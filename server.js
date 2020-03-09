const express = require('express')
const bodyParser = require('body-parser');
const textToSpeech = require('@google-cloud/text-to-speech');
const speech = require('@google-cloud/speech');
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
    async function textToSpeech() {

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
    textToSpeech();

    res.send('Audio content written to file on your Server Folder: output.mp3');
});

app.post('/SpeechConvert', (req, res) => {
    const data = req.body;

    console.log(data)

    const client = new speech.SpeechClient();

    async function speechToText() {

        // The name of the audio file to transcribe
        const fileName = data;

        // Reads a local audio file and converts it to base64
        const file = fs.readFileSync(fileName);
        const audioBytes = file.toString('base64');

        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        console.log(`Transcription: ${transcription}`);
    }
    speechToText().catch(console.error);

    res.send('Transcribed Successfully');


})




app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));