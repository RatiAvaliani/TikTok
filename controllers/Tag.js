const Controller = require('./Controller');

class Tag extends Controller {
    index (req, res) {
        super.renderView('tag/index', res);
    }
}

module.exports = new Tag ();