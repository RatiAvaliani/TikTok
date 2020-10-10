const autoLoad = require('auto-load');
const express = require('express');
const app = express();
const {Router} = autoLoad(`${__dirname}/routes`);

app.set('view engine', 'html')
app.use(express.static(__dirname + '/public/assets/'));

Router.forEach(router => app.use(router.path, router.router));

app.listen(3000, () => console.log('Express App Is Running'));