var AWS = require("aws-sdk");

var fs = require('fs');

//var now = new Date();

AWS.config.update({
    region: "us-west-2"
});

var docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

 var allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));

allMovies.forEach(function(movie) {
    var params = {
        TableName: "Movies",
        Item: {
            "year":  movie.year,
            "title": movie.title,
            "info":  movie.info,
        }
    };

    docClient.put(params, function(err, data) {
       if (err) {
           console.error("Unable to add movie", movie.title, ". Error JSON:", JSON.stringify(err, null, 2));
       } else {
           console.log("PutItem succeeded:", movie.title, " #######time is :", new Date().getMinutes(), ":",new Date().getSeconds());
       }
    });
});

// var allMovies = JSON.parse(fs.readFileSync('moviedata.json', 'utf8'));

// var params = {
//   RequestItems: {
//     'Movies': [
//         {
//         PutRequest: {
//           Item: {
//             "year": 111,
//             "title": "first movie"
//           }
//         }},
//         {
//         PutRequest: {
//           Item: {
//             "year": 222,
//             "title": "fi2222rst movie"
//           }
//         }},
//         {
//         PutRequest: {
//           Item: {
//             "year": 555,
//             "title": "first movie"
//           }
         
//         }}, {
//         PutRequest: {
//           Item: {
//             "year": 1111,
//             "title": "first movie"
//           }
         
//         }}

//     ]
//   },
//   ReturnConsumedCapacity: "TOTAL"
// };


// docClient.batchWrite(params, function(err, data) {
//   if (err) console.log(err);
//   else console.log(data);
// });


