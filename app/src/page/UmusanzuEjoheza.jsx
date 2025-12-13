import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/umusanzu_ejoheza";

export default function UmusanzuEjoheza() {
  const [form, setForm] = useState({
    umuturage: "",
    amafaranga: "",
    itariki: "",
    // user_id removed from state
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Inject modern styles (Green Theme)
  useEffect(() => {
    const id = "umusanzu-ejoheza-modern-ui";
    if (document.getElementById(id)) return;
    const css = `
      .ejoheza-page { background: radial-gradient(circle at top left, #bbf7d0 0, #ecfeff 32%, #ffffff 100%); }
      .modern-card { border-radius: 22px; border: none !important; background: rgba(255, 255, 255, 0.96); backdrop-filter: blur(10px); box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08); transition: all 0.25s ease; }
      .modern-card:hover { transform: translateY(-3px); box-shadow: 0 26px 65px rgba(15, 23, 42, 0.14); }
      .gradient-card-success { background: linear-gradient(135deg, #16a34a 0%, #22c55e 45%, #14b8a6 100%); color: #ecfdf5; }
      .header-icon { background: radial-gradient(circle at 30% 20%, #bbf7d0 0, #dcfce7 55%, #f0fdf4 100%); }
      .btn-gradient-success { background: linear-gradient(135deg, #22c55e 0%, #14b8a6 60%); border: none; color: #ecfdf5; box-shadow: 0 14px 32px rgba(34, 197, 94, 0.35); transition: all 0.25s ease; }
      .modern-input { border-radius: 16px !important; border: 1px solid rgba(148, 163, 184, 0.5) !important; background: #f9fafb !important; }
      .modern-input:focus { border-color: #22c55e !important; background: #ffffff !important; }
      .table-modern tbody tr { transition: all 0.18s ease; }
      .table-modern tbody tr:hover { background: rgba(240, 253, 250, 0.98); transform: translateY(-1px); }
      .avatar-soft { box-shadow: 0 8px 18px rgba(16, 185, 129, 0.35); }
      .modern-modal { border-radius: 24px; }
    `;
    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  // Fetch records (Backend uses req.user.id automatically)
  const fetchRecords = async () => {
    try {
      setLoading(true);
      // Ensure axios is sending credentials if using cookies/sessions
      // axios.defaults.withCredentials = true; 
      const res = await axios.get(API_URL);
      setRecords(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      showNotification("Habaye ikibazo mu gushaka amakuru.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const showNotification = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4000);
  };

  const formatRWF = (amount) => {
    const num = Number(amount || 0);
    return new Intl.NumberFormat("rw-RW", { style: "currency", currency: "RWF" }).format(num);
  };

  const totalSavings = records.reduce((acc, curr) => acc + Number(curr.amafaranga || 0), 0);
  const totalContributors = records.length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Backend automatically attaches user_id
      await axios.post(API_URL, form);
      setForm({ umuturage: "", amafaranga: "", itariki: "" });
      fetchRecords();
      showNotification("Ubwizigame bwabitswe neza!", "success");
    } catch (err) {
      console.error("Save error:", err);
      showNotification("Ntibyakunze kubika.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRecords = records.filter((record) => {
    const name = (record.umuturage || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    if (q && !name.includes(q)) return false;
    if (!record.itariki) return filterRange === "all";
    
    const recDate = new Date(record.itariki);
    const today = new Date();
    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
    const isSameMonth = (d1, d2) => d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    if (filterRange === "today") return isSameDay(recDate, today);
    if (filterRange === "month") return isSameMonth(recDate, today);
    return true;
  });

  const openDetailModal = (record) => { setSelectedRecord(record); setShowDetailModal(true); };
  const closeDetailModal = () => { setSelectedRecord(null); setShowDetailModal(false); };

  return (
    <div className="ejoheza-page container-fluid py-4 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11 ejoheza-shell">
          
          {/* Header & Stats */}
          <div className="row mb-4 align-items-center g-3">
            <div className="col-md-7">
              <div className="modern-card p-3 d-flex align-items-center">
                <div className="header-icon p-3 rounded-circle text-success me-3 d-flex align-items-center justify-content-center">
                  <i className="bi bi-piggy-bank-fill fs-3"></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-0 text-dark">Ejo Heza</h2>
                  <p className="text-muted mb-0 small">Gucunga ubwizigame bw'igihe kirekire.</p>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              <div className="modern-card gradient-card-success h-100">
                <div className="card-body p-3 d-flex flex-column justify-content-between">
                  <span className="text-subtle text-uppercase fw-semibold small">Ubwizigame Bwose</span>
                  <h4 className="fw-bold mb-1">{formatRWF(totalSavings)}</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Alert */}
          {alert.show && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4`} role="alert">
              <i className={`bi ${alert.type === "success" ? "bi-check-circle-fill" : "bi-exclamation-octagon-fill"} me-2`}></i>
              {alert.message}
            </div>
          )}

          <div className="row g-4">
            {/* Form */}
            <div className="col-lg-4">
              <div className="modern-card h-100">
                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="card-title fw-bold mb-0 text-success"><i className="bi bi-plus-lg me-2"></i> Andika Ubwizigame</h5>
                  <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={fetchRecords} disabled={loading}><i className="bi bi-arrow-clockwise"></i></button>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                      <input type="text" className="form-control modern-input" id="umuturage" name="umuturage" placeholder="Izina" value={form.umuturage} onChange={handleChange} required />
                      <label htmlFor="umuturage">Izina ry'Umuturage</label>
                    </div>
                    <div className="form-floating mb-3">
                      <input type="number" className="form-control modern-input" id="amafaranga" name="amafaranga" placeholder="Amount" value={form.amafaranga} onChange={handleChange} required />
                      <label htmlFor="amafaranga">Amafaranga (RWF)</label>
                    </div>
                    <div className="form-floating mb-4">
                      <input type="date" className="form-control modern-input" id="itariki" name="itariki" value={form.itariki} onChange={handleChange} required />
                      <label htmlFor="itariki">Itariki</label>
                    </div>
                    <button type="submit" className="btn btn-gradient-success w-100 py-3 rounded-3 fw-bold" disabled={submitting}>
                      {submitting ? "Bireme..." : "Bika Ubwizigame"}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="col-lg-8">
              <div className="modern-card h-100">
                <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center gap-3">
                  <h5 className="card-title fw-bold mb-0 text-dark">Raporo</h5>
                  <div className="input-group glass-input" style={{ maxWidth: "200px" }}>
                    <span className="input-group-text border-0"><i className="bi bi-search text-muted"></i></span>
                    <input type="text" className="form-control border-0" placeholder="Shakisha..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover table-modern align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4 border-0 py-3">Umuturage</th>
                          <th className="border-0 py-3">Amafaranga</th>
                          <th className="border-0 py-3">Itariki</th>
                          <th className="text-center border-0 py-3">Ibindi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr> : 
                         filteredRecords.map((row) => (
                          <tr key={row.id} onClick={() => openDetailModal(row)} style={{ cursor: "pointer" }}>
                            <td className="ps-4 fw-bold text-dark">{row.umuturage}</td>
                            <td className="fw-bold text-success">{formatRWF(row.amafaranga)}</td>
                            <td><span className="badge rounded-pill bg-light text-dark border fw-normal">{new Date(row.itariki).toLocaleDateString('rw-RW')}</span></td>
                            <td className="text-center"><button className="btn btn-sm btn-light rounded-circle"><i className="bi bi-eye"></i></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          {showDetailModal && selectedRecord && (
            <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.45)" }} onClick={(e) => e.target.classList.contains("modal") && closeDetailModal()}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modern-modal border-0 p-4 text-center">
                  <div className="avatar-soft rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center fw-bold" style={{ width: 80, height: 80, fontSize: "2rem" }}>
                    {selectedRecord.umuturage.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="fw-bold mb-4">{selectedRecord.umuturage}</h3>
                  <div className="bg-light p-3 rounded-3 mb-3 d-flex justify-content-between">
                    <span>Amafaranga:</span> <span className="fw-bold text-success">{formatRWF(selectedRecord.amafaranga)}</span>
                  </div>
                  <button className="btn btn-secondary w-100 rounded-pill" onClick={closeDetailModal}>Funga</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}