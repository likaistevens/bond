const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const arg = process.argv[2];

child_process.execSync("yarn build");

const packageFile = fs.readFileSync("./package.json");
const packageObj = JSON.parse(packageFile.toString());
const oldVersion = packageObj.version;
let newVersion;
if (arg) {
  newVersion = arg;
} else {
  const oldVersionArr = oldVersion.split(".");
  const newZ = Number(oldVersionArr[2]) + 1;
  newVersion = [oldVersionArr[0], oldVersionArr[1], newZ].join(".");
}

delete packageObj.version;
const newPackageObj = {
  version: newVersion,
  ...packageObj,
};

fs.writeFileSync("./package.json", JSON.stringify(newPackageObj, "", "\t"));

child_process.execSync("npm publish");

// npm publish --tag alpha
