const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');
const db = require('monk')('localhost/TikTok');

class User extends Modal {
    search (username) {
        return Api.Feed('Userfeed', {
            "user_name" : username,
	        "count"     : "10"
        });
    }

    byId (id=null) {
        return db.get('Users').findOne({"id" : id});
    }

    topList () {
        return db.get('TopPosts').find({});
    }
}

module.exports = new User();