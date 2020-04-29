## Instaling pre-build wallet on Mac OS

#### Running PastelD inside docker

As currently `PastelD` binary is not available for Mac - it can be run with Docker image.
 - Install Docker https://docs.docker.com/docker-for-mac/install/
 - Open Terminal
 - Run `docker run -d -p 19932:19932 -p 19933:19933 alexdobrushskiy/pasteld:0.1`

### Install wallet
 - In Terminal: `wget https://dobrushskiy.name/static/pastel-wallet-1.0.0.dmg`
 - Install downloaded `*.dmg`
 - Run `pastel-wallet` app

## How to run locally
 
 - `npm install`
 - install python requirements:
 - - `cd src/StoVaCore`
 - - `pip install -r requirements.txt`
 - `npm start` (it will open webpack dashboard and browser)
 - in `src/main_electron.js` make sure that `win.loadURL` loads `http://localhost:3000/`
 - `npm run start-electron`
 - electron main proccess will start python proccess (`src/StoVaCore/wallet_api.py`) on 5000 port.


## How to make a build
 - (On Ubuntu 18.04 instance) Run `linux_build.sh`

## Build on Mac OS
 - First - build `wallet_api` (from the StoVaCore dir)
 - `pyinstaller --add-data "misc":"misc"  -F wallet_api.py`
 - Next - build the wallet (`wallet_api` executable will be included).
 - `npm run electron-build:mac`
 
### Install Linux build
 - `sudo dpkg -i paste-wallet_1.0.0_amd64.deb`
 - if there are any uninstalled dependencies - run `sudo apt -f install`
 - Run `pastel-wallet` from command line

## Logging
 - For development run all logs will appear in the terminal
 - For packaged run logs path depends on the operation system. For OS X it is `/Users/<currentUser>/Library/Logs/pastel-wallet/log.log`
