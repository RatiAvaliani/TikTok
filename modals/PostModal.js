const {Modal} = require('./Modal');
const {TikTokGlobalApi} = require('../libs/Apis/TikTokGlobal');

class PostModal extends Modal {
     musicFeed (callback) {
         return TikTokGlobalApi.MusicFeed(callback);
     }
}

module.exports.PostModal = new PostModal ();