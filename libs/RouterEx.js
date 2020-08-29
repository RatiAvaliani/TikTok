const express = require('express');
const Router = express();

class RouteRex {
    routeList = [];

    set (path, callback) {
        this.routeList.push({
            path: path,
            router: Router.get(path, callback)
        });
    }

    get getList () {
        return this.routeList;
    }
}

module.exports = new RouteRex ();