const Controller = require('./Controller');
const Music = require('../modals/Music');

class TopOverlay extends Controller {
    index (req, res) {
        (async () => {
            console.log(await Music.list);
            super.renderView('top-overlay-soundtrack/index', res, {"Music" : await Music.list});
        })(); 
    }
}

module.exports = new TopOverlay ();