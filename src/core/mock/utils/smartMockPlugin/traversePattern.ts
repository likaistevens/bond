type PatternType = {
  [k: string]: string | [string] | PatternType;
};

export const traversePattern = (
  obj: PatternType,
  cb: (path: string[], val: string | [string]) => void,
  path: string[] | undefined = []
): void => {
  for (const key in obj) {
    const item = obj[key];
    if (typeof item === "string") {
      cb([...path, key], item);
    } else if (Array.isArray(item)) {
      if (typeof item[0] === "string") {
        cb([...path, key], item);
      } else if (typeof item[0] === "object") {
        traversePattern(item[0], cb, [...path, key, "0"]);
      }
    } else if (typeof item === "object") {
      traversePattern(item, cb, [...path, key]);
    }
  }
};
