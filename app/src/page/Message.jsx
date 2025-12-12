import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/message"; // change API if needed

export default function Message() {
  const [form, setForm] = useState({
    text_user: "",
    user_id: "",
  });

  const [messages, setMessages] = useState([]);

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(API_URL);
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add message
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(API_URL, form);
      setForm({
        text_user: "",
        user_id: "",
      });
      fetchMessages();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div style={{ padding: "25px" }}>
      <h2>Messages</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <textarea
          name="text_user"
          placeholder="Andika ubutumwa..."
          value={form.text_user}
          onChange={handleChange}
          required
          style={{ width: "100%", height: "100px" }}
        />

        <input
          type="number"
          name="user_id"
          placeholder="User ID (optional)"
          value={form.user_id}
          onChange={handleChange}
          style={{ marginTop: "10px" }}
        />

        <button type="submit" style={{ marginTop: "10px" }}>
          Send Message
        </button>
      </form>

      {/* TABLE */}
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Message</th>
            <th>User ID</th>
          </tr>
        </thead>

        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.id}</td>
              <td>{m.text_user}</td>
              <td>{m.user_id ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
