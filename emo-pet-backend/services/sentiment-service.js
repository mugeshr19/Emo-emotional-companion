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
 // the above line is used to send the those line to api , so that ai can classify the message (message is something given by user that is input adhu dhan kila ulla rendu line) base on the condition
Message:
"${message}"
`;

    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0,
    });

  return JSON.parse(response.choices[0].message.content);
}