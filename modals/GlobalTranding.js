const Modal = require('./Modal');
const {TikTokGlobalApi: Api} = require('../libs/Apis/TikTokGlobal.js');

class GlobalTranding extends Modal {
    countrys = [
        "US", "UK"
    ];

    TimeOut (code, i) {
        setTimeout(() => {
            Api.Feed("GlobalTranding", {
                "country" : code,
                "session" : "785631C6DFE241F051152D7F7EADEFED"+code,
                "count"   : "100"
            }, true);          
        }, i + '000');
    }

    get feed () {
        this.countrys.forEach (this.TimeOut);
    }
}

module.exports = new GlobalTranding();