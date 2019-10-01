git clone --recurse-submodules https://github.com/PastelNetwork/PastelWallet.git
#deps
sudo apt update
sudo apt install -y python3-pip
pip3 install -r PastelWallet/src/StoVaCore/requirements.txt
sudo apt install -y curl software-properties-common
curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs
cd PastelWallet
npm install
npm rebuild node-sass

cd src/StoVaCore
pyinstaller --add-data "misc":"misc"  -F wallet_api.py
cd ../../pasteld_binary
# fetch pasteld binary to
wget https://dobrushskiy.name/static/linux/pasteld
cd ..
npm run electron-build:linux
# build will appear in dist folder
