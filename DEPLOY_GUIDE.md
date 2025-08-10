# デジタル文字滝 - GitHub Pages デプロイガイド

このプロジェクトをGitHub Pagesにデプロイするための完全ガイドです。

## 問題と解決策

### 🔍 原因
GitHub Sparkテンプレートは `@github/spark` パッケージに依存していますが、これはプライベート/内部ライブラリのため、Spark環境外では利用できません。そのため、通常の `npm install` → `vite build` の流れが失敗します。

### ✅ 解決策
このプロジェクトでは以下の対応を実装しました：

1. **モック実装**: `src/lib/spark-mock.ts` でSpark APIのフォールバック版を提供
2. **条件付きエイリアス**: Vite設定でSpark環境の有無を自動検出し、適切な実装を選択
3. **自動フォールバック**: Spark環境でない場合は自動的にlocalStorageベースの実装に切り替え

## 📦 デプロイ手順

### 1. リポジトリ設定
```bash
# リポジトリ名に合わせてベースパスを確認/修正
# vite.config.ts の base 設定を確認
base: process.env.NODE_ENV === 'production' ? '/digital-narrative-cascade/' : '/'
```

### 2. GitHub Pages 設定
1. GitHubリポジトリの「Settings」→「Pages」へ移動
2. Source: 「GitHub Actions」を選択
3. ワークフローが自動実行されるのを確認

### 3. 自動デプロイ
- `main` ブランチへの push で自動デプロイが開始
- GitHub Actions でビルドとデプロイが実行される
- デプロイURL: `https://<username>.github.io/<repository-name>/`

## 🔧 環境別の動作

### Spark環境内
- 完全なSpark APIを使用
- KVストレージ、LLM API等がフル機能で動作

### Spark環境外（GitHub Pages等）
- モック実装を自動使用
- localStorageベースのデータ永続化
- LLM機能は無効化（太宰治APIは引き続き利用可能）

## 📋 必要な設定ファイル

### `vite.config.ts`
```typescript
// GitHub Pages用のベースパス設定
base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/'

// 条件付きエイリアス設定
resolve: {
  alias: {
    '@': resolve(projectRoot, 'src'),
    ...(existsSync(resolve(projectRoot, 'packages/spark-tools/dist/spark.js')) ? {} : {
      '@github/spark/spark': resolve(projectRoot, 'src/lib/spark-mock.ts'),
      '@github/spark/hooks': resolve(projectRoot, 'src/hooks/useKV.ts')
    })
  }
}
```

### `.github/workflows/deploy.yml`
GitHub Actionsによる自動デプロイ設定が含まれています。

## 🚨 注意事項

1. **ベースパス**: `vite.config.ts`のベースパス設定をリポジトリ名に合わせて修正してください
2. **API制限**: Spark環境外ではLLM機能は利用できません
3. **データ永続化**: Spark環境外ではlocalStorageを使用（ブラウザ依存）

## 🐛 トラブルシューティング

### ビルドエラーが発生する場合
```bash
# 依存関係を再インストール
npm clean-install

# キャッシュをクリア
npm run optimize

# 手動ビルドテスト
npm run build
```

### デプロイURLが間違っている場合
1. `vite.config.ts`のベースパス設定を確認
2. GitHub PagesのCustom domainの設定を確認
3. リポジトリ名とベースパスが一致しているか確認

### 文字が流れない場合
1. ブラウザの開発者ツールでエラーをチェック
2. 太宰治APIのCORS設定を確認
3. フォールバックテキストが表示されているか確認

## 📱 アプリケーション機能

- **文字の滝**: 太宰治の作品から文字が滝のように流れる
- **岩の配置**: クリックで岩を配置し、文字の流れを制御
- **物理演算**: リアルな水の流れを再現
- **溢れ効果**: 文字が溜まると自然に溢れて流れる
- **データ保存**: 岩の位置を自動保存（次回訪問時も復元）

## 🌐 デプロイ後の確認

デプロイが成功したら以下を確認してください：

1. ✅ アプリケーションが正常に表示される
2. ✅ 文字が滝のように流れる
3. ✅ クリックで岩を配置できる
4. ✅ 岩の位置が保存される
5. ✅ レスポンシブデザインが機能している

---

**成功！** これで美しい日本語文字滝アプリケーションがGitHub Pagesで公開されました。