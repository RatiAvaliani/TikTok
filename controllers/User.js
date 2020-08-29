const Controller = require('./Controller');

class Users extends Controller {
    index (req, res) {
        super.renderView('top-user/index', res);
    }

    top (req, res) {
        super.renderView('top-user/index', res);
    }
}

module.exports = new Users ();