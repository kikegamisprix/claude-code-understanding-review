# Claude Code Understanding Review

Claude API を使って、PRの作成者がコードの内容を理解しているかチェックする GitHub Actions ワークフローです。

## 概要

AI（Claude Code など）でコードを生成した場合、開発者が内容を理解しないままマージしてしまうリスクがあります。
このツールは、PR作成時に Claude がコード差分を分析して理解度チェックの質問を自動生成し、開発者の回答を評価して合格するまでマージをブロックします。

## フロー

1. 対象ユーザーがPRを作成
2. Claude が差分を分析し、理解度チェックの質問をPRコメントに投稿
3. Commit Status が `pending` になりマージがブロックされる
4. 開発者が `## 回答` で始まるコメントで回答
5. Claude が回答を評価し、合格なら Status を `success` に変更
6. 不合格の場合はフィードバック付きで再回答を求める

## セットアップ

### 1. ファイルを配置

このリポジトリのファイルをプロジェクトにコピーしてください。

```
.github/workflows/code-understanding-review.yml
src/shared.ts
src/generate-questions.ts
src/check-explanation.ts
review-config.json
package.json
tsconfig.json
```

### 2. シークレットを設定

リポジトリの Settings > Secrets and variables > Actions で以下を追加:

- `ANTHROPIC_API_KEY`: Anthropic の API キー

`GITHUB_TOKEN` はワークフローで自動提供されるため設定不要です。

### 3. 設定ファイルを編集

`review-config.json` の `target_users` にチェック対象のGitHubユーザー名を追加します。

```json
{
  "target_users": ["junior-dev-1", "junior-dev-2"],
  "questions_count": 3,
  "model": "claude-sonnet-4-20250514",
  "max_diff_lines": 500
}
```

### 4. Branch Protection を設定

リポジトリの Settings > Branches で保護ルールを追加:

1. Branch name pattern: `main`（保護対象ブランチ）
2. **Require status checks to pass before merging** を有効化
3. Status checks で `understanding-check` を追加

## 設定項目

| 項目 | 説明 |
|------|------|
| `target_users` | チェック対象のGitHubユーザー名リスト |
| `questions_count` | 生成する質問の数（推奨: 3） |
| `model` | 使用するClaudeモデル |
| `max_diff_lines` | 自動チェック可能な差分の最大行数 |

## ライセンス

MIT
