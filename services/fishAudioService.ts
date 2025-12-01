import { useState } from 'react';

const FISH_AUDIO_API_URL = "https://api.fish.audio/v1/tts";

export const speakWithFish = async (
  text: string, 
  apiKey: string, 
  referenceId: string
): Promise<ArrayBuffer> => {
  if (!apiKey || !referenceId) {
    throw new Error("Missing Fish Audio credentials");
  }

  const response = await fetch(FISH_AUDIO_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // User provided curl command has this header
      "model": "s1"
    },
    body: JSON.stringify({
      text: text,
      reference_id: referenceId,
      format: "mp3",
      normalize: true,
      latency: "normal"
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Fish Audio API Error: ${response.status} - ${err}`);
  }

  return await response.arrayBuffer();
};
