const Controller = require('./Controller');
const MusicModel = require('../modals/Music');
const GlobalTranding = require('../modals/GlobalTranding');
const Hashtag = require('../modals/Hashtag');
const User = require('../modals/User');

class Main extends Controller {
    index (req, res) {
        let itemList = [];
        //MusicModel.feed;
        
        //GlobalTranding.feed;
        (async () => {
            let Tags = await Hashtag.mainTags
            let Hashtags = await Hashtag.list;
            Hashtag.searchTag('TikTok', [1, 2])
            super.renderView('main/index', res, {"Hashtags": Hashtags, "Tags" : Tags});
        })();
    }
}

module.exports = new Main();