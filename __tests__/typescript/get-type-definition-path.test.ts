import { getTypeDefinitionPath } from "../../lib/typescript";

describe("getTypeDefinitionPath", () => {
  it("returns the type definition path", () => {
    const path = getTypeDefinitionPath("/some/path/style.less");

    expect(path).toEqual("/some/path/style.less.d.ts");
  });
});
