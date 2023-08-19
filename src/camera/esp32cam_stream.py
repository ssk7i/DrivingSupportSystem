import cv2
import time
import datetime

# コーデック:MPEG-4 　定数
XVID = 0x3447504d

cap = cv2.VideoCapture("http://192.168.1.111:81/stream")
digit_num = len(str(int(cap.get(cv2.CAP_PROP_FRAME_COUNT))))

now = datetime.datetime.now()
otime = time.time()
nowvfn = now.strftime('%Y%m%d_%H%M%S') + '.mp4'
 
fps = int(cap.get(cv2.CAP_PROP_FPS))
w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fourcc = cv2.VideoWriter_fourcc(*'XVID')
video = cv2.VideoWriter(nowvfn, fourcc, fps, (w, h))
 
while(True):
  ret, frame = cap.read()
  cv2.imshow('frame',frame)
  video.write(frame)
  ntime = time.time()
  if ntime - otime > 60:
    break
  if cv2.waitKey(1) & 0xFF == ord('q'):
    break

cap.release()
cv2.destroyAllWindows()
