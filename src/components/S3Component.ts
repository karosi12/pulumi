import * as pulumi from '@pulumi/pulumi';
import * as aws from '@pulumi/aws';

export interface BucketPolicyArgs {
  name: string;
  action: string[];
  accountId: string;
  accountName: string;
}

export class S3Component extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.BucketV2;
  public readonly bucketPolicy: aws.s3.BucketPolicy;

  constructor(
    name: string,
    args: BucketPolicyArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('aws:s3:BucketComponent', name, {}, opts);

    this.bucket = new aws.s3.BucketV2(name);
    new aws.s3.BucketPublicAccessBlock(name, {
      bucket: this.bucket.id,
      blockPublicAcls: false,
      blockPublicPolicy: false,
      ignorePublicAcls: false,
      restrictPublicBuckets: false,
    });
    this.bucketPolicy = new aws.s3.BucketPolicy(args.name, {
      bucket: this.bucket.id,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: {
              AWS: `arn:aws:iam::${args.accountId}:user/${args.accountName}`,
            },
            Action: ['s3:GetObject'].concat(args.action),
            Resource: [
              this.bucket.arn,
              pulumi.interpolate`${this.bucket.arn}/*`,
            ],
          },
        ],
      },
    });
  }
}
