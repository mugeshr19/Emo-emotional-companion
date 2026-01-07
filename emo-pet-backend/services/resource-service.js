export default function recommendResources(risk) {
  if (risk === "HIGH") {
    return [
      {
        name: "National Suicide Prevention Lifeline",
        contact: "988",
      },
      {
        name: "Crisis Text Line",
        contact: "Text HOME to 741741",
      },
      {
        name: "SAMHSA National Helpline",
        contact: "1-800-662-4357",
      },
    ];
  }


  return [];
}
