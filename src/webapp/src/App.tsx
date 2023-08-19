import { useState, useEffect } from "react";
import axios from "axios"
import './App.css';

const width    = 120;
const height   = 120;
//const sizeFont = 50;
const sizeFont   = 0;
const sizeMergin = 10;

export default function App(){
  const [resultTxt, setResultTxt] = useState("");
  const [resultGx,   setResultGx]   = useState("");
  const [resultGy,   setResultGy]   = useState("");
  const [resultGz,   setResultGz]   = useState("");
  const [resultGa,   setResultGa]   = useState("");
  const [resultTemp, setResultTemp] = useState("");
  const [resultDate, setResultDate] = useState("");
  const [resultTime, setResultTime] = useState("");
  
  const [png, setPng] = useState<string | null>(null);
  
  const gravity = 9.81; // 重力加速度 [m/s^2]
  
  useEffect(() => {
    const fetchData = () => {
      console.log("データを取得します");
      
      const canvas = document.createElement('canvas') as HTMLCanvasElement;
      canvas.width  = width+sizeFont+sizeMergin;
      canvas.height = height+sizeFont+sizeMergin;
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      
      axios
        .get(`http://localhost:5000/data`)
        .then((res) => {

          // APIがうまく動作していないときのエラー
          if (res.status !== 200) {
            throw new Error("APIがうまく動作していないようです");
          } else {

            setResultTxt("データ取得成功");

            // カンマ区切りで数値を分割する            
            var result = res.data.split(',');
            setResultGx(result[0]);        // 加速度gx
            setResultGy(result[1]);        // 加速度gy
            setResultGz(result[2]);        // 加速度gz
            setResultGa(result[3]+"G");    // 合成加速度G
            setResultTemp(result[4]+"°");  // 温度
            setResultDate(result[5]);      // 日付
            setResultTime(result[6]);      // 時刻

            var centerX = width/2+sizeMergin;
            var centerY = height/2+sizeFont;

            // 描画 - 軸の文字
            //ctx.font = '24px Roboto medium';
            //ctx.fillStyle = '#999999';
            //ctx.beginPath();
            //ctx.fillText('Gx', width/2, 20);
            //ctx.beginPath();
            //ctx.fillText('Gy', width, height/2);
            
            // 描画 - 円
            let radgradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width/2);
            if( Number(result[3]) < 0.5 ){ // 加速度が0.5G未満の場合
                radgradient.addColorStop(0, '#AED9DA');
                radgradient.addColorStop(1, '#135589');
            } else if( Number(result[3]) >= 0.5 && Number(result[3]) < 0.8){ // 加速度が0.5G以上0.8G未満の場合
                radgradient.addColorStop(0, '#FFF6B7');
                radgradient.addColorStop(1, '#FDEB71');
            } else { // 加速度が0.8G以上の場合
                radgradient.addColorStop(0, '#FFF4F4');
                radgradient.addColorStop(1, '#FF0000');
            }
            ctx.beginPath();
            ctx.fillStyle = radgradient;
            ctx.arc(centerX, centerY, width/2, 0*Math.PI/180, 360*Math.PI/180, false);
            ctx.fill();
            
            // 描画 - 基準線
            ctx.beginPath();
            if( Number(result[3]) < 0.5 ){ // 加速度が0.5G未満の場合
                ctx.strokeStyle = '#AED9DA';
            } else if( Number(result[3]) >= 0.5 && Number(result[3]) < 0.8 ) { // 加速度が0.5G以上0.8G未満の場合
                ctx.strokeStyle = '#FFF6B7';
            } else { // 加速度が0.8G以上の場合
                ctx.strokeStyle = '#FFF4F4';
            }
            ctx.lineWidth = 1;          
            ctx.arc(centerX, centerY, width/2*0.5, 0*Math.PI/180, 360*Math.PI/180, false);
            ctx.stroke();
            
            // 描画 - 計測値
            ctx.beginPath();
            //ctx.fillStyle = '#CCCC00';
            ctx.fillStyle = '#EBECED';
            ctx.arc(centerX + (Number(result[0])/gravity)*width/2, centerY + (Number(result[1])/gravity)*width/2, 5, 0*Math.PI/180, 360*Math.PI/180, false);
            ctx.fill();
            setPng(canvas.toDataURL());

            return;
          }
        })
        .catch((err) =>
          setResultTxt(`データがうまく取得できませんでした。${err}`)
        );
  };

  // 400ms周期で更新する
  setInterval(() => {
    fetchData();
  }, 400);
  
}, []);

const h1_dateStyle = {
  fontSize: "1.0em",
  color: "#b09851",
  background: "#e9e1c8",
  paddingLeft: "30px",
  lineHeight: "0.6"
};

const h1_timeStyle = {
  fontSize: "1.0em",
  color: "#b09851",
  background: "#e9e1c8",
  paddingLeft: "40px",
  lineHeight: "0.6"
};

const h1_otherStyle = {
  fontSize: "1.0em",
  color: "#b09851",
  background: "#e9e1c8",
  paddingLeft: "50px",
  lineHeight: "0.6"
};

return (
  <div style={{backgroundColor: "black", color: "white"}}>
    <div>
      <h1 style={h1_dateStyle}>{resultDate}</h1>
      <h1 style={h1_timeStyle}>{resultTime}</h1>
      <h1 style={h1_otherStyle}>{resultTemp}</h1>
      <h1 style={h1_otherStyle}>{resultGa}</h1>
    </div>
    <div>
      {png && (
        <div className="comp" style={{ display: 'flex' }}>
          <img alt="icon" src={png} />
        </div>
      )}
      <p>{resultTxt}</p>
      <p>{resultGx}</p>
      <p>{resultGy}</p>
      <p>{resultGz}</p>
      <p>{resultGa}</p>
    </div>
  </div>
  );
}
