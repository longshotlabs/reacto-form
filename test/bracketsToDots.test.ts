import bracketsToDots from "../src/util/bracketsToDots";

test("bracketsToDots", () => {
  expect(bracketsToDots("a[0].b")).toBe("a.0.b");
  expect(bracketsToDots("a[0].b[2]")).toBe("a.0.b.2");
  expect(bracketsToDots("a[0].")).toBe("a.0.");
  expect(bracketsToDots("a.[0].")).toBe("a.0.");
});
