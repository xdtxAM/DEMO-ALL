const { app } = require('electron');

const userDataPath = app.getPath('userData');
console.log(userDataPath);
