import fs from "node:fs";
import path from "node:path";
import { loadSkillsFromDir } from "@earendil-works/pi-coding-agent";
import { expect, it } from "vitest";

it("discovers one portable assignment skill with resolvable package-local references", () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  expect(pkg.pi.skills).toEqual(["./skills"]);
  const loaded = loadSkillsFromDir({
    dir: path.resolve(root, pkg.pi.skills[0]),
    source: "package",
  });
  expect(loaded.diagnostics).toEqual([]);
  expect(loaded.skills.map((skill) => skill.name)).toEqual(["cloud-assignment"]);
  const skill = loaded.skills[0]!;
  const content = fs.readFileSync(skill.filePath, "utf8");
  expect(content).not.toMatch(/SETUP\.md|\/Users\/|vendored|harness AWS/);
  const links = [...content.matchAll(/\]\(([^)]+)\)/g)].map((match) => match[1]!);
  expect(links.length).toBeGreaterThanOrEqual(3);
  for (const link of links) {
    const target = path.resolve(skill.baseDir, link.split("#")[0]!);
    expect(target.startsWith(`${root}${path.sep}`)).toBe(true);
    expect(fs.existsSync(target), link).toBe(true);
  }
});
