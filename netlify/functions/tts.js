const fetch = require("node-fetch");

exports.handler = async function(event, context) {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': 'https://vandr.webflow.io',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    const headers = {
        'Access-Control-Allow-Origin': 'https://vandr.webflow.io',
        'Content-Type': 'application/json'
    };

    try {
        const { text } = JSON.parse(event.body);
        const API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

        const requestBody = {
            input: { text: text },
            voice: { languageCode: "nb-NO", name: "nb-NO-Wavenet-D" },  // You can change the voice settings
            audioConfig: {
            audioEncoding: "MP3",
            speakingRate: 0.9,
            pitch: 0,
            volumeGainDb: 0,
            effectsProfileId: ["handset-class-device"]
        }
        };

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
            headers,
            body: JSON.stringify({ audioContent: data.audioContent })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: error.toString() })
        };
    }
};
