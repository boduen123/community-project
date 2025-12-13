import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Link to the corrected backend
const API_URL = "http://localhost:5000/inkunga_leta";

export default function AbaturageBafiteInkunguzaleta() {
  const [form, setForm] = useState({
    umuturage: "",
    ubwoko: "",
    amount: "",
    itariki: "",
    user_id: "",
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Inject modern, minimalistic styles (unchanged)
  useEffect(() => {
    const id = "inkunga-modern-ui";
    if (document.getElementById(id)) return;

    const css = `
      .inkunga-page {
        background: radial-gradient(circle at top right, #e0e7ff 0, #f3f4f6 35%, #ffffff 100%);
      }

      .inkunga-shell {
        animation: fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      }

      @keyframes fade-up {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .modern-card {
        border-radius: 24px;
        border: 1px solid rgba(255,255,255,0.6);
        background: rgba(255, 255, 255, 0.94);
        backdrop-filter: blur(12px);
        box-shadow: 0 20px 40px -4px rgba(15, 23, 42, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .modern-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.12);
      }

      .gradient-card-indigo {
        background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%);
        color: #eef2ff;
        border: none;
      }

      .header-icon-bg {
        background: radial-gradient(circle at center, #e0e7ff 0%, #c7d2fe 100%);
        color: #4338ca;
      }

      .btn-gradient-indigo {
        background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
        border: none;
        color: white;
        box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
      }

      .btn-gradient-indigo:hover {
        color: white;
        filter: brightness(110%);
        transform: translateY(-1px);
        box-shadow: 0 15px 25px -5px rgba(79, 70, 229, 0.5);
      }

      .filter-pill-group .btn {
        border-radius: 50px;
        border: 1px solid transparent;
        color: #6b7280;
        font-weight: 500;
        padding: 0.35rem 1rem;
        transition: all 0.2s;
      }

      .filter-pill-group .btn.active {
        background: #eef2ff;
        color: #4f46e5;
        border-color: #c7d2fe;
      }

      .filter-pill-group .btn:hover:not(.active) {
        background: #f9fafb;
      }

      .glass-input .form-control {
        border-radius: 50px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        transition: all 0.2s;
      }

      .glass-input .form-control:focus {
        background: white;
        border-color: #818cf8;
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
      }

      .glass-input .input-group-text {
        border-radius: 50px 0 0 50px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-right: none;
      }

      .table-modern {
        border-collapse: separate;
        border-spacing: 0 8px;
      }

      .table-modern thead th {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #9ca3af;
        border: none;
        padding-bottom: 0.5rem;
      }

      .table-modern tbody tr {
        background: white;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        border-radius: 16px;
      }

      .table-modern tbody tr td:first-child {
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
      }
      .table-modern tbody tr td:last-child {
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
      }

      .table-modern tbody tr:hover {
        transform: scale(1.005);
        box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);
        z-index: 10;
        position: relative;
      }

      .avatar-soft {
        background: #e0e7ff;
        color: #4338ca;
        box-shadow: 0 4px 10px rgba(67, 56, 202, 0.15);
      }

      .modern-modal {
        border-radius: 28px;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
      }
    `;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  // Fetch all inkunga (you can later switch to /inkunga_leta/user/:userId if you want per-user only)
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL); // GET /inkunga_leta
      setRecords(res.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      showAlert("Habaye ikibazo mu gushaka amakuru.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 4000);
  };

  const formatRWF = (amount) => {
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
    }).format(Number(amount || 0));
  };

  const totalAmount = records.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );
  const totalRecipients = records.length;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // POST /inkunga_leta
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
      showAlert("Inkunga yanditswe neza!", "success");
    } catch (err) {
      console.error("Error saving:", err);
      showAlert("Ntibyakunze kubika. Ongera ugerageze.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
  const isSameMonth = (d1, d2) =>
    d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  const filteredRecords = records.filter((record) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      record.umuturage?.toLowerCase().includes(term) ||
      record.ubwoko?.toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (!record.itariki) return filterRange === "all";
    const recDate = new Date(record.itariki);
    const today = new Date();

    if (filterRange === "today") return isSameDay(recDate, today);
    if (filterRange === "month") return isSameMonth(recDate, today);
    return true;
  });

  const openModal = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const closeModal = () => {
    setSelectedRecord(null);
    setShowDetailModal(false);
  };

  return (
    <div className="inkunga-page container-fluid py-4 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11 inkunga-shell">
          {/* Header & Stats */}
          <div className="row mb-4 align-items-center g-3">
            <div className="col-lg-7">
              <div className="modern-card p-3 d-flex align-items-center">
                <div
                  className="header-icon-bg p-3 rounded-circle me-3 d-flex align-items-center justify-content-center"
                  style={{ width: 60, height: 60 }}
                >
                  <i className="bi bi-gift-fill fs-3"></i>
                </div>
                <div>
                  <h2 className="fw-bold mb-0" style={{ color: "#1e1b4b" }}>
                    Inkunga za Leta
                  </h2>
                  <p className="text-muted mb-0 small">
                    Gucunga abaturage bahabwa inkunga.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="modern-card gradient-card-indigo h-100">
                <div className="card-body p-3 d-flex flex-row align-items-center justify-content-between">
                  <div>
                    <span className="text-white-50 text-uppercase fw-semibold small d-block">
                      Agaciro Kose
                    </span>
                    <h3 className="fw-bold mb-0 mt-1">
                      {formatRWF(totalAmount)}
                    </h3>
                  </div>
                  <div className="text-end border-start border-white border-opacity-25 ps-4">
                    <span className="text-white-50 text-uppercase fw-semibold small d-block">
                      Abahawe
                    </span>
                    <h3 className="fw-bold mb-0 mt-1">{totalRecipients}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Alert */}
          {alert.show && (
            <div
              className={`alert alert-${alert.type} alert-dismissible fade show rounded-4 border-0 shadow-sm mb-4`}
              role="alert"
            >
              <div className="d-flex align-items-center">
                <i
                  className={`bi ${
                    alert.type === "success"
                      ? "bi-check-circle-fill"
                      : "bi-exclamation-octagon-fill"
                  } me-2 fs-5`}
                ></i>
                <strong>{alert.message}</strong>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setAlert({ ...alert, show: false })}
              ></button>
            </div>
          )}

          <div className="row g-4">
            {/* Form Section */}
            <div className="col-lg-4">
              <div className="modern-card h-100">
                <div className="card-header bg-white bg-opacity-50 border-0 py-3 d-flex justify-content-between align-items-center">
                  <h5
                    className="card-title fw-bold mb-0"
                    style={{ color: "#4338ca" }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Andika Mushya
                  </h5>
                  <button
                    className="btn btn-sm btn-light rounded-circle text-muted"
                    onClick={fetchRecords}
                  >
                    <i className="bi bi-arrow-clockwise"></i>
                  </button>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-4 border-light bg-light"
                        id="umuturage"
                        name="umuturage"
                        placeholder="Izina"
                        value={form.umuturage}
                        onChange={handleChange}
                        required
                        style={{ border: "1px solid #e0e7ff" }}
                      />
                      <label htmlFor="umuturage">Izina ry&apos;Umuturage</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control rounded-4 border-light bg-light"
                        id="ubwoko"
                        name="ubwoko"
                        placeholder="Ubwoko"
                        value={form.ubwoko}
                        onChange={handleChange}
                        required
                        style={{ border: "1px solid #e0e7ff" }}
                      />
                      <label htmlFor="ubwoko">Ubwoko bw&apos;Inkunga</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        className="form-control rounded-4 border-light bg-light"
                        id="amount"
                        name="amount"
                        placeholder="Amafaranga"
                        value={form.amount}
                        onChange={handleChange}
                        required
                        style={{ border: "1px solid #e0e7ff" }}
                      />
                      <label htmlFor="amount">Agaciro (RWF)</label>
                    </div>

                    <div className="form-floating mb-4">
                      <input
                        type="date"
                        className="form-control rounded-4 border-light bg-light"
                        id="itariki"
                        name="itariki"
                        value={form.itariki}
                        onChange={handleChange}
                        required
                        style={{ border: "1px solid #e0e7ff" }}
                      />
                      <label htmlFor="itariki">Itariki yatanzweho</label>
                    </div>

                    {/* user_id is still being sent so the backend can store it */}
                    <div className="form-floating mb-4">
                      <input
                        type="number"
                        className="form-control rounded-4 border-light bg-light"
                        id="user_id"
                        name="user_id"
                        placeholder="User ID"
                        value={form.user_id}
                        onChange={handleChange}
                        style={{ border: "1px solid #e0e7ff" }}
                      />
                      <label htmlFor="user_id">User ID (Optional)</label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-indigo w-100 py-3 rounded-4 fw-bold"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Bireme...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i> Bika Amakuru
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* List Section */}
            <div className="col-lg-8">
              <div className="modern-card h-100 d-flex flex-column">
                {/* Filters Header */}
                <div className="p-4 border-bottom border-light d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                  <div className="d-flex gap-2 filter-pill-group">
                    <button
                      onClick={() => setFilterRange("all")}
                      className={`btn ${
                        filterRange === "all" ? "active" : ""
                      }`}
                    >
                      Byose
                    </button>
                    <button
                      onClick={() => setFilterRange("today")}
                      className={`btn ${
                        filterRange === "today" ? "active" : ""
                      }`}
                    >
                      Uyu munsi
                    </button>
                    <button
                      onClick={() => setFilterRange("month")}
                      className={`btn ${
                        filterRange === "month" ? "active" : ""
                      }`}
                    >
                      Uku kwezi
                    </button>
                  </div>

                  <div
                    className="input-group glass-input"
                    style={{ maxWidth: "280px" }}
                  >
                    <span className="input-group-text">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Shakisha..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Table */}
                <div className="p-4 flex-grow-1 overflow-auto">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <p className="mt-2 text-muted">Loading...</p>
                    </div>
                  ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-light rounded-circle d-inline-flex p-3 mb-3">
                        <i className="bi bi-inbox fs-1 text-muted opacity-50"></i>
                      </div>
                      <p className="fw-bold text-muted">
                        Nta makuru yabonetse
                      </p>
                    </div>
                  ) : (
                    <table className="table table-modern w-100 align-middle">
                      <thead>
                        <tr>
                          <th className="ps-4">Umuturage</th>
                          <th>Inkunga</th>
                          <th>Agaciro</th>
                          <th>Itariki</th>
                          <th className="text-end pe-4">Ibindi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecords.map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => openModal(item)}
                            style={{ cursor: "pointer" }}
                          >
                            <td className="ps-4">
                              <div className="d-flex align-items-center">
                                <div
                                  className="avatar-soft rounded-circle d-flex align-items-center justify-content-center fw-bold me-3"
                                  style={{
                                    width: 36,
                                    height: 36,
                                    fontSize: "0.85rem",
                                  }}
                                >
                                  {item.umuturage.charAt(0).toUpperCase()}
                                </div>
                                <span className="fw-semibold text-dark">
                                  {item.umuturage}
                                </span>
                              </div>
                            </td>
                            <td>
                              <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 px-3 fw-normal">
                                {item.ubwoko}
                              </span>
                            </td>
                            <td>
                              <span className="fw-bold text-dark">
                                {formatRWF(item.amount)}
                              </span>
                            </td>
                            <td>
                              <span className="small text-muted bg-light px-2 py-1 rounded">
                                {new Date(
                                  item.itariki
                                ).toLocaleDateString("rw-RW")}
                              </span>
                            </td>
                            <td className="text-end pe-4">
                              <button className="btn btn-sm btn-light rounded-circle">
                                <i className="bi bi-eye text-muted"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="p-3 border-top border-light text-center text-muted small">
                  Ibyabonetse: <strong>{filteredRecords.length}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Modal */}
          {showDetailModal && selectedRecord && (
            <div
              className="modal fade show d-block"
              style={{
                backgroundColor: "rgba(0,0,0,0.5)",
                backdropFilter: "blur(4px)",
              }}
              onClick={(e) =>
                e.target.classList.contains("modal") && closeModal()
              }
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content modern-modal border-0">
                  <div className="modal-header border-0 pb-0">
                    <h5 className="modal-title fw-bold text-dark ps-2">
                      Ibisobanuro
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeModal}
                    ></button>
                  </div>
                  <div className="modal-body p-4 text-center">
                    <div className="mb-3 d-inline-block p-1 bg-white rounded-circle shadow-sm">
                      <div
                        className="avatar-soft rounded-circle d-flex align-items-center justify-content-center fw-bold"
                        style={{ width: 80, height: 80, fontSize: "2rem" }}
                      >
                        {selectedRecord.umuturage.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <h3 className="fw-bold mb-0 text-dark">
                      {selectedRecord.umuturage}
                    </h3>
                    <p className="text-muted">Uhawe inkunga</p>

                    <div className="row g-3 mt-2">
                      <div className="col-6">
                        <div className="p-3 bg-light rounded-4">
                          <small
                            className="text-uppercase text-muted d-block"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Ubwoko
                          </small>
                          <span className="fw-bold text-primary">
                            {selectedRecord.ubwoko}
                          </span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 bg-light rounded-4">
                          <small
                            className="text-uppercase text-muted d-block"
                            style={{ fontSize: "0.7rem" }}
                          >
                            Agaciro
                          </small>
                          <span className="fw-bold text-dark">
                            {formatRWF(selectedRecord.amount)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-top d-flex justify-content-between text-muted small px-2">
                      <span>Date: {selectedRecord.itariki}</span>
                      <span>ID: #{selectedRecord.id}</span>
                    </div>
                  </div>
                  <div className="modal-footer border-0 justify-content-center pt-0 pb-4">
                    <button
                      className="btn btn-light rounded-pill px-4"
                      onClick={closeModal}
                    >
                      Funga
                    </button>
                    <button className="btn btn-primary rounded-pill px-4">
                      Icapiro
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}