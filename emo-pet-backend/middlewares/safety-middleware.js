const dangerousPhrases = [
  "kill myself",
  "end my life",
  "suicide",
  "want to die",
  "i want to die",
  "i should die",
  "i don't want to live",
];
// if the message contains these words this will be executed
export default function safetyCheck(req, res, next) {
  const msg = (req.body.message || "").toLowerCase();

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
          name: "Kiran Mental Health Helpline (India)",
          contact: "1800-599-0019",
        },
      ],
    });
  }

  next();
}
