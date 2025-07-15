import * as pulumi from '@pulumi/pulumi';
import { S3Component } from '../components/S3Component';

const config = new pulumi.Config();
const accountId = config.require('accountId');
const accountName = config.require('accountName');

const s3 = new S3Component('demo', {
  action: ['s3:PutObject', 's3:DeleteObject', 's3:ListBucket'],
  name: 's3-demo-policy',
  accountId,
  accountName,
});

export const bucketName = s3.bucket.bucket;
