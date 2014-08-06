var express = require("express"),
    request = require('request'),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    port = parseInt(process.env.PORT, 10) || 8000;


// Crazy OAuth Process
// 1. Make request to /auth, which redirects to stackexchange
// 2. User approves the request, which redirects back to /redirect
// 3. Within the request inside of /redirect we have the 'code' frm stackexchange
// 4. We then POST with form fields to stackexchange for the access_token
// 5. The post returns the access_token as the body
// 6. We are all happy


// 1. Make the request to /auth
app.get('/auth', function(req, res) {
  console.log('Im getting authed');
  var oauth_url =  'https://stackexchange.com/oauth?client_id=3391&scope=no_expiry&redirect_uri=http://localhost:8000/redirect';

  // redirect to stackexchange
  res.redirect(oauth_url);

});

// 2. User has approved the request, which redirects here
app.get("/redirect", function (req, res) {

  // 3. Here we have access to req.query.code

  // 4. Make a POST back to stackexchange to get the access_token
  var stack_post = 'https://stackexchange.com/oauth/access_token';
  var stackReq = request.post(stack_post, function(err, httpResponse, body) {

    // 5. This is the the access_token
    console.log(body);

  });

  // These are the form fields for the post
  var form = stackReq.form();
  form.append('client_id', '3391');
  form.append('client_secret', '<super-secret>');
  form.append('redirect_uri', 'http://localhost:8000/redirect');
  form.append('code', req.query.code);

});


// these are config stuff
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Simple static server listening at http://localhost:" + port);
app.listen(port);
