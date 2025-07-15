import * as pulumi from '@pulumi/pulumi';
import { LocalWorkspace } from '@pulumi/pulumi/automation';
import * as aws from '@pulumi/aws';

jest.setTimeout(5 * 60 * 1000);

describe('VPC integration test (Automation API)', () => {
  it('should export a valid vpcId', async () => {
    const stack = await LocalWorkspace.createOrSelectStack({
      stackName: 'test-int',
      projectName: 'test-project',
      program: async () => {
        const cfg = new pulumi.Config();
        const cidrBlock = cfg.get('cidrBlock') || '10.0.0.0/16';

        const vpc = new aws.ec2.Vpc('test-vpc', {
          cidrBlock,
        });

        return { vpcId: vpc.id };
      },
    });

    await stack.setConfig('cidrBlock', { value: '10.0.0.0/16' });

    const upRes = await stack.up();
    expect(upRes.summary.result).toBe('succeeded');

    const vpcId = upRes.outputs['vpcId'].value;
    expect(typeof vpcId).toBe('string');
    expect((vpcId as string).length).toBeGreaterThan(0);

    await stack.destroy();
  });
});
