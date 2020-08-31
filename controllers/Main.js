const Controller = require('./Controller');
const MusicModel = require('../modals/Music');
const GlobalTranding = require('../modals/GlobalTranding');
const Hashtag = require('../modals/Hashtag');
const User = require('../modals/User');
const db = require('monk')('localhost/TikTok');

class Main extends Controller {
    index (req, res) {
        (async () => {
            let Tags = await Hashtag.HomeTags;
            let HomeList = await Hashtag.HomeList;
            
            /*db.get('TopUsers').find({}).then((item) => {
                item.forEach(element => {
                    Hashtag.searchHomeTag(element.name);
                });
            });*/
            
            super.renderView('main/index', res, {"Hashtags": HomeList, "Tags" : Tags});
        })();
    }
}

module.exports = new Main ();