import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // CORS headers to allow calls from any origin (or restrict to your domain)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, model',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed', headers };
  }

  try {
    const { text, reference_id, normalize, format, latency } = JSON.parse(event.body || '{}');
    const apiKey = event.headers.authorization?.split(' ')[1]; // Extract Bearer token
    const model = event.headers.model;

    if (!apiKey) {
       return { statusCode: 401, body: 'Missing API Key', headers };
    }

    const response = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "model": model || "s1"
      },
      body: JSON.stringify({
        text,
        reference_id,
        format: format || "mp3",
        normalize: normalize || true,
        latency: latency || "normal"
      }),
    });

    if (!response.ok) {
        const errText = await response.text();
        return { statusCode: response.status, body: errText, headers };
    }

    const buffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'audio/mpeg',
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error: any) {
    console.error("Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      headers
    };
  }
};
