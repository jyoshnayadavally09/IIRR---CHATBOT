import { useState } from "react";
import MessageBubble from "./MessageBubble";
import InputForm from "./InputForm";
import PredictionResult from "./PredictionResult";
import { predictData } from "../services/api";
import { getLocation } from "../services/locationService";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [prediction, setPrediction] = useState("");

  const handleSubmit = async (inputs) => {
    const location = await getLocation();

    setMessages((prev) => [...prev, { text: JSON.stringify(inputs), isUser: true }]);

    const res = await predictData({
      inputs,
      location,
    });

    setPrediction(res.data.prediction);

    setMessages((prev) => [
      ...prev,
      { text: res.data.prediction, isUser: false },
    ]);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Agri Chatbot 🌾</h2>

      {messages.map((msg, i) => (
        <MessageBubble key={i} text={msg.text} isUser={msg.isUser} />
      ))}

      <InputForm onSubmit={handleSubmit} />

      {prediction && <PredictionResult result={prediction} />}
    </div>
  );
}
