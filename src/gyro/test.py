from mpu6050 import mpu6050
import sys;
import subprocess
import math

#arg_str = sys.stdin.readline() # 引数取得
#arg = int(arg_str)             # 文字を数値に変換
#print(arg)                     # 引数表示

sensor = mpu6050(0x68)

gravity = 9.81 # 重力加速度

accel_data = sensor.get_accel_data()
temp = sensor.get_temp()

# 小数点以下第3位まで表示
#if   arg == 1 :
print("%6.3f" % accel_data['x'])
#elif arg == 2 : 
print("%6.3f" % accel_data['y'])
#elif arg == 3 : 
print("%6.3f" % accel_data['z'])
#elif arg == 4 :
print("%4.1f" % temp)

# 合成加速度計算
accel = math.sqrt(accel_data['x']*accel_data['x']+accel_data['y']*accel_data['y']
                  +(accel_data['z']-gravity)*(accel_data['z']-gravity))/gravity
# 合成加速度が1G以上の場合、解析スクリプト実行
if accel >= 1.0 :
    try:
        res = subprocess.check_output(['/home/pi/work/startup/analyze.sh'])
    except:
        print("Error : bash command")
