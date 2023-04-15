// import { GenericConfigObject, LoadConfigFile } from "../type";
// import { pathToFileURL } from "node:url";

// export const loadConfigFile: LoadConfigFile = async (
//   fileName,
//   commandOptions = {}
// ) => {
//   //   const configs = await getDefaultFromCjs(await getConfigFileExport(fileName));
//   // @ts-ignore
//   const configs = await getDefaultFromCjs(await import(fileName));

//   console.log(configs);
// };

// function getDefaultFromCjs(namespace: GenericConfigObject): unknown {
//   return namespace.default || namespace;
// }

// async function getConfigFileExport(
//   fileName: string
//   // commandOptions: Record<string, unknown>
// ) {
//   // if (commandOptions.configPlugin || commandOptions.bundleConfigAsCjs) {
//   //   try {
//   //     return await loadTranspiledConfigFile(fileName, commandOptions);
//   //   } catch (error_: any) {
//   //     if (error_.message.includes("not defined in ES module scope")) {
//   //       return error(errorCannotBundleConfigAsEsm(error_));
//   //     }
//   //     throw error_;
//   //   }
//   // }
//   let cannotLoadEsm = false;
//   const handleWarning = (warning: Error): void => {
//     if (warning.message.includes("To load an ES module")) {
//       cannotLoadEsm = true;
//     }
//   };
//   process.on("warning", handleWarning);
//   try {
//     const fileUrl = pathToFileURL(fileName);
//     if (process.env.ROLLUP_WATCH) {
//       // We are adding the current date to allow reloads in watch mode
//       fileUrl.search = `?${Date.now()}`;
//     }
//     return (await import(fileUrl.href)).default;
//   } catch (error_: any) {
//     // if (cannotLoadEsm) {
//     //   return error(errorCannotLoadConfigAsCjs(error_));
//     // }
//     // if (error_.message.includes("not defined in ES module scope")) {
//     //   return error(errorCannotLoadConfigAsEsm(error_));
//     // }
//     throw error_;
//   } finally {
//     process.off("warning", handleWarning);
//   }
// }
