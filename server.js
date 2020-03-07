const express = require('express')
const bodyParser = require('body-parser');
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors');

const app = express()
const port = 3000

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//let routes = require('./api/routes/textToSpeechRoutes'); //importing route
//routes(app); //register the route

app.post('/ttsConvert', (req, res) => {
    const data = req.body;

    const client = new textToSpeech.TextToSpeechClient();
    // output the book to the console for debugging
    async function quickStart() {

        // The text to synthesize
        // const text = 'hello, world!';

        // Construct the request
        const request = {
            input: { text: data.text },
            // Select the language and SSML voice gender (optional)
            voice: { languageCode: data.language, ssmlGender: data.gender },
            // select the type of audio encoding
            audioConfig: { audioEncoding: 'MP3' },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);

        await writeFile('output.mp3', response.audioContent, 'binary');

        //console.log('Audio content written to file: output.mp3');
    }
    quickStart();

    res.send('Audio content written to file: output.mp3');
});

app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));