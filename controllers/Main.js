const {controller} = require('./Controller');
const {MainModal} = require('../modals/MainModal');
const {PostModal} = require('../modals/PostModal');

class Main extends controller {
    static index (req, res) {
        PostModal.musicFeed();

        let itemList = [];
        PostModal.renderView('main/index', res, {'MusicFeed': itemList});
    }
}

module.exports.Main = Main;