import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Table,
  Badge,
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
  Nav
} from "react-bootstrap";
import axios from "axios";
import * as Icon from "react-bootstrap-icons";
import { format, parseISO, differenceInDays } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// ===== NEW IMPORT =====
import Message from "../page/Message"; 
import RegisterB from "./AddumuyobozBohejuru";

const API_URL = "http://localhost:5000/raporo";

/* ================== ENHANCED STYLES ================== */
const EnhancedDashboardStyles = () => (
  <style>{`
    :root {
      --bg-light: #f5f7fa;
      --bg-dark: #0f1419;
      --paper-light: #ffffff;
      --paper-dark: #1a1f2e;
      --border-light: #e2e8f0;
      --border-dark: #334155;
      --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --gradient-danger: linear-gradient(135deg, #ee0979 0%, #ff6a00 100%);
      --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

    /* Breadcrumb */
    .breadcrumb-modern {
      background: var(--paper-light);
      border-radius: 16px;
      padding: 1rem 1.5rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-light);
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
      box-shadow: var(--shadow-lg);
      color: white;
      position: relative;
      overflow: hidden;
    }

    /* Navigation Tabs */
    .nav-modern {
      background: var(--paper-light);
      padding: 0.5rem;
      border-radius: 50px;
      border: 1px solid var(--border-light);
      display: inline-flex;
      gap: 0.5rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }
    .dm .nav-modern {
      background: var(--paper-dark);
      border-color: var(--border-dark);
    }
    .nav-modern .nav-link {
      color: var(--muted-light);
      border-radius: 50px;
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      transition: var(--transition-base);
      border: none;
    }
    .dm .nav-modern .nav-link { color: #94a3b8; }
    
    .nav-modern .nav-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
    }
    .nav-modern .nav-link.active {
      background: var(--gradient-primary);
      color: white;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    /* Stats Cards */
    .stat-card {
      border-radius: 20px;
      padding: 1.75rem;
      border: none;
      transition: var(--transition-base);
      cursor: pointer;
      overflow: hidden;
      position: relative;
    }
    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: var(--shadow-lg);
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

    /* Modern Search & Table */
    .search-modern {
      border-radius: 50px;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border: 2px solid transparent;
      background: var(--paper-light);
    }
    .dm .search-modern {
      background: var(--paper-dark);
      border-color: var(--border-dark);
    }
    
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
    
    .table-modern thead {
      background: var(--gradient-primary);
      color: white;
    }
    .table-modern tbody tr:hover {
      background: rgba(102, 126, 234, 0.05);
    }

    /* Buttons */
    .btn-modern {
      border-radius: 50px;
      font-weight: 600;
      transition: var(--transition-base);
    }
    .btn-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    /* Modal & Loading */
    .modal-modern .modal-content { border-radius: 24px; border: none; overflow: hidden; }
    .loading-wrapper { height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .loading-spinner { width: 80px; height: 80px; border: 6px solid rgba(102, 126, 234, 0.1); border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    /* Utility */
    .theme-toggle { width: 50px; height: 26px; background: #e2e8f0; border-radius: 50px; position: relative; cursor: pointer; }
    .theme-toggle::before { content: ''; position: absolute; width: 20px; height: 20px; background: white; border-radius: 50%; top: 3px; left: 3px; transition: 0.3s; }
    .theme-toggle.active { background: #667eea; }
    .theme-toggle.active::before { transform: translateX(24px); }
  `}</style>
);

/* ================== MAIN COMPONENT ================== */
const DashboardBohejuru = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("raporo"); // 'raporo' or 'messages'
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
  const [dateFilter, setDateFilter] = useState("all");
  const itemsPerPage = 10;

  const navigate = useNavigate();

  // Fetch raporo data
  const fetchData = useCallback(async () => {
    // Only fetch raporo if on raporo tab
    if (activeTab === "raporo") {
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
        setStatus({ type: "danger", message: "Ntibyakunze kubona raporo! Gerageza ukundi." });
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [activeTab]);

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

  // Apply sorting and filtering (Only for Raporo)
  useEffect(() => {
    if (activeTab !== "raporo") return;

    let filtered = [...raporo];

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.umutwe_wa_raporo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.ibisobanuro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.yakozwe_na?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.umudugudu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter !== "all") {
      const today = new Date();
      filtered = filtered.filter((r) => {
        const rDate = parseISO(r.itariki_ya_raporo);
        const daysDiff = differenceInDays(today, rDate);
        switch (dateFilter) {
          case "today": return daysDiff === 0;
          case "week": return daysDiff <= 7;
          case "month": return daysDiff <= 30;
          default: return true;
        }
      });
    }

    filtered.sort((a, b) => {
      let valA = sortKey === "itariki_ya_raporo" ? new Date(a[sortKey]) : a[sortKey];
      let valB = sortKey === "itariki_ya_raporo" ? new Date(b[sortKey]) : b[sortKey];
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredRaporo(filtered);
    setCurrentPage(0);
  }, [searchTerm, dateFilter, sortKey, sortDir, raporo, activeTab]);

  // Pagination
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredRaporo.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredRaporo.length / itemsPerPage);

  // Stats
  const stats = useMemo(() => ({
    totalResidents: raporo.reduce((sum, r) => sum + (r.umubare_w_abaturage || 0), 0),
    totalHouses: raporo.reduce((sum, r) => sum + (r.umubare_w_ingo || 0), 0),
    totalVulnerable: raporo.reduce((sum, r) => sum + (r.abanyantege_nke || 0), 0),
    totalReports: raporo.length,
    recentReports: raporo.filter(r => differenceInDays(new Date(), parseISO(r.itariki_ya_raporo)) <= 7).length,
  }), [raporo]);

  const getBadgeColor = (key, value) => {
    if (key === "abanyantege_nke") return value > 10 ? "danger" : "info";
    if (key === "umubare_w_abaturage") return "primary";
    return "secondary";
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };

  const handleDelete = (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba iyi raporo?")) {
      const updated = raporo.filter((r) => r.raporo_id !== id);
      setRaporo(updated);
      setStatus({ type: "warning", message: "Raporo yasibwe neza!" });
    }
  };

  const renderTooltip = (text) => <Tooltip className="tooltip-modern">{text}</Tooltip>;

  if (loading && activeTab === "raporo") {
    return (
      <div className="loading-wrapper">
        <div className="loading-spinner" />
        <h4 className={darkMode ? "text-light" : "text-dark"}>Tegereza gato...</h4>
      </div>
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
      <Breadcrumb className="breadcrumb-modern mb-4">
        <Breadcrumb.Item active className="d-flex align-items-center gap-2">
          <Icon.HouseFill />
          <span>Dashboard</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item active className="d-flex align-items-center gap-2">
          {activeTab === "raporo" ? <Icon.FileText /> : <Icon.ChatDotsFill />}
          <span>{activeTab === "raporo" ? "Raporo" : "Ubutumwa"}</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Header Card */}
      <Card className="header-card border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="fw-bold mb-2 d-flex align-items-center gap-3">
                {activeTab === "raporo" ? <Icon.GraphUpArrow size={32} /> : <Icon.ChatLeftTextFill size={32} />}
                {activeTab === "raporo" ? "Dashboard - Raporo" : "Dashboard - Ubutumwa"}
              </h2>
              <p className="mb-0 opacity-75">
                {activeTab === "raporo" ? "Reba no gucunga raporo z'umudugudu" : "Tanga ibitekerezo cyangwa ubutumwa bwihuse"}
              </p>
            </Col>
            <Col lg={6} className="text-lg-end mt-3 mt-lg-0">
              <div className="d-flex gap-2 justify-content-lg-end flex-wrap">
                <OverlayTrigger placement="bottom" overlay={renderTooltip("Hindura ubuso")}>
                  <div className={`theme-toggle ${darkMode ? "active" : ""}`} onClick={toggleDarkMode} />
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongera usubize")}>
                  <Button variant="light" onClick={fetchData} className="btn-icon">
                    <Icon.ArrowClockwise size={20} />
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="bottom" overlay={renderTooltip("Sohoka")}>
                  <Button variant="light" onClick={() => setShowLogout(true)} className="btn-icon">
                    <Icon.BoxArrowRight size={20} />
                  </Button>
                </OverlayTrigger>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* NAVIGATION TABS */}
      <div className="d-flex justify-content-center">
        <Nav className="nav-modern">
          <Nav.Item>
            <Nav.Link 
              active={activeTab === "raporo"} 
              onClick={() => setActiveTab("raporo")}
              role="button"
            >
              <Icon.FileText className="me-2" /> Raporo
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === "messages"} 
              onClick={() => setActiveTab("messages")}
              role="button"
            >
              <Icon.ChatDotsFill className="me-2" /> Ubutumwa
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              active={activeTab === "Andika"} 
              onClick={() => {
                setActiveTab("Andika");
              }}
              role="button"
            >
              <Icon.ChatDotsFill className="me-2" /> Ubutumwa
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      {/* CONDITIONAL RENDERING */}
      {activeTab === "raporo" ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Status Alert */}
          {status.message && (
            <Alert variant={status.type} dismissible onClose={() => setStatus({ type: "", message: "" })} className="shadow-sm border-0 mb-4" style={{ borderRadius: "16px" }}>
              <div className="d-flex align-items-center gap-2">
                {status.type === "success" ? <Icon.CheckCircle size={20} /> : <Icon.ExclamationTriangle size={20} />}
                {status.message}
              </div>
            </Alert>
          )}

          {/* Stats Cards */}
          <Row className="mb-4 g-4">
            {[
              { title: "Abaturage", icon: <Icon.People size={32} />, value: stats.totalResidents, gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", change: "+12%" },
              { title: "Ingo", icon: <Icon.HouseDoor size={32} />, value: stats.totalHouses, gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", change: "+8%" },
              { title: "Abanyantege nke", icon: <Icon.ExclamationTriangle size={32} />, value: stats.totalVulnerable, gradient: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)", change: "-5%" },
              { title: "Raporo Zose", icon: <Icon.FileText size={32} />, value: stats.totalReports, gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", change: `+${stats.recentReports} week` },
            ].map((card, idx) => (
              <Col xs={12} sm={6} lg={3} key={idx}>
                <Card className="stat-card h-100" style={{ background: card.gradient, color: "white" }}>
                  <Card.Body>
                    <div className="stat-icon-wrapper">{card.icon}</div>
                    <h6 className="text-white-50 mb-2 text-uppercase small fw-bold">{card.title}</h6>
                    <h2 className="fw-bold mb-2">{card.value.toLocaleString()}</h2>
                    <Badge bg="light" text="dark" className="badge-modern">{card.change}</Badge>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Search and Filters */}
          <Row className="mb-4 g-3 align-items-center">
            <Col lg={6}>
              <InputGroup className="search-modern">
                <InputGroup.Text className={darkMode ? "bg-dark text-light border-0" : "border-0"}><Icon.Search size={20} /></InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Shakisha umutwe, ibisobanuro..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={darkMode ? "bg-dark text-light border-0" : "border-0"}
                />
              </InputGroup>
            </Col>
            <Col lg={6} className="text-lg-end">
              <Dropdown className="d-inline-block me-2">
                <Dropdown.Toggle variant="outline-primary" className="btn-modern">
                  <Icon.Funnel className="me-2" /> Igihe: {dateFilter === "all" ? "Byose" : dateFilter}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setDateFilter("all")}>Byose</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateFilter("today")}>Uyu munsi</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateFilter("week")}>Iki cyumweru</Dropdown.Item>
                  <Dropdown.Item onClick={() => setDateFilter("month")}>Uku kwezi</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="outline-secondary" className="btn-modern" onClick={() => window.print()}>
                <Icon.Printer className="me-2" /> Icapiro
              </Button>
            </Col>
          </Row>

          {/* Table */}
          <div className="table-modern-wrapper">
            <Table hover className={`table-modern mb-0 ${darkMode ? "table-dark" : ""}`}>
              <thead>
                <tr>
                  {[ { key: "umutwe_wa_raporo", label: "Umutwe" }, { key: "ibisobanuro", label: "Ibisobanuro" }, { key: "itariki_ya_raporo", label: "Itariki" } ].map(({ key, label }) => (
                    <th key={key} onClick={() => handleSort(key)} className="cursor-pointer" role="button">
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        {label} {sortKey === key && (sortDir === "asc" ? <Icon.ChevronUp /> : <Icon.ChevronDown />)}
                      </div>
                    </th>
                  ))}
                  <th className="text-center">Abaturage</th>
                  <th className="text-center">Ingo</th>
                  <th className="text-center">Abanyantege nke</th>
                  <th className="text-center">Yakozwe na</th>
                  <th className="text-center">Ibikorwa</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentItems.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-5"><Icon.Inbox size={48} className="text-muted mb-3" /><p className="text-muted">Nta raporo</p></td></tr>
                  ) : (
                    currentItems.map((r) => (
                      <motion.tr key={r.raporo_id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <td className="fw-semibold">{r.umutwe_wa_raporo}</td>
                        <td className="text-muted" style={{ maxWidth: "250px" }}>{r.ibisobanuro?.substring(0, 80)}...</td>
                        <td className="text-center"><small className="text-muted">{format(parseISO(r.itariki_ya_raporo), "dd/MM/yyyy")}</small></td>
                        <td className="text-center"><Badge bg="primary" className="badge-modern">{r.umubare_w_abaturage}</Badge></td>
                        <td className="text-center"><Badge bg="success" className="badge-modern">{r.umubare_w_ingo}</Badge></td>
                        <td className="text-center"><Badge bg={getBadgeColor("abanyantege_nke", r.abanyantege_nke)} className="badge-modern">{r.abanyantege_nke}</Badge></td>
                        <td className="text-center">{r.yakozwe_na}</td>
                        <td className="text-center">
                          <Button variant="outline-danger" size="sm" onClick={() => handleDelete(r.raporo_id)} className="btn-icon"><Icon.Trash /></Button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="d-flex justify-content-center mt-4 gap-2 pagination-modern">
              <Button variant={darkMode ? "outline-light" : "outline-dark"} onClick={() => setCurrentPage(p => Math.max(p - 1, 0))} disabled={currentPage === 0}><Icon.ChevronLeft /></Button>
              <span className="align-self-center mx-2 fw-bold text-muted">Page {currentPage + 1} of {pageCount}</span>
              <Button variant={darkMode ? "outline-light" : "outline-dark"} onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount - 1))} disabled={currentPage === pageCount - 1}><Icon.ChevronRight /></Button>
            </div>
          )}
        </motion.div>
      ) : (
        /* MESSAGE COMPONENT VIEW */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Message />
        </motion.div>
      )}

      {/* Logout Modal */}
      <Modal show={showLogout} onHide={() => setShowLogout(false)} centered contentClassName="modal-modern">
        <Modal.Header closeButton><Modal.Title><Icon.ExclamationTriangleFill className="me-2" />Emeza Gusohoka</Modal.Title></Modal.Header>
        <Modal.Body className="text-center p-4">
          <Icon.BoxArrowRight size={48} className="text-danger mb-3" />
          <h5>Ushaka gusohoka koko?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowLogout(false)} className="btn-modern">Hagarika</Button>
          <Button variant="danger" onClick={handleLogout} className="btn-modern">Yego, Sohoka</Button>
        </Modal.Footer>
      </Modal>
    </motion.div>
  );
};

export default DashboardBohejuru;