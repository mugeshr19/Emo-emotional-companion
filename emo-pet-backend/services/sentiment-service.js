import groq from "../config/groqClient.js";

export default async function analyzeSentiment(message){
    const prompt = `
Analyze sentiment and return ONLY JSON:
{
  "sentiment": "positive | neutral | negative | distressed",
  "emotion": "happy | sad | anxious | angry | lonely | stressed | bored | tired | exhausted",
  "risk_level": 0-10,
  "mode": "friendly | humorous | playful | supportive",
  "reason": "short explanation"
} 

Message:
"${message}"
`;

    try {
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "user", content: prompt }],
            temperature: 0,
        });

        if (!response.choices || !response.choices[0] || !response.choices[0].message) {
            throw new Error('Invalid API response structure');
        }

        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Sentiment analysis error:', error);
        
        return {
            sentiment: "neutral",
            emotion: "neutral",
            risk_level: 5,
            mode: "supportive",
            reason: "Analysis unavailable"
        };
    }
}