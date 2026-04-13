/**
 * IMAGE-TO-TEXT SERVICE
 * Analyzes medicine images using Hugging Face BLIP model
 * Generates captions and health suggestions
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const HF_API_KEY = process.env.HuggingFace_API_KEY;
const HF_IMAGE_URL = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';

/**
 * Analyze medicine image and generate caption
 * @param {string} imagePath - Path to image file
 * @param {string} userId - User ID for logging
 * @returns {Promise<object>} - Image caption and suggestions
 */
const analyzeMedicineImage = async (imagePath, userId = 'unknown') => {
  try {
    // Validate file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    // Validate file size (max 10MB)
    const stats = fs.statSync(imagePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    if (fileSizeInMB > 10) {
      throw new Error(`File too large: ${fileSizeInMB.toFixed(2)}MB (max 10MB)`);
    }

    // Validate file type
    const ext = path.extname(imagePath).toLowerCase();
    const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!supportedFormats.includes(ext)) {
      throw new Error(`Unsupported image format: ${ext}. Supported: ${supportedFormats.join(', ')}`);
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`🖼️ [Image] User ${userId} analyzing image: ${path.basename(imagePath)}`);

    // Read image file and convert to base64
    const imageBuffer = fs.readFileSync(imagePath);

    // Call Hugging Face Image-to-Text API
    const response = await axios.post(
      HF_IMAGE_URL,
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        timeout: 30000,
      }
    );

    // Extract caption
    let caption = '';
    if (Array.isArray(response.data) && response.data.length > 0) {
      caption = response.data[0]?.generated_text || '';
    }

    if (!caption) {
      caption = 'Image analyzed but no clear description generated.';
    }

    console.log(`✅ [Image] Analysis complete for user ${userId}: "${caption.substring(0, 50)}..."`);

    // Generate health suggestions based on caption
    const suggestions = generateMedicineSuggestions(caption);

    return {
      success: true,
      caption: caption,
      suggestions: suggestions,
      isMedicineImage: suggestions.length > 0,
      model: 'Salesforce/blip-image-captioning-base',
    };
  } catch (error) {
    console.error(`❌ [Image] Error for user ${userId}:`, error.message);

    // Friendly error messages
    if (error.message.includes('timeout')) {
      throw new Error('Image processing took too long. Try a smaller file.');
    }
    if (error.message.includes('API')) {
      throw new Error('Image service temporarily unavailable. Please try again later.');
    }

    throw error;
  }
};

/**
 * Generate health suggestions based on image caption
 * @param {string} caption - Image caption
 * @returns {Array} - Suggestions array
 */
const generateMedicineSuggestions = (caption) => {
  const suggestions = [];
  const lowerCaption = caption.toLowerCase();

  // Check for medicine/medication keywords
  if (lowerCaption.includes('medicine') || lowerCaption.includes('pill') || lowerCaption.includes('tablet') || lowerCaption.includes('capsule')) {
    suggestions.push({
      type: 'medication-reminder',
      message: 'Remember to take your medication as prescribed by your doctor.',
      priority: 'high',
    });
  }

  // Check for warning signs
  if (lowerCaption.includes('prescription') || lowerCaption.includes('drug')) {
    suggestions.push({
      type: 'consultation',
      message: 'Always follow the dosage instructions recommended by your healthcare provider.',
      priority: 'high',
    });
  }

  // Check for bottle/container
  if (lowerCaption.includes('bottle') || lowerCaption.includes('container')) {
    suggestions.push({
      type: 'storage',
      message: 'Store medicines in a cool, dry place away from direct sunlight.',
      priority: 'medium',
    });
  }

  // General health suggestion
  if (suggestions.length === 0) {
    suggestions.push({
      type: 'general',
      message: 'Maintain a healthy lifestyle with proper diet, exercise, and regular check-ups.',
      priority: 'low',
    });
  }

  return suggestions;
};

/**
 * Analyze image from URL
 * @param {string} imageUrl - URL of image
 * @param {string} userId - User ID for logging
 * @returns {Promise<object>} - Image caption and suggestions
 */
const analyzeMedicineImageURL = async (imageUrl, userId = 'unknown') => {
  try {
    if (!imageUrl) {
      throw new Error('Image URL is required');
    }

    if (!HF_API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }

    console.log(`🖼️ [Image] User ${userId} analyzing image from URL: ${imageUrl}`);

    // Download image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024, // 10MB max
    });

    const imageBuffer = Buffer.from(response.data);

    // Call Hugging Face API
    const analysisResponse = await axios.post(
      HF_IMAGE_URL,
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        timeout: 30000,
      }
    );

    let caption = '';
    if (Array.isArray(analysisResponse.data) && analysisResponse.data.length > 0) {
      caption = analysisResponse.data[0]?.generated_text || '';
    }

    if (!caption) {
      caption = 'Image analyzed but no clear description generated.';
    }

    console.log(`✅ [Image] URL analysis complete for user ${userId}`);

    const suggestions = generateMedicineSuggestions(caption);

    return {
      success: true,
      caption: caption,
      suggestions: suggestions,
      source: 'url',
      model: 'Salesforce/blip-image-captioning-base',
    };
  } catch (error) {
    console.error(`❌ [Image] URL error for user ${userId}:`, error.message);
    throw error;
  }
};

module.exports = {
  analyzeMedicineImage,
  analyzeMedicineImageURL,
  generateMedicineSuggestions,
};
