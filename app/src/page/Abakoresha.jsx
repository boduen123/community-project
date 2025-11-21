import React, { useEffect, useState } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Abakoresha() {
  const [abakoresha, setAbakoresha] = useState([]);
  const [form, setForm] = useState({
    izina: "",
    email: "",
    password: "",
    role: "",
  });

  const API = "http://localhost:5000/abakoresha";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(API).then((res) => setAbakoresha(res.data));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(API, form).then(() => {
      fetchData();
      setForm({
        izina: "",
        email: "",
        password: "",
        role: "",
      });
    });
  };

  const deleteItem = (id) => {
    axios.delete(`${API}/${id}`).then(() => fetchData());
  };

  return (
    <div>
      <h4>👤 Abakoresha System (Accounts)</h4>

      {/* Form yo kwandika umukozi */}
      <form onSubmit={handleSubmit} className="row g-2 mb-3">
        {Object.keys(form).map((key) => (
          <div className="col-md-3" key={key}>
            <input
              type={key === "password" ? "password" : "text"}
              className="form-control"
              name={key}
              value={form[key]}
              onChange={handleChange}
              placeholder={key.replace(/_/g, " ")}
            />
          </div>
        ))}
        <div className="col-md-12">
          <button className="btn btn-primary w-100">
            <i className="bi bi-person-plus"></i> Andika Umukoresha
          </button>
        </div>
      </form>

      {/* Table y’abakoresha */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Izina</th>
            <th>Email</th>
            <th>Role</th>
            <th>Ibikorwa</th>
          </tr>
        </thead>
        <tbody>
          {abakoresha.map((a, i) => (
            <tr key={i}>
              <td>{a.user_id}</td>
              <td>{a.izina}</td>
              <td>{a.email}</td>
              <td>{a.role}</td>
              <td>
                <button
                  onClick={() => deleteItem(a.user_id)}
                  className="btn btn-danger btn-sm"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Abakoresha;
