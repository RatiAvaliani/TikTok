const config = require('./config');

let DevConfig = {
    ApiLimit: 200,
    RequestType: "GET",
    HeaderConfig: {'Accept': 'application/json'},
    ApiLink: {
        VideoSearch: {
            Link: "http://tiktoksee.co/testApiData/Videos/HashtagFeed.json",
            Query: {
                name: ""
            }
        },
        VideoMetaData: {
            Link: "http://tiktoksee.co/testApiData/Videos/VideoInfoMetaData.json",
            Query: {
                video: "https%3A%2F%2Fwww.tiktok.com%2F%40tiktok%2Fvideo%2F6824578676303154438"
            }
        },
        VideoComments: {
            Link: "http://tiktoksee.co/testApiData/Videos/VideoInfoPostComments.json",
            Query: {
                video_id: ""
            }
        },
        UserSearch: {
            Link: "http://tiktoksee.co/testApiData/User/UserSearch.json",
            Query: {
                keyword: ""
            }
        },
        UserInfoVideoFeed: {
            Link: "http://tiktoksee.co/testApiData/User/UserSearchAndVideoPosts.json",
            Query: {
                username: "tiktok"
            }
        },
        UserInfoFollowerList: {
            Link: "http://tiktoksee.co/testApiData/User/UserInfoFollowerList.json",
            Query: {
                username: "",
                max_cursor: 0,
                limit: 200
            }
        },
        UserInfoFollowingList: {
            Link: "http://tiktoksee.co/testApiData/User/UserInfoFollowingList.json",
            Query: {
                username: "",
                max_cursor: 0,
                limit: 200
            }
        },
        UserInfoMetaData: {
            Link: "http://tiktoksee.co/testApiData/User/UserInfoMetaData.json",
            Query: {
                fresh: 1,
                username: ""
            }
        },
        TrendingFeed: {
            Link: "http://tiktoksee.co/testApiData/Videos/VideoTrending.json",
            Query: {}
        }
    }
};

let ProdConfig = {
    ApiLimit: 15,
    RequestType: "GET",
    HeaderConfig: {
        "x-rapidapi-host": "tiktok.p.rapidapi.com",
        "x-rapidapi-key": "bcceeb5d0amsh1dce24f9b0610aep1c8cd6jsn9a309e0ad632",
        "useQueryString": true
    },
    ApiLink: {
        VideoSearch: {
            Link: "https://tiktok.p.rapidapi.com/live/hashtag/feed",
            Query: {
                name: ""
            }
        },
        VideoMetaData: {
            Link: "https://tiktok.p.rapidapi.com/live/post/meta",
            Query: {
                video: "https%3A%2F%2Fwww.tiktok.com%2F%40tiktok%2Fvideo%2F6824578676303154438"
            }
        },
        VideoComments: {
            Link: "https://tiktok.p.rapidapi.com/live/post/comments",
            Query: {
                video_id: ""
            }
        },
        UserSearch: {
            Link: "https://tiktok.p.rapidapi.com/live/user/search",
            Query: {
                keyword: ""
            }
        },
        UserInfoVideoFeed: {
            Link: "https://tiktok.p.rapidapi.com/live/user/feed",
            Query: {
                username: "tiktok"
            }
        },
        UserInfoFollowerList: {
            Link: "https://tiktok.p.rapidapi.com/live/user/follower/list",
            Query: {
                username: "",
                max_cursor: 0,
                limit: 200
            }
        },
        UserInfoFollowingList: {
            Link: "https://tiktok.p.rapidapi.com/live/user/following/list",
            Query: {
                username: "",
                max_cursor: 0,
                limit: 200
            }
        },
        UserInfoMetaData: {
            Link: "https://tiktok.p.rapidapi.com/live/user",
            Query: {
                fresh: 1,
                username: ""
            }
        },
        TrendingFeed: {
            Link: "https://tiktok.p.rapidapi.com/live/trending/feed",
            Query: {}
        }
    }
};

module.exports = (() => {
    if (config.dev) {
        return DevConfig;
    }

    return ProdConfig;
})();
