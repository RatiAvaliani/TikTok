const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');
const db = require('monk')('localhost/TikTok');

class Hashtag extends Modal {
    collection = {
        "Hashtag"    : "HashtagFeed",
        "TagedPosts" : "TagedPosts",
        "Tags"       : "Tags",
        "Posts"   : "Posts"
    };

    searchByTag (tag, cursor=[1, 50]) {
        return Api.Feed('HashtagFeed', {
            "count"     : "1000",
            "tag_name"  : tag, 
            "minCursor" : cursor[0],
            "maxCursor" : cursor[1]
        }, true);
    }

    searchHomeTag (tag, cursor=[1, 50]) {
        return Api.Feed('HashtagFeedHome', {
            "count"     : "1000",
            "tag_name"  : tag, 
            "minCursor" : cursor[0],
            "maxCursor" : cursor[1]
        }, true);
    }

    inti (tag) {
        return Api.Feed('HashtagInfo', {
            "tag_name": tag
        });
    }

    simular (tag=null, id=null) {
        return db.get(this.collection.Posts).find({
            "text" : {$regex : `.*${tag}.*`},
            "id"   : { $ne: id }
        }, {limit: 20});
    }

    byId (id=null) {
        return db.get(this.collection.Posts).findOne({
            "id" : id
        });
    }
    
    get list () {
        return db.get(this.collection.Posts).find({});
    }

    get HomeList () {
        return this.PostsList(50);
    }

    PostsList (limit) {
        return db.get(this.collection.Posts).find({
            "homePage" : true
        }, {limit: limit});
    }

    get Tags () {
        return db.get(this.collection.Tags).find();
    }

    get HomeTags () {
        return db.get(this.collection.Tags).find({}, {limit: 20});
    }

    get tagList () {
        return db.get(this.collection.Tags).find({});
    }
}

module.exports = new Hashtag();