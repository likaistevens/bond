// export interface GenericConfigObject {
//   [key: string]: unknown;
// }

// export function loadConfigFile(
//   fileName: string,
//   commandOptions: any
// ): Promise<any>;
// export type LoadConfigFile = typeof loadConfigFile;

export type SwaggerPathMethodObject = {
  tags: string[];
  summary: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters: {
    name: string;
    in: string;
    description: string;
    required: boolean;
    type: string;
  }[];
  responses: Record<
    string | number,
    { description: string; schema: { type: string }; example?: string }
  >;
  security: any[];
  deprecated: boolean;
};

export type Swagger = {
  swagger: string;
  info: {
    description: string;
    version: string;
    title: string;
    license: {
      name: string;
      url: string;
    };
  };
  host: string;
  basePath: string;
  tags: {
    name: string;
    description: string;
  }[];
  paths: Record<string, Record<string, SwaggerPathMethodObject>>;
  securityDefinitions: Record<string, any>;
  definitions: Record<string, any>;
};
