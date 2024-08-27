import { RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import { App, Function, Script } from "sst/constructs";
import { PrismaLayer } from "./prisma-layer";

export class MigrationScript extends Construct {
  constructor(scope: Construct, id: string, runMigration: boolean) {
    super(scope, id);

    const app = App.of(scope) as App;

    const migrationLayer = new PrismaLayer(this, "PrismaMigrateLayer", {
      removalPolicy: RemovalPolicy.RETAIN,
      description: "Prisma migration engine and SDK",
      layerVersionName: app.logicalPrefixedName("prisma-migrate"),
      prismaEngines: ["schema-engine"],
      prismaModules: ["@prisma/engines", "@prisma/internals", "@prisma/client"],
    });

    const migrationFunction = new Function(this, "MigrationScriptLambda", {
      enableLiveDev: false,
      handler: "packages/db-migration-runner/lambda.handler",
      layers: [migrationLayer],
      copyFiles: [
        { from: "prisma/schema.prisma" },
        { from: "prisma/migrations" },
      ],
      nodejs: {
        esbuild: { external: migrationLayer.externalModules || [] },
      },
      timeout: "3 minutes",
    });

    if (runMigration) {
      new Script(this, "MigrationScript", {
        onCreate: migrationFunction,
        onUpdate: migrationFunction,
      });
    }
  }
}
