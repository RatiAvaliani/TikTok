const Controller = require('./Controller');

class TopOverlay extends Controller {
    index (req, res) {
        super.renderView('top-overlay-soundtrack/index', res);
    }
}

module.exports = new TopOverlay ();