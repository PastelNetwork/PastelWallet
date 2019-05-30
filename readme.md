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

 - install python requirements:
 - - `cd src/StoVaCore`
 - - `pip install -r requirements.txt`
 - - make python build: `pyinstaller -F wallet_api.py` (result will appear in `src/StoVaCore/dist`)
 - on the top level of the repository: `npm install`
 - `npm run electron-build`
 - builded application will appear in `dist` folder (for OS X it is *.dmg file)
