const axios = require('axios');

const arrayOfAddresses = [
    '1675 Larimer St, Denver, CO',
    '630 Williams St NW, Atlanta, GA',
    '33 E Quay Rd, Key West, FL 33040',
    '1599 Ski Hill Rd, Breckenridge, CO 80424',
    '601 E Dean St, Aspen, CO 81611'
];

stater(arrayOfAddresses);

function stater(arrayOfAddresses) {
    const addrPromises = arrayOfAddresses
        .map(addr => intialCallToGetLatitute(addr));

    const results = Promise
        .all(addrPromises)
        .then(addrs => addrs)
        .catch((err) => {
            throw new Error(err);
        });

    results
        .then((addrResults) => {
            // sortList(addrResults);
        })
        .catch(err => {
            throw new Error(err);
        });
};

function buildURLForRequest(path) {
    const baseURL = 'https://maps.googleapis.com/maps/api/';
    return baseURL + path;
};

function intialCallToGetLatitute(address) {
    const params = {
        "address": address,
        'key': 'AIzaSyDvljlrMZb2jmza5Jn8IYZNBJ2I-0-eEdE',
    };
    const finalURL = buildURLForRequest('geocode/json');

    return axios.get(finalURL, {
            params
        })
        .then((response) => {
            const firstResponse = {};

            firstResponse[
                response.data.results[0].formatted_address
            ] = response.data.results[0].geometry.location;

            return nextCallToGetElevation(firstResponse);
        })
        .catch((error) => {
            throw new Error(error);
        });

}

function nextCallToGetElevation(firstResponse) {
    const objectLatAndLong = firstResponse[Object.keys(firstResponse)];
    const params = {
        'locations': objectLatAndLong.lat + ',' + objectLatAndLong.lng,
        'key': 'AIzaSyDsqiy_cePurnBq-LSbDohZ-xDJ6kOoQrY'
    };
    const finalURL = buildURLForRequest('elevation/json');

    return axios.get(finalURL, {
            params
        })
        .then((response) => {
            const tempKey = Object.keys(firstResponse);
            const tempElevation = response.data.results[0].elevation;

            return buildUnsortedArray(tempKey, tempElevation);
        })
        .catch((error) => {
            throw new Error(error);
        });

}

function buildUnsortedArray(tempKey, tempElevation) {
    return tempKey + " - " + tempElevation;
};
