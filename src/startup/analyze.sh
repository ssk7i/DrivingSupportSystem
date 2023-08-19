#!/bin/bash

# ディレクトリを一時ファイルが保存されているフォルダに移動
cd /home/pi/work/camera/data

# 保存するフォルダ名取得
FOLDER_NAME=`date +%Y%m%d%H%M%S`
echo $FOLDER_NAME

# 画像ファイルを日時のフォルダ名にコピー
cp -rp /home/pi/work/camera/data/temp /home/pi/work/camera/data/$FOLDER_NAME

# コピーしたフォルダ内に移動
cd /home/pi/work/camera/data/$FOLDER_NAME 

# 最新のファイルの名前を一つ取得
FILE_NAME=`ls -rt | tail -n 1`
echo $FILE_NAME

# 解析処理が実行中かどうか判定する
PS=`ps aux | grep detect.sh | grep -v grep | wc -l`
if [ $PS -eq 0 ]; then # 対象プロセスが存在しなかった
  # 最新のファイルに対して解析を実行
  /home/pi/work/startup/detect.sh /home/pi/work/camera/data/$FOLDER_NAME/$FILE_NAME
else # 対象プロセスがした
  exit 1 # 処理終了
fi
# 解析結果ファイルをコピー
cd /tmp
FILE_NAME_2=`ls -rt | tail -n 1`
echo $FILE_NAME_2
cp -p /tmp/$FILE_NAME_2 /home/pi/work/camera/data/$FOLDER_NAME/

# 30秒間 画像表示待機
sleep 30

# 画像表示しているプロセスを終了する
pkill -f "gpicview /tmp/$FILE_NAME_2"

# 一時ファイルは削除
rm -f /tmp/$FILE_NAME_2
