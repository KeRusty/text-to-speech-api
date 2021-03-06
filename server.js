const express = require('express')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const textToSpeech = require('@google-cloud/text-to-speech');
const speech = require('@google-cloud/speech');
const fs = require('fs');
const util = require('util');
const cors = require('cors');

const app = express()
const port = 3002

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());

//let routes = require('./api/routes/textToSpeechRoutes'); //importing route
//routes(app); //register the route

app.post('/ttsConvert', (req, res) => {
    const data = req.body;

    const client = new textToSpeech.TextToSpeechClient();

    // output the book to the console for debugging
    async function textToSpeechConverter() {

        // Construct the request
        const request = {
            input: { ssml: data.ssml },
            // Select the language and SSML voice gender (optional)
            //voice: { languageCode: data.language, ssmlGender: data.gender },
            voice: { languageCode: data.locale.split('-').slice(0, 2).join('-'), name: data.locale },
            // select the type of audio encoding
            audioConfig: { audioEncoding: data.audio, speakingRate: data.speed, pitch: data.pitch },
        };

        // Performs the text-to-speech request
        const [response] = await client.synthesizeSpeech(request);

        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);

        await writeFile(`${data.fileName}.mp3`, response.audioContent, 'binary');

    }

    textToSpeechConverter();

    res.send('Audio content written to file on your Server Folder: output.mp3');

});

app.post('/SpeechConvert', (req, res) => {
    // const file = req.files.file;

    console.log(req.files.file);

    const client = new speech.SpeechClient();

    async function speechToText() {

        // The name of the audio file to transcribe
        const fileData = req.files.file.data;

        // Reads a local audio file and converts it to base64
        // const file = fs.readFileSync(fileData);
        const audioBytes = fileData.toString('base64');

        console.log(audioBytes);
        // The audio file's encoding, sample rate in hertz, and BCP-47 language code
        const audio = {
            content: audioBytes,
        };
        const config = {
            encoding: 'MP3',
            sampleRateHertz: 16000,
            languageCode: 'en-US',
        };
        const request = {
            audio: audio,
            config: config,
        };

        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        console.log(response);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            // .map(result => result)
            .join('\n');
        console.log(`Transcription: ${transcription}`);
        res.send(transcription);
    }

    speechToText().catch(console.error);

});


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`));