export default function MessageBubble({ text, isUser }) {
  return (
    <div
      style={{
        textAlign: isUser ? "right" : "left",
        margin: "10px",
      }}
    >
      <span
        style={{
          background: isUser ? "#4CAF50" : "#eee",
          color: isUser ? "#fff" : "#000",
          padding: "10px",
          borderRadius: "10px",
          display: "inline-block",
        }}
      >
        {text}
      </span>
    </div>
  );
}
