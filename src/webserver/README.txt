Node.js インストール
$ sudo apt install -y nodejs npm

デフォルトでインストールされるバージョンは古い。
$ node -v
　v12.22.12
$ npm -v
　7.5.2

アンインストールする。
$ sudo apt-get --purge remove nodejs npm
$ sudo apt autoremove

LTSバージョンをインストール
$ curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
$ sudo apt-get install -y nodejs

バージョンを確認する。
$ node -v
v18.17.1
$ npm -v
9.6.7

Canvsに必要なツールのインストール
$ sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libpng-dev libgif-dev librsvg2-dev
$ npm install canvas

Reactインストール
$ sudo npm install -g create-react-app

Reactで新しいアプリ"hello-world"を作成する
$ create-react-app hellow-world

