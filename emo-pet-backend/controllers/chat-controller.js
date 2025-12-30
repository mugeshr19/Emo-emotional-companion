import analyzeSentiment from "../services/sentiment-service.js";
import generateResponse from "../services/response-service.js";
import detectRisk from "../services/risk-service.js";
import recommendResources from "../services/resource-service.js";
import getPetMood from "../utils/mood-util.js";

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ error: "Message required" });

    // 2️⃣ Analyze sentiment and mode
    const analysis = await analyzeSentiment(message); // returns {emotion, sentiment, risk_level, mode, reason}

    // 3️⃣ Detect risk level
    const risk = detectRisk(analysis.risk_level);

    // 4️⃣ Generate AI reply
    const reply = await generateResponse({ message, analysis, risk });

    // 5️⃣ Recommend resources
    const resources = recommendResources(risk);

    // 6️⃣ Get pet mood based on AI-detected emotion
    const petMood = getPetMood(analysis.emotion);

    // 8️⃣ Send response to frontend
    res.json({
      reply,
      emotion: analysis.emotion,
      risk,
      petMood,
      resources
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI processing failed" });
  }
};
