const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');

class Music extends Modal {
    get feed () {
        Api.Feed("Music", {
            "maxCursor": "1",
            "minCursor": "1"
        }, null, '6822243166939368198');
    }
}

module.exports = new Music();