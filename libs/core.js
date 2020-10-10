class code {
    convertUnixToDate (timeStamp=null) {
        if (timeStamp === null || timeStamp === undefined) throw new Error('Can\'t use empty timeStamp');

        let date = new Date(timeStamp * 1000);
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();

        return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    }
}

module.exports = code;