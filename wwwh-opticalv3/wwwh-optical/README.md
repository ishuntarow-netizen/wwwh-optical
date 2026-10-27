# WWWH Optical — 紹介サイト（日本語 / English）

`index.html`（外枠）＋ `site.html`（本体）＋ CSS ＋ JS だけで動く静的サイトです。ビルド不要。GitHub Pages にそのまま置けます。
写真は使わず、製品写真は Instagram へのリンクで案内する構成です。

## 1. GitHub Pages で公開する

1. GitHub で新しいリポジトリを作成（例：`wwwh-optical`／Public）。
2. このフォルダの中身をすべてコミット（`.nojekyll` も一緒に）。
   ```bash
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/<ユーザー名>/wwwh-optical.git
   git push -u origin main
   ```
3. **Settings → Pages** → Source: `Deploy from a branch`、Branch: `main` / `/ (root)` → Save。
4. 数分後 `https://<ユーザー名>.github.io/wwwh-optical/` で公開。

独自ドメインは Settings → Pages → Custom domain に `www.wwwh-optical.com` 等を入力し、
DNS で CNAME を `<ユーザー名>.github.io` に向けます。

## 2. 文章を書き換える（コード不要）

### 方法A：ブラウザ上で直接編集

1. URL の末尾に `?edit=1` を付けて開く（例：`https://…/wwwh-optical/?edit=1`）。
2. 点線の付いた文章をクリックして、その場で書き換え。
3. 「index.html を書き出す」→ ダウンロードされた **`site.html`** を GitHub の `site.html` に上書き。
4. 編集内容はブラウザに自動保存。「編集を破棄」で元に戻ります。

> 書き出さずに閉じると反映されません。必ず書き出して GitHub に上げてください。

### 方法B：HTMLを直接編集

各要素に `data-edit="hero.lede"` のような印が付いています。中身の文字を書き換えるだけで反映されます。

| 印 | 場所 |
|---|---|
| `hero.*` | ファーストビュー |
| `philosophy.*` | 理念（01） |
| `form.*` | 造形（02） |
| `link.*` | リンク（03） |
| `collection.*` / `c1.*`〜`c3.*` | 製品（04） |
| `craft.*` | つくり（05） |
| `profile.*` | 会社概要（06） |
| `footer.*` | フッター |

## 3. 英語版の文章

各要素の `data-en="…"` が英語版の文言です。右上の **JA / EN** で切り替わります。

- 日本語 → `data-en` を書き換える、または日本語側を編集モードで変更
- 英語 → `data-en="…"` の中を直接書き換え（HTMLタグも使えます。**属性内なので引用符は `'` を使用**）
- 例：`<p data-edit="hero.lede" data-en="English text here.">日本語の文章</p>`
- 英語の行間・書体は `html[lang="en"]` の CSS で別指定しています。

## 4. フォント

- 英字：**Century Gothic** を最優先。ただし Monotype の有償フォントのため、
  未インストール環境では **Questrial**（最も近い無料の幾何学サンセリフ）で表示します。
  全環境で完全一致させたい場合は Web Font ライセンスを取得し、`@font-face` を `<style>` の先頭に追加してください。
- 日本語：**Noto Sans JP**（Google Fonts・ゴシック体）

## 5. 製品写真について

このページには写真を載せていません（軽量・常に最新のため）。
各モデル行の「写真を見る ↗」と、04セクション右上の「製品写真はInstagramに ↗」が
`https://www.instagram.com/wwwhoptical/` に繋がっています。

写真を載せたい場合は、`<article class="model">` の中に
`<img src="assets/img/xxx.jpg" alt="">` を追加し、CSS の `.model` グリッドに列を足してください。

## 6. 公開前に確認する項目

- 会社概要の「代表」「事業」の表記
- 製品カードのモデル名（現在は形状名 ROUND / SQUARE / BOSTON）・カラー・価格

## 7. 構成

```
index.html            … 外枠（背景は黒。本文を幅10cmの枠で表示する）
site.html             … サイト本体（日英テキストを内蔵）
assets/css/site.css   … 全スタイル
assets/js/site.js     … スクロール演出／日英切替／編集モード
README.md             … このファイル
CLAUDE.md             … Claude Code 用の仕様メモ
.nojekyll             … GitHub Pages 用（消さない）
```

### 表示幅について

`index.html` が、幅 `10cm`（CSS の cm 換算で約378px）の枠に `site.html` を表示し、
両サイドを黒にしています。10cm より狭い画面（スマホなど）では画面幅いっぱいで表示します。
ブラウザの `cm` は 1cm ≒ 37.8px の規定値で換算されるため、画面の解像度や拡大率の設定によって、
実寸の定規で測ると10cmにならないPCもあります。幅を変えるときは `index.html` の `10cm` を書き換えます。

---

## 8. Claude Code で編集する場合

このフォルダは CSS / JS を分離した構成になっています（GitHub Pages ではそのまま動きます）。

```bash
git clone https://github.com/<ユーザー名>/wwwh-optical.git
cd wwwh-optical
claude      # Claude Code を起動
```

起動後、最初にこう伝えると話が早いです。

> CLAUDE.md を読んで。日本語と英語（data-en）を必ず両方直して。
> 写真は追加しないで。

`CLAUDE.md` に、確定済みの仕様（読み方・拠点・サイズ M/W/C・店頭なし・
オーダーメイドなし・写真なし など）と、壊しやすいポイントをまとめてあります。
