const dangerousPhrases = [
  "kill myself",
  "end my life",
  "suicide",
  "want to die",
  "i want to die",
  "i should die",
  "i don't want to live",
];
// Safety middleware to detect potentially harmful messages
export default function safetyCheck(req, res, next) {
  const msg = (req.body?.message || "").toLowerCase();

  const isDangerous = dangerousPhrases.some((phrase) =>
    msg.includes(phrase)
  );

  if (isDangerous) {
    return res.status(200).json({
      reply:
        "I’m really glad you told me this. You matter, and you’re not alone. Please consider reaching out to someone you trust or a mental health professional right now.",
      risk: "HIGH",
      petMood: "soothing",
      resources: [
        {
          name: "National Suicide Prevention Lifeline",
          contact: "988",
        },
        {
          name: "Crisis Text Line",
          contact: "Text HOME to 741741",
        },
        {
          name: "International Association for Suicide Prevention",
          contact: "https://www.iasp.info/resources/Crisis_Centres/",
        },
      ],
    });
  }

  next();
}
