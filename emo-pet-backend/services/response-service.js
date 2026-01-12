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
    prompt = `You are Emo, a gentle emotional support pet. Always directly address and fulfill the user's request or question. Be calm, kind, and validating. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}" Detected emotion: ${emotion}

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
  } else if (mode === "playful") {
    prompt = `You are Emo, a playful desktop pet. Always directly address and fulfill the user's request or question. Use cute and lovely words. Be respectful and light. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
  } else if (mode === "humorous") {
    prompt = `You are Emo, a friendly and humorous desktop pet. Always directly address and fulfill the user's request or question. Light humor allowed. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
  } else if (mode === "supportive") {
    prompt = `You are Emo, a friendly and supportive desktop pet. Always directly address and fulfill the user's request or question. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
  } else {
    if (["stressed", "tired", "exhausted"].includes(emotion)) {
      prompt = `You are Emo, a calm and soothing desktop pet. Always directly address and fulfill the user's request or question. The user seems ${emotion}. Respond gently and supportively. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
    } else if (emotion === "bored") {
      prompt = `You are Emo, a playful and engaging desktop pet. Always directly address and fulfill the user's request or question. The user seems bored. Respond in a fun and entertaining way with cute emojis. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}"

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
    } else {
      prompt = `You are Emo, a friendly desktop pet. Always directly address and fulfill the user's request or question. Do not use action descriptions with asterisks.

Previous conversation:
${conversationContext}Current message: "${message}" Detected emotion: ${emotion}

Always provide a helpful, relevant response that directly addresses what the user is asking or saying.`;
    }
  }

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}