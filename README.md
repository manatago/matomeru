# デスクトップまとめる

攻殻機動隊風のデザインを採用したmacOS用デスクトップ整理アプリケーション。

## 機能

- デスクトップ上のファイルとフォルダを自動的に整理
- 現在の日時をフォルダ名として使用
- 「過去のデスクトップ」フォルダへの自動移動（Homeディレクトリの文書の中に作成します）
- 除外ファイル/フォルダの設定
- サイバーパンク的なビジュアルエフェクト

## インストール方法

現在、アプリケーションの著名が有料かつ面倒なので、realeaseからダウンロードしても動きません。
開発者向けのインストール、およびパッケージ化でお願いします。


## 使用方法

1. アプリケーションを起動
2. 必要に応じて「設定」ボタンから除外するファイル/フォルダを設定
   - 整理時に移動したくないファイルやフォルダの名前を指定できます
3. 「まとめる」ボタンをクリック
   - デスクトップ上のファイルが日時名のフォルダにまとめられます
   - まとめられたフォルダは自動的に「ドキュメント/過去のデスクトップ」に移動されます

## 開発者向け情報

### 必要な環境

- Node.js 16.0.0以上
- npm 7.0.0以上
- ImageMagick（アイコン生成用）

### セットアップ

```bash
# プロジェクトのクローン
git clone <repository-url>
cd desktop-matome

# 依存関係のインストール
npm install
```

### 開発モードでの実行

```bash
npm run dev
```

### ビルドとパッケージング

```bash
# アプリケーションのビルドのみ
npm run build

# macOSアプリケーションとしてパッケージング
npm run package:mac
```

ビルドされたアプリケーションは`release`ディレクトリに生成されます。

## デザイン

- 電脳的なグリーン（#00FF00）を基調としたカラーパレット
- サイバー的なアクセントカラー（#00FFFF）
- ダークネイビーの背景（#002B36）
- ホログラム風のUIエフェクト
- スキャンラインやデータフローのアニメーション
- 攻殻機動隊をインスピレーションとしたビジュアル

## 注意事項

- このアプリケーションは、デスクトップ上のファイルを移動します。重要なファイルは事前にバックアップすることをお勧めします。
- 除外設定で指定したファイル/フォルダは移動されません。
- アプリケーションが正常に動作するために、以下の権限が必要です：
  - デスクトップへのアクセス
  - ドキュメントフォルダへのアクセス

## ライセンス

MIT License