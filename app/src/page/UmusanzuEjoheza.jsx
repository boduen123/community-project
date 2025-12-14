import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// -----------------------------------------------------------------------------
// MODERN UI STYLES
// -----------------------------------------------------------------------------
const modernStyles = `
  :root {
    --primary: #16a34a;
    --primary-light: #ecfdf5;
    --primary-dark: #15803d;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-600: #4b5563;
    --gray-800: #1f2937;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --radius: 1rem;
    --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    color: var(--gray-800);
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: var(--radius);
    box-shadow: var(--shadow-lg);
    transition: var(--transition);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .form-control, .form-select {
    border-radius: 0.75rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--gray-200);
    background-color: var(--gray-50);
    transition: var(--transition);
    font-size: 0.95rem;
  }

  .form-control:focus {
    background-color: #fff;
    border-color: var(--primary);
    box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1);
  }

  .btn-modern {
    border-radius: 0.75rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
    letter-spacing: 0.025em;
    transition: var(--transition);
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .btn-modern:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }

  .btn-modern:active {
    transform: translateY(0);
  }

  .btn-success-gradient {
    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
    color: white;
  }

  .btn-success-gradient:hover {
    background: linear-gradient(135deg, #15803d 0%, #166534 100%);
    color: white;
  }

  .table-modern {
    background: white;
    border-radius: var(--radius);
    overflow: hidden;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
  }

  .table-modern thead th {
    background-color: var(--primary-light);
    color: var(--primary-dark);
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--gray-200);
  }

  .table-modern tbody tr {
    transition: background-color 0.15s;
  }

  .table-modern tbody tr:hover {
    background-color: #f0fdf4;
  }

  .table-modern td {
    padding: 1rem 1.5rem;
    vertical-align: middle;
    border-bottom: 1px solid var(--gray-100);
    color: var(--gray-600);
  }

  .table-modern tbody tr:last-child td {
    border-bottom: none;
  }

  .avatar-circle {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
    color: var(--primary-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1rem;
    box-shadow: var(--shadow-sm);
  }

  .badge-modern {
    padding: 0.35rem 0.75rem;
    border-radius: 9999px;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.025em;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    border: none;
    cursor: pointer;
    background: transparent;
  }

  .action-btn:hover {
    background-color: var(--gray-100);
    transform: scale(1.1);
  }

  .action-btn.edit { color: var(--warning); }
  .action-btn.edit:hover { background-color: #fffbeb; }

  .action-btn.delete { color: var(--danger); }
  .action-btn.delete:hover { background-color: #fef2f2; }

  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--gray-600);
  }

  .empty-state-icon {
    font-size: 3.5rem;
    color: var(--gray-200);
    margin-bottom: 1rem;
  }

  /* Search Input Styling */
  .search-wrapper {
    position: relative;
    max-width: 300px;
    width: 100%;
  }
  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--gray-600);
    pointer-events: none;
  }
  .search-input {
    padding-left: 2.5rem !important;
    border-radius: 9999px !important;
    background-color: white !important;
    border: 1px solid var(--gray-200) !important;
    transition: var(--transition);
  }
  .search-input:focus {
    border-color: var(--primary) !important;
    box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.1) !important;
    width: 100%;
  }

  /* Animation for alerts */
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
`;

const API_URL = "http://localhost:5000/umusanzu-ejoheza";

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
export default function UmusanzuEjoheza() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ umuturage: "", amafaranga: "", itariki: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");

  // Inject Styles
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = modernStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Helper: Show Alert
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4000);
  };

  // Helper: Get Auth Headers
  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL, getAuthConfig());
      setRecords(res.data);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 403 || error.response?.status === 401) {
        showAlert("Session yarangiye. Ongera winjire.", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form, getAuthConfig());
        showAlert("Byavuguruwe neza!", "success");
      } else {
        await axios.post(API_URL, form, getAuthConfig());
        showAlert("Byanditswe neza!", "success");
      }
      setForm({ umuturage: "", amafaranga: "", itariki: "" });
      setEditId(null);
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      showAlert("Habaye ikibazo. Gerageza nanone.", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEdit = (row) => {
    setForm({ umuturage: row.umuturage, amafaranga: row.amafaranga, itariki: row.itariki });
    setEditId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Delete Click
  const handleDelete = async (id) => {
    if (!window.confirm("Urashaka gusiba uyu musanzu burundu?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, getAuthConfig());
      showAlert("Byasibwe neza!", "warning");
      fetchData();
    } catch (error) {
      console.error(error);
      showAlert("Ntibyasibwe.", "danger");
    }
  };

  // Filter records based on search term
  const filteredRecords = records.filter(record => 
    record.umuturage.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.amafaranga.toString().includes(searchTerm)
  );

  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: "linear-gradient(to bottom right, #f0fdf4, #e0f2fe)" }}>
      <div className="container py-5 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-12 col-xl-10">

            {/* HEADER */}
            <div className="text-center mb-5 animate-slide-in">
              <div className="d-inline-flex align-items-center justify-content-center p-3 mb-3 bg-white rounded-circle shadow-sm">
                <i className="bi bi-piggy-bank text-success" style={{ fontSize: "2.5rem" }}></i>
              </div>
              <h1 className="fw-bold text-gray-800 mb-2">Umusanzu Ejo Heza</h1>
              <p className="text-muted fs-5">Kuzigama no kwiteganyiriza ejo hazaza heza.</p>
            </div>

            {/* ALERT NOTIFICATION */}
            {alert.show && (
              <div className={`alert alert-${alert.type} border-0 shadow-sm rounded-4 d-flex align-items-center mb-4 animate-slide-in`}>
                <i className={`bi bi-${alert.type === "success" ? "check-circle-fill" : "exclamation-triangle-fill"} fs-4 me-3`}></i>
                <div className="fw-medium">{alert.message}</div>
                <button type="button" className="btn-close ms-auto" onClick={() => setAlert({ ...alert, show: false })}></button>
              </div>
            )}

            {/* INPUT FORM CARD */}
            <div className="glass-card mb-5 p-4 p-md-5">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h4 className="fw-bold text-success m-0">
                  <i className={`bi bi-${editId ? "pencil-square" : "plus-circle"} me-2`}></i>
                  {editId ? "Hindura Umusanzu" : "Ongeraho Umusanzu Mushya"}
                </h4>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-5">
                    <label className="form-label fw-semibold text-gray-600 small text-uppercase">Amazina</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 ps-3 text-muted">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        name="umuturage"
                        className="form-control border-start-0 ps-0"
                        placeholder="Urugero: Kalisa Jean"
                        value={form.umuturage}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label fw-semibold text-gray-600 small text-uppercase">Amafaranga (RWF)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0 ps-3 text-muted">
                        <i className="bi bi-cash-stack"></i>
                      </span>
                      <input
                        type="number"
                        name="amafaranga"
                        className="form-control border-start-0 ps-0"
                        placeholder="0"
                        value={form.amafaranga}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold text-gray-600 small text-uppercase">Itariki</label>
                    <input
                      type="date"
                      name="itariki"
                      className="form-control"
                      value={form.itariki}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-3 mt-4 pt-2">
                  {editId && (
                    <button
                      type="button"
                      className="btn btn-modern btn-light text-muted"
                      onClick={() => {
                        setEditId(null);
                        setForm({ umuturage: "", amafaranga: "", itariki: "" });
                      }}
                    >
                      Bireke
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-modern btn-success-gradient px-5"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        <span>Bitegereje...</span>
                      </>
                    ) : (
                      <>
                        <i className={`bi bi-${editId ? "check2" : "save"}`}></i>
                        <span>{editId ? "Emeza" : "Bika"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* DATA TABLE CARD */}
            <div className="glass-card overflow-hidden">
              <div className="p-4 p-md-5 border-bottom border-light d-flex flex-wrap justify-content-between align-items-center bg-white bg-opacity-50 gap-3">
                <div className="d-flex align-items-center gap-3">
                  <h5 className="fw-bold text-gray-800 m-0">Urutonde rw'Imisanzu</h5>
                  <span className="badge badge-modern bg-success bg-opacity-10 text-success">
                    Total: {filteredRecords.length}
                  </span>
                </div>

                {/* Search Input */}
                <div className="search-wrapper">
                  <i className="bi bi-search search-icon"></i>
                  <input
                    type="text"
                    className="form-control search-input"
                    placeholder="Shakisha umuturage..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-responsive">
                {filteredRecords.length > 0 ? (
                  <table className="table-modern">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Umuturage</th>
                        <th>Amafaranga</th>
                        <th>Itariki</th>
                        <th className="text-end pe-4">Ibikorwa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRecords.map((r, i) => (
                        <tr key={r.id}>
                          <td className="fw-bold text-muted ps-4">{i + 1}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-3">
                                {r.umuturage.charAt(0).toUpperCase()}
                              </div>
                              <span className="fw-semibold text-gray-800">{r.umuturage}</span>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-modern bg-green-100 text-green-800" 
                                  style={{backgroundColor: '#dcfce7', color: '#166534'}}>
                              {parseInt(r.amafaranga).toLocaleString()} RWF
                            </span>
                          </td>
                          <td className="text-muted">
                            <i className="bi bi-calendar3 me-2 opacity-50"></i>
                            {new Date(r.itariki).toLocaleDateString("rw-RW")}
                          </td>
                          <td className="text-end pe-4">
                            <button
                              className="action-btn edit me-2"
                              onClick={() => handleEdit(r)}
                              title="Hindura"
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button
                              className="action-btn delete"
                              onClick={() => handleDelete(r.id)}
                              title="Siba"
                            >
                              <i className="bi bi-trash-fill"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-inbox empty-state-icon"></i>
                    <h5 className="fw-bold text-gray-700">
                      {searchTerm ? "Nta gisubizo kibonetse" : "Nta musanzu uraboneka"}
                    </h5>
                    <p className="text-muted">
                      {searchTerm ? "Gerageza gushakisha irindi zina." : "Tangira wandika umusanzu wa mbere hejuru."}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}