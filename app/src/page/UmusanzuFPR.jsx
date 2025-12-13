import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/umusanzu_fpr";

export default function UmusanzuFPR() {
  const [form, setForm] = useState({
    umuturage: "",
    amafaranga: "",
    itariki: "",
  });

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRange, setFilterRange] = useState("all");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Get current user id (adapt as needed)
  const userId = localStorage.getItem("user_id") || "1"; // fallback "1" for testing

  // Inject modern UI styles (scoped to this page)
  useEffect(() => {
    const id = "umusanzu-fpr-modern-ui";
    if (document.getElementById(id)) return;

    const css = `
      .umusanzu-page {
        background: radial-gradient(circle at top left, #fee2e2 0, #f9fafb 40%, #ffffff 100%);
      }

      .umusanzu-shell {
        animation: umusanzu-fade-up 0.4s ease-out;
      }

      @keyframes umusanzu-fade-up {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .modern-card {
        border-radius: 22px;
        border: none !important;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(10px);
        box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
        transition: all 0.25s ease;
      }

      .modern-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 26px 65px rgba(15, 23, 42, 0.16);
      }

      .gradient-card-primary {
        background: linear-gradient(135deg, #ef4444 0%, #f97316 45%, #fbbf24 100%);
        color: #fefce8;
      }

      .gradient-card-primary .text-subtle {
        color: rgba(254, 252, 232, 0.8);
      }

      .header-card-icon {
        background: radial-gradient(circle at 30% 20%, #fecaca 0, #fee2e2 60%, #fee2e2 100%);
      }

      .btn-gradient-danger {
        background: linear-gradient(135deg, #ef4444 0%, #f97316 60%);
        border: none;
        color: #fef2f2;
        box-shadow: 0 14px 30px rgba(239, 68, 68, 0.35);
        transition: all 0.25s ease;
      }

      .btn-gradient-danger:hover {
        color: #fff;
        transform: translateY(-1px);
        box-shadow: 0 20px 40px rgba(239, 68, 68, 0.5);
      }

      .btn-gradient-danger:active {
        transform: translateY(0);
        box-shadow: 0 10px 24px rgba(239, 68, 68, 0.35);
      }

      .filter-pill-group .btn {
        border-radius: 999px !important;
        border-color: transparent;
        background: transparent;
        color: #6b7280;
        padding-inline: 0.9rem;
      }

      .filter-pill-group .btn.active {
        background: #111827;
        color: #f9fafb;
      }

      .filter-pill-group .btn:hover:not(.active) {
        background: #e5e7eb;
      }

      .glass-input .form-control {
        border-radius: 999px;
        background: rgba(249, 250, 251, 0.95);
        box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);
      }

      .glass-input .input-group-text {
        border-radius: 999px 0 0 999px;
        background: rgba(249, 250, 251, 0.9);
        border: none;
      }

      .modern-input {
        border-radius: 16px !important;
        border: 1px solid rgba(148, 163, 184, 0.5) !important;
        background: #f9fafb !important;
        box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.15);
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease,
          background-color 0.2s ease,
          transform 0.1s ease;
      }

      .modern-input::placeholder {
        color: transparent;
      }

      .modern-input:hover {
        background: #ffffff !important;
        box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.35);
      }

      .modern-input:focus {
        border-color: #fb7185 !important;
        box-shadow: 0 0 0 3px rgba(248, 113, 113, 0.25);
        background: #ffffff !important;
        transform: translateY(-1px);
      }

      .form-floating > .modern-input ~ label {
        color: #9ca3af;
        transition: color 0.2s ease, transform 0.2s ease;
      }

      .form-floating > .modern-input:focus ~ label {
        color: #fb7185;
      }

      .form-floating > .modern-input:not(:placeholder-shown) ~ label {
        opacity: 0.85;
      }

      .table-modern tbody tr {
        transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
      }

      .table-modern tbody tr:hover {
        background: rgba(239, 246, 255, 0.9);
        transform: translateY(-1px);
        box-shadow: 0 10px 28px rgba(15, 23, 42, 0.12);
      }

      .avatar-soft {
        box-shadow: 0 8px 18px rgba(248, 113, 113, 0.35);
      }

      .modern-modal {
        border-radius: 24px;
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
        animation: umusanzu-modal-pop 0.28s ease-out;
      }

      @keyframes umusanzu-modal-pop {
        from { opacity: 0; transform: translateY(10px) scale(0.96); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  // Fetch records for this user_id
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/${userId}`); // GET /umusanzu_fpr/:userId
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
  }, [userId]);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(
      () => setNotification({ show: false, message: "", type: "" }),
      4000
    );
  };

  const formatRWF = (amount) => {
    const num = Number(amount || 0);
    return new Intl.NumberFormat("rw-RW", {
      style: "currency",
      currency: "RWF",
    }).format(num);
  };

  const totalAmount = records.reduce(
    (acc, curr) => acc + Number(curr.amafaranga || 0),
    0
  );
  const totalContributors = records.length;
  const averageAmount =
    totalContributors > 0 ? totalAmount / totalContributors : 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // POST /umusanzu_fpr/:userId
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(`${API_URL}/${userId}`, form);
      setForm({ umuturage: "", amafaranga: "", itariki: "" });
      fetchRecords();
      showNotification("Umusanzu wakiriwe neza!", "success");
    } catch (err) {
      console.error("Save error:", err);
      showNotification("Ntibyakunze kubika. Ongera ugerageze.", "danger");
    } finally {
      setSubmitting(false);
    }
  };

  // date filters
  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isSameMonth = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();

  const filteredRecords = records.filter((record) => {
    const name = (record.umuturage || "").toLowerCase();
    const q = searchTerm.toLowerCase();
    if (q && !name.includes(q)) return false;

    if (!record.itariki) return filterRange === "all";

    const recDate = new Date(record.itariki);
    const today = new Date();

    if (filterRange === "today") return isSameDay(recDate, today);
    if (filterRange === "month") return isSameMonth(recDate, today);
    return true;
  });

  const openDetailModal = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };
  const closeDetailModal = () => {
    setSelectedRecord(null);
    setShowDetailModal(false);
  };

  return (
    <div className="umusanzu-page container-fluid py-4 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-11 umusanzu-shell">
          {/* Header + Stats */}
          <div className="row mb-4 g-3">
            <div className="col-md-6 col-lg-5">
              <div className="card modern-card h-100">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="header-card-icon p-3 rounded-circle text-danger me-3 d-flex align-items-center justify-content-center">
                    <i className="bi bi-flag-fill fs-3"></i>
                  </div>
                  <div>
                    <h2 className="fw-bold mb-1 text-dark">Umusanzu FPR</h2>
                    <p className="text-muted mb-0 small">
                      Gucunga imisanzu y&apos;abanyamuryango mu buryo bugezweho.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="col-md-6 col-lg-7">
              <div className="row g-3 h-100">
                <div className="col-sm-6">
                  <div className="card modern-card gradient-card-primary h-100">
                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="text-subtle text-uppercase fw-semibold mb-0 small">
                          Umusanzu Wose
                        </h6>
                        <i className="bi bi-graph-up-arrow fs-4 text-subtle"></i>
                      </div>
                      <h3 className="fw-bold mb-1">{formatRWF(totalAmount)}</h3>
                      <span className="small text-subtle">
                        Imisanzu yose yakiriwe kugeza ubu
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="card modern-card h-100">
                    <div className="card-body p-3 d-flex flex-column justify-content-between">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6 className="text-muted text-uppercase fw-semibold mb-0 small">
                          Abatanze imisanzu
                        </h6>
                        <i className="bi bi-people-fill text-primary fs-4"></i>
                      </div>
                      <h3 className="fw-bold mb-1">{totalContributors}</h3>
                      <span className="small text-muted">
                        Impuzandengo:{" "}
                        <span className="fw-semibold text-primary">
                          {formatRWF(averageAmount)}
                        </span>{" "}
                        ku muturage
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notification */}
          {notification.show && (
            <div
              className={`alert alert-${notification.type} alert-dismissible fade show shadow-sm border-0 rounded-3 mb-4`}
            >
              <i
                className={`bi ${
                  notification.type === "success"
                    ? "bi-check-circle-fill"
                    : "bi-exclamation-triangle-fill"
                } me-2`}
              ></i>
              {notification.message}
              <button
                type="button"
                className="btn-close"
                onClick={() =>
                  setNotification({ show: false, message: "", type: "" })
                }
              ></button>
            </div>
          )}

          <div className="row g-4">
            {/* Form */}
            <div className="col-lg-4">
              <div className="card modern-card h-100">
                <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
                  <h5 className="card-title fw-bold mb-0 text-danger">
                    <i className="bi bi-plus-circle me-2"></i>
                    Andika Umusanzu
                  </h5>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary rounded-pill d-flex align-items-center"
                    onClick={fetchRecords}
                    disabled={loading}
                  >
                    <i className="bi bi-arrow-clockwise me-1"></i>
                    <span className="d-none d-sm-inline">Refresh</span>
                  </button>
                </div>
                <div className="card-body p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                      <input
                        type="text"
                        className="form-control modern-input"
                        id="umuturage"
                        name="umuturage"
                        placeholder="Izina ry'Umuturage"
                        value={form.umuturage}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="umuturage">Izina ry&apos;Umuturage</label>
                    </div>

                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        className="form-control modern-input"
                        id="amafaranga"
                        name="amafaranga"
                        placeholder="Amafaranga (RWF)"
                        value={form.amafaranga}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="amafaranga">Amafaranga (RWF)</label>
                    </div>

                    <div className="form-floating mb-4">
                      <input
                        type="date"
                        className="form-control modern-input"
                        id="itariki"
                        name="itariki"
                        placeholder="Itariki y'Ubwishyu"
                        value={form.itariki}
                        onChange={handleChange}
                        required
                      />
                      <label htmlFor="itariki">Itariki y&apos;Ubwishyu</label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-danger w-100 py-3 rounded-3 fw-bold d-flex justify-content-center align-items-center"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Bireme...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Bika Umusanzu
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="col-lg-8">
              <div className="card modern-card h-100">
                <div className="card-header bg-white border-bottom-0 py-3 d-flex flex-wrap justify-content-between align-items-center gap-3">
                  <div>
                    <h5 className="card-title fw-bold mb-1">
                      <i className="bi bi-list-check me-2 text-primary"></i>
                      Raporo y&apos;Imisanzu
                    </h5>
                    <p className="text-muted small mb-0">
                      Reba imisanzu yose yishyuwe na buri muturage.
                    </p>
                  </div>

                  <div className="d-flex flex-wrap align-items-center gap-2">
                    <div
                      className="btn-group btn-group-sm filter-pill-group"
                      role="group"
                    >
                      <button
                        type="button"
                        className={`btn btn-outline-secondary ${
                          filterRange === "all" ? "active" : ""
                        }`}
                        onClick={() => setFilterRange("all")}
                      >
                        Byose
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-secondary ${
                          filterRange === "today" ? "active" : ""
                        }`}
                        onClick={() => setFilterRange("today")}
                      >
                        Uyu munsi
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline-secondary ${
                          filterRange === "month" ? "active" : ""
                        }`}
                        onClick={() => setFilterRange("month")}
                      >
                        Uku kwezi
                      </button>
                    </div>

                    <div
                      className="input-group input-group-sm glass-input"
                      style={{ maxWidth: "260px" }}
                    >
                      <span className="input-group-text border-0">
                        <i className="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0"
                        placeholder="Shakisha umuturage..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover table-modern align-middle mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="ps-4 text-muted text-uppercase fs-7 fw-bold border-0 py-3">
                            Umuturage
                          </th>
                          <th className="text-muted text-uppercase fs-7 fw-bold border-0 py-3">
                            Amafaranga
                          </th>
                          <th className="text-muted text-uppercase fs-7 fw-bold border-0 py-3">
                            Itariki
                          </th>
                          <th className="text-center text-muted text-uppercase fs-7 fw-bold border-0 py-3">
                            Ibindi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="4" className="text-center py-5">
                              <div
                                className="spinner-border text-danger"
                                role="status"
                              >
                                <span className="visually-hidden">
                                  Loading...
                                </span>
                              </div>
                              <p className="text-muted mt-2">
                                Tegereza gato...
                              </p>
                            </td>
                          </tr>
                        ) : filteredRecords.length === 0 ? (
                          <tr>
                            <td
                              colSpan="4"
                              className="text-center py-5 text-muted"
                            >
                              <i className="bi bi-clipboard-x fs-1 opacity-50 mb-2 d-block"></i>
                              Nta makuru yabonetse
                            </td>
                          </tr>
                        ) : (
                          filteredRecords.map((row) => (
                            <tr
                              key={row.id}
                              style={{ cursor: "pointer" }}
                              className="align-middle"
                              onClick={() => openDetailModal(row)}
                            >
                              <td className="ps-4">
                                <div className="d-flex align-items-center">
                                  <div
                                    className="avatar-sm bg-danger bg-opacity-10 text-danger rounded-circle d-flex align-items-center justify-content-center fw-bold me-2 avatar-soft"
                                    style={{
                                      width: "32px",
                                      height: "32px",
                                      transition: "all 0.25s ease",
                                    }}
                                  >
                                    {row.umuturage
                                      ?.charAt(0)
                                      .toUpperCase()}
                                  </div>
                                  <span className="fw-semibold">
                                    {row.umuturage}
                                  </span>
                                </div>
                              </td>
                              <td className="fw-bold text-success">
                                {formatRWF(row.amafaranga)}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border fw-normal">
                                  <i className="bi bi-calendar3 me-1"></i>
                                  {row.itariki}
                                </span>
                              </td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-light rounded-circle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openDetailModal(row);
                                  }}
                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-footer bg-white border-top-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Ibyabonetse:{" "}
                      <strong>{filteredRecords.length}</strong> /{" "}
                      {records.length}
                    </small>
                    <small className="text-muted">
                      Umusanzu wose:{" "}
                      <strong className="text-success">
                        {formatRWF(totalAmount)}
                      </strong>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Modal */}
          {showDetailModal && selectedRecord && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
              onClick={(e) =>
                e.target.classList.contains("modal") && closeDetailModal()
              }
            >
              <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content modern-modal border-0">
                  <div className="modal-header border-0">
                    <h5 className="modal-title fw-bold">
                      <i className="bi bi-receipt-cutoff text-danger me-2"></i>
                      Ibisobanuro by&apos;Umusanzu
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={closeDetailModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <span className="text-muted small d-block mb-1">
                          Umuturage
                        </span>
                        <div className="d-flex align-items-center">
                          <div
                            className="bg-danger bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center text-danger fw-bold me-3"
                            style={{ width: "40px", height: "40px" }}
                          >
                            {selectedRecord.umuturage
                              ?.charAt(0)
                              .toUpperCase()}
                          </div>
                          <span className="fw-semibold">
                            {selectedRecord.umuturage}
                          </span>
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <span className="text-muted small d-block mb-1">
                          Amafaranga yatanze
                        </span>
                        <span className="badge bg-light text-success border px-3 py-2">
                          <i className="bi bi-cash-coin me-1"></i>
                          {formatRWF(selectedRecord.amafaranga)}
                        </span>
                      </div>

                      <div className="col-sm-6">
                        <span className="text-muted small d-block mb-1">
                          Itariki y&apos;ubwishyu
                        </span>
                        <div className="d-flex align-items-center text-muted small">
                          <i className="bi bi-calendar3 me-2"></i>
                          {selectedRecord.itariki}
                        </div>
                      </div>

                      <div className="col-12">
                        <span className="text-muted small d-block mb-1">
                          ID y&apos;inyandiko
                        </span>
                        <span className="fw-semibold">
                          #{selectedRecord.id}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer border-0">
                    <button
                      type="button"
                      className="btn btn-secondary rounded-pill"
                      onClick={closeDetailModal}
                    >
                      Funga
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