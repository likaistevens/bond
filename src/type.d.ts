export type BondConfig = {
  input: string;
  cookie: string;
  output: string;
  request: string;
};

export interface GenericConfigObject {
  [key: string]: unknown;
}

export type LoadConfigFile = typeof loadConfigFile;

export function loadConfigFile(
  fileName: string,
  commandOptions: any
): Promise<any>;

export type Swagger = {
  swagger: string;
  info: string;
  host: string;
  basePath: string;
  tags: string[];
  paths: Record<string, any>;
  securityDefinitions: Record<string, any>;
  definitions: Record<string, any>;
};
