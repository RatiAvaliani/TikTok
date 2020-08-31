const Controller = require('./Controller');
const User = require('../modals/User');

class Users extends Controller {
    index (req, res) {
        (async () => {
            super.renderView('user/index', res, {"User" : await User.byId(req.params.id)});
        })();
    }

    top (req, res) {
        super.renderView('top-user/index', res);
    }
}

module.exports = new Users ();