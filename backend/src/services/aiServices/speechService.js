/**
 * SPEECH-TO-TEXT SERVICE
 * Converts audio files to text using Hugging Face Whisper model
 * Supports WAV and MP3 formats
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const HF_API_KEY = process.env.HuggingFace_API_KEY;
const HF_SPEECH_URL = 'https://api-inference.huggingface.co/models/openai/whisper-base';

/**
 * Transcribe audio file to text
 * @param {string} filePath - Path to audio file
 * @param {string} userId - User ID for logging
 * @returns {Promise<object>} - Transcribed text
 */
const transcribeAudio = async (filePath, userId = 'unknown') => {
  let fileBuffer = null;
  try {
    // Validate file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`Audio file not found: ${filePath}`);
    }

    // Validate file size (max 25MB for Hugging Face)
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    if (fileSizeInMB > 25) {
      throw new Error(`File too large: ${fileSizeInMB.toFixed(2)}MB (max 25MB)`);
    }

    // Validate file type
    const ext = path.extname(filePath).toLowerCase();
    const supportedFormats = ['.wav', '.mp3', '.m4a', '.flac', '.ogg'];
    if (!supportedFormats.includes(ext)) {
      throw new Error(`Unsupported audio format: ${ext}. Supported: ${supportedFormats.join(', ')}`);
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`🎤 [Speech] User ${userId} uploading audio: ${path.basename(filePath)} (${fileSizeInMB.toFixed(2)}MB)`);

    // Read audio file
    fileBuffer = fs.readFileSync(filePath);

    // Call Hugging Face Speech-to-Text API
    const response = await axios.post(
      HF_SPEECH_URL,
      fileBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'audio/wav',
        },
        timeout: 60000, // 60 seconds for longer audio
      }
    );

    const transcribedText = response.data?.text || '';

    if (!transcribedText) {
      throw new Error('No speech detected in audio file');
    }

    console.log(`✅ [Speech] Transcription complete for user ${userId}: "${transcribedText.substring(0, 50)}..."`);

    return {
      success: true,
      text: transcribedText,
      duration: null, // Can be calculated from audio file if needed
      model: 'openai/whisper-base',
      language: 'auto-detected',
    };
  } catch (error) {
    console.error(`❌ [Speech] Error for user ${userId}:`, error.message);

    // Friendly error messages
    if (error.message.includes('timeout')) {
      throw new Error('Speech processing took too long. Try a shorter audio file.');
    }
    if (error.message.includes('API')) {
      throw new Error('Speech service temporarily unavailable. Please try again later.');
    }

    throw error;
  }
};

/**
 * Transcribe audio from URL
 * @param {string} audioUrl - URL of audio file
 * @param {string} userId - User ID for logging
 * @returns {Promise<object>} - Transcribed text
 */
const transcribeAudioURL = async (audioUrl, userId = 'unknown') => {
  try {
    if (!audioUrl) {
      throw new Error('Audio URL is required');
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`🎤 [Speech] User ${userId} transcribing from URL: ${audioUrl}`);

    // Download audio file
    const response = await axios.get(audioUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });

    const audioBuffer = Buffer.from(response.data);

    // Call Hugging Face API
    const transcriptionResponse = await axios.post(
      HF_SPEECH_URL,
      audioBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'audio/wav',
        },
        timeout: 60000,
      }
    );

    const transcribedText = transcriptionResponse.data?.text || '';

    if (!transcribedText) {
      throw new Error('No speech detected in audio');
    }

    console.log(`✅ [Speech] URL transcription complete for user ${userId}`);

    return {
      success: true,
      text: transcribedText,
      source: 'url',
      model: 'openai/whisper-base',
    };
  } catch (error) {
    console.error(`❌ [Speech] URL error for user ${userId}:`, error.message);
    throw error;
  }
};

module.exports = {
  transcribeAudio,
  transcribeAudioURL,
};
