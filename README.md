### Elevation Project

In this project we have used the Google Geolocation API and the Google Elevation API to find the
elevation of several addresses and sort them in descending order, meaning, the addresses with the highest
elevation on the top of the list.

#### The Criteria

* The code should expose a function that would take in an array of strings as the input.
* This function should then geocode the provided array of strings using the Google
Geocode API.
* Using the latitude and longitude from the geocoding process, find the elevation of the
addresses.
* Finally, sorted the addresses in descending order (highest on the top) of their elevations, and
returned an array of addresses and elevations in that order. The sorting of the array was performed manually by
using a bubble sort algorithm since it was required that no built in methods such as array.sort(), or
array.min() should be used.

#### Getting Started with the Project

* Please generate* API keys for the Google Geocoding and Elevation APIs, here are the links:

1. [Get​ ​a​ ​Google​ ​API​ ​key​ ​for​ ​Geocoding](https://developers.google.com/maps/documentation/geocoding/start#get-a-key)
2. [Get​ ​a​ ​Google​ ​API​ ​key​ ​for​ ​Elevation](https://developers.google.com/maps/documentation/elevation/start#get-a-key)

**Important Info** I have already included a test key in the code that you can use for this app testing purposes, I have decided to leave the keys their since they are linked to a testing account and will be revoked within 15 days.

* Clone the repository `git clone https://github.com/rsbarbo/elevationProject`
* I am using a Promise based HTTP client called [axios](https://github.com/axios/axios) to perform API calls,
so please make sure to install the package by running `npm install axios` (depending on your setup, you may need to
`sudo npm install axios`)
* Once you are CDed into the directory in your local machine, please run the command `node elevation.js` and you will an output on the terminal as the following:

```
[ '1599 Ski Hill Rd, Breckenridge, CO 80424, USA ',
  3031.680419921875,
  '601 E Dean St, Aspen, CO 81611, USA ',
  2426.819091796875,
  '1675 Larimer St, Denver, CO 80202, USA ',
  1585.82470703125,
  '630 Williams St NW, Atlanta, GA 30313, USA ',
  293.2690734863281,
  '33 E Quay Rd, Key West, FL 33040, USA ',
  2.406881809234619 ]
  ```

#### Additional Information

The initial function takes in an array of address as shown below:

```
const arrayOfAddresses = [
    '1675 Larimer St, Denver, CO',
    '630 Williams St NW, Atlanta, GA',
    '33 E Quay Rd, Key West, FL 33040',
    '1599 Ski Hill Rd, Breckenridge, CO 80424',
    '601 E Dean St, Aspen, CO 81611'
];
```

The file gets kicked off by a function called `stater(arrayOfAddresses);` that takes in an array of addresses.

```
function stater(arrayOfAddresses) {
  const addrPromises = arrayOfAddresses
    .map(addr => intialCallToGetLatitute(addr));

  const results = Promise
    .all(addrPromises)
      .then(addrs => addrs)
      .catch((err) => {
        throw new Error(err)
      });

  results
    .then((addrResults) => {
      sortList(addrResults);
    })
    .catch(err => {
      throw new Error(err);
    });
};
```

The interesting part of the project was definitely the sorting approach to build the final array, here is the function used for this approach:

```
function sortList(arrayOfAddress) {
    const newObject = {};

    arrayOfAddress.map((address) => {
        newObject[extractAddressAsString(address)] = extractElevationAsFlot(address);
    });

    const arrayOfElevations = Object.values(newObject);

    var length = arrayOfElevations.length,
        i, j, stop;

    for (i = 0; i < length; i++) {
        for (j = 0, stop = length - i; j < stop; j++) {
            if (arrayOfElevations[j] < arrayOfElevations[j + 1]) {
                makeASwap(arrayOfElevations, j, j + 1);
            }
        }
    }

    const finalArray = [];

    for (var i = 0; i < arrayOfElevations.length; i++) {
        var key = getKeyByValue(newObject, arrayOfElevations[i]);
        finalArray.push(key) && finalArray.push(arrayOfElevations[i])
    }

    console.log(finalArray)

}
```
