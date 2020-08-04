const {Modal} = require('./Modal');
const {TikTokGlobalApi} = require('../libs/Apis/TikTokGlobal');

class PostModal extends Modal {
     musicFeed (callback) {
         TikTokGlobalApi.MusicFeed(callback);
     }
}

module.exports.PostModal = new PostModal ();