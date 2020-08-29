const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');
const db = require('monk')('localhost/TikTok');

class User extends Modal {
    feed (username) {
        return Api.Feed('Userfeed', {
            "user_name" : username,
	        "count"     : "10"
        });
    }

    info (username) {
        return Api.Feed('UserInfo', {
            "user_name" : username
        });
    }

    topList () {
        return db.get('TopPosts').find({});
    }
}

module.exports = new User();