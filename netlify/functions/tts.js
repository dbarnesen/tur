const fetch = require("node-fetch");

const headers = {
  'Access-Control-Allow-Origin': '*',  // Adjust accordingly for production
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST'
};

if (event.httpMethod === 'OPTIONS') {
  // CORS preflight
  return {
    statusCode: 200,
    headers,
    body: ''
  };
}

exports.handler = async function(event, context) {
    const { text } = JSON.parse(event.body);
    const API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

    const requestBody = {
        input: { text: text },
        voice: { languageCode: "nb-NO", name: "nb-NO-Wavenet-A" },  // You can change the voice settings
        audioConfig: { audioEncoding: "MP3" }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify({ audioContent: data.audioContent })
        };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
