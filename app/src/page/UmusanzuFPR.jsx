import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/umusanzu_fpr"; // change to your backend route

export default function UmusanzuFPR() {
  const [form, setForm] = useState({
    umuturage: "",
    amafaranga: "",
    itariki: "",
    user_id: "",
  });

  const [records, setRecords] = useState([]);

  // Fetch all records
  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL);
      setRecords(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Handle form inputs
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
        amafaranga: "",
        itariki: "",
        user_id: "",
      });

      fetchRecords();
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Umusanzu FPR</h2>

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
          type="number"
          name="amafaranga"
          placeholder="Amafaranga"
          value={form.amafaranga}
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

        <button type="submit" style={{ marginTop: "10px" }}>
          Save
        </button>
      </form>

      {/* TABLE */}
      <table border="1" width="100%" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Umuturage</th>
            <th>Amafaranga</th>
            <th>Itariki</th>
            <th>User ID</th>
          </tr>
        </thead>

        <tbody>
          {records.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.umuturage}</td>
              <td>{row.amafaranga}</td>
              <td>{row.itariki}</td>
              <td>{row.user_id ?? "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import UmusanzuFPR from "./UmusanzuFPR";  
import UmusanzuEjoheza from "./UmusanzuEjoheza";  
 import Message from "./Message";  
 import AbaturageBafiteInkunguzaleta from "./AbaturageBafiteInkunguzaleta";        


