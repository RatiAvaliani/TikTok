const mongoose = require('mongoose');
const schema = mongoose.Schema;
const core = require('./../libs/core');

const videoComment = new schema({
    commentId: String,
    text: String,
    videoId: String,
    createTime: Date,
    likeCount: Number,
    status: Number,
    authorUniqueId: String,
    authorNikName: String,
    authorLanguage: String,
    authorImage: String
});


const comment = mongoose.model('videoComment', videoComment);

module.exports = {
    VideoComments : (inObject) => {
        comment.commentId = inObject.comment_id;
        comment.text = inObject.text;
        comment.videoId = inObject.video_id;
        comment.createTime = core.convertUnixToDate(inObject.create_time);
        comment.likeCount = inObject.like_count;
        comment.status = inObject.status;

        comment.authorUniqueId = inObject.author.unique_id;
        comment.authorNikName = inObject.author.nickname;
        comment.authorLanguage = inObject.author.language;
        comment.authorImage = inObject.author.avatar_thumb;

        return comment;
    }
};