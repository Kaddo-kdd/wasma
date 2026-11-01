import { readFileSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { execSync } from "node:child_process";

export const CANONICAL_REPO_URL = "https://github.com/Kaddo-kdd/wasma";
export const COMMIT_URL_BASE = `${CANONICAL_REPO_URL}/commit/`;

export type DeploymentSource = "netlify" | "github" | "git" | "dev";

export interface DeploymentMeta {
  version: string;
  versionLabel: string;
  isCommit: boolean;
  fullSha: string | null;
  shortSha: string | null;
  commitUrl: string | null;
  source: DeploymentSource;
}

export interface DeploymentMetaOptions {
  packageVersion?: string;
  packageJsonPath?: string;
  gitFn?: () => string | null;
  allowLocalGit?: boolean;
  isGitPublished?: () => boolean;
}

const SHA_REGEX = /^[0-9a-f]{40}$/i;

/**
 * Validates that a string is a 40-character hexadecimal Git commit hash.
 */
export function isValidSha(sha: unknown): sha is string {
  return typeof sha === "string" && SHA_REGEX.test(sha.trim());
}

/**
 * Formats a canonical GitHub commit URL from a full 40-character SHA.
 */
export function formatCommitUrl(fullSha: string): string {
  if (!isValidSha(fullSha)) {
    throw new Error(`Cannot format commit URL for invalid SHA: "${fullSha}"`);
  }
  return `${COMMIT_URL_BASE}${fullSha.trim().toLowerCase()}`;
}

/**
 * Reads the website package version from website/package.json.
 */
export function readPackageVersion(customPath?: string): string {
  if (customPath && existsSync(customPath)) {
    const pkg = JSON.parse(readFileSync(customPath, "utf8"));
    if (typeof pkg.version === "string" && pkg.version.trim() !== "") {
      return pkg.version.trim();
    }
  }

  const candidates = [
    join(process.cwd(), "package.json"),
    join(process.cwd(), "website", "package.json"),
    resolve(process.cwd(), "..", "package.json"),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      try {
        const pkg = JSON.parse(readFileSync(candidate, "utf8"));
        if (pkg.name === "wasma-website" && typeof pkg.version === "string") {
          return pkg.version.trim();
        }
      } catch {
        // Continue searching
      }
    }
  }

  return "0.1.0";
}

/**
 * Default local Git commit resolution using git rev-parse HEAD.
 */
function defaultGitFn(): string | null {
  try {
    return execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }
}

/**
 * Checks if the current local HEAD commit is published to a remote branch and clean.
 */
function defaultIsGitPublished(): boolean {
  try {
    const status = execSync("git status --porcelain", {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    if (status.length > 0) {
      // Working tree is dirty; local state is not published
      return false;
    }

    const branches = execSync("git branch -r --contains HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    return branches.includes("origin/");
  } catch {
    return false;
  }
}

/**
 * Resolves deployment metadata from environment variables and local git fallback.
 */
export function resolveDeploymentMeta(
  env: Record<string, string | undefined> = process.env,
  options: DeploymentMetaOptions = {},
): DeploymentMeta {
  const version =
    options.packageVersion ?? readPackageVersion(options.packageJsonPath);
  const versionLabel = `web v${version}`;

  // 1. Netlify build environment (COMMIT_REF)
  if (typeof env.COMMIT_REF === "string") {
    const trimmed = env.COMMIT_REF.trim();
    if (isValidSha(trimmed)) {
      const fullSha = trimmed.toLowerCase();
      return {
        version,
        versionLabel,
        isCommit: true,
        fullSha,
        shortSha: fullSha.slice(0, 7),
        commitUrl: formatCommitUrl(fullSha),
        source: "netlify",
      };
    }
    // Corrupt / invalid declared source: degrade safely to dev without silent fallback
    return {
      version,
      versionLabel,
      isCommit: false,
      fullSha: null,
      shortSha: null,
      commitUrl: null,
      source: "dev",
    };
  }

  // 2. GitHub Actions environment (GITHUB_SHA)
  if (typeof env.GITHUB_SHA === "string") {
    const trimmed = env.GITHUB_SHA.trim();
    if (isValidSha(trimmed)) {
      const fullSha = trimmed.toLowerCase();
      return {
        version,
        versionLabel,
        isCommit: true,
        fullSha,
        shortSha: fullSha.slice(0, 7),
        commitUrl: formatCommitUrl(fullSha),
        source: "github",
      };
    }
    // Corrupt / invalid declared source: degrade safely to dev without silent fallback
    return {
      version,
      versionLabel,
      isCommit: false,
      fullSha: null,
      shortSha: null,
      commitUrl: null,
      source: "dev",
    };
  }

  // 3. Fallback to local Git if available and provenance is verified
  const gitReader = options.gitFn !== undefined ? options.gitFn : defaultGitFn;
  let rawGitSha: string | null = null;
  try {
    rawGitSha = gitReader();
  } catch {
    rawGitSha = null;
  }

  if (rawGitSha && isValidSha(rawGitSha.trim())) {
    const isPublished =
      options.allowLocalGit ??
      (options.gitFn !== undefined
        ? true
        : (options.isGitPublished?.() ?? defaultIsGitPublished()));

    if (isPublished) {
      const fullSha = rawGitSha.trim().toLowerCase();
      return {
        version,
        versionLabel,
        isCommit: true,
        fullSha,
        shortSha: fullSha.slice(0, 7),
        commitUrl: formatCommitUrl(fullSha),
        source: "git",
      };
    }
  }

  // 4. Default / unverified local development build
  return {
    version,
    versionLabel,
    isCommit: false,
    fullSha: null,
    shortSha: null,
    commitUrl: null,
    source: "dev",
  };
}

/**
 * Standard convenience getter for deployment metadata in Astro templates.
 */
export function getDeploymentMeta(): DeploymentMeta {
  return resolveDeploymentMeta(process.env);
}

/**
 * Renders deployment metadata to HTML string (used for tests and verification).
 */
export function renderDeploymentHtml(meta: DeploymentMeta): string {
  if (meta.isCommit && meta.commitUrl && meta.shortSha) {
    return `<div class="deploy-meta" aria-label="Versión y procedencia del despliegue"><span class="deploy-version">${meta.versionLabel}</span><span class="meta-sep" aria-hidden="true">·</span><a class="commit-link" href="${meta.commitUrl}" target="_blank" rel="noopener noreferrer" title="Ver commit en GitHub">commit ${meta.shortSha} <span aria-hidden="true">↗</span></a></div>`;
  }
  return `<div class="deploy-meta" aria-label="Versión y procedencia del despliegue"><span class="deploy-version">${meta.versionLabel}</span><span class="meta-sep" aria-hidden="true">·</span><span class="dev-badge">dev</span></div>`;
}
