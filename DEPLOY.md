# GitHub Pagesデプロイガイド

## 🚀 デプロイ手順

### 1. GitHub Pagesの有効化

1. GitHubリポジトリの **Settings** タブに移動
2. 左側メニューの **Pages** をクリック
3. **Source** を "Deploy from a branch" から **"GitHub Actions"** に変更
4. **Save** をクリック

### 2. 自動デプロイ

- `main` ブランチにプッシュすると自動的にデプロイが実行されます
- **Actions** タブでデプロイの進行状況を確認できます

### 3. 手動デプロイ（オプション）

ローカルから手動でデプロイする場合：

```bash
# 依存関係のインストール
npm install

# ビルド実行
npm run build

# GitHub Pagesにデプロイ
npm run deploy
```

## 📝 設定ファイル

### vite.config.ts
- GitHub Pages用のベースパス設定
- ビルド最適化設定

### .github/workflows/deploy.yml
- GitHub Actions設定
- 自動ビルド＆デプロイ

### package.json
- `gh-pages` パッケージの追加
- デプロイスクリプトの追加

## 🔗 アクセスURL

デプロイ後のアクセスURL:
```
https://[ユーザー名].github.io/japanese-text-waterfall/
```

## ⚠️ 注意事項

1. **API制限**: Bungomail APIはHTTPS環境でのみ動作するため、GitHub Pagesでも正常に動作します

2. **CORS設定**: 外部APIを使用している場合、CORS設定を確認してください

3. **サブパス**: GitHub Pagesではリポジトリ名がサブパスになるため、vite.config.tsでbaseパスを設定済みです

4. **初回デプロイ**: 初回デプロイ時は数分かかる場合があります

## 🛠️ トラブルシューティング

### デプロイが失敗する場合

1. **Actions** タブでエラーログを確認
2. Node.jsのバージョンを確認（v20推奨）
3. 依存関係の不整合がないか確認

### サイトにアクセスできない場合

1. GitHub Pagesの設定を再確認
2. DNS伝播を待つ（最大10分程度）
3. ブラウザのキャッシュをクリア

## 📊 パフォーマンス最適化

- 自動的にコード分割を実施
- アセットの最適化
- 軽量ビルドの生成

デプロイが完了すると、美しい日本語文字の滝アプリケーションがWeb上で公開されます！