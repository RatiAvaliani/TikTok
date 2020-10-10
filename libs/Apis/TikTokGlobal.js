const unrest = require('unirest');
//const db = require('monk')('localhost/TikTok');
const db = require('./../DB');
const dowuload = require('../../libs/download');
const { music : ApiContent } = {};//require('../../db/musicFeed')

class TikTokGlobal {
    uri = 'https://tiktok-global.p.rapidapi.com/'
    urls = {
        'HashtagFeed'     : `${this.uri}hashtag/feed`,
        'HashtagFeedHome' : `${this.uri}hashtag/feed`,
        'HashtagInfo'     : `${this.uri}hashtag/info`,
        "GlobalTranding"  : `${this.uri}tranding`,
        "UserInfo"        : `${this.uri}user/info`,
        "Userfeed"        : `${this.uri}user/feed`
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
        if (tags === null) return;

        tags.forEach(item => {
            db.get('Tags').find({'tag' : item}).then(info => {
               if (info.length === 0) {
                   db.get('Tags').insert({'tag' : item.substring(1)})
               }
            });
        });

        return tags;
    }
 
    /*
        @DONE from `itemInfos` `text` needs to be filterd in FilterTags
        @DONE from `itemInfos` `covers` saved as an images
        @DONE from `itemInfos` `video` `urls` video needs to be saved  
            And `videoMeta` needs to be saved in one object in Document

        @DONE from `authorInfos` User info needs to be save in tow Documents (HashtagFeed And Users)
        @DONE from `authorInfos` `coversMedium` needs to be saved as a image
        
        @DONE from `musicInfos` needs to be save in Three Documents (HashtagFeed, Users And Music)
            And `playUrl` needs to be saved as mp3
    
        @DONE from `challengeInfoList` needs to be saved in Tow Documents (HashtagFeed And Challenges)

        @DONE from `authorStats` needs to be saved in Tow Documents (HashtagFeed And Users)
    */
    FilterHashtagFeed (item, isHomePage=false) {
        db.get('Posts ').find({"id" : item.itemInfos.id}).then(info =>  {
            if (info.length === 0) {
                let post = {};
                let user = {}
                let music = {};

                post.homePage = isHomePage;
                post.image = dowuload.Iamge(item.itemInfos.covers[0] === "" ? item.itemInfos.covers[1] : item.itemInfos.covers[0]);
                
                post.video = {
                    "url" : dowuload.Video(item.itemInfos.video.urls[0] === '' ? item.itemInfos.video.urls[1] : item.itemInfos.video.urls[0]),
                    "width" : item.itemInfos.video.videoMeta.width,
                    "height" : item.itemInfos.video.videoMeta.height
                };
                post.id = item.itemInfos.id;
                post.text = item.itemInfos.text;
                post.createTime = new Date(item.itemInfos.createTime);
                post.like = item.itemInfos.diggCount;
                post.tags = TikTokGlobal.FilterTags(item.itemInfos.text);

                user.image = dowuload.Iamge(item.authorInfos.coversMedium[0] === '' ? item.authorInfos.coversMedium[1] : item.authorInfos.coversMedium[0]);
                user.followerCount = item.authorStats.followerCount;
                user.heartCount = item.authorStats.heartCount;
                user.followingCount = item.authorStats.followingCount;
                user.videoCount = item.authorStats.videoCount;
                user.username = item.authorInfos.nickName;
                user.signature = item.authorInfos.signature;
                user.id = item.authorInfos.userId;
                user.uniqueId = item.authorInfos.uniqueId;

                post.user = user;

                music.id = item.musicInfos.musicId;
                music.musicName = item.musicInfos.musicName;
                music.authorName = item.musicInfos.authorName;
                music.music = dowuload.Music(item.musicInfos.playUrl[0] === '' ? item.musicInfos.playUrl[1] : item.musicInfos.playUrl[0]);
 
                TikTokGlobal.saveUserInfo(user);
                TikTokGlobal.saveMusicInfo(music); 
 
                db.get('Posts').insert(post);
            }
        });
    }

    static insert (to, Content)  {
        db.get(to).find({'id' : Content['id']}).then(info => {
            if (info.length === 0) {
                db.get(to).insert(Content);
            }
        }); 
    }

    //@DONE save in Musci Document
    static saveMusicInfo (Content) {
        TikTokGlobal.insert('Music', Content);
    }

    //@DONE save incoming info to users
    static saveUserInfo (Content) {
        TikTokGlobal.insert('Users', Content);
    }

    //@DONE add info to User Feed
    static FilterUserFeed (Content) {
        db.get('Users').find({id : Content.id}).then(info => {
            if (info.length === 0) {
                let user = {};
                let music = {};

                user.image = dowuload.Iamge(Content.author.avatarMedium);
                user.username = Content.author.nickName;
                user.signature = Content.author.signature;
                user.id = Content.author.id;
                user.uniqueId = Content.author.uniqueId;

                music.id = Content.music.id;
                music.musicName = Content.music.title;
                music.authorName = Content.music.authorName;
                music.music = dowuload.Music(Content.music.playUrl);

                TikTokGlobal.saveMusicInfo(music);
                db.get('Users').insert(Content);
            }
        });
    }

    static FilterUserInfo (Content) {
        db.get('Users').find({id : Content.id}).then(info => {
            if (info.length === 0) {
                TikTokGlobal.FilterTags(Content.desc);
                let user = {};
                
                user.followerCount = Content.stats.followerCount;
                user.heartCount = Content.stats.heartCount;
                user.followingCount = Content.stats.followingCount;
                user.videoCount = Content.stats.videoCount;
                user.heart = Content.stats.heart;

                user.image = dowuload.Iamge(Content.user.avatarMedium);
                user.username = Content.user.nickName;
                user.signature = Content.user.signature;
                user.id = Content.user.id;
                user.uniqueId = Content.user.uniqueId;
                
                db.get('Users').insert(Content);
            }
        });
    }

    // @TODO test Content.data.body.hasMore 
    HashtagFeed (Content=null, query, isHomePage=false) {
        if (Content === null || Content.data.body === null || Content.data.body.itemListData === []) throw new Error ('Called Hastag Feed On Content Null');
    
        Content.data.body.itemListData.forEach((item, index) => { 
            this.FilterHashtagFeed(item, isHomePage)
        })
        
        /*if (Content.data.body.hasMore === true) {
            query.minCursor = query.minCursor+1;
            query.maxCursor = query.maxCursor+1;
            
            this.Feed('HashtagFeed', query, true);
        }*/
    }

    HashtagFeedHome (Content=null, query) {
        this.HashtagFeed(Content, query, true);
    }

    UserInfo (Content) {
        TikTokGlobal.FilterUserInfo(Content.data.userInfo);
    }
    
    UserFeed (Content) {
        Content.data.items.forEach(FilterUserFeed);
    }

    Feed (to, query , forseUpdate=null, urlAddon=null) {
        try {
            db.get('Timeout').findOne({'moduleName' : to}).then( (data) => {
                if ( Math.abs(( new Date() ) - data.lastUpdate ) / 8.64e7 > 20 || forseUpdate !== null ) {
                    
                    let Request = this.SendRequest(to, query, urlAddon);
                    Request.end((res) => {
                        if (res.error) return;
                        if (res.body.errors) console.log('Api Error: ' + res.body.errors);
                        
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