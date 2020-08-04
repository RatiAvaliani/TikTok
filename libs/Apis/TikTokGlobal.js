const unrest = require('unirest');
const db = require('monk')('localhost/TikTok');
const assigningKeys = require('../assigningKeys');

class TikTokGlobal {
    uri = 'https://tiktok-global.p.rapidapi.com/'
    UploadTo = "../public/assets/img/uploads/";

    urls = {
        'Music'   : `${this.uri}music/6822243166939368198`,
        'Hashtag' : `${this.uri}hashtag/info`
    }
    uploads = {
        "postCover" : `${this.UploadTo}postCoverImage/`,
        "postVideo" : `${this.UploadTo}postVideos/`
    };
    timeOut = {
        "Music"    : 20,
        "Trending" : 20,
        "Hashtag"  : 20,
        "User"     : 20
    };
    insertStyles = {
        "Post" : {
            id           : null,
            text         : null,
            creatTime    : null,
            authorId     : null,
            musicId      : null,
            coverImage   : "covers.origin",
            video        : "videoMeta.urls[0]",
            shareCount   : null,
            commentCount : null,
        },
        "User" : {
            id             : null,
            uniqeId        : null,
            nikName        : null,
            signature      : null,
            verified       : null,
            coverImage     : null,
            followingCount : null,
            followerCount  : null,
            videoCount     : null,
            heartCount     : null
        },
        "Music" : {
            id             : null,
            musicName      : null,
            authorName     : null,
            original       : null,
            cover          : null,
            music          : null
        }
    };
    requestCount = 200; /* this will change based on requests count in mango */

    constructor ()  {}

    autoFillPostDB (content={}, to='Post') {
        if (Object.keys(content).length === 0) throw new Error('can\'t use empty object.');

        let insertStyle = Object.keys(this.insertStyles[to]);
        let count = 0;
        let assigningKeys = new assigningKeys(this.insertStyles[to]);
        let insertIterator = assigningKeys.ContentInsertStyleIterator(content, (content, key) => {
            console.log(content);
            console.log(key);
        }).next(insertStyle[count]);
        let currentPostContent = {};

        while (insertIterator.done !== true) {
            Object.assign(currentPostContent, insertIterator.value);
            count++;
            insertIterator = insertIterator.next(insertStyle[count]);
        }

        return currentPostContent;
    }

    sendRequest (to, query) {
        let req = unrest('GET', this.urls[to]);
        let timeOut = db.get('timeOut'); 
        this.db = timeOut;

        req.headers({
            "x-rapidapi-host": "tiktok-global.p.rapidapi.com",
            "x-rapidapi-key": "bcceeb5d0amsh1dce24f9b0610aep1c8cd6jsn9a309e0ad632",
            "useQueryString": true
        });

        req.query(query);
        
        timeOut.findOne({'moduleName' : to}).then((data)=> {
            this.timeOut[to] = parseInt (data.FeedLimit)-1;
            if (data.FeedLimit === 0) throw new Error('Limit is up');
            this.LastRequest(to);   
        });

        return req;     
    }

    LastRequest (to) {
        this.db.findOneAndUpdate(
            { 'moduleName': to },
            { $set: { 'FeedLimit': this.timeOut[to], 'LastUpdate': new Date ()}}
        );
    }

    Feed (callBack=null, to) {
        try {
            db.get('timeOut').findOne({'moduleName' : to}).then( (data) => {

                if ( Math.abs(data.LastUpdate - ( new Date() )) / 8.64e7 > 20 ) {
                    let Request = this.sendRequest(to, {
                        "maxCursor": "1",
                        "minCursor": "1"
                    });

                    Request.end((res) => {
                        if (res.error) throw new Error(res.error);

                       let content = this.autoFillPostDB(res.body);

                       db.get(to).insert(content);
                       if (callBack !== null) callBack(content);
                    });
                } else {
                    db.get(to).find({}).then((data) => {
                        if (callBack !== null) callBack(data);
                    });
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }
    
    MusicFeed (callBack) {
        return this.Feed(callBack, 'Music')
    }

    HashtagInfo (callBack) {
        this.Feed(callBack, 'Hashtag')
    }

    Tranding () {
        
    }

    HashtagFeed () {

    }

    UserInfo () {

    }

    UserFeed () {

    }
}

module.exports.TikTokGlobalApi = new TikTokGlobal();