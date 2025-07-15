import * as pulumi from '@pulumi/pulumi';

pulumi.runtime.setMocks({
  newResource: function (args: pulumi.runtime.MockResourceArgs): {
    id: string;
    state: Record<string, unknown>;
  } {
    return {
      id: `${args.name}_id`,
      state: {
        ...args.inputs,
        arn: `arn:aws:ec2:region:account:vpc/${args.name}`,
      },
    };
  },
  call: function (args: pulumi.runtime.MockCallArgs) {
    return args.inputs;
  },
});

jest.mock('@pulumi/pulumi', () => {
  const actualPulumi = jest.requireActual('@pulumi/pulumi');
  return {
    ...actualPulumi,
    Config: jest.fn(() => ({
      require: (key: string) => {
        if (key === 'cidrBlock') return '10.0.0.0/16';
        throw new Error(`Unknown config key: ${key}`);
      },
    })),
  };
});

describe('VpcComponent', () => {
  it('should create a VPC with the correct CIDR', async () => {
    const stack = await import('../stacks/network');

    const vpcCidr = await stack.vpcCidr;
    expect(vpcCidr).toBe('10.0.0.0/16');
  });
});
