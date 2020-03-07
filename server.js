var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

bodyParser = require('body-parser');
var cors = require("cors");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let routes = require('./api/routes/textToSpeechRoutes'); //importing route
routes(app); //register the route

app.use(cors());
app.listen(port);



console.log('Text to Speech API server started on: ' + port);