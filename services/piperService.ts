import { TtsSession } from '@mintplex-labs/piper-tts-web';
import * as ort from 'onnxruntime-web';

// Disable multi-threading to avoid 404s on threaded WASM files and CORS issues
ort.env.wasm.numThreads = 1;
ort.env.wasm.simd = false; // Disable SIMD just in case to be safe on all devices

let ttsSession: TtsSession | null = null;
const VOICE_MODEL_ID = 'en_US-ryan-high'; // A good quality male voice

export const initPiper = async (onProgress?: (progress: number) => void) => {
  if (ttsSession) return ttsSession;

  try {
    // Initialize the Piper TTS session
    // Explicitly configure WASM paths and disable multi-threading to avoid 404s and CORS issues
    ttsSession = await TtsSession.create({
      voiceId: VOICE_MODEL_ID,
      progress: (event: any) => {
        if (onProgress && event.total) {
          onProgress((event.loaded / event.total) * 100);
        }
      },
      logger: console.log,
      wasmPaths: {
        onnxWasm: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.18.0/dist/',
        piperData: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.data',
        piperWasm: 'https://cdn.jsdelivr.net/npm/@diffusionstudio/piper-wasm@1.0.0/build/piper_phonemize.wasm'
      }
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
