const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');

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
}

module.exports = new User();