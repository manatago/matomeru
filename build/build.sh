#!/bin/bash

echo "Building Desktop Matome application..."

# 必要なディレクトリの作成
mkdir -p build/icons/iconset.iconset

# アイコン生成のための一時的なSVGファイルを作成
cat > build/icons/temp_icon.svg << "EOF"
<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#003344;stop-opacity:1"/>
      <stop offset="100%" style="stop-color:#002233;stop-opacity:1"/>
    </linearGradient>
    <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur"/>
      <feColorMatrix in="blur" type="matrix" values="
        0 0 0 0   0
        0 1 0 0   1
        0 0 0 0   0
        0 0 0 0.7 0
      "/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="innerGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur"/>
      <feComposite in="blur" in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feFlood flood-color="#00FF00" flood-opacity="0.5"/>
      <feComposite operator="in" in2="SourceAlpha"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- 背景 -->
  <rect width="1024" height="1024" fill="url(#bgGrad)"/>
  
  <!-- グリッドパターン -->
  <g stroke="#00FF00" stroke-width="1" opacity="0.1">
    <path d="M0 256 H1024 M0 512 H1024 M0 768 H1024"/>
    <path d="M256 0 V1024 M512 0 V1024 M768 0 V1024"/>
  </g>
  
  <!-- メインのフォルダアイコン -->
  <g transform="translate(192, 192) scale(0.625)">
    <!-- フォルダの本体 -->
    <path d="M256 384 L768 384 L768 768 L256 768 Z" 
          fill="none" 
          stroke="#00FF00" 
          stroke-width="40"
          filter="url(#neonGlow)"/>
    
    <!-- フォルダの上部 -->
    <path d="M384 256 L384 384 M640 256 L640 384" 
          stroke="#00FF00" 
          stroke-width="40"
          filter="url(#neonGlow)"/>
    
    <!-- サイバーな装飾 -->
    <circle cx="512" cy="576" r="96" 
            fill="none" 
            stroke="#00FFFF" 
            stroke-width="20"
            filter="url(#neonGlow)"/>
    <path d="M512 480 L512 672 M416 576 L608 576" 
          stroke="#00FFFF" 
          stroke-width="20"
          filter="url(#neonGlow)"/>
  </g>
</svg>
EOF

# 各サイズのアイコンを生成
SIZES=(16 32 128 256 512)
for size in "${SIZES[@]}"; do
    # 1x サイズのアイコン
    magick convert -background none build/icons/temp_icon.svg -resize ${size}x${size} \
        -depth 8 -quality 100 \
        "build/icons/iconset.iconset/icon_${size}x${size}.png"
    
    # 2x サイズのアイコン（Retinaディスプレイ用）
    double=$((size * 2))
    magick convert -background none build/icons/temp_icon.svg -resize ${double}x${double} \
        -depth 8 -quality 100 \
        "build/icons/iconset.iconset/icon_${size}x${size}@2x.png"
done

# 一時SVGファイルを削除
rm build/icons/temp_icon.svg

# icnsファイルの生成
echo "Generating .icns file..."
iconutil -c icns build/icons/iconset.iconset -o build/icons/icon.icns

# アプリケーションのビルド
echo "Building application..."
npm run build

# macOSアプリケーションのパッケージング
echo "Packaging application..."
npm run package:mac

echo "Build complete! Check the 'release' directory for the packaged application."