#!/bin/bash
cd /home/pi/work/webserver
node test.js &

cd /home/pi/work/webapp/gyro
npm start &

cd /home/pi/work/camera
watch -n 10 python esp32cam_still.py
