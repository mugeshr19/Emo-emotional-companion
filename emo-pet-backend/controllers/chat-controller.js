import analyzeSentiment from "../services/sentiment-service.js";
import generateResponse from "../services/response-service.js";
import detectRisk from "../services/risk-service.js";
import recommendResources from "../services/resource-service.js";
import getPetMood from "../utils/mood-util.js";
import Chat from "../models/Chat.js";

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user?.userId;
    
    if (!message) return res.status(400).json({ error: "Message required" });
    if (!userId) return res.status(401).json({ error: "Authentication required" });

    // Get last 10 messages for context
    let chat = await Chat.findOne({ userId });
    const chatHistory = chat ? chat.messages.slice(-10) : [];
    
    console.log('Chat history:', chatHistory); // Debug log

    // Analyze sentiment
    const analysis = await analyzeSentiment(message);
    const risk = detectRisk(analysis.risk_level);

    // Generate AI reply with last 10 messages context
    const reply = await generateResponse({ message, analysis, risk, chatHistory });

    // Save conversation
    if (!chat) {
      chat = new Chat({ userId, messages: [] });
    }
    chat.messages.push(
      { role: "user", content: message },
      { role: "assistant", content: reply }
    );
    await chat.save();

    const resources = recommendResources(risk);
    const petMood = getPetMood(analysis.emotion);

    res.json({ reply, emotion: analysis.emotion, risk, petMood, resources });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI processing failed" });
  }
};
