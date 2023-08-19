#!/bin/bash
# 引数は1つ(画像ファイルのフルパス)
cd /home/pi/work/detect/keras-yolo3-master
/home/pi/tool/python/bin/python3.7 yolo_video.py --image <<EOF
$1
EOF
