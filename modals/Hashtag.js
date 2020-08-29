const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');
const db = require('monk')('localhost/TikTok');

class Hashtag extends Modal {
    collection = {
        "Hashtag"    : "HashtagFeed",
        "TagedPosts" : "TagedPosts",
        "Tags"       : "Tags",
        "TopPosts"   : "TopPosts"
    };

    searchTag (tag, cursor) {
        return Api.Feed('HashtagFeed', {
            "count": "1000",
            "tag_name" : tag, 
            "minCursor": cursor[0],
            "maxCursor": cursor[1]
        }, true);
    }

    inti (tag) {
        return Api.Feed('HashtagInfo', {
            "tag_name": tag
        });
    }

    get list () {
        return db.get(this.collection.Hashtag).find({});
    }

    get topList () {
        return db.get(this.collection.TopPosts).find({});
    }

    get tagList () {
        return db.get(this.collection.TagedPosts).find({});
    }
}

module.exports = new Hashtag();