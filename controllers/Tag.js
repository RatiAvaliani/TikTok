const Controller = require('./Controller');
const Hashtag = require('../modals/Hashtag');

class Tag extends Controller {
    index (req, res) {
        (async () => { 
            super.renderView('tag/index', res, {"Tags" : await Hashtag.Tags, "Hashtags" : await Hashtag.PostsList(100)});
        })();
    }
}

module.exports = new Tag ();