import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createMistral } from '@ai-sdk/mistral';
import { createCohere } from '@ai-sdk/cohere';
import { createDeepSeek } from '@ai-sdk/deepseek';

/**
 * Returns a configured LanguageModel based on the provider string.
 * It dynamically provisions OpenAI-compatible endpoints for Groq, OpenRouter, etc.
 * Gracefully falls back to Google Gemini if keys are missing.
 */
export function getAgentModel(provider: string, modelId: string) {
  console.log(`\n🕵️ [SYSTEM] Requesting AI Model Factory -> Provider: ${provider} | Model: ${modelId}`);
  try {
    switch (provider.toLowerCase()) {
      case 'google':
        if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY in .env");
        console.log(`✅ [SYSTEM] Loaded GEMINI_API_KEY successfully`);
        const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
        return google(modelId || 'gemini-2.5-flash');

      case 'groq':
        if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY in .env");
        console.log(`✅ [SYSTEM] Loaded GROQ_API_KEY successfully`);
        const groq = createOpenAI({
          apiKey: process.env.GROQ_API_KEY,
          baseURL: "https://api.groq.com/openai/v1",
        });
        return groq(modelId || 'llama-3.1-8b-instant');

      case 'openrouter':
        if (!process.env.OPENROUTER_API_KEY) throw new Error("Missing OPENROUTER_API_KEY in .env");
        console.log(`✅ [SYSTEM] Loaded OPENROUTER_API_KEY successfully`);
        const openrouter = createOpenAI({
          apiKey: process.env.OPENROUTER_API_KEY,
          baseURL: "https://openrouter.ai/api/v1",
        });
        return openrouter(modelId || 'meta-llama/llama-3.1-8b-instruct:free');

      case 'mistral':
        if (!process.env.MISTRAL_API_KEY) throw new Error("Missing MISTRAL_API_KEY in .env");
        console.log(`✅ [SYSTEM] Loaded MISTRAL_API_KEY successfully`);
        const mistral = createMistral({ apiKey: process.env.MISTRAL_API_KEY });
        return mistral(modelId || 'open-mistral-nemo');

      case 'cohere':
        if (!process.env.COHERE_API_KEY) throw new Error("Missing COHERE_API_KEY in .env");
        console.log(`✅ [SYSTEM] Loaded COHERE_API_KEY successfully`);
        const cohere = createCohere({ apiKey: process.env.COHERE_API_KEY });
        return cohere(modelId || 'command-r-08-2024');

      case 'deepseek':
        if (!process.env.DEEPSEEK_API_KEY) throw new Error("Missing DEEPSEEK_API_KEY in .env");
        console.log(`✅ [SYSTEM] Loaded DEEPSEEK_API_KEY successfully`);
        const deepseek = createDeepSeek({ apiKey: process.env.DEEPSEEK_API_KEY });
        return deepseek(modelId || 'deepseek-chat');

      case 'github':
        if (!process.env.GITHUB_TOKEN) throw new Error("Missing GITHUB_TOKEN in .env");
        console.log(`✅ [SYSTEM] Loaded GITHUB_TOKEN successfully`);
        const github = createOpenAI({
          apiKey: process.env.GITHUB_TOKEN,
          baseURL: "https://models.inference.ai.azure.com",
        });
        return github(modelId || 'gpt-4o');

      default:
        console.warn(`⚠️ [SYSTEM] Unrecognized provider ${provider}. Falling back to Google.`);
        const fallback = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
        return fallback('gemini-2.5-flash');
    }
  } catch (error: any) {
    console.error(`🚨 [SYSTEM FATAL] Failed to init ${provider}: ${error.message}`);
    console.log(`🔄 [SYSTEM FALLBACK] Routing traffic autonomously back to Google Gemini...`);
    const fallback = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });
    return fallback('gemini-2.5-flash');
  }
}
