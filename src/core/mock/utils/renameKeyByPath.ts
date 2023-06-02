import _ from "lodash";

export function renameKeyByPath(
  path: string[],
  newKey: string,
  obj: Record<string, any>
) {
  const newObj = _.cloneDeep(obj);

  // 获取需要修改的属性对象以及对应的key名称
  const parentPath = path.slice(0, -1);
  const oldKey = _.last(path) || "";
  const parentObj = parentPath.length ? _.get(newObj, parentPath) : newObj;

  // 重命名key名称
  if (parentObj && parentObj.hasOwnProperty(oldKey) && oldKey !== newKey) {
    _.set(newObj, [...parentPath, newKey], parentObj[oldKey]);
    _.unset(newObj, [...parentPath, oldKey]);
  }

  return newObj;
}
