## How to run locally
 
 - `npm install`
 - `npm start` (it will open webpack dashboard and browser)
 - in `src/main_electron.js` make sure that `win.loadURL` loads `http://localhost:3000/`
 - `npm run start-electron`


## How to make a build

 - `npm install`
 - in `src/main_electron.js` make sure that `win.loadURL` loads `file://...` (not `localhost:3000`)
 - `npm run electron-build`
 - builded application will appear in `dist` folder
