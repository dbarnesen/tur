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
        const { text, language } = JSON.parse(event.body);
        const API_KEY = process.env.GOOGLE_CLOUD_TTS_API_KEY;
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;

        // Map languages to Google TTS language codes and voice names
        const languageSettings = {
            'no': { languageCode: 'nb-NO', voiceName: 'nb-NO-Wavenet-D' },
            'nl': { languageCode: 'nl-NL', voiceName: 'nl-NL-Wavenet-D' },
            'en': { languageCode: 'en-US', voiceName: 'en-US-Journey-D' },
            'fr': { languageCode: 'fr-FR', voiceName: 'fr-FR-Wavenet-D' },
            'de': { languageCode: 'de-DE', voiceName: 'de-DE-Wavenet-E' }
        };

        const voiceSettings = languageSettings[language] || languageSettings['no']; // Default to Norwegian if no match

        const requestBody = {
            input: { text: text },
            voice: { languageCode: voiceSettings.languageCode, name: voiceSettings.voiceName },
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
