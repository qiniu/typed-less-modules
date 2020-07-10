import { fileToClassNames } from "../../lib/less";

describe("fileToClassNames", () => {
  test("it converts a file path to an array of class names (default camel cased)", async () => {
    const result = await fileToClassNames(`${__dirname}/../complex.less`);

    expect(result).toEqual(["someStyles", "nestedClass", "nestedAnother"]);
  });

  describe("nameFormat", () => {
    test("it converts a file path to an array of class names with kebab as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "kebab"
      });

      expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
    });

    test("it converts a file path to an array of class names with param as the name format", async () => {
      const result = await fileToClassNames(`${__dirname}/../complex.less`, {
        nameFormat: "param"
      });

      expect(result).toEqual(["some-styles", "nested-class", "nested-another"]);
    });

    test("it converts a file path to an array of class names where only classes with dashes in the names are altered", async () => {
      const result = await fileToClassNames(`${__dirname}/../dashes.less`, {
        nameFormat: "dashes"
      });

      expect(result).toEqual(["App", "Logo", "appHeader"]);
    });

    test("it does not change class names when nameFormat is set to none", async () => {
      const result = await fileToClassNames(`${__dirname}/../dashes.less`, {
        nameFormat: "none"
      });

      expect(result).toEqual(["App", "Logo", "App-Header"]);
    });
  });

  describe("aliases", () => {
    test("it converts a file that contains aliases", async () => {
      const result = await fileToClassNames(`${__dirname}/../aliases.less`, {
        aliases: {
          "~fancy-import": `${__dirname}/../complex.less`,
          "~another": `${__dirname}/../style.less`
        }
      });

      expect(result).toEqual([
        "someStyles",
        "nestedClass",
        "nestedAnother",
        "someClass",
        "myCustomClass"
      ]);
    });
  });
});
