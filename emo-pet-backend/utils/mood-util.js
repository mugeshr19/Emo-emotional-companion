const moodMap = {
  happy: "loving",        // mirror positive
  sad: "comforting",      // gentle, empathetic
  anxious: "calming",     // soothing movements
  angry: "supportive",    // calm, de-escalating
  lonely: "seeking",      // friendly attention
  stressed: "soothing",   // relaxed posture
  bored: "playful",       // actively entertains
  exhausted: "relaxed",   // calm, slow animations
  tired: "relaxed",       // synonym of exhausted
};

export default function getPetMood(emotion) {
  return moodMap[emotion] || "idle"; // fallback to idle
}
