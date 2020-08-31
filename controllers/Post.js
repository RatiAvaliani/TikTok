const Controller = require('./Controller');
const Hashtag = require('../modals/Hashtag');

class Post extends Controller {
    index (req, res) {
        (async () => {
            let post = await Hashtag.byId(req.params.id);
            let simulars = await Hashtag.simular(post.tags[0], req.params.id);
            if (simulars.length === 0) {
                Hashtag.searchByTag(post.tags[0]);
                simulars = await Hashtag.simular(post.tags[0], req.params.id);
            } 
            
            super.renderView('post/index', res, {"post" : post, "simulars" : simulars});
        })(); 
    }
}

module.exports = new Post ();