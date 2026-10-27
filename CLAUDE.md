# CLAUDE.md — WWWH Optical 紹介サイト

このリポジトリは、サングラスブランド **WWWH Optical（ダブリュ・キューブド　オプチカル）** の
紹介サイトです。Claude Code で保守・改修するための前提をまとめています。

---

## 1. これは何か

- 静的な1ページサイト。ビルド不要。**GitHub Pages にそのまま置ける**構成。
- 公開URLの例：`https://<ユーザー名>.github.io/wwwh-optical/`
- サイトの目的：ブランドの理念と造形の考え方を伝え、製品写真は Instagram に誘導する。
  **このページ自体は写真を一切使わない**（意図的な設計。軽量さと「常に最新」を優先）。

```
.
├── index.html            # 本文（約19KB）
├── assets/css/site.css   # 全スタイル（デザイントークンは先頭の :root）
├── assets/js/site.js     # スクロール演出／日英切替／編集モード
├── README.md             # 使い方（公開手順・編集手順）
└── .nojekyll             # GitHub Pages 用（消さない）
```

## 2. 絶対に守る制約（ユーザー指示済み・変更禁止）

これらは過去に明示的に指示された確定事項です。勝手に戻さないこと。

| 項目 | 確定内容 |
|---|---|
| 読み方 | WWWH Optical = **ダブリュ・キューブド　オプチカル**（英語表記は W Cubed Optical） |
| 拠点 | **東京都**（静岡ではない） |
| 製造 | 福井県鯖江市 |
| 問い合わせ | **info@r-fopt.com** |
| サイズ | **M / W / C**（C = チルドレンサイズ。K は使わない） |
| 店舗 | **店頭販売なし**。「店頭で」「店舗にて」等の文言を書かない |
| オーダーメイド | **扱わない**。関連文言を書かない |
| 製品写真 | **掲載しない**。各モデル行と製品セクションに Instagram へのリンクを置く |
| レンズ | 「すべてのフレームはレンズ交換が可能です。※お近くの眼鏡店舗にてご相談してください。」のみ |
| 連番 | 本文中の「01 / 02 / 03」は**使わない**（章番号 `.section__label` の 01〜06 のみ残す） |
| 見出し | 製品セクションの「Three shapes, one line.」と、造形セクションの見出しは**削除済み**。復活させない |

## 3. デザインの決まり

- トーン：**文字と罫線だけ**。写真・装飾SVGは原則追加しない。唯一の線画は
  ヒーロー右上のメガネ（`figure.glassmark`、`aria-hidden`）。
- パレット（`site.css` の `:root`）：

  | 変数 | 値 | 用途 |
  |---|---|---|
  | `--paper` | `#e5e8e4` | 背景（わずかに緑を含むグレー。クリーム色にしない） |
  | `--ink` | `#16181a` | 本文・見出し |
  | `--ink-70` | `#4a4f4d` | 本文（副次） |
  | `--smoke` | `#767d79` | キャプション・注記 |
  | `--demi` | `#7c4a26` | 唯一のアクセント（琥珀）。多用しない |

- 書体：
  - 英字 `--f-en`：Century Gothic を最優先。ライセンスの都合で Webフォント配信はせず、
    未インストール環境では Questrial（Google Fonts）で代替する設計。**この意図を壊さない**。
  - 日本語 `--f-jp`：Noto Sans JP。
  - 英語モード時は `html[lang="en"]` 配下で本文も欧文書体・欧文行間に切り替わる。
- 余白：`.wrap { padding: 0 var(--pad) }`、`.section { padding-block: ... }`。
  **`padding` ショートハンドで左右を 0 に潰さない**（過去に事故あり）。
- PCフレーム：`site.css` 末尾（章15）で、幅900px以上のとき左右に **3cm の黒帯**
  （`--frame`）を出す。`html` が黒、`main` / `footer` が紙色。固定要素（`.bar` `.sheet`
  `.editor`）も帯の内側に寄せている。**この帯を消さない**。印刷時は帯なし。
- レスポンシブ：1000px / 640px の2ブレイクポイント。`prefers-reduced-motion` 対応済み。

## 4. テキストの持ち方（編集時に最重要）

本文は**日英2言語を同じ要素に持つ**。

```html
<p data-edit="hero.lede"
   data-en="English text here.">日本語の文章</p>
```

- `data-edit` … 編集モード（`?edit=1`）で書き換え可能にする印。**キー名は変更しない**。
- `data-en` … 英語版の文言。**日本語を変えたら英語も必ず対応させる**。
- `data-en` は属性なので、内部のHTMLタグは `&lt;` `&gt;` でエスケープし、
  引用符は `'`（シングル）を使う。
- 会社概要の `<dt>` にも `data-en` がある（`profile.brand.l` など）。

### キー一覧

`hero.* / philosophy.* / form.* / link.* / collection.* / c1.*〜c3.* / craft.* / profile.* / footer.*`

## 5. JavaScript の構造（`assets/js/site.js`）

IIFE 1本。上から順に：

1. スクロール出現（IntersectionObserver、`prefers-reduced-motion` で無効化）
2. ヘッダーの縮小・ナビのアクティブ追従・モバイルシート
3. **日英切替**（`setLang()`）— 初回に日本語を `dataset.jp` へ退避し、`data-en` と入れ替える。
   選択は `localStorage['wwwh-lang']` に保存。
4. **編集モード**（`?edit=1`）— `contenteditable` を付与し、`localStorage` に自動保存。
   「index.html を書き出す」で編集済みHTMLをダウンロード。

### 壊しやすいポイント

- 編集モードは `setLang('ja')` を強制してから起動する。**英語表示のまま編集させない**こと。
- 書き出し（`exportHTML`）は `contenteditable` / `spellcheck` を除去し、
  編集バーを閉じた状態でHTMLを再生成する。ここを変えると壊れたHTMLが出る。
- `defer` 付きで読み込んでいるため、DOM操作はすべて読み込み後に実行される。

## 6. ローカルでの確認

```bash
python3 -m http.server 8000
# → http://localhost:8000/          （通常表示）
# → http://localhost:8000/?edit=1   （編集モード）
```

`index.html` を `file://` で直接開いても動くが、`localStorage` の挙動が環境で異なるため
HTTPサーバー経由を推奨。

## 7. 変更したら必ずやること

1. **日本語と英語の両方を直したか**確認（`data-en` の対応漏れが最も多い不具合）。
2. ブラウザ幅 1351px / 390px の2つで表示確認。特に：
   - 左右の余白が消えていないか（`padding` ショートハンド）
   - 見出し・本文が画面外にはみ出していないか
3. `?edit=1` で点線が出ること、書き出しボタンが動くことを確認。
4. コミットメッセージは日本語で簡潔に（例：`製品名を実モデル名に変更`）。

## 8. デプロイ

`main` ブランチに push すると GitHub Pages が自動反映（Settings → Pages →
Deploy from a branch / `main` / `/ (root)`）。`.nojekyll` は削除しない。

## 9. 未確定・保留事項

- 製品の**実モデル名・カラー・価格**は未入力（現在は形状名 ROUND / SQUARE / BOSTON のみ）。
  ユーザーから情報が出たら `c1.*` 〜 `c3.*` を更新する。
- フッターの `WWWH` ロゴは `<svg><text textLength="1000" lengthAdjust="spacing">` で
  画面幅いっぱいに字間を伸ばしている。フォントを変えると字面が変わるので、
  サイズ調整は `font-size`（198）と `y`（182）で行う。
