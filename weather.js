const https = require("https");
const querystring = require("querystring");
const api = require("./api.json");
const http = require("http");
const errors = require("./errors");
const insertDb = require("./database/connection");

function printDetails(weather){
    const message = `Current temperature in ${weather.name} is ${weather.main.temp}F`;
    console.log(message);
}


function get(query) {

    try {
        const parameters = {
            APPID: api.key,
            units: 'imperial'
        };

        const zipCode = parseInt(query);
        if(!isNaN(zipCode)) {
            parameters.zip =  zipCode + ',us';
        } else {
            parameters.q = query + ',us';
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?${querystring.stringify(parameters)}`;
        const request = https.get(url, response => {
            if(response.statusCode === 200) {
                var body = '';
                response.on('data', chunk => {
                    body += chunk;
                });

                response.on('end', () => {
                    try {
                        const weather = JSON.parse(body);

                        if(weather.name) {
                            // printDetails(weather);
                            insertDb.insertOne(printDetails(weather));

                        } else {
                            var erorrMsg = "Country not exists";
                            const error22 = new Error(erorrMsg);
                            errors.printError(error22);
                        }
                    } catch (error) {
                        errors.printError(error);
                        // console.log(error.message);
                    }
                })
            } else {
                const message = `There was an error during request ${http.STATUS_CODES[response.statusCode]}`;
                const statusCodeError = new Error(message);
                errors.printError(statusCodeError);
            }

        })
    }catch (error) {
        error.printError(error);
    }
}

module.exports.get = get;