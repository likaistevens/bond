import fs from "fs-extra";
import path from "path";
// import prettier from "prettier";
import { program } from "commander";
// import { readSwaggerFakerConfig, DEFAULT_CONFIG } from "./utils";
// import { jsonServerGen } from "../json-server";
// import { startServer } from "./server";
import { mockServer, mockGen, bond } from "../index";

const cwd = process.cwd();

const pkg = fs.readJsonSync(path.join(cwd, "package.json"));

program.version(pkg.version, "-v, --version");

// program.description("generates Typescript clients").action(() => {
//   mock();
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

program
  .command("mock")
  .description("Run mock server")
  .action(async () => {
    await mockGen();
    await mockServer();
    // const swaggerFakerConfig = readSwaggerFakerConfig();
    // startServer(swaggerFakerConfig);
  });

program
  .command("mock:gen")
  .description("generate mock data from swagger/openapi")
  .action(async () => {
    await mockGen();
    // const swaggerFakerConfig = readSwaggerFakerConfig();
    // console.log(
    //   `Generate config to ${swaggerFakerConfig.outputFolder} folder successfully!`
    // );
    // jsonServerGen(swaggerFakerConfig);
  });

program
  .command("mock:server")
  .description("Run mock server")
  .action(async () => {
    await mockServer();
    // const swaggerFakerConfig = readSwaggerFakerConfig();
    // startServer(swaggerFakerConfig);
  });

program.parse(process.argv);
