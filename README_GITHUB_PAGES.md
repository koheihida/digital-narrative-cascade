# Japanese Text Waterfall 🎋

太宰治の文学作品から文字が滝のように流れ落ちる、美しいインタラクティブWebアプリケーション。

![Demo](demo.gif)

## 📝 概要

黒い背景に白い日本語の文字が自然な水の流れのように落ちてくるアプリケーションです。ユーザーは画面をクリックして岩を配置し、文字の流れを変化させることができます。

### 🌟 主な機能

- **リアルタイム文字流**: 太宰治の作品から取得した文字が滝のように流れ落ちる
- **物理演算**: 重力、反射、乱流効果によるリアルな文字の動き
- **インタラクティブな岩配置**: クリックで岩を配置し、文字の流れを変える
- **溢れ効果**: 文字が溜まると水のように溢れて流れる
- **美しい軌跡**: 文字の動きに合わせた軌跡表示

## 🚀 GitHub Pagesにデプロイする

### 1. リポジトリをForkまたはClone

```bash
git clone [リポジトリURL]
cd japanese-text-waterfall
```

### 2. GitHub Pagesの設定

1. GitHubリポジトリの **Settings** → **Pages**
2. **Source** を **"GitHub Actions"** に変更
3. 保存

### 3. 自動デプロイ

`main` ブランチにプッシュすると自動的にデプロイされます：

```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

デプロイ後のURL: `https://[ユーザー名].github.io/japanese-text-waterfall/`

### 4. 手動デプロイ（オプション）

```bash
npm install
npm run build
npm run deploy
```

## 🛠️ ローカル開発

### 前提条件

- Node.js 20以上
- npm

### セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

開発サーバーは `http://localhost:5000` で起動します。

### 利用可能なスクリプト

```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド版のプレビュー
npm run deploy   # GitHub Pagesにデプロイ
npm run lint     # コードチェック
```

## 🎮 使い方

1. **文字の観察**: 太宰治の文学作品の文字が画面上部から流れ落ちるのを観察
2. **岩の配置**: 画面をクリックして岩を配置し、文字の流れを変える
3. **流れの変化**: 岩に当たった文字は水のように反射・分流
4. **溢れ効果**: 岩が多く配置されて文字が溜まると、自然に溢れて流れる
5. **岩のクリア**: 左上の「岩をクリア」ボタンで全ての岩を削除

## 🔧 技術仕様

### フロントエンド

- **React 19** + **TypeScript**
- **Vite** (ビルドツール)
- **Tailwind CSS** (スタイリング)
- **Canvas API** (描画)
- **Framer Motion** (アニメーション)

### 物理演算

- **重力**: 自然な落下
- **衝突判定**: 岩との正確な衝突検出
- **反射計算**: リアルな反射角度
- **乱流効果**: 自然な流れの再現
- **溢れ処理**: 文字の蓄積と溢れ

### データソース

- **Bungomail API**: 太宰治の作品テキストを動的取得
- **フォールバック**: API失敗時の代替テキスト

## 📁 プロジェクト構造

```
src/
├── App.tsx              # メインアプリケーション
├── types.ts             # TypeScript型定義
├── utils/
│   ├── physics.ts       # 物理演算ユーティリティ
│   └── rendering.ts     # Canvas描画ユーティリティ
├── index.css            # グローバルスタイル
└── main.tsx             # エントリーポイント
```

## ⚙️ カスタマイズ

### 物理パラメーター

`src/utils/physics.ts` で物理演算の設定を調整：

```typescript
export const PHYSICS_CONFIG = {
  GRAVITY: 0.2,              // 重力の強さ
  MIN_VELOCITY: 0.3,         // 最小落下速度
  SPAWN_INTERVAL: 100,       // 文字生成間隔
  MAX_NEARBY_CHARS: 8,       // 溢れ判定の文字数
  OVERFLOW_VELOCITY: 0.8,    // 溢れ時の速度
  TURBULENCE: 0.0015,        // 乱流の強さ
}
```

### 滝の幅

`getWaterfallBounds` 関数で滝の幅を変更：

```typescript
export const getWaterfallBounds = (canvasWidth: number) => {
  const width = Math.min(320, canvasWidth * 0.3) // 幅を調整
  const left = (canvasWidth - width) / 2
  return { left, right: left + width, width }
}
```

## 🔗 API情報

- **Bungomail API**: `https://api.bungomail.com/works?author=太宰治`
- 太宰治の文学作品データを取得
- CORS対応、HTTPS必須

## 📱 レスポンシブ対応

- デスクトップ、タブレット、スマートフォンに対応
- Canvas要素は画面サイズに自動調整
- タッチ操作での岩配置をサポート

## 🛡️ ブラウザサポート

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

Canvas API使用のため、モダンブラウザが必要です。

## 📄 ライセンス

MIT License

## 🤝 コントリビューション

1. Fork
2. Feature Branch作成 (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Pull Request作成

## 📞 サポート

問題や質問がある場合は、GitHubのIssueで報告してください。

## 📋 デプロイガイド

詳細なデプロイ手順については [DEPLOY.md](DEPLOY.md) をご確認ください。

---

**日本の美しい文学を、現代のテクノロジーで表現した芸術作品です。**