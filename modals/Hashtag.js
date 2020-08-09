const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');
const db = require('monk')('localhost/TikTok');

class Hashtag extends Modal {
    collection = {
        "Hashtag" : "Hashtag",
        "Tags"    : "Tags"
    };

    searchTag (tag, cursor) {
        return Api.Feed('Hashtag', {
            "count": "1000",
            "tag_name" : tag, 
            "minCursor": cursor[0],
            "maxCursor": cursor[1]
        },true);
    }

    inti (tag) {
        return Api.Feed('HashtagInfo', {
            "tag_name": tag
        });
    }

    get list () {
        return db.get(this.collection.Hashtag).find({});
    }

    set filter (tag) {
        let cont = db.get(collection.Hashtag).find({}, { fields: { "itemInfos.text" : tag } });
        if (cont.lenght === 0) {
            this.info(tag);
        }

        return cont;
    }

    get mainTags () {
        return db.get(this.collection.Tags).find({}, {limit : 10});
    }

    get randomTags () {
        return db.get(this.collection.Hashtag).find({});
    }
}

module.exports = new Hashtag();