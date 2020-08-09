const {TwingEnvironment, TwingLoaderFilesystem} = require('twing');
let loader = new TwingLoaderFilesystem('./public/views/');
let twing = new TwingEnvironment(loader);

class controller {
    renderView (file='index', res=null, variables={}) {
        if (res === null) throw new Error('When rendering view you need to pass response.');

        twing.render(`${file}.html`, variables).then(renderedView => res.end(renderedView));
        return this;
    }
}

module.exports = controller;