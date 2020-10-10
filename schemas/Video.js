const mongoose = require('mongoose');
const core = require('./../libs/core');

const schema = mongoose.Schema;

let videoSchema = new schema({
    videoId : String,
    createTime: Date,
    description: String,
    authorId : String,
    authorName: String,
    authorNickName: String,
    authorImage : String,
    authorDesc: String,
    authorFollowing: Number,
    authorFollowers: Number,
    authorHarts: String,
    authorVideos: Number,
    videoHeight: Number,
    videoWidth: Number,
    videoDuration: Number,
    videoCover: String,
    videoGifCover: String,
    videoLink: String,
    videoShare: Number,
    videoComment: Number,
    videoPlay: Number
});

const video = mongoose.model('video', videoSchema);

let saveVideoGlobal = (inObject) => {
    video.videoId = inObject.video_id;
    video.createTime = core.convertUnixToDate(inObject.create_time);
    video.description = inObject.description;

    video.authorId = inObject.author.id;
    video.authorName = inObject.author.uniqueId;
    video.authorNickName = inObject.author.nickname;
    video.authorImage = inObject.author.avatarMedium;
    video.authorDesc = inObject.author.signature;
    video.authorFollowing = inObject.author.following;
    video.authorFollowers = inObject.author.followers;
    video.authorHarts = inObject.author.heartCount;
    video.authorVideos = inObject.author.videoCount;

    video.videoHeight = inObject.video.height;
    video.videoWidth = inObject.video.width;
    video.videoDuration = inObject.video.duration;
    video.videoCover = inObject.video.originCover;
    video.videoGifCover = inObject.video.dynamicCover;
    video.videoLink = inObject.video.playAddr;
    video.videoShare = inObject.statistics.shareCount;
    video.videoComment = inObject.statistics.commentCount;
    video.videoPlay = inObject.statistics.playCount;

    return video;
};

module.exports = {
    VideoSearch: saveVideoGlobal,
    UserInfoVideoFeed: saveVideoGlobal,
    TrendingFeed: saveVideoGlobal,
    VideoMetaData: (inObject) => {
        video.videoId = inObject.id;
        video.createTime = core.convertUnixToDate(inObject.createTime);
        video.description = inObject.text;
        video.authorId = inObject.authorMeta.id;
        video.authorName = inObject.authorMeta.name;
        video.authorNickName = inObject.authorMeta.nickName;
        video.authorImage = inObject.authorMeta.avatar;
        video.authorDesc = inObject.authorMeta.name;
        video.videoHeight = inObject.videoMeta.height;
        video.videoWidth = inObject.videoMeta.width;
        video.videoDuration = inObject.video.duration;
        video.videoCover = inObject.imageUrl;
        video.videoLink = inObject.videoUrl;
        video.videoShare = inObject.shareCount;
        video.videoComment = inObject.commentCount;
        video.videoPlay = inObject.playCount;

        video.authorFollowing = 0;
        video.authorFollowers = 0;
        video.authorHarts = 0;
        video.authorVideos = 0;
        video.videoGifCover = '0';

        return video;
    }

};