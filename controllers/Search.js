const Controller = require('./Controller');

class Search extends Controller {
    index (req, res) {
        let tags = ['tag','tag','tag','tag','tag','tag','tag','tag','tag','tag','tag','tag'];
        let hashtags = [];
        
        return super.renderView('search/index', res, {Tags: tags, Hashtags: hashtags});
    }
}

module.exports = new Search();