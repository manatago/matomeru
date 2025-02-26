const esbuild = require('esbuild');
const path = require('path');

// メインプロセスのビルド設定
const mainConfig = {
  entryPoints: ['src/main.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/main.js',
  external: ['electron'],
};

// プリロードスクリプトのビルド設定
const preloadConfig = {
  entryPoints: ['src/preload.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/preload.js',
  external: ['electron'],
};

// レンダラープロセスのビルド設定
const rendererConfig = {
  entryPoints: ['src/renderer.tsx'],
  bundle: true,
  platform: 'browser',
  target: 'es2020',
  outfile: 'dist/renderer.js',
  loader: {
    '.tsx': 'tsx',
    '.ts': 'ts',
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
};

// 開発モードでの実行
const isDev = process.argv.includes('--dev');

// 共通の設定
const commonConfig = {
  minify: !isDev,
  sourcemap: isDev,
};

// ビルド関数
async function build() {
  try {
    // distディレクトリの作成
    const fs = require('fs');
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    // ビルドコンテキストの作成
    if (isDev) {
      // 開発モード: watchモードで実行
      const contexts = await Promise.all([
        esbuild.context(Object.assign({}, mainConfig, commonConfig)),
        esbuild.context(Object.assign({}, preloadConfig, commonConfig)),
        esbuild.context(Object.assign({}, rendererConfig, commonConfig))
      ]);

      await Promise.all(contexts.map(context => context.watch()));
      console.log('Watching for changes...');
    } else {
      // 本番モード: 一度だけビルド
      await Promise.all([
        esbuild.build(Object.assign({}, mainConfig, commonConfig)),
        esbuild.build(Object.assign({}, preloadConfig, commonConfig)),
        esbuild.build(Object.assign({}, rendererConfig, commonConfig))
      ]);

      console.log('Build completed successfully!');
    }

    // HTMLファイルのコピー
    const srcHtml = path.join(__dirname, 'src', 'index.html');
    const destHtml = path.join(__dirname, 'dist', 'index.html');
    fs.copyFileSync(srcHtml, destHtml);

    if (!isDev) {
      process.exit(0);
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();