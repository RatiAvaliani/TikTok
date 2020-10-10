const mongoose = require('mongoose');
const schema = mongoose.Schema;

const tagsSchema = new schema({
    name: String
});

let tag = mongoose.model('tag', tagsSchema);

module.exports = {
    tag: (tagName) => {
        tag.name = tagName;

        return tag;
    }
};