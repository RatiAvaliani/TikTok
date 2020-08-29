const unrest = require('unirest');
const db = require('monk')('localhost/TikTok');
const assigningKeys = require('../assigningKeys');
const dowuload = require('../../libs/download');
const { music : ApiContent } = require('../../db/musicFeed');

class TikTokGlobal {
    uri = 'https://tiktok-global.p.rapidapi.com/'
    urls = {
        'HashtagFeed'    : `${this.uri}hashtag/feed`,
        'HashtagInfo'    : `${this.uri}hashtag/info`,
        "GlobalTranding" : `${this.uri}tranding`,
        "UserInfo"       : `${this.uri}user/info`,
        "Userfeed"       : `${this.uri}user/feed`
    }
    timeOut = {
        "default"  : 20
    }
    static UploadTo = "public/assets/uploads/";
    static Uploads = {
        "Image" : {
            "url" : `${this.UploadTo}Images/`
        },
        "Video"      : {
            "url" : `${this.UploadTo}Videos/`
        },
        "Music"    : {
            "url" : `${this.UploadTo}Music/`
        },
    };
    
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
            this.UpdateReqCount(to, parseInt(data.feedLimit)-1);   
        });

        return req;
    }

    UpdateReqCount (to, feedLimit) {
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

    /*
        @DONE the # needs to be removed
        @DONE not all of the tags are filterd
        @TODO tags needs to be tested on unic val
        @DONE filter text (string) using regex and save all of the tags in `Tags` Document
    */
    static FilterTags (string="") {
        if (string.trim() === "") return;
        let tags = string.match(/#[A-Za-z0-9\-\.\_]+/g);
        
        tags.forEach(item => {
            db.get('Tags').find({tag : item}).then(info => info.length === 0 ? db.get('Tags').insert({'tag' : item.substring(1)}) : 0);
        });

        return tags;
    }
 
    /* 
        @DONE from `itemInfos` `text` needs to be filterd in FilterTags
        @DONE from `itemInfos` `covers` saved as an images
        @DONE from `itemInfos` `shareCover` saved as an images
        @DONE from `itemInfos` `video` `urls` video needs to be saved  
            And `videoMeta` needs to be saved in one object in Document

        @DONE from `authorInfos` User info needs to be save in tow Documents (HashtagFeed And Users)
        @DONE from `authorInfos` `coversMedium` needs to be saved as a image
        
        @DONE from `musicInfos` needs to be save in Three Documents (HashtagFeed, Users And Music)
            And `playUrl` needs to be saved as mp3
    
        @DONE from `challengeInfoList` needs to be saved in Tow Documents (HashtagFeed And Challenges)

        @DONE from `authorStats` needs to be saved in Tow Documents (HashtagFeed And Users)
    */
    FilterHashtagFeed (item) {
        db.get('TopPosts ').find({"itemInfos.id" : item.itemInfos.id}).then(info =>  {
            if (info.length === 0) {
                item.itemInfos.tags = TikTokGlobal.FilterTags(item.itemInfos.text);
               
                item.itemInfos.covers = dowuload.Iamge(item.itemInfos.covers[0] === "" ? item.itemInfos.covers[1] : item.itemInfos.covers[0]);
                item.itemInfos.shareCover = dowuload.Iamge(item.itemInfos.shareCover[0] === "" ? item.itemInfos.shareCover[1] : item.itemInfos.shareCover[0]);

                let video = {
                    'url' : dowuload.Video(item.itemInfos.video.urls[0] === '' ? item.itemInfos.video.urls[1] : item.itemInfos.video.urls[0]),
                }
                item.itemInfos.video = {...video, ...item.itemInfos.video.videoMeta}

                item.authorInfos.coversMedium = dowuload.Iamge(item.authorInfos.coversMedium[0] === '' ? item.authorInfos.coversMedium[1] : item.authorInfos.coversMedium[0]);
                item.authorInfos.authorStats = item.authorStats;

                TikTokGlobal.saveUserInfo(item.authorInfos);

                item.musicInfos.playUrl = dowuload.Music(item.musicInfos.playUrl[0] === '' ? item.musicInfos.playUrl[1] : item.musicInfos.playUrl[0]);
                
                TikTokGlobal.saveMusicInfo(item.musicInfos);
                TikTokGlobal.saveChalengeInfo(item.challengeInfoList);

                //TikTokGlobal.saveTagedPosts(item, item.itemInfos.tags[0]);
                db.get('TopPosts').insert(item);
            }
        });
    }

    // @TODO save Conent based on tags
    static saveTagedPosts (Content, Tag) {
        db.get('TagedPosts').find({'info.itemInfos.id' : Content.itemInfos.id}).then(info => {
           if (info.length === 0) {
                db.get('TagedPosts').insert({
                    tag: Tag,
                    info: Content
                });
           }
        });
    } 

    static insert (to, uniqId, Content)  {
        db.get(to).find({uniqId : Content[uniqId]}).then(info => info.length === 0 ? db.get(to).insert(Content) : 0); 
    }

    //@DONE save in Musci Document
    static saveMusicInfo (Content) {
        TikTokGlobal.insert('MusicFeed', 'musicId', Content);
    }

    //@DONE save in Chalenges Doucument
    static saveChalengeInfo (Content) {
        Content.forEach(item => TikTokGlobal.insert('ChalengesFeed', 'challengeId', item));
    }

    //@DONE save incoming info to users
    static saveUserInfo (Content) {
        TikTokGlobal.insert('UserInfoFeed', 'userId', Content);
    }

    //@DONE add info to User Feed
    static FilterUserFeed (Content) {
        db.get('UserFeed').find({id : Content.id}).then(info => {
            if (info.length === 0) {
                TikTokGlobal.FilterTags(Content.desc);
                Content.video.cover = dowuload.Iamge(Content.video.cover);
                Content.video.playAddr = dowuload.Video(Content.video.playAddr);
                Content.video.author.avatarMedium = dowuload.Image(Content.video.author.avatarMedium);
                Content.video.music.playUrl = dowuload.Music(Content.video.music.playUrl);

                db.get('UserFeed').insert(Content);
            }
        });
    }

    // @TODO test Content.data.body.hasMore 
    HashtagFeed (Content=null, query) {
        if (Content === null || Content.data.body === null || Content.data.body.itemListData === []) throw new Error ('Called Hastag Feed On Content Null');
    
        Content.data.body.itemListData.forEach((item, index) => { 
            this.FilterHashtagFeed(item)
        })
        
        /*if (Content.data.body.hasMore === true) {
            query.minCursor = query.minCursor+1;
            query.maxCursor = query.maxCursor+1;
            
            this.Feed('HashtagFeed', query, true);
        }*/
    }

    UserInfo (Content) {
        Content.data.userInfo.user.avatarMedium = dowuload.Iamge(Content.data.userInfo.user.avatarMedium);
        let user = {...Content.data.userInfo.user, ...Content.data.userInfo.stats};

        db.get('UserInfo').find({'id' : user.id}).then(item => {
            if (item.length === 0) {
                db.get('UserInfo').insert(user);
            }
        });
    }
    
    UserFeed (Content) {
        Content.data.items.forEach(FilterUserFeed);
    }

    Feed (to, query, forseUpdate=null, urlAddon=null) {
        try {
            db.get('Timeout').findOne({'moduleName' : to}).then( (data) => {
                if ( Math.abs(( new Date() ) - data.lastUpdate ) / 8.64e7 > 20 || forseUpdate !== null ) {
                    
                    let Request = this.SendRequest(to, query, urlAddon);
                    Request.end((res) => {
                        if (res.error) throw new Error(res.error);
                        if (res.body.errors) throw new Error(res.body.errors);
                        
                        // Calling the proper method based on `to` variable
                        this[to](res.body, query);
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