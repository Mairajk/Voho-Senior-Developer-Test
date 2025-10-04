/**
 * @description Creates a call using the Ultravox API.
 * @returns {Promise<Object>} The response from the Ultravox API.
 */
const createCall = async () => {
  try {
    const ultravoxUrl = process.env.ULTRAVOX_API_URL;
    const localHeaders = {
      "Content-Type": "application/json",
      "X-API-Key": process.env.ULTRAVOX_API_KEY,
    };

    const response = await fetch(ultravoxUrl, {
      method: "POST",
      headers: localHeaders,
      body: JSON.stringify({
        systemPrompt: "You are a helpful assistant. Be friendly and concise.",
        voice: "Jessica",
        model: "fixie-ai/ultravox",
        temperature: 0.3,
        joinTimeout: "60s",
        maxDuration: "300s",
        recordingEnabled: true,
        firstSpeakerSettings: {
          agent: {
            text: "Hello! How can I help you today?",
          },
        },
        metadata: {
          test: "true",
          purpose: "api_testing",
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Call created successfully
    return data;
  } catch (error) {
    console.error("Error creating call:", error.message);
    throw error;
  }
};

module.exports = createCall;
