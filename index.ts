import * as network from "./src/stacks/network";
import * as compute from "./src/stacks/compute";
import * as storage from "./src/stacks/storage";

export const vpcId = network.vpcId;
export const subnetId = network.subnetId;
export const instanceId = compute.instance.id;
export const bucketId = storage.bucketName;
