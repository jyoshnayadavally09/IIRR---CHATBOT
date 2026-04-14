import { useState } from "react";

export default function InputForm({ onSubmit }) {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <div>
      <input name="stage" placeholder="Stage" onChange={handleChange} />
      <input name="weather_type" placeholder="Weather" onChange={handleChange} />
      <input name="temperature" placeholder="Temperature" onChange={handleChange} />

      <button onClick={handleSubmit}>Send</button>
    </div>
  );
}
