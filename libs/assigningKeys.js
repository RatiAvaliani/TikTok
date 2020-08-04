const fs = require('fs');
const request = require('request');
const randomString = require('randomstring');

class assigningKeys {
    insertStyle = {};

    constructor (insetStyle) {
        this.insertStyle = insetStyle;
    }

    downloadMedia (category=null, mediaUrl=null) {
        if (category === null && mediaUrl === null) throw new Error('some of the parameters are empty');
        let fineName = randomString.generate(10);
        let filePath = this.uploads[category] + fineName + '.jpeg';

        request.head(mediaUrl, (err, res, body) => {
            request(mediaUrl)
                .pipe(fs.createWriteStream(filePath))
                .on('close');
        });

        return fineName;
    }

    ContentInsertStyleIterator (content, callback=null) {
        return {
            next: (key) => {
                let currentApiKey = this.insertStyle[key];
                currentApiKey = currentApiKey === null ? key : currentApiKey;

                if ( typeof currentApiKey === 'object' ) {
                    let keys = Object.keys(currentApiKey);
                    let count = 0;
                    var apiKey = this.ContentInsertApiKeyIterator(content).next(keys[count]);

                    while (apiKey.done !== true) {
                        count++;
                        apiKey = apiKey.next(keys[count]);
                    }

                    apiKey = apiKey.value;
                }
                if (callback !== null) callback(apiKey, content[apiKey]);
                if (apiKey === null) return { value: null, done: true };

                return { value: { apiKey: content[apiKey] }, done: true };
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

module.exports.assigningKeys = assigningKeys;