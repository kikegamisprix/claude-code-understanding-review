import Anthropic from "@anthropic-ai/sdk";
import { Octokit } from "@octokit/rest";
import { readFileSync } from "fs";

export const COMMENT_MARKER = "<!-- claude-understanding-check -->";
export const ANSWER_MARKER = "## 回答";
export const STATUS_CONTEXT = "understanding-check";

export interface ReviewConfig {
  target_users: string[];
  questions_count: number;
  model: string;
  max_diff_lines: number;
}

export interface PullRequestFile {
  filename: string;
  patch?: string;
}

export function loadConfig(): ReviewConfig {
  return JSON.parse(readFileSync("review-config.json", "utf-8"));
}

export function createAnthropicClient(): Anthropic {
  return new Anthropic();
}

export function createOctokit(): Octokit {
  return new Octokit({ auth: process.env.GITHUB_TOKEN });
}

export function getEventPayload(): Record<string, any> {
  return JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH!, "utf-8"));
}

export function parseRepo(): { owner: string; repo: string } {
  const [owner, repo] = process.env.GITHUB_REPOSITORY!.split("/");
  return { owner, repo };
}

export async function isCollaborator(
  octokit: Octokit,
  owner: string,
  repo: string,
  username: string
): Promise<boolean> {
  try {
    await octokit.repos.checkCollaborator({ owner, repo, username });
    return true;
  } catch {
    return false;
  }
}

export function buildDiffContent(files: PullRequestFile[]): string {
  return files
    .map((f) => `--- ${f.filename}\n${f.patch || "(binary file)"}`)
    .join("\n\n");
}
