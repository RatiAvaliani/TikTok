const apiConfig = require('./apiConfig');
const unrest = require('unirest');

class apiRequest {

    /*
     * send method sends the request based on config type given (dev or peod)
     */
    static send (type=null, queryInfo={}) {
        if (type === null) throw new Error('Can\'t call api request on empty type.');
        if (apiConfig.ApiLink[type] === undefined) throw new Error('Request type not found.');

        const reqInfo = apiConfig.ApiLink[type]; // getting current type request info from config

        let req = unrest('GET', reqInfo.Link);
        req.headers(apiConfig.HeaderConfig);

        return this.feelQuery (queryInfo, req, reqInfo); // testing and returning async query
    }

    /*
     * query filter
     */
    static feelQuery (queryInfo={}, req, reqInfo) {
        if (Object.keys(queryInfo).lenght === 0) throw new Error('Query info empty');

        let reqQueryProperty = Object.getOwnPropertyNames(reqInfo.Query); // getting property names of config query
        let queryInfoProperty = Object.getOwnPropertyNames(queryInfo); // and property names of user info

        if (JSON.stringify(reqQueryProperty) !== JSON.stringify(queryInfoProperty)){ // testing if user input and config info match
            throw new Error(`Passed query info is not matching to required fields. Needed -> ${reqQueryProperty.join(',')}`);
        }

        return req.send(queryInfo);
    }

    static requestHandler (req, type) {
        req.then((data) => {
            if (data.body.error !== undefined) throw new Error(`Request returned an error. Error -> ${data.body.error}`);

            // Code hear ...
        });
    }
}

module.exports = apiRequest;