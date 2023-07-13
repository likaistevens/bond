import Mock from "mockjs";
import { middleware } from "./middleware";
import { last, set } from "lodash";
import { traversePattern } from "./traversePattern";
import {
  CELEBRITY_LIST,
  CODE_PATTERN,
  MAJOR_LIST,
  PHONE_PATTERN,
  SCHOOL_CREST_LIST,
  SCHOOL_LIST,
  YEAR_PATTERN,
} from "./const";

export const smartMockPlugin = (
  mockData: Record<string, Record<string, any>>
) => {
  Mock.Random.extend({
    customname: function (type: string) {
      if (type === "school") {
        return this.pick(SCHOOL_LIST);
      } else if (type === "major") {
        return this.pick(MAJOR_LIST);
      } else if (type === "nickname") {
        return Mock.mock("@province").slice(0, 2) + this.pick(CELEBRITY_LIST);
      }
    },
    timestamp: function () {
      const year = new Date().getFullYear() + Mock.mock("@integer(-10, 0)");
      const dateTime = Mock.mock('@datetime("MM-dd HH:mm:ss")');
      return new Date(year + "-" + dateTime).getTime();
    },
    status: function () {
      return Mock.mock("@integer(1, 5)") * 10;
    },
    phonestring: function () {
      return `${Mock.mock(PHONE_PATTERN)}`;
    },
    codestring: function () {
      return `${Mock.mock(CODE_PATTERN)}`;
    },
    crest: function () {
      return this.pick(SCHOOL_CREST_LIST);
    },
    yearstring: function () {
      return `${Mock.mock(YEAR_PATTERN)}`;
    },
  });

  const newMockData = Object.assign({}, mockData);
  Object.entries(newMockData).forEach(([operationId, pattern], indx) => {
    traversePattern(pattern, (path, value) => {
      const key = last(path) || "";
      const [newKey, newValue] = middleware(key, value, path);
      set(newMockData, [operationId, ...path], newValue);
    });
  });
  return newMockData;
};
