import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';
import { VpcComponent } from '../components/VpcComponent';

const config = new pulumi.Config();
const cidrBlock = config.require('cidrBlock');

const vpc = new VpcComponent('main-vpc', { cidrBlock });

const subnet = new aws.ec2.Subnet('public-subnet', {
  vpcId: vpc.vpc.id,
  cidrBlock: '10.0.1.0/24',
  availabilityZone: 'us-east-2a',
  mapPublicIpOnLaunch: true,
  tags: { Name: 'public-subnet' },
});

const igw = new aws.ec2.InternetGateway('main-igw', {
  vpcId: vpc.vpc.id,
});

const routeTable = new aws.ec2.RouteTable('public-rt', {
  vpcId: vpc.vpc.id,
  routes: [
    {
      cidrBlock: '0.0.0.0/0',
      gatewayId: igw.id,
    },
  ],
});

new aws.ec2.RouteTableAssociation('public-rt-assoc', {
  subnetId: subnet.id,
  routeTableId: routeTable.id,
});

const sg = new aws.ec2.SecurityGroup('web-sg', {
  vpcId: vpc.vpc.id,
  description: 'Allow SSH and HTTP',
  ingress: [
    { protocol: 'tcp', fromPort: 22, toPort: 22, cidrBlocks: ['0.0.0.0/0'] },
    { protocol: 'tcp', fromPort: 80, toPort: 80, cidrBlocks: ['0.0.0.0/0'] },
  ],
  egress: [
    { protocol: '-1', fromPort: 0, toPort: 0, cidrBlocks: ['0.0.0.0/0'] },
  ],
});

export const vpcId = vpc.vpc.id;
export const subnetId = subnet.id;
export const vpcCidr = cidrBlock;
export const securityGroupId = sg.id;
