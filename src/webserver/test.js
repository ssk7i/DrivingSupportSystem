require('date-utils');

// pythonから取得するデータを引き継ぐためのグローバル変数
global.gx   = 0;
global.gy   = 0;
global.gz   = 0;
global.Ga   = 0;
global.temp = 0;
global.date = "";
global.time = "";

// 関数：mpu6050から加速度を取得する
function getGyro(){
    var {PythonShell} = require('python-shell');

    var pyshell = new PythonShell('/home/pi/work/gyro/test.py');

    var n       = 0;
    var gravity = 9.81;
    // pyshell.send(1); // テスト：1を引数として与える
    pyshell.send();
    pyshell.on('message', (message) => {

        //console.log("結果:"+message);
        //console.log(n);
        
        if(n==0)      global.gx   = parseFloat(message); // 加速度X取得
	else if(n==1) global.gy   = parseFloat(message); // 加速度Y取得 
	else if(n==2) global.gz   = parseFloat(message); // 加速度Z取得
	else if(n==3) global.temp = parseFloat(message); // 温度取得

        n +=1;
        if(n>3){
	    n=0;
	    // 加速度[G]計算
	    global.Ga = Math.sqrt(global.gx*global.gx + global.gy*global.gy
			+ (global.gz - gravity)*(global.gz - gravity))/gravity;
	    // 日時取得
	    const date = new Date();
	    global.date = date.toFormat("YYYY/MM/DD"); // YYYY/MM/DD
	    global.time = date.toFormat("HH24:MI:SS"); // hh:mm:ss
	}
    });
}

// 200ms周期で関数実行
setInterval(getGyro, 200);

// Web Server 起動
var http = require('http'); // 1 - Import Node.js core module

var server = http.createServer(function (req, res) { // 2 - creating server
    
	if (req.url == '/') { // check the URL of the current request
		
		// set response header
		res.writeHead(200, { 'Content-Type': 'text/html' });
		
		// set response content
		res.write('<html><body<p>This is home Page.</p></body></html>');
		res.end();
	}
	else if (req.url == "/test") {
		
		// set response header
		res.writeHead(200, { 'Content-Type': 'text/html' });
		
		// set response content
		res.write('<html><body><p>This is test Page.</p></body></html>');
		res.end();
	}
	else if (req.url == "/data") {
	    
                //console.log('/data受け付け');
		
		// set response header
		res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
		
		// set response content
		//res.write("AAA");
		res.write(String(global.gx.toFixed(1))+","+String(global.gy.toFixed(1))+","+String(global.gz.toFixed(1))
		     +","+String(global.Ga.toFixed(1))+","+String(global.temp.toFixed(1))+","+global.date+","+global.time);
		res.end();
	}
	else
	    res.end('Invalid Request!');
	
});

server.listen(5000); // 3 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..');
