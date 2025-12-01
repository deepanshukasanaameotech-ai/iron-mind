import { TtsSession } from '@mintplex-labs/piper-tts-web';

let ttsSession: TtsSession | null = null;
const VOICE_MODEL_ID = 'en_US-ryan-high'; // A good quality male voice

export const initPiper = async (onProgress?: (progress: number) => void) => {
  if (ttsSession) return ttsSession;

  try {
    // Initialize the Piper TTS session
    // This handles model downloading and WASM initialization
    ttsSession = await TtsSession.create({
      voiceId: VOICE_MODEL_ID,
      progress: (event: any) => {
        if (onProgress && event.total) {
          onProgress((event.loaded / event.total) * 100);
        }
      },
      logger: console.log,
    });

    return ttsSession;
  } catch (error) {
    console.error("Failed to initialize Piper TTS:", error);
    throw error;
  }
};

export const speakWithPiper = async (text: string): Promise<string> => {
  if (!ttsSession) {
    await initPiper();
  }

  try {
    if (!ttsSession) throw new Error("Piper session not initialized");

    // Generate audio blob
    const blob = await ttsSession.predict(text);
    
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Piper TTS generation failed:", error);
    throw error;
  }
};
