const Controller = require('./Controller');
const MusicModel = require('../modals/Music');
const GlobalTranding = require('../modals/GlobalTranding');
const Hashtag = require('../modals/Hashtag');
const User = require('../modals/User');
const db = require('monk')('localhost/TikTok');

class Main extends Controller {
    index (req, res) {
        (async () => {
            let Tags = await Hashtag.mainTags
            let Hashtags = await Hashtag.list;
            
            let TopHashtags = await Hashtag.topList

            /*db.get('TopUsers').find({}).then((item) => {
                item.forEach(element => {
                    Hashtag.searchTag(element.name, [1, 2]);
                });
            });*/
            
            super.renderView('main/index', res, {"Hashtags": Hashtags, "Tags" : Tags});
        })();
    }
}

module.exports = new Main ();