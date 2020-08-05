const fs = require('fs');
const request = require('request');
const randomString = require('randomstring');

class assigningKeys {
    insertStyle = {};
    UploadTo = "../public/assets/img/uploads/";
    Uploads = {
        "coverImage" : {
            "url" : `${this.UploadTo}postCoverImage/`,
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

        request.head(mediaUrl, (err, res, body) => {
            request(mediaUrl)
                .pipe(fs.createWriteStream(filePath))
                .on('close');
        });

        return filePath;
    }

    Iterate (content=[]) {
        if (content.length === 0) throw new Error('can\'t use empty array.');
        let newStyleObjects = [];

        content.forEach(cont => {
            newStyleObjects.push(this.InitIterator(cont));
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

    ContentInsertStyleIterator (content) {
        return {
            next: (key) => {
                console.log(key);
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

                if (currentApiKey === undefined || content[currentApiKey] === undefined || key === undefined) return { value: null, done: true };

                let value = {};
                    value[currentApiKey] = content[currentApiKey];
                if (currentApiKey === "coverImage" || currentApiKey === "video") value[currentApiKey] = this.downloadMedia(currentApiKey, content[currentApiKey]);
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