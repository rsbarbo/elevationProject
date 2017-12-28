const axios = require('axios');

const arrayOfAddresses = [
    '1675 Larimer St, Denver, CO',
    '630 Williams St NW, Atlanta, GA',
    '33 E Quay Rd, Key West, FL 33040',
    '1599 Ski Hill Rd, Breckenridge, CO 80424',
    '601 E Dean St, Aspen, CO 81611'
];

stater(arrayOfAddresses);

// the starter function kicks off the job
function stater(arrayOfAddresses) {
    const addrPromises = arrayOfAddresses
        .map(addr => intialCallToGetLatitute(addr));

// we are using Promises to make sure we do not move forward without having
// the proper array of address and elevations
    const results = Promise
        .all(addrPromises)
        .then(addrs => addrs)
        .catch((err) => {
            throw new Error(err);
        });

// once we have the result, we will then move forward with the sorting part
    results
        .then((addrResults) => {
            sortList(addrResults);
        })
        .catch(err => {
            throw new Error(err);
        });
};

// make a dynamic building of the path for the API call
function buildURLForRequest(path) {
    const baseURL = 'https://maps.googleapis.com/maps/api/';
    return baseURL + path;
};

// initial call to Get Latitute
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

// secondary call to Get Elevation
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

// build the response with address and elevation
function buildUnsortedArray(tempKey, tempElevation) {
    return tempKey + " - " + tempElevation;
};

// convert the elevation to float rather than string
function extractElevationAsFlot(addressElevation) {
    return parseFloat(addressElevation.split('-')[1], 2);
};

// get address as it is own separate value
function extractAddressAsString(addressElevation) {
    return addressElevation.split('-')[0];
};

// sort the initial array of addresses and elevations
function sortList(arrayOfAddress) {
    const newObject = {};

    // get each single individual address and applies to the "newObject" object
    arrayOfAddress.map((address) => {
        newObject[extractAddressAsString(address)] = extractElevationAsFlot(address);
    });

    // gets an array of elevations from the object
    const arrayOfElevations = Object.values(newObject);

    // assign length, i, j, and stop variables to be used in the for loop
    var length = arrayOfElevations.length,
        i, j, stop;

    // this for loop iterates through the array of elevations, and "swap" them on the values (higher or lower)
    for (i = 0; i < length; i++) {
        for (j = 0, stop = length - i; j < stop; j++) {
            if (arrayOfElevations[j] < arrayOfElevations[j + 1]) {
                makeASwap(arrayOfElevations, j, j + 1);
            }
        }
    }

    const finalArray = [];

    // this for loop iterates through the sorted (swapped) array, and looks into the
    // "newObject" object to find the key value pair and build the final array
    for (var i = 0; i < arrayOfElevations.length; i++) {
        var key = getKeyByValue(newObject, arrayOfElevations[i]);
        finalArray.push(key) && finalArray.push(arrayOfElevations[i]);
    }

    // it will print the sorted array with address followed by elevation
    console.log(finalArray);

};

// the swap function is part of the bubble sort approach to swap two elevations in an array
function makeASwap(elevations, firstIndex, secondIndex) {
    const temp = elevations[firstIndex];
    elevations[firstIndex] = elevations[secondIndex];
    elevations[secondIndex] = temp;
}

// this function just look for the value in the Object key, and if it matches, it returns the
// key of the matching value
function getKeyByValue(obj, value) {
    const key = Object.keys(obj).filter(function(key) {
        return obj[key] === value;
    })[0];
    return key;
}
