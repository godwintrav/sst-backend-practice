import { AssetHashType, IgnoreMode } from "aws-cdk-lib";
import {
  Code,
  LayerVersion,
  LayerVersionProps,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import crypto from "crypto";

const PRISMA_LAYER_EXTERNAL = [
  "@prisma/engines",
  "@prisma/engines-version",
  "@prisma/internals",
];

type PrismaEngine =
  | "introspection-engine"
  | "schema-engine"
  | "prisma-fmt"
  | "libquery_engine";

export interface PrismaLayerProps extends Omit<LayerVersionProps, "code"> {
  nodeModules?: string[];
  prismaModules?: string[];
  prismaEngines?: PrismaEngine[];
}

export class PrismaLayer extends LayerVersion {
  externalModules: string[];

  constructor(scope: Construct, id: string, props: PrismaLayerProps = {}) {
    const { prismaModules, ...rest } = props;
    const nodeModules = props.nodeModules || [];

    const layerDir = "/asset-output/nodejs";
    const nm = `${layerDir}/node_modules`;
    const engineDir = `${nm}/@prisma/engines`;

    const modulesToInstall = prismaModules || [
      "@prisma/client",
      "@prisma/engines",
    ];
    const modulesToInstallArgs = modulesToInstall.concat(nodeModules).join(" ");

    const allEngines: PrismaEngine[] = [
      "introspection-engine",
      "schema-engine",
      "libquery_engine",
      "prisma-fmt",
    ];
    const prismaEngines = props.prismaEngines || ["libquery_engine"];
    const deleteEngineCmds = allEngines
      .filter((e) => !prismaEngines.includes(e))
      .map((e) => `rm -f ${engineDir}/${e}*`);

    const createBundleCommand = [
      "bash",
      "-c",
      [
        `echo "Installing ${modulesToInstallArgs}"`,
        "mkdir -p /tmp/npm && pushd /tmp/npm && HOME=/tmp npm i --no-save --no-package-lock npm@latest && popd",
        `mkdir -p ${layerDir}`,
        `cp package.json ${layerDir}`,
        `cp -r prisma ${layerDir}/prisma`,
        `cd ${layerDir} && HOME=/tmp /tmp/npm/node_modules/.bin/npm install --omit dev --omit peer --omit optional ${modulesToInstallArgs}`,
        ...deleteEngineCmds,
        `rm -rf ${nm}/.cache`,
        `rm -rf ${nm}/@prisma/engines/node_modules`,
        `rm -rf ${nm}/@prisma/*darwin*`,
        `rm -rf ${nm}/@prisma/*windows*`,
        `rm -rf ${nm}/prisma/*darwin*`,
        `rm -rf ${nm}/prisma/*windows*`,
        `npx prisma generate`,
      ].join(" && "),
    ];

    const bundleCommandHash = crypto.createHash("sha256");
    bundleCommandHash.update(JSON.stringify(createBundleCommand));
    const bundleCommandDigest = bundleCommandHash.digest("hex");

    const code = Code.fromAsset(".", {
      ignoreMode: IgnoreMode.GLOB,
      exclude: ["*"],
      assetHashType: AssetHashType.CUSTOM,
      assetHash: bundleCommandDigest,
      bundling: {
        user: "root",
        image: Runtime.NODEJS_18_X.bundlingImage,
        command: createBundleCommand,
      },
    });

    super(scope, id, { ...rest, code });

    this.externalModules = [
      ...new Set([...PRISMA_LAYER_EXTERNAL, ...nodeModules]),
    ];
  }
}
