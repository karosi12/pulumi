import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

export interface VpcArgs {
  cidrBlock: pulumi.Input<string>;
}

export class VpcComponent extends pulumi.ComponentResource {
  public readonly vpc: aws.ec2.Vpc;

  constructor(
    name: string,
    args: VpcArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('aws:vpc:VpcComponent', name, {}, opts);

    this.vpc = new aws.ec2.Vpc(
      name,
      {
        cidrBlock: args.cidrBlock,
        enableDnsSupport: true,
        enableDnsHostnames: true,
        tags: {
          Name: name,
        },
      },
      { parent: this },
    );

    this.registerOutputs({
      vpcId: this.vpc.id,
    });
  }
}
