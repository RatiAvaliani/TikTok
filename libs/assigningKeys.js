const fs = require('fs');
const request = require('request');
const randomString = require('randomstring');

class assigningKeys {
    insertStyle = {};
    UploadTo = "public/assets/img/uploads/";

    insertStyles = {
        "Post" : {
            id                   : null,
            text                 : null,
            createTime           : null,
            authorId             : null,
            musicId              : null,
            covers               : ['covers', 0],
            video                : ['video', 'urls', 0],
            shareCount           : null,
            commentCount         : null,
            playCount            : null,
            liked                : null,
            commentStatus        : null,
            secUid               : ['authorInfos', 'secUid'],
            userId               : ['authorInfos', 'userId'],
            uniqueId             : ['authorInfos', 'uniqueId'],
            nickName             : ['authorInfos', 'nickName'],
            signature            : ['authorInfos', 'signature'],
            verified             : ['authorInfos', 'verified'],
            userCover            : ['authorInfos', 'covers', 0],
            musicId              : ['musicInfos', 'musicId'],
            musicName            : ['musicInfos', 'musicName'],
            authorName           : ['musicInfos', 'authorName'],
            playUrl              : ['musicInfos', 'playUrl', 0],
            coverMusicInfosImage : ['musicInfos', 'covers', 0]
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

    
    Uploads = {
        "covers" : {
            "url" : `${this.UploadTo}postCoversImages/`,
            "ending" : ".jpeg"
        },
        "video"      : {
            "url" : `${this.UploadTo}postVideos/`,
            "ending" : ".mp4"
        },
        "playUrl"    : {
            "url" : `${this.UploadTo}music/`,
            "ending" : ".mp3"
        },
    };

    constructor (insetStyle) {
        this.insertStyle = insetStyle;
    }

    downloadMedia (category=null, mediaUrl=null) {
        if (category === null && mediaUrl === null) throw new Error('some of the parameters are empty');
        let fineName = randomString.generate(10);
        let filePath = this.Uploads[category].url + fineName + this.Uploads[category].ending;

        try {
            request.head(mediaUrl, (err, res, body) => {
                if (err) console.log(err);
            
                request(mediaUrl).pipe(fs.createWriteStream(filePath)).on('close', e => console.log(e));
            });
        } catch (e) {
            console.error(e);
        }

        return filePath;
    }

    Iterate (content=[]) {
        if (content.length === 0) throw new Error('can\'t use empty array.');
        let newStyleObjects = [];
        content.data.itemListData.forEach(cont => {
            newStyleObjects.push(this.InitIterator(cont.itemInfos));
        });

        return newStyleObjects;
    }

    InitIterator (content= {}) {
        if (Object.keys(content).length === 0) throw new Error('can\'t use empty object.');
        let insertStyleKeys = Object.keys(this.insertStyle);
        let count = 0;

        let insertIterator = this.ContentInsertStyleIterator(content);
        let iteratorContent  = insertIterator.next(insertStyleKeys[count]);
        let currentPostContent = {};

        while (iteratorContent.done !== true) {
            Object.assign(currentPostContent, iteratorContent.value);
            count++;
            iteratorContent = insertIterator.next(insertStyleKeys[count]);
        }

        return currentPostContent;
    }

    getNestedObject = (nestedObj, pathArr) => {
        return pathArr.reduce((obj, key) =>
            (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
    }

    ContentInsertStyleIterator (content) {
        return {
            next: (key) => {
                let currentApiKey = key;
                currentApiKey = currentApiKey === null ? key : currentApiKey;
                if ( typeof currentApiKey === 'object' ) {
                    let keys = Object.keys(currentApiKey);
                    let count = 0;
                    let keyIterator = this.ContentInsertApiKeyIterator(content);
                    let keyIteratorContent = keyIterator.next(keys[count]);

                    while (keyIteratorContent.done !== true) {
                        count++;
                        keyIteratorContent = keyIterator.next(keys[count]);
                    }

                    currentApiKey = keyIterator.value;
                }
                
                let value = {};
                    value[currentApiKey] = content[currentApiKey];

                if (typeof content[currentApiKey] === "array") {
                    value[currentApiKey] = this.getNestedObject(content, currentApiKey);
                }
    
                if (currentApiKey === "covers" || currentApiKey === "video" || currentApiKey === "playUrl")  {
                    value[currentApiKey] = this.downloadMedia(currentApiKey, value[currentApiKey]);
                }

                if (currentApiKey === undefined || content[currentApiKey] === undefined || key === undefined) return { value: null, done: true };
                return { value: value, done: false };
            }
        }
    }

     ContentInsertApiKeyIterator (content) {
        return {
            next: (key) => {
                if (content[key] === undefined) {
                    return { value: null, done: false };
                }

                return { value: content[key], done: true };
            }
        }
    }
}

module.exports = assigningKeys;