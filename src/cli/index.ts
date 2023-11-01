import fs from "fs-extra";
import path from "path";
// import prettier from "prettier";
import { program } from "commander";
// import { readSwaggerFakerConfig, DEFAULT_CONFIG } from "./utils";
// import { jsonServerGen } from "../json-server";
// import { startServer } from "./server";
import { bond } from "../index";

const cwd = process.cwd();

const pkg = fs.readJsonSync(path.join(cwd, "package.json"));

program.version(pkg.version, "-v, --version");

// program.description("generates Typescript clients").action(async () => {
//   await mockGen();
//   await mockServer();
// });

program.description("generates Typescript clients").action(() => {
  bond();
});

program
  .command("api")
  .description("generates Typescript clients")
  .action(() => {
    bond();
  });

// program
//   .command("mock")
//   .description("Run mock server")
//   .action(async () => {
//     await mockGen();
//     await mockServer();
//   });

// program
//   .command("mock:gen")
//   .description("generate mock data from swagger/openapi")
//   .action(async () => {
//     await mockGen();
//   });

// program
//   .command("mock:server")
//   .description("Run mock server")
//   .action(async () => {
//     await mockServer();
//   });

program.parse(process.argv);
