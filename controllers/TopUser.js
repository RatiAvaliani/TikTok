const Controller = require('./Controller');

class TopUsers extends Controller {
    index (req, res) {
        super.renderView('top-user/index', res);
    }
}

module.exports = new TopUsers ();