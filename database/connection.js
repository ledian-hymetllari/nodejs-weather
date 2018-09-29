var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function insertOne(weather) {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("weather");
        var myobj = { weather: weather };
        dbo.collection("weather").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("Weather inserted");
            db.close();
        });
    });
}

module.exports.insertOne = insertOne;

