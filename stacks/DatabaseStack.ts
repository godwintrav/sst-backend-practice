import { StackContext } from "sst/constructs";
import { PrismaLayer } from "./resources/prisma-layer";

export function DatabaseStack({ stack, app }: StackContext) {
  const dbName = "shuffle-test";
  let engine = "postgresql";
  let username = "postgres";
  let password = "foobar123";
  let socketAddress = "localhost:5432";

  const connectionString = `${engine}://${username}:${password}@${socketAddress}/${dbName}`;
  app.addDefaultFunctionEnv({
    DATABASE_URL: connectionString,
    PRISMA_CLI_BINARY_TARGETS: "linux-arm64-openssl-1.0.x",
  });

  const prismaLayer = new PrismaLayer(stack, "PrismaLayer", {
    layerVersionName: app.logicalPrefixedName("prisma-layer"),
    prismaEngines: ["schema-engine", "libquery_engine"],
    prismaModules: ["@prisma/client"],
  });

  app.addDefaultFunctionLayers([prismaLayer]);

  app.setDefaultFunctionProps({
    architecture: "arm_64",
    copyFiles: [{ from: "prisma/schema.prisma", to: "src/schema.prisma" }],
    nodejs: {
      esbuild: {
        external: ["@prisma/client", ".prisma"],
      },
    },
  });

  return { connectionString };
}
