import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/message";

export default function Message() {
  const [form, setForm] = useState({
    text_user: "",
    user_id: "",
  });

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ show: false, type: "", msg: "" });

  // Inject Modern CSS (unchanged)
  useEffect(() => {
    const id = "message-modern-ui";
    if (document.getElementById(id)) return;

    const css = `
      .message-page {
        background: radial-gradient(circle at top center, #e0f2fe 0%, #f0f9ff 40%, #ffffff 100%);
      }
      .message-shell {
        animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .modern-card {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.5);
        border-radius: 24px;
        box-shadow: 0 10px 30px -5px rgba(14, 165, 233, 0.08);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .modern-card:hover {
        box-shadow: 0 20px 40px -5px rgba(14, 165, 233, 0.12);
      }
      .gradient-header {
        background: linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%);
        color: white;
      }
      .btn-gradient-ocean {
        background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
        border: none;
        color: white;
        border-radius: 16px;
        box-shadow: 0 8px 16px -4px rgba(14, 165, 233, 0.3);
        transition: all 0.2s;
      }
      .btn-gradient-ocean:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 20px -4px rgba(14, 165, 233, 0.4);
        color: white;
      }
      .btn-gradient-ocean:active {
        transform: translateY(0);
      }
      .modern-input .form-control {
        border-radius: 16px;
        background: #f8fafc;
        border: 2px solid #f1f5f9;
        transition: all 0.2s;
      }
      .modern-input .form-control:focus {
        background: white;
        border-color: #38bdf8;
        box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1);
      }
      .message-item {
        border-left: 4px solid transparent;
        transition: all 0.2s;
      }
      .message-item:hover {
        background: #f0f9ff;
        border-left-color: #0ea5e9;
        transform: translateX(4px);
      }
      .avatar-circle {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
        background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
      }
      .avatar-active {
        background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
        box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
      }
      .custom-scroll::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 10px;
      }
      .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
    `;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  // Fetch messages (optionally filtered by user_id)
  const fetchMessages = async (filterUserId) => {
    try {
      setLoading(true);

      const params = filterUserId ? { user_id: filterUserId } : {};
      const res = await axios.get(API_URL, { params });

      const sorted = res.data ? res.data.sort((a, b) => b.id - a.id) : [];
      setMessages(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Ikibazo mu gushaka ubutumwa.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load: all messages
    fetchMessages();
  }, []);

  const showToast = (msg, type) => {
    setStatus({ show: true, type, msg });
    setTimeout(() => setStatus({ show: false, type: "", msg: "" }), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await axios.post(API_URL, form); // POST /message with text_user & user_id
      const currentUserFilter = form.user_id || undefined;

      setForm({ text_user: "", user_id: form.user_id }); // keep user_id in field, clear text
      // After sending, reload messages for this user_id (data selected according user_id)
      fetchMessages(currentUserFilter);

      showToast("Ubutumwa bwoherejwe neza!", "success");
    } catch (err) {
      console.error("Save error:", err);
      showToast("Byanze kohereza.", "danger");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="message-page container-fluid py-4 min-vh-100 font-sans">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10 message-shell">
          {/* Header Card */}
          <div className="modern-card p-4 mb-4 d-flex flex-column flex-md-row align-items-center justify-content-between">
            <div className="d-flex align-items-center mb-3 mb-md-0">
              <div
                className="rounded-circle gradient-header p-3 me-3 shadow-sm d-flex align-items-center justify-content-center"
                style={{ width: 64, height: 64 }}
              >
                <i className="bi bi-chat-quote-fill fs-3"></i>
              </div>
              <div>
                <h2 className="fw-bold mb-0 text-dark">Ibitekerezo</h2>
                <p className="text-muted mb-0">
                  Tanga ibitekerezo cyangwa ubutumwa bwihuse.
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center gap-3">
              <div className="text-end d-none d-md-block">
                <small
                  className="text-muted d-block text-uppercase fw-bold"
                  style={{ fontSize: "0.7rem" }}
                >
                  Total Messages
                </small>
                <span className="fs-4 fw-bold text-primary">
                  {messages.length}
                </span>
              </div>
              <button
                className="btn btn-light rounded-circle shadow-sm"
                onClick={() => fetchMessages(form.user_id || undefined)}
                title="Refresh"
                style={{ width: 45, height: 45 }}
              >
                <i
                  className={`bi bi-arrow-clockwise ${
                    loading ? "d-inline-block fa-spin" : ""
                  }`}
                ></i>
              </button>
            </div>
          </div>

          <div className="row g-4">
            {/* Compose Area */}
            <div className="col-lg-4 order-lg-1 order-2">
              <div
                className="modern-card h-100 position-sticky"
                style={{ top: "20px" }}
              >
                <div className="p-4 border-bottom border-light">
                  <h5 className="fw-bold mb-0 text-primary">
                    <i className="bi bi-pencil-square me-2"></i>
                    Andika Hano
                  </h5>
                  <small className="text-muted d-block mt-1">
                    Niba ushaka kureba ubutumwa bwa user runaka, shyiramo
                    <strong> User ID</strong> mbere yo kubona inbox.
                  </small>
                </div>
                <div className="p-4">
                  <form onSubmit={handleSubmit}>
                    <div className="form-floating modern-input mb-3">
                      <textarea
                        className="form-control"
                        placeholder="Andika ubutumwa..."
                        id="text_user"
                        name="text_user"
                        value={form.text_user}
                        onChange={handleChange}
                        required
                        style={{ height: "180px", resize: "none" }}
                      ></textarea>
                      <label htmlFor="text_user">Ubutumwa bwawe...</label>
                    </div>

                    <div className="form-floating modern-input mb-4">
                      <input
                        type="number"
                        className="form-control"
                        id="user_id"
                        name="user_id"
                        placeholder="ID"
                        value={form.user_id}
                        onChange={handleChange}
                      />
                      <label htmlFor="user_id">User ID (Optional)</label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient-ocean w-100 py-3 fw-bold d-flex align-items-center justify-content-center"
                      disabled={sending || !form.text_user.trim()}
                    >
                      {sending ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Biroherezwa...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i> Ohereza
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Message Feed */}
            <div className="col-lg-8 order-lg-2 order-1">
              <div
                className="modern-card h-100 overflow-hidden d-flex flex-column"
                style={{ maxHeight: "800px" }}
              >
                <div className="p-4 border-bottom border-light bg-white bg-opacity-50">
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-collection me-2 text-primary"></i>
                    Ubutumwa Buheruka{" "}
                    {form.user_id && (
                      <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-2">
                        User #{form.user_id}
                      </span>
                    )}
                  </h5>
                </div>

                <div className="flex-grow-1 overflow-auto custom-scroll p-3">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      ></div>
                      <p className="text-muted mt-2 small">Loading feed...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-5">
                      <div className="bg-light rounded-circle d-inline-flex p-4 mb-3">
                        <i className="bi bi-chat-square-dots fs-1 text-muted opacity-25"></i>
                      </div>
                      <h6 className="text-muted">Nta butumwa buraboneka</h6>
                      <p className="small text-muted">
                        Ba uwa mbere mu gutanga igitekerezo!
                      </p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className="message-item p-4 rounded-4 bg-white border border-light shadow-sm position-relative"
                        >
                          <div className="d-flex gap-3">
                            <div className="flex-shrink-0">
                              <div
                                className={`avatar-circle ${
                                  m.user_id ? "avatar-active" : ""
                                }`}
                              >
                                <i
                                  className={`bi ${
                                    m.user_id ? "bi-person-fill" : "bi-person"
                                  }`}
                                ></i>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                  <h6 className="fw-bold mb-0 text-dark">
                                    {m.user_id
                                      ? `User #${m.user_id}`
                                      : "Anonymous"}
                                  </h6>
                                  <small
                                    className="text-muted"
                                    style={{ fontSize: "0.75rem" }}
                                  >
                                    Message ID: {m.id}
                                  </small>
                                </div>
                              </div>
                              <div
                                className="bg-light p-3 rounded-4 rounded-top-0 text-secondary"
                                style={{ lineHeight: "1.6" }}
                              >
                                {m.text_user}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Toast Notification */}
          {status.show && (
            <div
              className="position-fixed bottom-0 end-0 p-4"
              style={{ zIndex: 1050 }}
            >
              <div
                className={`toast show border-0 shadow-lg align-items-center text-white bg-${
                  status.type === "success" ? "success" : "danger"
                }`}
              >
                <div className="d-flex">
                  <div className="toast-body px-4 py-3 fw-medium">
                    <i
                      className={`bi ${
                        status.type === "success"
                          ? "bi-check-circle-fill"
                          : "bi-exclamation-triangle-fill"
                      } me-2`}
                    ></i>
                    {status.msg}
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