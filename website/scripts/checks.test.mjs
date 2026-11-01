import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, existsSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { load } from "cheerio";
import { checkLinks } from "./check-links.mjs";
import { readRoadmap } from "../src/lib/roadmap.mjs";
import {
  resolveDeploymentMeta,
  getDeploymentMeta,
  isValidSha,
  formatCommitUrl,
  readPackageVersion,
  renderDeploymentHtml,
  CANONICAL_REPO_URL,
} from "../src/lib/deployment.ts";

test("link check rejects missing files and fragments, accepts real fragments", () => {
  const root = mkdtempSync(join(tmpdir(), "wasma-links-"));
  try {
    writeFileSync(
      join(root, "index.html"),
      '<a href="/missing/">broken</a><a href="/#absent">broken</a><a href="/#present">ok</a><h1 id="present">Title</h1>',
    );
    const errors = checkLinks(root);
    assert.equal(errors.length, 2);
    assert.ok(errors.some((e) => e.includes("missing fragment")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("roadmap reflects canonical state and rejects missing or unknown states", () => {
  const root = mkdtempSync(join(tmpdir(), "wasma-roadmap-"));
  const write = (n, status) =>
    writeFileSync(
      join(root, `INI-00${n}-test.md`),
      `---\nid: INI-00${n}\ntitle: RM-0${n} — Test\nroadmap_block: RM-0${n}\nstatus: ${status}\n---\n`,
    );
  try {
    for (let n = 1; n <= 8; n++) write(n, "completed");
    assert.equal(readRoadmap(root)[7].status, "completed");
    write(8, "in-progress");
    assert.equal(readRoadmap(root)[7].label, "En curso");
    write(8, "unrecognized");
    assert.throws(() => readRoadmap(root), /Unknown status/);
    rmSync(join(root, "INI-008-test.md"));
    assert.throws(() => readRoadmap(root), /eight/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("1. deployment: COMMIT_REF válido de Netlify", () => {
  const sha = "0123456789abcdef0123456789abcdef01234567";
  const meta = resolveDeploymentMeta({ COMMIT_REF: sha });
  assert.equal(meta.isCommit, true);
  assert.equal(meta.source, "netlify");
  assert.equal(meta.fullSha, sha);
  assert.equal(meta.shortSha, "0123456");
  assert.equal(meta.commitUrl, `https://github.com/Kaddo-kdd/wasma/commit/${sha}`);
  assert.equal(meta.versionLabel, "web v0.1.0");
});

test("2. deployment: GITHUB_SHA válido", () => {
  const sha = "abcdef0123456789abcdef0123456789abcdef01";
  const meta = resolveDeploymentMeta({ GITHUB_SHA: sha });
  assert.equal(meta.isCommit, true);
  assert.equal(meta.source, "github");
  assert.equal(meta.fullSha, sha);
  assert.equal(meta.shortSha, "abcdef0");
  assert.equal(meta.commitUrl, `https://github.com/Kaddo-kdd/wasma/commit/${sha}`);
});

test("3. deployment: Prioridad de COMMIT_REF sobre GITHUB_SHA", () => {
  const netlifySha = "1111111111111111111111111111111111111111";
  const githubSha = "2222222222222222222222222222222222222222";
  const meta = resolveDeploymentMeta({
    COMMIT_REF: netlifySha,
    GITHUB_SHA: githubSha,
  });
  assert.equal(meta.isCommit, true);
  assert.equal(meta.source, "netlify");
  assert.equal(meta.fullSha, netlifySha);
  assert.equal(meta.shortSha, "1111111");
});

test("4. deployment: Ausencia de variables de CI", () => {
  const meta = resolveDeploymentMeta({}, { gitFn: () => null });
  assert.equal(meta.isCommit, false);
  assert.equal(meta.source, "dev");
  assert.equal(meta.fullSha, null);
  assert.equal(meta.shortSha, null);
  assert.equal(meta.commitUrl, null);
  assert.equal(meta.versionLabel, "web v0.1.0");
});

test("5. deployment: SHA inválido, truncado o con caracteres no hexadecimales", () => {
  const invalidCases = [
    "not-a-sha",
    "123456",
    "0123456789abcdef0123456789abcdef0123456",
    "0123456789abcdef0123456789abcdef012345678",
    "0123456789abcdef0123456789abcdef0123456g",
    "",
  ];
  for (const bad of invalidCases) {
    const meta = resolveDeploymentMeta(
      { COMMIT_REF: bad },
      { gitFn: () => "4900ab0e57b65587f4b6debcef00521f0ad45ab7" },
    );
    assert.equal(meta.isCommit, false, `Expected bad SHA ${bad} to degrade to dev`);
    assert.equal(meta.source, "dev");
    assert.equal(meta.fullSha, null);
    assert.equal(meta.commitUrl, null);
  }

  const metaGh = resolveDeploymentMeta(
    { GITHUB_SHA: "invalid-gh-sha" },
    { gitFn: () => "4900ab0e57b65587f4b6debcef00521f0ad45ab7" },
  );
  assert.equal(metaGh.isCommit, false);
  assert.equal(metaGh.source, "dev");
});

test("6. deployment: Fallback Git local", () => {
  const localSha = "3333333333333333333333333333333333333333";
  const meta = resolveDeploymentMeta(
    {},
    { gitFn: () => localSha, allowLocalGit: true },
  );
  assert.equal(meta.isCommit, true);
  assert.equal(meta.source, "git");
  assert.equal(meta.fullSha, localSha);
  assert.equal(meta.shortSha, "3333333");
  assert.equal(
    meta.commitUrl,
    `https://github.com/Kaddo-kdd/wasma/commit/${localSha}`,
  );
});

test("7. deployment: Git no disponible", () => {
  const metaNull = resolveDeploymentMeta({}, { gitFn: () => null });
  assert.equal(metaNull.isCommit, false);
  assert.equal(metaNull.source, "dev");

  const metaThrow = resolveDeploymentMeta(
    {},
    {
      gitFn: () => {
        throw new Error("git not found");
      },
    },
  );
  assert.equal(metaThrow.isCommit, false);
  assert.equal(metaThrow.source, "dev");
});

test("8. deployment: Versión web separada de la CLI", () => {
  const meta = resolveDeploymentMeta({});
  assert.equal(meta.version, "0.1.0");
  assert.equal(meta.versionLabel, "web v0.1.0");
  assert.ok(meta.versionLabel.startsWith("web v"));
  assert.ok(!meta.versionLabel.toLowerCase().includes("wasma"));
});

test("9. deployment: URL canónica con SHA completo", () => {
  const fullSha = "4900ab0e57b65587f4b6debcef00521f0ad45ab7";
  const meta = resolveDeploymentMeta({ COMMIT_REF: fullSha });
  assert.equal(
    meta.commitUrl,
    "https://github.com/Kaddo-kdd/wasma/commit/4900ab0e57b65587f4b6debcef00521f0ad45ab7",
  );
  assert.equal(meta.fullSha.length, 40);
  assert.equal(meta.shortSha.length, 7);
  assert.ok(meta.commitUrl.endsWith(meta.fullSha));
  assert.ok(meta.commitUrl.startsWith(CANONICAL_REPO_URL));
});

test("10. deployment: Renderizado de dev sin enlace", () => {
  const meta = resolveDeploymentMeta({}, { gitFn: () => null });
  assert.equal(meta.isCommit, false);
  const html = renderDeploymentHtml(meta);
  assert.ok(html.includes("web v0.1.0"));
  assert.ok(html.includes("dev"));
  assert.ok(!html.includes("<a"));
  assert.ok(!html.includes("href"));
});

test("11. deployment: HTML estático generado con los metadatos correctos", () => {
  const commitMeta = resolveDeploymentMeta({
    COMMIT_REF: "4900ab0e57b65587f4b6debcef00521f0ad45ab7",
  });
  const commitHtml = renderDeploymentHtml(commitMeta);
  const $commit = load(commitHtml);
  const commitMetaEl = $commit(".deploy-meta");
  assert.equal(commitMetaEl.length, 1);
  assert.equal(
    commitMetaEl.attr("aria-label"),
    "Versión y procedencia del despliegue",
  );
  assert.equal($commit(".deploy-version").text(), "web v0.1.0");
  assert.equal(
    $commit("a.commit-link").attr("href"),
    "https://github.com/Kaddo-kdd/wasma/commit/4900ab0e57b65587f4b6debcef00521f0ad45ab7",
  );
  assert.ok($commit("a.commit-link").text().includes("commit 4900ab0"));
  assert.equal($commit("a.commit-link").attr("target"), "_blank");
  assert.equal($commit("a.commit-link").attr("rel"), "noopener noreferrer");

  const devMeta = resolveDeploymentMeta({}, { gitFn: () => null });
  const devHtml = renderDeploymentHtml(devMeta);
  const $dev = load(devHtml);
  assert.equal($dev(".dev-badge").text(), "dev");
  assert.equal($dev("a.commit-link").length, 0);

  if (existsSync("dist/index.html")) {
    const pageHtml = readFileSync("dist/index.html", "utf8");
    const $page = load(pageHtml);
    const footerMeta = $page("footer.site-footer .deploy-meta");
    assert.equal(
      footerMeta.length,
      1,
      "Expected .deploy-meta in dist/index.html footer",
    );
    assert.ok(
      footerMeta.text().includes("web v0.1.0"),
      "Expected web v0.1.0 in footer",
    );
  }
});
