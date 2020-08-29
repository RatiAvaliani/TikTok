const Controller = require('./Controller');

class Search extends Controller {
    index (req, res) {
        return super.renderView('search/index', res);
    }
}

module.exports = new Search();