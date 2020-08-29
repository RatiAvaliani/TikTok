const Main = require('../controllers/Main');
const Post = require('../controllers/Post');
const Search = require('../controllers/Search');
const TopOverlay = require('../controllers/TopOverlay');
const TopUser = require('../controllers/TopUser');
const Tag = require('../controllers/Tag');
const RouterEx = require('../libs/RouterEx');

RouterEx.set('/', Main.index);
RouterEx.set('/Search/:id', Search.index); 
RouterEx.set('/Post/:id', Post.index); 
RouterEx.set('/TopOverlaySoundtrack', TopOverlay.index); 
RouterEx.set('/TopUser', TopUser.index); 
RouterEx.set('/Tag', Tag.index);

module.exports = RouterEx.getList;