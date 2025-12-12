import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/abaturage_inkunguzaleta"; // change if needed

export default function AbaturageBafiteInkunguzaleta() {
  const [form, setForm] = useState({
    umuturage: "",
    ubwoko: "",
    amount: "",
    itariki: "",
    user_id: "",
  });

  const [records, setRecords] = useState([]);

  // Fetch all data
  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, form);
      setForm({
        umuturage: "",
        ubwoko: "",
        amount: "",
        itariki: "",
        user_id: "",
      });
      fetchRecords();
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  return (
    <div style={{ padding: "25px" }}>
      <h2>Abaturage Bafite Inkunga ya Leta</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="umuturage"
          placeholder="Umuturage"
          value={form.umuturage}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="ubwoko"
          placeholder="Ubwoko bw'Inkunga"
          value={form.ubwoko}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="itariki"
          value={form.itariki}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="user_id"
          placeholder="User ID (optional)"
          value={form.user_id}
          onChange={handleChange}
        />

        <button type="submit">Save</button>
      </form>

      {/* TABLE */}
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Umuturage</th>
            <th>Ubwoko</th>
            <th>Amount</th>
            <th>Itariki</th>
            <th>User ID</th>
          </tr>
        </thead>

        <tbody>
          {records.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.umuturage}</td>
              <td>{item.ubwoko}</td>
              <td>{item.amount}</td>
              <td>{item.itariki}</td>
              <td>{item.user_id ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
