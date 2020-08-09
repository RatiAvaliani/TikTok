const fs = require('fs');
const request = require('request');
const randomString = require('randomstring');

class download {
    static UploadTo = "public/assets/uploads/";
    static Uploads = {
        "covers" : {
            "url" : `${this.UploadTo}CoversImages/`,
            "ending" : ".jpeg"
        },
        "userCover" : {
            "url" : `${this.UploadTo}UserCoversImages/`,
            "ending" : ".jpeg"
        },
        "video"      : {
            "url" : `${this.UploadTo}Videos/`,
            "ending" : ".mp4"
        },
        "coverGif"      : {
            "url" : `${this.UploadTo}coverGif/`,
            "ending" : ".gif"
        },
        "music"    : {
            "url" : `${this.UploadTo}Music/`,
            "ending" : ".mp3"
        },
    };

    static downloadMedia (category=null, mediaUrl=null) {
        if (category === null && mediaUrl === null) throw new Error('some of the parameters are empty');
        let fineName = randomString.generate(10);
        let filePath = this.Uploads[category].url + fineName + this.Uploads[category].ending;
        console.log(mediaUrl);
        try {
            request.head(mediaUrl, (e, res, body) => {
                if (e) throw new Error(e);
            
                request(mediaUrl).pipe(fs.createWriteStream(filePath)).on('close', e => console.log(e));
            });
        } catch (e) {
            throw new Error(e);
        }

        return filePath;
    }

    static userCovers (url) {
        return this.downloadMedia('userCover', url);
    }

    static coverGif (url) {
        return this.downloadMedia('coverGif', url);
    }

    static cover (url) {
        return this.downloadMedia('covers', url);
    }

    static videos (url) {
        return this.downloadMedia('video', url);
    }

    static music (url) {
        return this.downloadMedia('music', url);
    }
}

module.exports = download; 