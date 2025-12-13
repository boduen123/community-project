import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Placeholder imports (Replace with your actual file paths)
import Abayobozi from "./Abayobozi";
import IbikorwaRaporo from "./IbikorwaRaporo";
import ImiberehoMyiza from "./ImiberehoMyiza";
import Ingo from "./Ingo";
import Isibo from "./Isibo";
import Ubukungu from "./Ubukungu";
import Uburezi from "./Uburezi";
import Ubuzima from "./Ubuzima";
import Abaturage from "./Abaturage";

// ===== NEW IMPORTS =====
// Umusanzu imports removed as requested
import Message from "./Message";
import AbaturageBafiteInkunguzaleta from "./AbaturageBafiteInkunguzaleta";

/* ===== Enhanced Global Styles ===== */
const GlobalStyles = () => {
  useEffect(() => {
    const id = "umudugudu-dashboard-styles";
    if (document.getElementById(id)) return;

    const css = `
/* ========== CSS Variables ========== */
:root {
  --nav-h: 64px;
  --sidebar-w: 280px;
  --sidebar-w-collapsed: 80px;

  --bg: #f5f7fa;
  --card-bg: #ffffff;
  --text: #1a202c;
  --muted: #718096;

  --brand: #0d6efd;
  --brand-hover: #0b5ed7;
  --brand-light: #e7f1ff;
  --accent: #ffbf00;
  
  --success: #10b981;
  --danger: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;

  --border: #e2e8f0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.06);
  --shadow: 0 4px 6px -1px rgba(0,0,0,.1), 0 2px 4px -1px rgba(0,0,0,.06);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -2px rgba(0,0,0,.05);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,.1), 0 10px 10px -5px rgba(0,0,0,.04);

  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========== Base Styles ========== */
html, body, #root { 
  height: 100%; 
  margin: 0;
  padding: 0;
}

body { 
  background: var(--bg); 
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  overflow-x: hidden;
}

.dashboard-container { 
  padding-top: var(--nav-h);
  min-height: 100vh;
}

* {
  box-sizing: border-box;
}

/* ========== Enhanced Navbar ========== */
.navbar {
  height: var(--nav-h);
  backdrop-filter: saturate(180%) blur(20px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  box-shadow: var(--shadow-lg);
  border-bottom: 1px solid rgba(255,255,255,.1);
  transition: var(--transition);
  z-index: 1030;
}

.navbar-brand {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  transition: var(--transition);
}

.navbar-brand:hover {
  transform: translateY(-1px);
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255,255,255,.3) 0%, rgba(255,255,255,.1) 100%);
  backdrop-filter: blur(10px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 900;
  font-size: 1.25rem;
  letter-spacing: 1px;
  box-shadow: 0 8px 16px rgba(0,0,0,.2);
  margin-right: .75rem;
  transition: var(--transition);
  border: 2px solid rgba(255,255,255,.2);
}

.navbar-brand:hover .brand-logo {
  transform: translateY(-2px) rotate(5deg) scale(1.05);
  box-shadow: 0 12px 24px rgba(0,0,0,.3);
}

.nav-time-display {
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(10px);
  padding: .5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,.2);
  transition: var(--transition);
}

.nav-time-display:hover {
  background: rgba(255,255,255,.25);
  transform: translateY(-1px);
}

/* ========== Enhanced Sidebar ========== */
.sidebar {
  position: fixed;
  top: var(--nav-h);
  left: 0;
  width: var(--sidebar-w);
  height: calc(100vh - var(--nav-h));
  border-right: 1px solid var(--border);
  background: var(--card-bg);
  overflow-x: hidden;
  overflow-y: auto;
  transition: var(--transition);
  z-index: 1020;
  box-shadow: var(--shadow);
}

.sidebar.collapsed { 
  width: var(--sidebar-w-collapsed); 
}

.sidebar-header {
  position: sticky;
  top: 0;
  background: var(--card-bg);
  z-index: 10;
  padding: 1.25rem;
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(10px);
}

.sidebar-header h5 {
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin: 0;
  transition: var(--transition);
}

.sidebar.collapsed .sidebar-header h5 {
  opacity: 0;
  transform: scale(0);
}

.sidebar .nav-link {
  color: var(--text);
  padding: .875rem 1rem;
  margin: .25rem .5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: .95rem;
  display: flex;
  align-items: center;
  gap: .75rem;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.sidebar .nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: var(--brand);
  transform: scaleY(0);
  transition: var(--transition);
}

.sidebar .nav-link .bi {
  font-size: 1.25rem;
  color: var(--muted);
  transition: var(--transition);
  min-width: 24px;
}

.sidebar .nav-link:hover {
  background: var(--brand-light);
  color: var(--brand);
  transform: translateX(4px);
}

.sidebar .nav-link:hover .bi {
  color: var(--brand);
  transform: scale(1.1);
}

.sidebar .nav-link.active {
  background: linear-gradient(135deg, var(--brand-light) 0%, rgba(13, 110, 253, .05) 100%);
  color: var(--brand);
  box-shadow: var(--shadow-sm);
}

.sidebar .nav-link.active::before {
  transform: scaleY(1);
}

.sidebar .nav-link.active .bi {
  color: var(--brand);
}

.sidebar.collapsed .nav-link {
  justify-content: center;
  padding: 1rem;
}

.sidebar.collapsed .nav-link .nav-link-text {
  opacity: 0;
  width: 0;
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
}

.sidebar-footer {
  position: sticky;
  bottom: 0;
  background: var(--card-bg);
  border-top: 1px solid var(--border);
  padding: 1rem;
  backdrop-filter: blur(10px);
}

/* Navigation badge for notifications */
.nav-badge {
  position: absolute;
  top: 8px;
  right: 12px;
  background: var(--danger);
  color: white;
  font-size: .7rem;
  font-weight: 700;
  padding: .2rem .4rem;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(239, 68, 68, .4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .7; }
}

/* ========== Main Content ========== */
.main-content {
  margin-left: var(--sidebar-w);
  min-height: calc(100vh - var(--nav-h));
  transition: var(--transition);
  background: var(--bg);
  padding: 2rem;
}

.sidebar.collapsed ~ .main-content { 
  margin-left: var(--sidebar-w-collapsed); 
}

/* ========== Enhanced Cards ========== */
.card {
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  background: var(--card-bg);
  overflow: hidden;
}

.card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(135deg, rgba(13, 110, 253, .05) 0%, rgba(13, 110, 253, .02) 100%);
  border-bottom: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  font-weight: 700;
}

.card-title {
  color: var(--text);
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0;
}

/* ========== Dashboard Overview Cards ========== */
.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(90deg, var(--brand) 0%, var(--info) 100%);
}

.stat-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  margin-bottom: 1rem;
  transition: var(--transition);
}

.stat-card:hover .stat-icon {
  transform: scale(1.1) rotate(5deg);
}

/* ========== Enhanced Buttons ========== */
.btn {
  border-radius: 10px;
  font-weight: 600;
  padding: .625rem 1.25rem;
  transition: var(--transition);
  border: none;
  box-shadow: var(--shadow-sm);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%);
}

.btn-success {
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
}

.btn-danger {
  background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
}

.btn-warning {
  background: linear-gradient(135deg, var(--warning) 0%, #d97706 100%);
  color: white;
}

.btn-info {
  background: linear-gradient(135deg, var(--info) 0%, #2563eb 100%);
  color: white;
}

.btn-outline-primary:hover {
  background: var(--brand);
  border-color: var(--brand);
}

/* ========== User Dropdown ========== */
.user-dropdown-btn {
  background: rgba(255,255,255,.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.2);
  border-radius: 50px;
  padding: .5rem 1rem;
  transition: var(--transition);
}

.user-dropdown-btn:hover {
  background: rgba(255,255,255,.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,.15);
}

.avatar {
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
  transition: var(--transition);
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,.25);
}

.dropdown-menu {
  border: none;
  border-radius: 16px;
  box-shadow: var(--shadow-xl);
  padding: .5rem;
  min-width: 280px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  border-radius: 8px;
  padding: .75rem 1rem;
  font-weight: 500;
  transition: var(--transition);
  margin: .125rem 0;
}

.dropdown-item:hover {
  background: var(--brand-light);
  color: var(--brand);
  transform: translateX(4px);
}

.dropdown-divider {
  margin: .5rem 0;
  border-color: var(--border);
}

/* ========== Payment Section ========== */
.payment-code {
  font-family: 'Courier New', monospace;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: #10b981;
  padding: .75rem 1.25rem;
  border-radius: 10px;
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: 2px;
  box-shadow: var(--shadow);
  border: 1px solid rgba(16, 185, 129, .3);
}

.copy-badge {
  padding: .375rem .75rem;
  border-radius: 8px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  color: #065f46;
  font-size: .875rem;
  font-weight: 700;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

/* ========== Modal Enhancements ========== */
.modal-content {
  border: none;
  border-radius: 20px;
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.modal-header {
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 2rem;
}

.modal-body {
  padding: 2rem;
}

.modal-footer {
  border-top: 1px solid var(--border);
  padding: 1.25rem 2rem;
}

/* ========== Toast Notifications ========== */
.toast {
  border-radius: 14px;
  box-shadow: var(--shadow-lg);
  border: none;
  overflow: hidden;
  animation: slideInRight 0.4s ease;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-header {
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-hover) 100%);
  border: none;
  font-weight: 600;
}

.toast-body {
  padding: 1.25rem;
  font-size: .95rem;
}

/* ========== Loading States ========== */
.spinner-border {
  border-width: 3px;
}

/* ========== Custom Scrollbar ========== */
.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
  transition: var(--transition);
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* ========== Responsive Design ========== */
@media (max-width: 1200px) {
  .main-content {
    padding: 1.5rem;
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: var(--sidebar-w-collapsed);
  }
  
  .main-content {
    margin-left: var(--sidebar-w-collapsed);
    padding: 1rem;
  }
  
  .nav-time-display {
    display: none !important;
  }
}

@media (max-width: 768px) {
  :root {
    --nav-h: 56px;
  }
  
  .navbar-brand {
    font-size: 1.125rem;
  }
  
  .brand-logo {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.show {
    transform: translateX(0);
  }
  
  .main-content {
    margin-left: 0;
  }
}

/* ========== Print Styles ========== */
@media print {
  body {
    background: white;
  }
  
  .navbar,
  .sidebar,
  .toast-container,
  .dropdown-menu,
  .btn,
  .user-dropdown-btn {
    display: none !important;
  }
  
  .main-content {
    margin: 0;
    padding: 0;
  }
  
  .card {
    border: 1px solid #ddd;
    box-shadow: none;
    page-break-inside: avoid;
  }
}

/* ========== Utility Classes ========== */
.text-gradient {
  background: linear-gradient(135deg, var(--brand) 0%, var(--info) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  background: rgba(255, 255, 255, .7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, .2);
}

.hover-lift {
  transition: var(--transition);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
    `;

    const style = document.createElement("style");
    style.id = id;
    style.innerHTML = css;
    document.head.appendChild(style);
  }, []);

  return null;
};

/* ===== Enhanced Dashboard Overview ===== */
const DashboardOverview = ({ user }) => {
  const stats = [
    {
      title: "Abaturage",
      value: "1,234",
      change: "+12%",
      icon: "bi-people-fill",
      color: "#0d6efd",
      bgColor: "rgba(13, 110, 253, .1)",
    },
    {
      title: "Ingo",
      value: "456",
      change: "+8%",
      icon: "bi-house-door-fill",
      color: "#10b981",
      bgColor: "rgba(16, 185, 129, .1)",
    },
    {
      title: "Raporo",
      value: "89",
      change: "+23%",
      icon: "bi-file-earmark-text-fill",
      color: "#f59e0b",
      bgColor: "rgba(245, 158, 11, .1)",
    },
    {
      title: "Abayobozi",
      value: "12",
      change: "0%",
      icon: "bi-person-workspace",
      color: "#8b5cf6",
      bgColor: "rgba(139, 92, 246, .1)",
    },
  ];

  const recentActivities = [
    { action: "Umuturage mushya yashyizwemo", time: "Saa 2 ishize", icon: "bi-person-plus", color: "success" },
    { action: "Raporo nshya yashyizwemo", time: "Saa 5 ishize", icon: "bi-file-earmark-plus", color: "primary" },
    { action: "Urugo rushya rwanditswe", time: "Ejo", icon: "bi-house-add", color: "info" },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-gradient mb-2">
          Murakaza neza, {user?.name}!
        </h2>
        <p className="text-muted">
          <i className="bi bi-calendar-event me-2"></i>
          {new Date().toLocaleDateString("rw-RW", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-4">
        {stats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="stat-card hover-lift">
              <div
                className="stat-icon"
                style={{ background: stat.bgColor, color: stat.color }}
              >
                <i className={`bi ${stat.icon}`}></i>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h3 className="mb-0 fw-bold">{stat.value}</h3>
                <span className="badge bg-success bg-opacity-10 text-success">
                  {stat.change}
                </span>
              </div>
              <p className="text-muted mb-0 small fw-600">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card hover-lift h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
                Ibikorwa Byihuse
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6 col-md-4">
                  <button className="btn btn-outline-primary w-100 py-3">
                    <i className="bi bi-person-plus-fill d-block fs-3 mb-2"></i>
                    <small>Ongeraho Umuturage</small>
                  </button>
                </div>
                <div className="col-6 col-md-4">
                  <button className="btn btn-outline-success w-100 py-3">
                    <i className="bi bi-house-add-fill d-block fs-3 mb-2"></i>
                    <small>Ongeraho Urugo</small>
                  </button>
                </div>
                <div className="col-6 col-md-4">
                  <button className="btn btn-outline-info w-100 py-3">
                    <i className="bi bi-file-earmark-plus-fill d-block fs-3 mb-2"></i>
                    <small>Andika Raporo</small>
                  </button>
                </div>
                <div className="col-6 col-md-4">
                  <button className="btn btn-outline-warning w-100 py-3">
                    <i className="bi bi-bar-chart-fill d-block fs-3 mb-2"></i>
                    <small>Reba Imibare</small>
                  </button>
                </div>
                <div className="col-6 col-md-4">
                  <button className="btn btn-outline-danger w-100 py-3">
                    <i className="bi bi-printer-fill d-block fs-3 mb-2"></i>
                    <small>Icapiro</small>
                  </button>
                </div>
                <div className="col-6 col-md-4">
                  <button className="btn btn-outline-secondary w-100 py-3">
                    <i className="bi bi-gear-fill d-block fs-3 mb-2"></i>
                    <small>Igenamiterere</small>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card hover-lift h-100">
            <div className="card-header">
              <h5 className="card-title mb-0">
                <i className="bi bi-clock-history me-2 text-info"></i>
                Ibikorwa Biheruka
              </h5>
            </div>
            <div className="card-body">
              <div className="activity-timeline">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="d-flex mb-3 pb-3 border-bottom">
                    <div
                      className={`bg-${activity.color} bg-opacity-10 rounded-circle p-2 me-3`}
                      style={{ width: "40px", height: "40px" }}
                    >
                      <i className={`bi ${activity.icon} text-${activity.color} d-block text-center`}></i>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-600">{activity.action}</p>
                      <small className="text-muted">
                        <i className="bi bi-clock me-1"></i>
                        {activity.time}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn btn-sm btn-outline-primary w-100 mt-2">
                Reba byose
                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== Enhanced Payment Report Component ===== */
const PaymentReport = () => {
  const paymentCode = "1759342";
  const bankAccount = "XXX-XXXX-XXXX (Shyiramo konti nyayo ya banki yawe)";
  const phone = "0792652471";
  const serviceFee = 2000; 
  const period = "Buri kwezi";
  const [copied, setCopied] = useState(false);

  const currency = new Intl.NumberFormat("rw-RW", {
    style: "currency",
    currency: "RWF",
    maximumFractionDigits: 0,
  });

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentCode);
      setCopied(true);
    } catch {
      const el = document.createElement("textarea");
      el.value = paymentCode;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
    } finally {
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayment = (gateway) => {
    alert(
      `Kwishyura ukoresheje ${gateway} birimo gutangira...\nCode: ${paymentCode}\nAmafaranga: ${serviceFee} RWF`
    );
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="fw-bold text-gradient">
          <i className="bi bi-credit-card-2-front me-2"></i>
          Kwishyura - Raporo y'ibanze
        </h2>
        <p className="text-muted">
          Hitamo uburyo bwo kwishyura ukoresheje Emutiyene cyangwa Eyateri.
        </p>
      </div>

      <div className="card hover-lift">
        <div className="card-header">
          <h5 className="card-title mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Amakuru y'ubwishyu
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="glass-effect p-3 rounded-3">
                <label className="fw-bold mb-2 d-block text-muted small">Code y'ubwishyu</label>
                <div className="d-flex align-items-center gap-2">
                  <span className="payment-code flex-grow-1">{paymentCode}</span>
                  <button
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                    onClick={copyCode}
                  >
                    <i className="bi bi-clipboard"></i>
                    <span className="d-none d-md-inline">Kopya</span>
                  </button>
                </div>
                {copied && (
                  <div className="copy-badge mt-2" role="alert">
                    <i className="bi bi-check-circle me-1"></i>
                    Byakopijwe!
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-effect p-3 rounded-3">
                <label className="fw-bold mb-2 d-block text-muted small">Konti ya banki</label>
                <p className="mb-0">{bankAccount}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-effect p-3 rounded-3">
                <label className="fw-bold mb-2 d-block text-muted small">
                  Ufite ikibazo? Hamagara
                </label>
                <p className="mb-0">
                  <i className="bi bi-telephone-fill me-2 text-success"></i>
                  {phone}
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="glass-effect p-3 rounded-3">
                <label className="fw-bold mb-2 d-block text-muted small">
                  Amafaranga y'iserivisi
                </label>
                <p className="mb-0 fs-4 fw-bold text-primary">
                  {currency.format(serviceFee)}
                  <span className="text-muted fs-6 fw-normal ms-2">({period})</span>
                </p>
              </div>
            </div>
          </div>

          <hr className="my-4" />

          <div>
            <h6 className="fw-bold mb-3">
              <i className="bi bi-wallet2 me-2"></i>
              Hitamo uburyo bwo kwishyura:
            </h6>
            <div className="row g-3">
              <div className="col-md-6">
                <button
                  className="btn btn-warning w-100 py-3 hover-lift"
                  onClick={() => handlePayment("Emutiyene")}
                >
                  <i className="bi bi-phone-fill fs-3 d-block mb-2"></i>
                  <span className="fw-bold">Emutiyene Pay</span>
                </button>
              </div>
              <div className="col-md-6">
                <button
                  className="btn btn-info text-white w-100 py-3 hover-lift"
                  onClick={() => handlePayment("Eyateri")}
                >
                  <i className="bi bi-wallet2 fs-3 d-block mb-2"></i>
                  <span className="fw-bold">Eyateri Pay</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 d-flex gap-2 justify-content-end">
            <button className="btn btn-outline-secondary" onClick={() => window.print()}>
              <i className="bi bi-printer me-2"></i>
              Icapiro
            </button>
            <button className="btn btn-outline-primary">
              <i className="bi bi-download me-2"></i>
              Koborora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== Main Dashboard Component ===== */
const Dashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWelcomeToast, setShowWelcomeToast] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const onPopState = () => {
      const token = localStorage.getItem("token");
      if (!token) navigate("/", { replace: true });
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcomeToast(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (showUserMenu && !e.target.closest(".dropdown")) {
        setShowUserMenu(false);
      }
    };
    const onEsc = (e) => {
      if (e.key === "Escape") {
        setShowUserMenu(false);
        setShowLogoutModal(false);
        setIsMobileSidebarOpen(false);
      }
    };
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [showUserMenu, showLogoutModal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    setShowLogoutModal(false);
    navigate("/", { replace: true });
  };

  const tabContent = [
    {
      key: "overview",
      label: "Muri rusange",
      icon: "bi-house-fill",
      content: () => <DashboardOverview user={user} />,
      badge: null,
    },
    { key: "abaturage", label: "Abaturage", icon: "bi-people-fill", content: () => <Abaturage />, badge: "1234" },
    { key: "ingo", label: "Ingo", icon: "bi-house-door-fill", content: () => <Ingo />, badge: "456" },
    { key: "abayobozi", label: "Abayobozi", icon: "bi-person-workspace", content: () => <Abayobozi />, badge: "12" },
    { key: "raporo", label: "Raporo", icon: "bi-file-earmark-text-fill", content: () => <IbikorwaRaporo />, badge: "89" },
    { key: "imibereho", label: "Imibereho Myiza", icon: "bi-heart-fill", content: () => <ImiberehoMyiza /> },
    { key: "isibo", label: "Isibo", icon: "bi-geo-alt-fill", content: () => <Isibo /> },
    { key: "ubukungu", label: "Ubukungu", icon: "bi-currency-exchange", content: () => <Ubukungu /> },
    { key: "uburezi", label: "Uburezi", icon: "bi-mortarboard-fill", content: () => <Uburezi /> },
    { key: "ubuzima", label: "Ubuzima", icon: "bi-heart-pulse-fill", content: () => <Ubuzima /> },
    // ===== NAVIGATION ITEMS UPDATED =====
    // Removed FPR and Ejo Heza from navigation list
    { key: "inkunga", label: "Inkunga za Leta", icon: "bi-gift-fill", content: () => <AbaturageBafiteInkunguzaleta /> },
    { key: "message", label: "Ubutumwa", icon: "bi-chat-dots-fill", content: () => <Message /> },
    // ===========================================
    { key: "payment", label: "Kwishyura", icon: "bi-credit-card-2-front-fill", content: () => <PaymentReport /> },
  ];

  const selectedTab = tabContent.find((tab) => tab.key === activeTab);

  return (
    <div className="dashboard-container">
      <GlobalStyles />

      {/* Enhanced Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container-fluid px-4">
          <button
            className="btn btn-sm btn-outline-light me-3 d-lg-inline-block"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? "Gukingura sidebar" : "Gufunga sidebar"}
          >
            <i className={`bi bi-${isSidebarCollapsed ? "chevron-right" : "chevron-left"}`}></i>
          </button>

          <button
            className="btn btn-sm btn-outline-light me-3 d-lg-none"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            aria-label="Toggle mobile sidebar"
          >
            <i className="bi bi-list"></i>
          </button>

          <span className="navbar-brand fw-bold d-flex align-items-center mb-0">
            <span className="brand-logo">U</span>
            <span className="d-none d-md-inline">Umudugudu Dashboard</span>
            <span className="d-inline d-md-none">Dashboard</span>
          </span>

          <div className="d-flex align-items-center ms-auto gap-3">
            <div className="nav-time-display text-white text-end d-none d-lg-block">
              <div className="fw-bold">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</div>
              <small className="opacity-75">
                {currentTime.toLocaleDateString("rw-RW", { month: "short", day: "numeric" })}
              </small>
            </div>

            {user && (
              <div className="dropdown">
                <button
                  className="btn user-dropdown-btn d-flex align-items-center gap-2"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-expanded={showUserMenu}
                >
                  <div
                    className="avatar bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold"
                    style={{ width: "36px", height: "36px" }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="d-none d-md-inline text-white fw-600">{user.name}</span>
                  <i className="bi bi-chevron-down text-white"></i>
                </button>

                {showUserMenu && (
                  <div className="dropdown-menu dropdown-menu-end show mt-2">
                    <div className="p-3 border-bottom">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{ width: "48px", height: "48px" }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h6 className="mb-0 fw-bold">{user.name}</h6>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <button className="dropdown-item">
                        <i className="bi bi-person me-2"></i>
                        Konti yange
                      </button>
                      <button className="dropdown-item">
                        <i className="bi bi-gear me-2"></i>
                        Igenamiterere
                      </button>
                      <button className="dropdown-item">
                        <i className="bi bi-bell me-2"></i>
                        Imenyesha
                        <span className="badge bg-danger ms-auto">3</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item text-danger"
                        onClick={() => setShowLogoutModal(true)}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Kuvamo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Enhanced Sidebar */}
      <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""} ${isMobileSidebarOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <h5 className="text-muted">MENU</h5>
        </div>
        <ul className="nav flex-column px-2 py-3">
          {tabContent.map((tab) => (
            <li key={tab.key} className="nav-item mb-1">
              <button
                className={`nav-link w-100 text-start position-relative ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsMobileSidebarOpen(false);
                }}
              >
                <i className={`bi ${tab.icon}`}></i>
                <span className="nav-link-text">{tab.label}</span>
                {tab.badge && !isSidebarCollapsed && (
                  <span className="nav-badge">{tab.badge}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
        <div className="sidebar-footer">
          <button
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={() => setShowLogoutModal(true)}
          >
            <i className="bi bi-box-arrow-right"></i>
            {!isSidebarCollapsed && <span>Kuvamo</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="main-content">
        {selectedTab ? selectedTab.content() : <DashboardOverview user={user} />}
      </main>

      {/* Enhanced Logout Modal */}
      {showLogoutModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={(e) => e.target.classList.contains("modal") && setShowLogoutModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle-fill text-danger me-2"></i>
                  Emeza kuvamo
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowLogoutModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <div className="mb-4">
                  <div
                    className="bg-danger bg-opacity-10 rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <i className="bi bi-box-arrow-right fs-1 text-danger"></i>
                  </div>
                </div>
                <h5 className="mb-3">Urasaba guvamo muri konti yawe?</h5>
                <p className="text-muted">
                  Uzajya uvamo muri systeme, kandi ibikorwa byose bizajya bigenda.
                </p>
              </div>
              <div className="modal-footer border-0 justify-content-center pb-4">
                <button
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Hagarika
                </button>
                <button className="btn btn-danger px-4" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Yego, nshaka kuvamo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Welcome Toast */}
      {showWelcomeToast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1050 }}>
          <div className="toast show">
            <div className="toast-header">
              <i className="bi bi-stars me-2"></i>
              <strong className="me-auto text-white">Murakaza neza!</strong>
              <small className="text-white opacity-75">Yaje</small>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setShowWelcomeToast(false)}
              ></button>
            </div>
            <div className="toast-body">
              <p className="mb-2">
                <strong>Murakaza neza ku Umudugudu Dashboard!</strong>
              </p>
              <p className="mb-0 small text-muted">
                Ufite ibikorwa byinshi ushobora gukora. Tangira ugakoresha menu kuruhande.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-lg-none"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1019 }}
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;