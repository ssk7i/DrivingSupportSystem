import cv2
import os
import subprocess
import time

def save_frame_camera_loop(device_num, dir_path, basename, ext='jpg', delay=1, window_name='frame'):

    # 画像のフレームサイズを指定する
    try:
        res = subprocess.check_output(['curl','http://192.168.1.111:80/control?var=framesize&val=8'])
    except:
        print("Error : curl command")
        return

    cap = cv2.VideoCapture("http://192.168.1.111:81/stream")

    if not cap.isOpened():
        print("Error : open video capture")
        return

    os.makedirs(dir_path, exist_ok=True) # 画像ファイル保存用フォルダ作成
    base_path = os.path.join(dir_path, basename)
    
    n = 0
    while True:
        ret, frame = cap.read() # stream画像取得
        cv2.imwrite('{}_{}.{}'.format(base_path, str(n).zfill(2), ext), frame) # 画像ファイル出力
        
        height = frame.shape[0] # 画像の高さ取得
        width  = frame.shape[1] # 画像の幅取得
        resized_img = cv2.resize(frame, (width*4, height*4)) # 画像拡大
        cv2.imshow(window_name, resized_img)                 # 画像表示
        cv2.moveWindow(window_name, 0,0)                     # 画像位置移動
        #time.sleep(0.25) # 250ms待機
        cv2.waitKey(250)
        n += 1
        if n > 99:
            n = 0

    cv2.destroyWindow(window_name)

save_frame_camera_loop(0, 'data/temp', 'camera_capture')
