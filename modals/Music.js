const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');
const db = require('monk')('localhost/TikTok');

class Music extends Modal {
    get feed () {
        Api.Feed("Music", {
            "maxCursor": "1",
            "minCursor": "1"
        }, null, '6822243166939368198');
    }

    get list () {
        return db.get('Music').find();
    }
}

module.exports = new Music();