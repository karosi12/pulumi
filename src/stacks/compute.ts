import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import * as network from './network';


const config = new pulumi.Config("02");

const env = config.require("env");
const instanceType = config.require("instanceType");

const ami = aws.ec2.getAmi({
  mostRecent: true,
  owners: ['amazon'],
  filters: [{ name: 'name', values: ['amzn2-ami-hvm-*-x86_64-gp2'] }],
});

export const instance = new aws.ec2.Instance('web-server', {
  ami: (async () => (await ami).id)(), //ami.then(a => a.id),
  // instanceType: 't3.micro',
  instanceType,
  subnetId: network.subnetId,
  vpcSecurityGroupIds: [network.securityGroupId],
  associatePublicIpAddress: true,
  tags: {
    Name: 'WebServer',
    Environment: env,
  },
});

export const instanceId = instance.id;
