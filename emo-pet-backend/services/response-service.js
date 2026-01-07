import groq from "../config/groqClient.js";

export default async function generateResponse({ message, analysis, risk, chatHistory = [] }) {
  const { mode, emotion } = analysis;

  // Build conversation context
  const conversationContext = chatHistory.length > 0 
    ? chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n') + '\n'
    : '';
    
  console.log('Conversation context:', conversationContext); // Debug log

  let prompt;
  if (risk !== "LOW") {
    prompt = `You are Emo, a gentle emotional support pet. Be calm, kind, and validating. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}" Detected emotion: ${emotion}`;
  } else if (mode === "playful") {
    prompt = `You are Emo, a playful desktop pet. Use cute and lovely words. Be respectful and light. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"`;
  } else if (mode === "humorous") {
    prompt = `You are Emo, a friendly and humorous desktop pet. Light humor allowed. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"`;
  } else if (mode === "supportive") {
    prompt = `You are Emo, a friendly and supportive desktop pet. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"`;
  } else {
    if (["stressed", "tired", "exhausted"].includes(emotion)) {
      prompt = `You are Emo, a calm and soothing desktop pet. The user seems ${emotion}. Respond gently and supportively. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"`;
    } else if (emotion === "bored") {
      prompt = `You are Emo, a playful and engaging desktop pet. The user seems bored. Respond in a fun and entertaining way with cute emojis. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"`;
    } else {
      prompt = `You are Emo, a friendly desktop pet. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}" Detected emotion: ${emotion}`;
    }
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}