export default function recommendResources(risk) {
  if (risk === "HIGH") {
    return [
      {
        name: "Kiran Mental Health Helpline (India)",
        contact: "1800-599-0019",
      },
    ];
  }

  if (risk === "MEDIUM") {
    return [{ name: "Breathing exercises" }, { name: "Journaling" }];
  }

  return [];
}
// if the risk level is high then it will show the resources of mental health helpline
//if the risk level is medium then it will show the breathing exercises and journaling
