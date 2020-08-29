const fs = require('fs');
const request = require('request');
const randomString = require('randomstring');
const downloader = require('downloader.js');

class download {
    static UploadTo = "public/assets/uploads/";
    static Uploads = {
        "Image" : {
            "url" : `${this.UploadTo}Images/`,
            "ending" : ".jpeg"
        },
        "Video"      : {
            "url" : `${this.UploadTo}Videos/`,
            "ending" : ".mp4"
        },
        "Music"    : {
            "url" : `${this.UploadTo}Music/`,
            "ending" : ".mp3"
        },
    };

    static downloadMedia (category=null, mediaUrl=null) {
        if (category === null || mediaUrl === null) return;
        let fineName = randomString.generate(10);
        let filePath = this.Uploads[category].url + fineName + this.Uploads[category].ending;
     
        (async () => {
            await (new downloader (this.Uploads[category].url)).download({downloadLink: mediaUrl, filePath}).catch(console.error);
        })();
        
        return fineName + this.Uploads[category].ending;
    }

    static Iamge (url) {
        return this.downloadMedia('Image', url);
    }
    
    static Video (url) {
        return this.downloadMedia('Video', url);
    }
    
    static Music (url) {
        return this.downloadMedia('Music', url);
    }
}

module.exports = download; 