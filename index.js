const autoLoad = require('auto-load');
const express = require('express');
const app = express();
const routs = autoLoad(`${__dirname}/routes`);

const routsObject = Object.keys(routs);

app.set('view engine', 'html')
app.use(express.static(__dirname + '/public/assets/'));

for (let i = 0; i < routsObject.length; i++) {
    let rout = routs[routsObject[i]].rout;
    if (rout !== undefined) app.use(`/${rout.path}`, rout.router);
}

app.listen(80, () => console.log('Express App Is Running'));