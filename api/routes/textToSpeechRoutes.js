'use strict';
module.exports = function (app) {

    var textToSpeech = require('../controllers/textToSpeechController');

    // textToSpeech Routes
    app.route('/convert')
        .post(textToSpeech.convert);

};
