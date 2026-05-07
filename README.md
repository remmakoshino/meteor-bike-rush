# 流星バーストライダーズ

バイク専用のブラウザアーケードレースゲームです。Phaser 3 + TypeScript + Vite で構築し、GitHub Pages へデプロイできる構成になっています。

## 開発コマンド

- `npm run dev`
- `npm run typecheck`
- `npm run test:unit`
- `npm run build`
- `npm run test:e2e`
- `npm run debug:static`
- `npm run verify:debug`

## 操作

- `W` / `↑`: 加速
- `S` / `↓`: 減速
- `A,D` / `←,→`: 旋回
- `Shift`: ドリフト
- `Space`: アイテム使用

スマホ・タブレットは画面上のタッチボタンで操作できます。

## 公開設定

- Vite base: `/meteor-bike-rush/`
- GitHub Actions: `.github/workflows/deploy.yml`
- push対象: `main`, `master`

## デバッグ運用

デバッグ作業の記録・修正履歴は `SPEC.md` に追記します。デバッグ実施時の追記ルールも `SPEC.md` を参照してください。
