const { TranslationServiceClient } = require("@google-cloud/translate");
const { GOOGLE_PROJECT_ID } = require("../appsecrets");

class TranslationService {
  
  constructor() {
    this.translationClient = new TranslationServiceClient();
  }

  async translateText(text) {
    // Construct request
    const request = {
      parent: `projects/${GOOGLE_PROJECT_ID}/locations/global`,
      contents: [text],
      mimeType: 'text/plain', // mime types: text/plain, text/html
      sourceLanguageCode: 'en',
      targetLanguageCode: 'fr',
    };

    // Run request
    const [response] = await this.translationClient.translateText(request);

    for (const translation of response.translations) {
      console.log(`\n\nTranslation: ${translation.translatedText}`);
    }
    return response.translations[0].translatedText;
  }
}

module.exports = TranslationService;
