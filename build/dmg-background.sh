#!/bin/bash

# DMGバックグラウンド画像の生成
magick convert -size 540x400 xc:none \
    -fill "#000A14" -draw "rectangle 0,0 540,400" \
    -stroke "#00FF00" -strokewidth 1 \
    -draw "path 'M 0,100 L 540,100 M 0,200 L 540,200 M 0,300 L 540,300'" \
    -draw "path 'M 100,0 L 100,400 M 200,0 L 200,400 M 300,0 L 300,400 M 400,0 L 400,400'" \
    -fill none -stroke "#00FF00" -strokewidth 2 \
    -draw "circle 270,200 270,300" \
    -draw "rectangle 220,150 320,250" \
    -fill "#00FFFF" -stroke "#00FFFF" -strokewidth 1 \
    -draw "path 'M 270,100 L 270,300 M 170,200 L 370,200'" \
    build/background.png

# 画像の最適化
magick convert build/background.png -quality 95 build/background.png