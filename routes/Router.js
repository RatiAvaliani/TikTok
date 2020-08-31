const Main = require('../controllers/Main');
const Post = require('../controllers/Post');
const Search = require('../controllers/Search');
const TopOverlay = require('../controllers/TopOverlay');
const User = require('../controllers/User');
const Tag = require('../controllers/Tag');
const RouterEx = require('../libs/RouterEx');

RouterEx.set('/', Main.index);
RouterEx.set('/Search', Search.index); 
RouterEx.set('/Post/:id', Post.index); 
RouterEx.set('/User/:id/:username', User.index); 
RouterEx.set('/TopOverlaySoundtrack', TopOverlay.index); 
RouterEx.set('/TopUser', User.top); 
RouterEx.set('/Tag', Tag.index);

module.exports = RouterEx.getList;