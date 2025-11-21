import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  Badge,
  Spinner,
  Alert,
  Card,
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  Breadcrumb,
  Modal,
  Dropdown,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from "react-bootstrap";
import axios from "axios";
import * as Icon from "react-bootstrap-icons";
import { format, parseISO, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = "http://localhost:5000/raporo";

/* ================== ENHANCED STYLES ================== */
const EnhancedDashboardStyles = () => (
  <style>{`
    :root {
      --bg-light: #f5f7fa;
      --bg-dark: #0f1419;
      --paper-light: #ffffff;
      --paper-dark: #1a1f2e;
      --muted-light: #64748b;
      --muted-dark: #94a3b8;
      --border-light: #e2e8f0;
      --border-dark: #334155;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      --shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      
      /* Gradients */
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-success: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
      --gradient-danger: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
      --gradient-info: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --gradient-warning: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      
      /* Transitions */
      --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-fast: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Base Layout */
    .dashboard-shell {
      background: var(--bg-light);
      min-height: 100vh;
      transition: var(--transition-base);
    }
    .dashboard-shell.dm {
      background: var(--bg-dark);
      color: #e2e8f0;
    }

    /* Glass Morphism Effect */
    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(255, 255, 255, 0.3);
      box-shadow: var(--shadow-lg);
      transition: var(--transition-base);
    }
    .dm .glass-card {
      background: rgba(26, 31, 46, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    /* Enhanced Breadcrumb */
    .breadcrumb-modern {
      background: var(--paper-light);
      border-radius: 16px;
      padding: 1.25rem 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-light);
      backdrop-filter: blur(10px);
    }
    .dm .breadcrumb-modern {
      background: var(--paper-dark);
      border-color: var(--border-dark);
    }

    /* Header Card */
    .header-card {
      background: var(--gradient-primary);
      border-radius: 20px;
      padding: 2rem;
      box-shadow: var(--shadow-xl);
      color: white;
      position: relative;
      overflow: hidden;
    }
    .header-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }

    /* Stats Cards */
    .stat-card {
      border-radius: 20px;
      padding: 1.75rem;
      position: relative;
      overflow: hidden;
      border: none;
      transition: var(--transition-base);
      cursor: pointer;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: var(--gradient-primary);
    }
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: var(--shadow-xl);
    }
    .stat-icon-wrapper {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    /* Modern Search */
    .search-modern {
      border-radius: 50px;
      overflow: hidden;
      box-shadow: var(--shadow);
      border: 2px solid transparent;
      transition: var(--transition-base);
      background: var(--paper-light);
    }
    .dm .search-modern {
      background: var(--paper-dark);
      border-color: var(--border-dark);
    }
    .search-modern:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
      transform: translateY(-2px);
    }

    /* Enhanced Table */
    .table-modern-wrapper {
      border-radius: 20px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      background: var(--paper-light);
    }
    .dm .table-modern-wrapper {
      background: var(--paper-dark);
      border-color: var(--border-dark);
    }

    .table-modern {
      margin: 0;
    }
    .table-modern thead {
      background: var(--gradient-primary);
      color: white;
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .table-modern thead th {
      border: none;
      padding: 1.25rem 1rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-size: 0.875rem;
    }
    .table-modern tbody tr {
      transition: var(--transition-fast);
      border-bottom: 1px solid var(--border-light);
    }
    .dm .table-modern tbody tr {
      border-bottom-color: var(--border-dark);
    }
    .table-modern tbody tr:hover {
      background: rgba(102, 126, 234, 0.05);
      transform: scale(1.01);
    }

    /* Enhanced Buttons */
    .btn-modern {
      border-radius: 50px;
      padding: 0.75rem 1.75rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      border: none;
      transition: var(--transition-base);
      box-shadow: var(--shadow-sm);
      position: relative;
      overflow: hidden;
    }
    .btn-modern::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: width 0.6s, height 0.6s, top 0.6s, left 0.6s;
    }
    .btn-modern:hover::before {
      width: 300px;
      height: 300px;
      top: -150px;
      left: -150px;
    }
    .btn-modern:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-lg);
    }
    .btn-modern:active {
      transform: translateY(-1px);
    }

    /* Icon Buttons */
    .btn-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: var(--transition-base);
      border: 2px solid transparent;
    }
    .btn-icon:hover {
      transform: translateY(-3px) rotate(5deg);
      box-shadow: var(--shadow);
    }

    /* Enhanced Badges */
    .badge-modern {
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.875rem;
      letter-spacing: 0.5px;
      box-shadow: var(--shadow-sm);
    }

    /* Pagination */
    .pagination-modern {
      gap: 0.5rem;
    }
    .pagination-modern .btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-base);
      border: 2px solid var(--border-light);
    }
    .dm .pagination-modern .btn {
      border-color: var(--border-dark);
    }
    .pagination-modern .btn:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow);
    }

    /* Modal Enhancements */
    .modal-modern .modal-content {
      border: none;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }
    .modal-modern .modal-header {
      background: var(--gradient-danger);
      color: white;
      border: none;
      padding: 2rem;
    }
    .modal-modern .modal-body {
      padding: 2.5rem;
    }
    .modal-modern .modal-footer {
      border: none;
      padding: 1.5rem 2rem 2rem;
    }

    /* Loading Animation */
    .loading-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      gap: 2rem;
    }
    .loading-spinner {
      width: 80px;
      height: 80px;
      border: 6px solid rgba(102, 126, 234, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Tooltip Customization */
    .tooltip-modern .tooltip-inner {
      background: rgba(0, 0, 0, 0.9);
      border-radius: 8px;
      padding: 0.75rem 1rem;
      font-weight: 500;
    }

    /* Scrollbar */
    .table-modern-wrapper {
      max-height: 600px;
      overflow: auto;
    }
    .table-modern-wrapper::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    .table-modern-wrapper::-webkit-scrollbar-track {
      background: var(--border-light);
      border-radius: 10px;
    }
    .dm .table-modern-wrapper::-webkit-scrollbar-track {
      background: var(--border-dark);
    }
    .table-modern-wrapper::-webkit-scrollbar-thumb {
      background: #667eea;
      border-radius: 10px;
    }
    .table-modern-wrapper::-webkit-scrollbar-thumb:hover {
      background: #764ba2;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .stat-card {
        margin-bottom: 1rem;
      }
      .header-card {
        padding: 1.5rem;
      }
      .btn-modern {
        padding: 0.625rem 1.25rem;
        font-size: 0.875rem;
      }
    }

    /* Print Styles */
    @media print {
      .breadcrumb-modern,
      .header-card,
      .search-modern,
      .pagination-modern,
      .btn,
      .alert {
        display: none !important;
      }
      .table-modern-wrapper {
        box-shadow: none;
        border: 1px solid #ddd;
      }
      .stat-card {
        page-break-inside: avoid;
      }
    }

    /* Accessibility */
    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    /* Focus States */
    .btn-modern:focus,
    .btn-icon:focus,
    .search-modern input:focus {
      outline: 2px solid #667eea;
      outline-offset: 2px;
    }

    /* Dark Mode Toggle */
    .theme-toggle {
      position: relative;
      width: 56px;
      height: 28px;
      background: var(--border-light);
      border-radius: 50px;
      cursor: pointer;
      transition: var(--transition-base);
    }
    .theme-toggle::before {
      content: '';
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      transition: var(--transition-base);
    }
    .theme-toggle.active {
      background: #667eea;
    }
    .theme-toggle.active::before {
      transform: translateX(28px);
    }
  `}</style>
);

/* ================== MAIN COMPONENT ================== */
const DashboardBohejuru = () => {
  // State Management
  const [raporo, setRaporo] = useState([]);
  const [filteredRaporo, setFilteredRaporo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [sortKey, setSortKey] = useState("raporo_id");
  const [sortDir, setSortDir] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [showLogout, setShowLogout] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Fetch raporo data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setStatus({ type: "", message: "" });
      const res = await axios.get(API_URL);
      setRaporo(res.data);
      setFilteredRaporo(res.data);
      setStatus({ type: "success", message: "Amakuru yagaruwe neza!" });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      console.error(err);
      setStatus({
        type: "danger",
        message: "Ntibyakunze kubona raporo! Gerageza ukundi.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Dark mode persistence
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.body.classList.add("bg-dark", "text-light");
    } else {
      document.body.classList.remove("bg-dark", "text-light");
    }
  }, [darkMode]);

  // Sorting function
  const handleSort = useCallback((key) => {
    setSortDir((prevDir) => (sortKey === key && prevDir === "asc" ? "desc" : "asc"));
    setSortKey(key);
  }, [sortKey]);

  // Apply sorting and filtering
  useEffect(() => {
    let filtered = [...raporo];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.umutwe_wa_raporo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.ibisobanuro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.yakozwe_na?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.umudugudu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      filtered = filtered.filter((r) => {
        const rDate = parseISO(r.itariki_ya_raporo);
        const daysDiff = differenceInDays(today, rDate);
        switch (dateFilter) {
          case "today":
            return daysDiff === 0;
          case "week":
            return daysDiff <= 7;
          case "month":
            return daysDiff <= 30;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA = sortKey === "itariki_ya_raporo" ? new Date(a[sortKey]) : a[sortKey];
      let valB = sortKey === "itariki_ya_raporo" ? new Date(b[sortKey]) : b[sortKey];
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRaporo(filtered);
    setCurrentPage(0);
  }, [searchTerm, dateFilter, sortKey, sortDir, raporo]);

  // Pagination
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredRaporo.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredRaporo.length / itemsPerPage);

  // Statistics calculations
  const stats = useMemo(() => ({
    totalResidents: raporo.reduce((sum, r) => sum + (r.umubare_w_abaturage || 0), 0),
    totalHouses: raporo.reduce((sum, r) => sum + (r.umubare_w_ingo || 0), 0),
    totalVulnerable: raporo.reduce((sum, r) => sum + (r.abanyantege_nke || 0), 0),
    totalReports: raporo.length,
    recentReports: raporo.filter(r => 
      differenceInDays(new Date(), parseISO(r.itariki_ya_raporo)) <= 7
    ).length,
  }), [raporo]);

  // Badge color logic
  const getBadgeColor = (key, value) => {
    if (key === "abanyantege_nke") {
      if (value > 10) return "danger";
      if (value > 5) return "warning";
      return "info";
    }
    if (key === "umubare_w_abaturage") return "primary";
    if (key === "umubare_w_ingo") return "success";
    return "secondary";
  };

  // Toggle dark mode
  const toggleDarkMode = () => setDarkMode(!darkMode);

  // Logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("authToken");
      sessionStorage.clear();
      if (axios.defaults.headers.common.Authorization) {
        delete axios.defaults.headers.common.Authorization;
      }
    } finally {
      navigate("/", { replace: true });
    }
  };

  // Delete raporo
  const handleDelete = (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba iyi raporo?")) {
      const updated = raporo.filter((r) => r.raporo_id !== id);
      setRaporo(updated);
      setStatus({ type: "warning", message: "Raporo yasibwe neza!" });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    }
  };

  // Render tooltip
  const renderTooltip = (text) => (
    <Tooltip className="tooltip-modern">{text}</Tooltip>
  );

  // Loading state
  if (loading) {
    return (
      <motion.div
        className="loading-wrapper"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="loading-spinner" />
        <h4 className={darkMode ? "text-light" : "text-dark"}>
          Tegereza gato...
        </h4>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`container-fluid py-4 dashboard-shell ${darkMode ? "dm" : ""}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <EnhancedDashboardStyles />

      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumb className="breadcrumb-modern mb-4">
          <Breadcrumb.Item active className="d-flex align-items-center gap-2">
            <Icon.HouseFill />
            <span>Dashboard</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active className="d-flex align-items-center gap-2">
            <Icon.FileText />
            <span>Raporo</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </motion.div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="header-card border-0 mb-4">
          <Card.Body className="position-relative">
            <Row className="align-items-center">
              <Col lg={6}>
                <motion.div
                  initial={{ x: -20 }}
                  animate={{ x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="fw-bold mb-2 d-flex align-items-center gap-3">
                    <Icon.GraphUpArrow size={32} />
                    Dashboard - Raporo
                  </h2>
                  <p className="mb-0 opacity-75">
                    Reba no gucunga raporo z'umudugudu
                  </p>
                </motion.div>
              </Col>
              <Col lg={6} className="text-lg-end mt-3 mt-lg-0">
                <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                  <OverlayTrigger placement="bottom" overlay={renderTooltip("Hindura ubuso")}>
                    <div
                      className={`theme-toggle ${darkMode ? "active" : ""}`}
                      onClick={toggleDarkMode}
                      role="button"
                      tabIndex={0}
                      aria-label="Toggle dark mode"
                    />
                  </OverlayTrigger>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongera usubize")}>
                    <Button
                      variant="light"
                      onClick={fetchData}
                      className="btn-icon"
                    >
                      <Icon.ArrowClockwise size={20} />
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger placement="bottom" overlay={renderTooltip("Sohoka")}>
                    <Button
                      variant="light"
                      onClick={() => setShowLogout(true)}
                      className="btn-icon"
                    >
                      <Icon.BoxArrowRight size={20} />
                    </Button>
                  </OverlayTrigger>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </motion.div>

      {/* Status Alert */}
      <AnimatePresence>
        {status.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              variant={status.type}
              dismissible
              onClose={() => setStatus({ type: "", message: "" })}
              className="shadow-sm border-0 mb-4"
              style={{ borderRadius: "16px" }}
            >
              <div className="d-flex align-items-center gap-2">
                {status.type === "danger" && <Icon.ExclamationTriangle size={20} />}
                {status.type === "warning" && <Icon.ExclamationCircle size={20} />}
                {status.type === "success" && <Icon.CheckCircle size={20} />}
                {status.message}
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Cards */}
      <Row className="mb-4 g-4">
        {[
          {
            title: "Abaturage",
            icon: <Icon.People size={32} />,
            value: stats.totalResidents,
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            change: "+12%",
          },
          {
            title: "Ingo",
            icon: <Icon.HouseDoor size={32} />,
            value: stats.totalHouses,
            gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
            change: "+8%",
          },
          {
            title: "Abanyantege nke",
            icon: <Icon.ExclamationTriangle size={32} />,
            value: stats.totalVulnerable,
            gradient: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
            change: "-5%",
          },
          {
            title: "Raporo Zose",
            icon: <Icon.FileText size={32} />,
            value: stats.totalReports,
            gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
            change: `+${stats.recentReports} iyi cyumweru`,
          },
        ].map((card, idx) => (
          <Col xs={12} sm={6} lg={3} key={idx}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <Card
                className="stat-card border-0 h-100"
                style={{ background: card.gradient, color: "white" }}
              >
                <Card.Body>
                  <div className="stat-icon-wrapper">
                    {card.icon}
                  </div>
                  <h6 className="text-white-50 mb-2 text-uppercase small fw-bold">
                    {card.title}
                  </h6>
                  <h2 className="fw-bold mb-2">
                    {card.value.toLocaleString()}
                  </h2>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="light" text="dark" className="badge-modern">
                      {card.change}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Row className="mb-4 g-3 align-items-center">
          <Col lg={6}>
            <InputGroup className="search-modern">
              <InputGroup.Text className={darkMode ? "bg-dark text-light border-0" : "border-0"}>
                <Icon.Search size={20} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Shakisha umutwe, ibisobanuro, yakozwe na..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={darkMode ? "bg-dark text-light border-0" : "border-0"}
              />
              {searchTerm && (
                <Button
                  variant="link"
                  className="text-muted"
                  onClick={() => setSearchTerm("")}
                >
                  <Icon.XCircle size={20} />
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col lg={6} className="text-lg-end">
            <Dropdown className="d-inline-block me-2">
              <Dropdown.Toggle variant="outline-primary" className="btn-modern">
                <Icon.Funnel className="me-2" />
                Igihe: {dateFilter === "all" ? "Byose" : dateFilter === "today" ? "Uyu munsi" : dateFilter === "week" ? "Iki cyumweru" : "Uku kwezi"}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setDateFilter("all")}>
                  <Icon.Grid3x3Gap className="me-2" /> Byose
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDateFilter("today")}>
                  <Icon.Calendar className="me-2" /> Uyu munsi
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDateFilter("week")}>
                  <Icon.CalendarWeek className="me-2" /> Iki cyumweru
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setDateFilter("month")}>
                  <Icon.CalendarMonth className="me-2" /> Uku kwezi
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Button
              variant="outline-secondary"
              className="btn-modern"
              onClick={() => window.print()}
            >
              <Icon.Printer className="me-2" />
              Icapiro
            </Button>
          </Col>
        </Row>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="table-modern-wrapper">
          <Table hover className={`table-modern mb-0 ${darkMode ? "table-dark" : ""}`}>
            <thead>
              <tr>
                {[
                  { key: "umutwe_wa_raporo", label: "Umutwe" },
                  { key: "ibisobanuro", label: "Ibisobanuro" },
                  { key: "itariki_ya_raporo", label: "Itariki" },
                ].map(({ key, label }) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer user-select-none"
                    role="button"
                  >
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      {label}
                      {sortKey === key && (
                        sortDir === "asc" ? <Icon.ChevronUp /> : <Icon.ChevronDown />
                      )}
                    </div>
                  </th>
                ))}
                <th className="text-center">Abaturage</th>
                <th className="text-center">Ingo</th>
                <th className="text-center">Abanyantege nke</th>
                <th className="text-center">Yakozwe na</th>
                <th className="text-center">Umudugudu</th>
                <th className="text-center">Ibikorwa</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-5">
                      <Icon.Inbox size={48} className="text-muted mb-3" />
                      <p className="text-muted mb-0">Nta raporo yabonetse</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((r, idx) => (
                    <motion.tr
                      key={r.raporo_id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                    >
                      <td className="fw-semibold">{r.umutwe_wa_raporo}</td>
                      <td className="text-muted" style={{ maxWidth: "300px" }}>
                        {r.ibisobanuro?.length > 100
                          ? `${r.ibisobanuro.substring(0, 100)}...`
                          : r.ibisobanuro || "-"}
                      </td>
                      <td className="text-center">
                        <small className="text-muted">
                          {format(parseISO(r.itariki_ya_raporo), "dd/MM/yyyy")}
                        </small>
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={getBadgeColor("umubare_w_abaturage", r.umubare_w_abaturage)}
                          className="badge-modern"
                        >
                          {r.umubare_w_abaturage}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={getBadgeColor("umubare_w_ingo", r.umubare_w_ingo)}
                          className="badge-modern"
                        >
                          {r.umubare_w_ingo}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge
                          bg={getBadgeColor("abanyantege_nke", r.abanyantege_nke)}
                          className="badge-modern"
                        >
                          {r.abanyantege_nke}
                        </Badge>
                      </td>
                      <td className="text-center">{r.yakozwe_na || "-"}</td>
                      <td className="text-center">{r.umudugudu || "-"}</td>
                      <td className="text-center">
                        <OverlayTrigger placement="top" overlay={renderTooltip("Siba raporo")}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(r.raporo_id)}
                            className="btn-icon"
                          >
                            <Icon.Trash />
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </Table>
        </div>
      </motion.div>

      {/* Pagination */}
      {pageCount > 1 && (
        <motion.div
          className="d-flex justify-content-center mt-4 gap-2 pagination-modern flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Button
            variant={darkMode ? "outline-light" : "outline-dark"}
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
            disabled={currentPage === 0}
          >
            <Icon.ChevronLeft />
          </Button>

          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
            let pageNum;
            if (pageCount <= 5) {
              pageNum = i;
            } else if (currentPage < 3) {
              pageNum = i;
            } else if (currentPage > pageCount - 3) {
              pageNum = pageCount - 5 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={pageNum === currentPage ? "primary" : darkMode ? "outline-light" : "outline-dark"}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum + 1}
              </Button>
            );
          })}

          <Button
            variant={darkMode ? "outline-light" : "outline-dark"}
            onClick={() => setCurrentPage(Math.min(currentPage + 1, pageCount - 1))}
            disabled={currentPage === pageCount - 1}
          >
            <Icon.ChevronRight />
          </Button>
        </motion.div>
      )}

      {/* Logout Modal */}
      <Modal
        show={showLogout}
        onHide={() => setShowLogout(false)}
        centered
        contentClassName="modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Icon.ExclamationTriangleFill size={24} />
            Emeza Gusohoka
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
              }}
            >
              <Icon.BoxArrowRight size={40} color="white" />
            </div>
          </div>
          <h5 className="mb-3">Ushaka gusohoka koko?</h5>
          <p className="text-muted">
            Nusohoka, uzakenera kongera kwinjira ukoresheje konti yawe.
          </p>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button
            variant="outline-secondary"
            onClick={() => setShowLogout(false)}
            className="btn-modern px-4"
          >
            Hagarika
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            className="btn-modern px-4"
          >
            <Icon.BoxArrowRight className="me-2" />
            Yego, Sohoka
          </Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default DashboardBohejuru;