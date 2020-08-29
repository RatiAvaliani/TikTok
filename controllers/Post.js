const Controller = require('./Controller');

class Post extends Controller {
    index (req, res) {
        super.renderView('post/index', res);
    }
}

module.exports = new Post ();