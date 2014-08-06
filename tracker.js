var http = require('https');
var zlib = require('zlib');

var url = 'https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&tagged=firebase&site=stackoverflow&pagesize=100&client_id=3392&page=';
function getGzipped(page, url, callback) {
    url = url + page;
    // buffer to store the streamed decompression
    var buffer = [];

    http.get(url, function(res) {
        // pipe the response into the gunzip to decompress
        console.log(res.statusCode);
        var gunzip = zlib.createGunzip();            
        res.pipe(gunzip);

        gunzip.on('data', function(data) {
            // decompression chunk ready, add it to the buffer
            buffer.push(data.toString())

        }).on("end", function() {
            // response and decompression complete, join the buffer and return
            callback(null, buffer.join(""), page); 

        }).on("error", function(e) {
            callback(e);
        })
    }).on('error', function(e) {
        callback(e)
    });
}

 
var tags = {};
var query = function(err, data, page) {
  var obj = JSON.parse(data);
  var questions = obj.items;
  console.log(obj.has_more);
  if (obj.has_more) { //loop through each page of 100 questions
    getGzipped(page + 1, url, query);
    for (var key in questions) {
      var question = questions[key];
      //Counts the frequency of tags used in combination with the firebase tag
      for (var tagKey in question.tags) { 
        var tag = question.tags[tagKey];
        if (tags[tag]) {
          tags[tag] += 1;
        } else {
          tags[tag] = 1;
        }
      }
    }

    // // Get data on each question
    // var questionURL = 'http://api.stackexchange.com/' + question.question_id + '?order=desc&sort=activity&site=stackoverflow';
    // getGzipped(1, questionURL, some_callback_function);

  } else {
    console.log(tags);
  }
};

getGzipped(1, url, query);
