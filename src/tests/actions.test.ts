import { upperCase, sortAsc, sortDesc } from "../actions.js";
import { describe, it, expect, test } from "vitest";



describe("actions tests", () => {

  test("sortAsc works correctly", () => {
    expect(sortAsc([3,1,2])).toEqual([1,2,3]);
  });

  test("sortDesc works correctly", () => {
    expect(sortDesc([3,1,2])).toEqual([3,2,1]);
  });

  test("upperCase works correctly", () => {
    expect(
      upperCase({ name: "fatimah" })
    ).toEqual({ name: "FATIMAH" });
  });

});