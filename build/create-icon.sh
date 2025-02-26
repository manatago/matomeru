#!/bin/bash

# アイコン用の基本画像を生成
magick -size 1024x1024 xc:none \
    -define gradient:direction=diagonal \
    -define gradient:extent=diagonal-tr \
    -sparse-color Barycentric \
        '0,0 #003344 1024,1024 #001122' \
    \( +clone -alpha extract \
        -draw "roundrectangle 0,0 1024,1024 50,50" \
        -blur 0x10 \) \
    -alpha off -compose CopyOpacity -composite \
    build/icons/base.png

# メインの図形を描画
magick build/icons/base.png \
    -stroke '#00FF00' -strokewidth 8 \
    -fill none \
    -draw "roundrectangle 100,100 924,924 40,40" \
    -draw "path 'M 512,200 L 512,824'" \
    -draw "path 'M 200,512 L 824,512'" \
    -stroke '#00FFFF' -strokewidth 4 \
    -draw "circle 512,512 512,712" \
    build/icons/main.png

# グロー効果を追加
magick build/icons/main.png \
    \( +clone -background '#00FF00' -shadow 60x20+0+0 \) +swap \
    -background none -layers merge +repage \
    \( +clone -background '#00FFFF' -shadow 40x10+0+0 \) +swap \
    -background none -layers merge +repage \
    build/icons/icon_with_glow.png

# デジタルノイズパターンを追加
magick build/icons/icon_with_glow.png \
    \( -size 1024x1024 xc:none \
       -seed 1234 +noise Random \
       -virtual-pixel tile \
       -blur 0x0.5 \
       -level 0,50% \
       -fill '#00FF00' -colorize 100 \
       -alpha set -channel A -evaluate set 30% \
    \) \
    -compose overlay -composite \
    build/icons/final.png

# 各サイズのアイコンを生成
mkdir -p build/icons/iconset.iconset
SIZES=(16 32 128 256 512)
for size in "${SIZES[@]}"; do
    # 1x サイズのアイコン
    magick build/icons/final.png -resize ${size}x${size} \
        build/icons/iconset.iconset/icon_${size}x${size}.png
    
    # 2x サイズのアイコン（Retinaディスプレイ用）
    double=$((size * 2))
    magick build/icons/final.png -resize ${double}x${double} \
        build/icons/iconset.iconset/icon_${size}x${size}@2x.png
done

# icnsファイルを生成
iconutil -c icns build/icons/iconset.iconset -o build/icons/icon.icns

# 一時ファイルを削除
rm build/icons/base.png build/icons/main.png build/icons/icon_with_glow.png build/icons/final.png