import {
  AVATAR_KEY_WORDS,
  AVATAR_URL,
  CODE_PATTERN,
  ID_PATTERN,
  NORMAL_IMAGE_URL,
  PHONE_PATTERN,
} from "./const";
import { pipe } from "lodash/fp";
import { fill } from "lodash";

type PipFuncProps = {
  key: string;
  value: string | string[];
  path: string[];
  lowerCaseKey: string;
  newEntries: [string, string | string[]];
};

const ArrayLength = "1-10";

export function middleware(
  key: string,
  value: string | string[],
  path: string[]
) {
  const lowerCaseKey = key.toLowerCase();
  const newEntries = [key, value] as PipFuncProps["newEntries"];
  const res = pipe(
    endWithUrl,
    equalToCrest,
    endWithTitle,
    endWithName,
    endWithId,
    withTime,
    withStatus,
    withPhone,
    endWithCode,
    endWithCity,
    endWithProvince,
    endWithContent
  )({ key, value, path, lowerCaseKey, newEntries });
  // console.log(res.newEntries);
  return res.newEntries;
}

/**
 * 以url或urls结尾
 */
export const endWithUrl = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("url") || lowerCaseKey.endsWith("urls")) {
    const isAvatar = (key: string) => {
      const lowerCaseKey = key.toLowerCase();
      return AVATAR_KEY_WORDS.some((k) => lowerCaseKey.includes(k));
    };

    const url = isAvatar(key) ? AVATAR_URL : NORMAL_IMAGE_URL;
    if (Array.isArray(value)) {
      newEntries = [key, fill(Array(5), url)];
      // newEntries = [`${key}|${ArrayLength}`, url];
    } else {
      newEntries = [key, url];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * crest 校徽
 */
export const equalToCrest = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey === "crest") {
    if (!Array.isArray(value)) {
      newEntries = [key, "@CREST"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 title 结尾
 */
export const endWithTitle = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("title")) {
    if (!Array.isArray(value)) {
      newEntries = [key, "@ctitle"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 name 结尾
 */
export const endWithName = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("name")) {
    if (!Array.isArray(value)) {
      const pathStr = path.join("").toLocaleLowerCase().replaceAll(/\d/g, "");
      if (
        lowerCaseKey.endsWith("schoolname") ||
        pathStr.endsWith("schoolname") ||
        pathStr.endsWith("schoolsname")
      ) {
        newEntries = [key, "@CUSTOMNAME(school)"];
      } else if (
        lowerCaseKey.endsWith("majorname") ||
        pathStr.endsWith("majorname") ||
        pathStr.endsWith("majorsname")
      ) {
        newEntries = [key, "@CUSTOMNAME(major)"];
      } else if (lowerCaseKey === "nickname") {
        newEntries = [key, "@CUSTOMNAME(nickname)"];
      } else if (lowerCaseKey === "realname") {
        newEntries = [key, "@cname"];
      } else if (pathStr.endsWith("tagname") || pathStr.endsWith("tagsname")) {
        newEntries = [key, "@cname"];
      } else {
        newEntries = [key, "@word"];
      }
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以id或ids结尾
 */
export const endWithId = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("id") || lowerCaseKey.endsWith("ids")) {
    if (Array.isArray(value)) {
      newEntries = [`${key}|${ArrayLength}`, ID_PATTERN];
    } else {
      newEntries = [key, ID_PATTERN];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以gmt开头、以date结尾、以time结尾
 */
export const withTime = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (
    lowerCaseKey.startsWith("gmt") ||
    lowerCaseKey.endsWith("date") ||
    lowerCaseKey.endsWith("time")
  ) {
    if (!Array.isArray(value)) {
      newEntries = [key, "@TIMESTAMP"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以status、type 结尾，且为 number 类型
 */
export const withStatus = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("status") || lowerCaseKey.endsWith("type")) {
    if (Array.isArray(value)) {
      newEntries = [key, fill(Array(5), "@STATUS")];
    } else {
      newEntries = [key, "@STATUS"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 phone 开头或结尾
 */
export const withPhone = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("phone") || lowerCaseKey.startsWith("phone")) {
    if (!Array.isArray(value)) {
      if (value.startsWith("@integer")) {
        newEntries = [key, PHONE_PATTERN];
      } else if (value.startsWith("@string")) {
        newEntries = [key, "@PHONESTRING"];
      }
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 code 开头或结尾
 */
export const endWithCode = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("code")) {
    if (!Array.isArray(value)) {
      if (value.startsWith("@integer")) {
        newEntries = [key, CODE_PATTERN];
      } else if (value.startsWith("@string")) {
        newEntries = [key, "@CODESTRING"];
      }
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 city 结尾
 */
export const endWithCity = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("city")) {
    if (!Array.isArray(value)) {
      newEntries = [key, "@city"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 province 结尾
 */
export const endWithProvince = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("province")) {
    if (!Array.isArray(value)) {
      newEntries = [key, "@province"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};

/**
 * 以 content 结尾
 */
export const endWithContent = ({
  key,
  value,
  path,
  lowerCaseKey,
  newEntries,
}: PipFuncProps): PipFuncProps => {
  if (lowerCaseKey.endsWith("content")) {
    if (!Array.isArray(value)) {
      newEntries = [key, "@csentence"];
    }
  }
  return { key, value, path, lowerCaseKey, newEntries };
};
