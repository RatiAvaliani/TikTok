const unrest = require('unirest');
const db = require('monk')('localhost/TikTok');
const assigningKeys = require('../assigningKeys');
const dowuload = require('../../libs/download');
const { music : ApiContent } = require('../../db/musicFeed');

class TikTokGlobal {
    uri = 'https://tiktok-global.p.rapidapi.com/'
    urls = {
        'Music'          : `${this.uri}music/`,
        'Hashtag'        : `${this.uri}hashtag/feed`,
        'HashtagInfo'    : `${this.uri}hashtag/info`,
        "GlobalTranding" : `${this.uri}tranding`,
        "UserInfo"       : `${this.uri}user/info`,
        "Userfeed"       : `${this.uri}user/feed`
    }
    timeOut = {
        "default"  : 20
    }
    
    requestCount = 200; /* this will change based on requests count in mango */

    constructor ()  {}

    SendRequest (to, query, urlAddon=null) {
        let req = unrest('GET', this.urls[to] + (urlAddon === null ? "" : urlAddon));
        let timeOut = db.get('Timeout');
        this.db = timeOut;

        req.headers({
            "x-rapidapi-host": "tiktok-global.p.rapidapi.com",
            "x-rapidapi-key": "bcceeb5d0amsh1dce24f9b0610aep1c8cd6jsn9a309e0ad632",
            "useQueryString": true
        });

        req.query(query);

        timeOut.findOne({'moduleName' : to}).then((data)=> {
            if (data.feedLimit === 0) throw new Error('Limit is up');
            this.LastRequest(to, parseInt(data.feedLimit)-1);   
        });

        return req;
    }

    LastRequest (to, feedLimit) {
        this.db.findOneAndUpdate(
            { 'moduleName': to },
            { $set: { 'feedLimit': feedLimit, 'lastUpdate': new Date ()}}
        );
    }

    InsertTimeout (to) {
        db.get('Timeout').insert({
            "moduleName" : to, 
            "lastUpdate" : new Date(),
            "feedLimit"  : this.timeOut.default
        });
    }

    Feed (to, query, forseUpdate=null, urlAddon=null) {
        try {
            db.get('Timeout').findOne({'moduleName' : to}).then( (data) => {
                if ( Math.abs(( new Date() ) - data.lastUpdate ) / 8.64e7 > 20 || forseUpdate !== null ) {
                    let Request = this.SendRequest(to, query, urlAddon);
                    
                    Request.end((res) => {
                        if (res.error) throw new Error(res.error);
                        if (res.body.errors) throw new Error(res.body.errors);

                        if (res.body.data.items !== undefined && res.body.data.items !== null) {
                            res.body.data.items.forEach((item) => {
                                db.get(to).insert(item);
                            });
                        } else if (res.body.data.body !== undefined && res.body.data.body.itemListData !== undefined && res.body.data.body.itemListData !== null) {
                            res.body.data.body.itemListData.forEach((item) => {
                                item.itemInfos.covers[0] = dowuload.cover (item.itemInfos.covers[0]);
                                item.itemInfos.video.urls[0] = dowuload.videos (item.itemInfos.video.urls[0]);
                                item.authorInfos.covers[0] = dowuload.userCovers (item.authorInfos.covers[0]);
                                //item.itemInfos.shareCover[1] = dowuload.coverGif(item.itemInfos.shareCover[1]);
                                //item.musicInfos.playUrl[0] = dowuload.music(item.musicInfos.playUrl[0]);
                                
                                db.get(to).insert(item);
                            });
                        } else if (res.body.data !== undefined && res.body.data.itemListData !== undefined) {
                            res.body.data.itemListData.forEach((item) => {
                                db.get(to).insert(item);
                            });
                        } else if (res.body.data !== undefined && res.body.data.userInfo !== undefined) {
                            res.body.data.userInfo.user.avatarMedium = dowuload.userCovers (res.body.data.userInfo.user.avatarMedium);
                            db.get(to).insert(res.body.data.userInfo);
                        } else {
                            db.get(to).insert(res.body);
                        }

                    });
                }
            }).catch((e) => {
                this.InsertTimeout(to);
                console.error(e);
            });
            return db.get(to).find({});
        } catch (error) {
            throw new Error(error);
        }
    }
}

module.exports.TikTokGlobalApi = new TikTokGlobal();