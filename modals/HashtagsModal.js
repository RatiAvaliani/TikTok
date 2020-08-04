const {Modal} = require('./Modal');

class HashtagsModal extends Modal {
    static url = 'https://tiktok.p.rapidapi.com/live/hashtag/feed';
    static collection = null;

    static feed () {
        return HashtagsModal.sendReq(HashtagsModal.url);
    }

    static hashtagDb () {
        /*return (async () => {
            let collection = null;
            await this.db().then(db => {
                collection = db.collection('userSearch')
            });
            return collection;
        })();*/
    }

    static get () {
        /*this.hashtagDb().then((db) => {
            db.find({});
        });*/
    }
}

module.exports.HashtagsModal = HashtagsModal;