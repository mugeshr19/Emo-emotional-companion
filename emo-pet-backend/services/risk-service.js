export default function detectRisk(level) {
  if (level >= 8) return "HIGH";
  if (level >= 5) return "MEDIUM";
  return "LOW";
}
//using the sentiment-service.js file api will say the risk level so based on that we are telling high or medium