import { build } from "esbuild";

const triggerNames = ["bookstatus-calc"];
const buildPromises = triggerNames.map(async (name) => {
  const sourcePath = `./src/trigger/${name}/handler.ts`;
  const destPath = `./dist/trigger/${name}/handler.js`;
  await build({
    entryPoints: [sourcePath],
    bundle: true,
    outfile: destPath,
    platform: "node",
    target: "node14",
  });
});

Promise.all(buildPromises)
  .then(() => {
    console.log("done trigger build");
  })
  .catch((reason) => {
    console.log(reason);
  });
