const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    uniqueId: String,
    nickName: String,
    image: String,
    follower: Number,
    favorited: String,
    following: Number,
    video: Number,
    country: String
});

let user = mongoose.model('user', userSchema);

let saveUserGlobal = (inObject) => {
    user.uniqeId = inObject.unique_id;
    user.nickName = inObject.nickname;
    user.image = inObject.avatar_medium;
    user.country = inObject.country;

    user.follower = 0;
    user.favorited = 0;
    user.following = 0;
    user.video = 0;

    return user;
};

let saveUserGlobalTow = (inObject) => {
    user.uniqeId = inObject.unique_id;
    user.nickName = inObject.nickname;
    user.image = inObject.avatar_medium;
    user.follower = inObject.follower_count;
    user.favorited = inObject.total_favorited;
    user.following = inObject.following_count;
    user.video = inObject.video_count;
    user.country = inObject.country;

    return user;
};

module.exports = {
    UserSearch: saveUserGlobalTow,
    UserInfoMetaData: saveUserGlobalTow,
    UserInfoFollowerList: saveUserGlobal,
    UserInfoFollowingList: saveUserGlobal
}