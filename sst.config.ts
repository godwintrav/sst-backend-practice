import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { DatabaseStack } from "./stacks/DatabaseStack";

export default {
  config(_input) {
    return {
      name: "backend-exercise",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(DatabaseStack).stack(ApiStack);
  },
} satisfies SSTConfig;
