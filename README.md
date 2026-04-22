# Karotter Studio

![Version](https://img.shields.io/badge/version-1.6.0-blue)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Firefox-orange)

---

**Karotter Studio** は、[karotter.com](https://karotter.com) およびそのサブドメイン（`apikarotter.karon.jp` 等を含む）のエクスペリエンスを劇的に進化させるブラウザ拡張機能（Chrome & Firefox 対応）です。強力なテーマエンジンによる自由な外観カスタマイズから、集中力を高める機能拡張まで。あなたのブラウジングを「スタジオ」に変えます。

---

## 📖 目次
- [✨ 主な機能](#-主な機能)
  - [🎨 究極の外観カスタマイズ](#-究極の外観カスタマイズ)
  - [🛠️ 直感的な機能拡張](#-直感的な機能拡張)
- [🚀 導入方法](#-導入方法)
  - [Google Chrome](#google-chrome)
  - [Firefox](#firefox)
- [📁 プロジェクト構成](#-プロジェクト構成)
- [🛠️ 開発者向け](#-開発者向け)
- [⚖️ サードパーティ・ライセンス / Credits](#-サードパーティライセンス--credits)

---

## ✨ 主な機能

### 🎨 究極の外観カスタマイズ
- **ダイナミック・テーマエンジン**: 1つのベースカラーから「ライト」「ソフト」「ディム」「ダーク」の4つのモードを自動生成。新設の「ソフト」モードは、明るさを保ちつつ色味を鮮やかに表現します。
- **背景画像 & ガラスモーフィズム**: お気に入りの画像を背景に設定可能。UIの透明度を調整して、透き通るようなモダンなデザインを実現します。
- **高度なフォントカスタマイズ**: アプリ全体のフォントを自由自在に変更可能。内蔵の個性的なフォント（無心、タイムマシンわ号など）に加え、お手持ちのフォントファイルのアップロード、さらには Google Fonts からの直接選択にも対応しています。
- **微調整機能**: 彩度や明るさのシフトにより、あなたの目に最も優しい配色を追求できます。
- **エディタ・テーマ**: 設定画面自体の「ライト」「ダーク」「システム」テーマの切り替えに対応。快適な設定環境を提供します。

### 🛠️ 直感的な機能拡張
- **高度な検索 UI**: 検索ボックスの横に高度な設定アイコンを追加。Twitter(X)互換の詳細な条件（AND、OR、期間など）を直感的なモーダルで入力可能です。
- **スタジオ動画プレイヤー (Beta)**: デフォルトの再生UIを拡張し、再生速度変更、動画の直接ダウンロード、美しいシークバー、没入感を高めるオートハイド機能などを提供します。
- **vbot コマンドアシスタント**: 投稿作成時に `@vbot` と入力すると、利用可能なボットコマンドをサジェスト。複雑なコマンドも迷わず入力できます。
- **自動化・効率化アシスト**: 「もっと見る」ボタンの自動展開や、投稿画像のワンクリック保存ボタンを追加します。
- **ナビゲーション拡張**: メインナビゲーションに「掲示板」へのショートカットを追加可能。コミュニティへのアクセスを加速します。
- **サイドバー整理**: かさばる右サイドバーをセクションごとに折りたたみ可能。タイムラインに集中できます。
- **ネタバレ防止**: 指定したキーワードをタイムライン上で黒塗りに。ホバーするまで内容は表示されません。

- **ノイズの除去**: リアクション数、閲覧数、認証済みマーク（本人・運営・団体含む）など、集中を妨げる要素を個別に非表示にできます。
- **返信の非表示 (New)**: ホームタイムライン上の返信投稿（リプライ）を非表示にし、オリジナルの投稿のみを並べることができます。

---

- **Firefox 版の公式サポート**: Firefox 向けに Manifest V3 で移植。サイドパネル（サイドバー）標準対応により、よりシームレスな操作性を実現。
- **UI 設定の整理**: 「返信を非表示」設定を「UI の簡素化」セクションへ移動し、より直感的にアクセスできるよう改善。
- **文言のブラッシュアップ**: 設定画面の各項目の説明文をよりわかりやすく、適切な表現に修正。
- **バージョンアップ**: 内部バージョンおよび UI 表示を 1.6.0 に更新。

---

## 🚀 導入方法

> [!IMPORTANT]
> **ZIPファイルをダウンロードする場合**
> GitHub の画面右上にある緑色の「Code ＞ Download ZIP」ではなく、必ず **[GitHub Releases](https://github.com/NamiCode-Dev/Karotter-Studio/releases)** から最新バージョンの ZIP ファイルをダウンロードしてください。（Code からのダウンロードでは、一部のファイルが不足したり動作しなかったりする場合があります）

### Google Chrome
Chrome には 2 通りのインストール方法があります。

#### 1. ストアからインストール（推奨）
公式の Chrome ウェブストアから直接インストールできます。自動更新が適用されるため、こちらを推奨します。
- **[Chrome ウェブストアで入手](https://chromewebstore.google.com/detail/karotter-studio/kjhhkkihmpfkhaffccmcilmocopkphgf?hl=ja)**

#### 2. ファイルから手動でインストール（開発者向け）
1. [GitHub Releases](https://github.com/NamiCode-Dev/Karotter-Studio/releases) から最新の ZIP ファイルをダウンロードして解凍してください。
2. Chrome で `chrome://extensions` を開きます。
3. 右上の「**デベロッパー モード**」をオンにします。
4. 「**パッケージ化されていない拡張機能を読み込む**」をクリックします。
5. 解凍したフォルダのルート（`manifest.json` がある場所）を選択してください。

> [!TIP]
> Chrome のサイドパネル機能に対応しています。拡張機能アイコンを右クリックして「サイドパネルで開く」を選択すると、タイムラインを見ながらリアルタイムで設定を変更できます。

### Firefox
Firefox には 2 通りのインストール方法があります。

#### 1. ストアからインストール（推奨）
公式のアドオンストアから直接インストールできます。自動更新が適用されるため、こちらを推奨します。
- **[Firefox Add-ons ストアで入手](https://addons.mozilla.org/ja/firefox/addon/karotter-studio/)**

#### 2. ファイルから手動でインストール
開発版や特定のバージョンを使用したい場合に利用してください。
1. [GitHub Releases](https://github.com/NamiCode-Dev/Karotter-Studio/releases) から最新の ZIP ファイルをダウンロードして解凍してください。
2. **未署名のアドオンのインストールを有効化します。**
   - 設定方法は [Mozilla サポートの公式ガイド](https://support.mozilla.org/ja/kb/add-on-signing-in-firefox#w_wei-shu-ming-noadoonwoshi-itaichang-he-shang-ji-yu-za-xiang-ke) を参照し、必ず事前にチェックしてください。
   - ※ 一般的な Firefox (Release 版) では制限があるため、上記ガイドに従って設定を変更する必要があります。
3. Firefox で `about:addons` を開きます。
4. 右上の歯車アイコン（アドオンの管理）をクリックし、「**ファイルからアドオンをインストール...**」を選択します。
5. 解凍したフォルダ内の **`firefox/manifest.json`** を選択してください。

> [!NOTE]
> Firefox 版は標準でサイドパネル（サイドバー）で開くように設定されています。ツールバーのアイコンをクリックするだけで、サイドバーに設定画面が表示されます。


---

## 📁 プロジェクト構成

```text
.
├── manifest.json      # Chrome 用の定義 (Manifest V3)
├── firefox/           # Firefox 用のソースコード一式
│   └── manifest.json  # Firefox 用の定義 (Sidebar 特化)
├── popup.html/js/css  # 設定画面の UI とロジック
├── content.js         # Karotter への機能注入
├── theme-engine.js    # 配色生成コアロジック
├── storage.js         # 設定の永続化処理
└── background.js      # バックグラウンド処理
```

---

## 🛠️ 開発者向け

このプロジェクトは純粋な HTML/JS/CSS で構築されており、ビルドプロセスなしで直接読み込み・開発が可能です。

- **テーマエンジン**: `theme-engine.js` 内の HSL 計算ロジックにより、コントラストを維持したまま調和のとれたパレットを生成します。
- **CSS変数注入**: `content.js` が動的にスタイルシートを生成し、Karotter 本体の CSS 変数をオーバーライドします。

---

## ⚖️ サードパーティ・ライセンス / Credits

本拡張機能では、以下のオープンソースソフトウェアおよび資産を使用しています。開発者の皆様に感謝いたします。

- **Credits**:
  - This product uses [Lucide Icons](https://lucide.dev/).
  - Lucide Icons © Lucide Contributors, licensed under the [ISC License](https://github.com/lucide-icons/lucide/blob/main/LICENSE).
  - Some icons are derived from [Feather](https://feathericons.com/) © Cole Bemis, licensed under the [MIT License](https://github.com/feathericons/feather/blob/master/LICENSE).

---

Developed with ❤️ for the Karotter Community.

---
