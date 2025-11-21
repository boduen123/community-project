import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Alert,
  ProgressBar,
  Nav,
  Tab,
  Dropdown,
  Modal,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Form,
  InputGroup
} from "react-bootstrap";

// Component imports
import UrubyirukoRukora from "./UrubyirukoRukora";
import UrubyirukoRudafiteAkazi from "./UrubyirukoRudafiteAkazi";
import AbanaMirireMibi from "./AbanaMirireMibi";
import AbakobwaBabyaye from "./AbakobwaBabyaye";
import AbagoreBatwite from "./AbagoreBatwite";

/* ================= Enhanced Styles ================= */
const EnhancedStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    :root {
      --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      --success-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      --info-gradient: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      --warning-gradient: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      --dark-gradient: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
      
      --glass-bg: rgba(255, 255, 255, 0.25);
      --glass-border: rgba(255, 255, 255, 0.18);
      --shadow-sm: 0 2px 10px rgba(0, 0, 0, 0.08);
      --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.12);
      --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.15);
      --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.2);
      
      --transition-fast: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --transition-smooth: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    * {
      font-family: 'Inter', sans-serif;
    }

    .dashboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      position: relative;
      overflow-x: hidden;
    }

    .dashboard-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none;
    }

    .dashboard-container.dark-mode {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: var(--shadow-lg);
      transition: var(--transition-smooth);
    }

    .dark-mode .glass-card {
      background: rgba(30, 30, 45, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e4e4e7;
    }

    .nav-pills-custom {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 15px;
      padding: 8px;
      box-shadow: var(--shadow-md);
    }

    .dark-mode .nav-pills-custom {
      background: rgba(30, 30, 45, 0.95);
    }

    .nav-pills-custom .nav-link {
      border-radius: 10px;
      color: #6b7280;
      padding: 10px 20px;
      margin: 0 4px;
      transition: var(--transition-fast);
      font-weight: 500;
    }

    .nav-pills-custom .nav-link:hover {
      background: rgba(102, 126, 234, 0.1);
      color: #667eea;
      transform: translateY(-2px);
    }

    .nav-pills-custom .nav-link.active {
      background: var(--primary-gradient);
      color: white;
      box-shadow: var(--shadow-md);
    }

    .stat-card {
      border-radius: 20px;
      padding: 24px;
      transition: var(--transition-smooth);
      background: white;
      border: none;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--primary-gradient);
    }

    .dark-mode .stat-card {
      background: rgba(30, 30, 45, 0.95);
      color: #e4e4e7;
    }

    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: var(--shadow-xl);
    }

    .stat-icon {
      width: 60px;
      height: 60px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 16px;
    }

    .quick-action-btn {
      border-radius: 12px;
      padding: 12px;
      border: 2px solid transparent;
      transition: var(--transition-fast);
      background: white;
      color: #6b7280;
    }

    .dark-mode .quick-action-btn {
      background: rgba(30, 30, 45, 0.95);
      color: #e4e4e7;
    }

    .quick-action-btn:hover {
      transform: translateY(-4px);
      border-color: #667eea;
      box-shadow: var(--shadow-md);
      color: #667eea;
    }

    .activity-item {
      padding: 16px;
      border-radius: 12px;
      margin-bottom: 12px;
      background: rgba(248, 250, 252, 0.5);
      border-left: 4px solid;
      transition: var(--transition-fast);
    }

    .activity-item:hover {
      transform: translateX(8px);
      box-shadow: var(--shadow-md);
    }

    .notification-badge {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #ef4444;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: bold;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 1; }
    }

    .chart-container {
      padding: 20px;
      background: rgba(248, 250, 252, 0.5);
      border-radius: 16px;
      margin-top: 20px;
    }

    .dark-mode .chart-container {
      background: rgba(30, 30, 45, 0.5);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: var(--primary-gradient);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
    }

    .floating-action-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary-gradient);
      color: white;
      border: none;
      box-shadow: var(--shadow-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      transition: var(--transition-fast);
      z-index: 1000;
    }

    .floating-action-btn:hover {
      transform: scale(1.1) rotate(90deg);
      box-shadow: var(--shadow-xl);
    }

    .progress-ring {
      transform: rotate(-90deg);
    }

    .progress-ring-circle {
      stroke-dasharray: 377;
      stroke-dashoffset: 377;
      animation: progress 2s ease-out forwards;
    }

    @keyframes progress {
      to { stroke-dashoffset: 0; }
    }

    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `}</style>
);

/* ================= Main Dashboard Component ================= */
function DashboardUmunyamabanga() {
  const API = "http://localhost:5000";
  const [activeTab, setActiveTab] = useState("dashboard");
  const [abaturage, setAbaturage] = useState([]);
  const [ingo, setIngo] = useState([]);
  const [raporo, setRaporo] = useState([]);
  const [imibereho, setImibereho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Get current user info
  const currentUser = JSON.parse(localStorage.getItem("user") || '{"name": "Umunyamabanga"}');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [abaturageRes, ingoRes, raporoRes, imiberehoRes] = await Promise.all([
          axios.get(`${API}/abaturage`).catch(() => ({ data: [] })),
          axios.get(`${API}/ingo`).catch(() => ({ data: [] })),
          axios.get(`${API}/raporo`).catch(() => ({ data: [] })),
          axios.get(`${API}/imibereho-myiza`).catch(() => ({ data: [] })),
        ]);
        setAbaturage(abaturageRes.data);
        setIngo(ingoRes.data);
        setRaporo(raporoRes.data);
        setImibereho(imiberehoRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Calculate statistics
  const totalProjects = imibereho.length;
  const completedProjects = imibereho.filter((i) => i.imiterere_yayo === "Yarangiye").length;
  const completionRate = totalProjects ? Math.round((completedProjects / totalProjects) * 100) : 0;
  const activeProjects = totalProjects - completedProjects;

  // Recent activities (mock data for demonstration)
  const recentActivities = [
    { type: "success", message: "Gahunda 5 zarangiye muri iki cyumweru", time: "2 amasaha ashize" },
    { type: "info", message: "Abaturage 12 bashya bongeweho", time: "5 amasaha ashize" },
    { type: "warning", message: "Raporo 3 zigomba gushyikirizwa", time: "Ejo" },
  ];

  // Notifications (mock data)
  const notifications = [
    { id: 1, message: "Inama yo ku wa Kane saa 4:00", type: "info" },
    { id: 2, message: "Raporo ya vuba igomba gushyikirizwa", type: "warning" },
    { id: 3, message: "Abaturage 8 bashya bongeweho", type: "success" },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Turimo gushaka amakuru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      <EnhancedStyles />
      <Container fluid className="py-4">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="glass-card mb-4">
            <Card.Body>
              <Row className="align-items-center">
                <Col>
                  <div className="d-flex align-items-center">
                    <div className="user-avatar me-3">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="mb-1 fw-bold">Muraho, {currentUser.name}!</h4>
                      <p className="text-muted mb-0">
                        <i className="bi bi-calendar3 me-1"></i>
                        {new Date().toLocaleDateString('rw-RW', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col xs="auto">
                  <div className="d-flex align-items-center gap-2">
                    {/* Search */}
                    <InputGroup style={{ width: '250px' }}>
                      <InputGroup.Text className="bg-white border-end-0">
                        <i className="bi bi-search"></i>
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Shakisha..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-start-0"
                      />
                    </InputGroup>

                    {/* Notifications */}
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>Amatangazo</Tooltip>}
                    >
                      <Button
                        variant="light"
                        className="position-relative rounded-circle"
                        onClick={() => setShowNotifications(true)}
                      >
                        <i className="bi bi-bell fs-5"></i>
                        <span className="notification-badge">{notifications.length}</span>
                      </Button>
                    </OverlayTrigger>

                    {/* Dark Mode Toggle */}
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip>{darkMode ? 'Urumuri' : 'Umwijima'}</Tooltip>}
                    >
                      <Button
                        variant="light"
                        className="rounded-circle"
                        onClick={() => setDarkMode(!darkMode)}
                      >
                        <i className={`bi ${darkMode ? 'bi-sun-fill' : 'bi-moon-fill'} fs-5`}></i>
                      </Button>
                    </OverlayTrigger>

                    {/* Settings */}
                    <Dropdown align="end">
                      <Dropdown.Toggle variant="light" className="rounded-circle">
                        <i className="bi bi-gear fs-5"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item href="#">
                          <i className="bi bi-person me-2"></i>Umwirondoro
                        </Dropdown.Item>
                        <Dropdown.Item href="#">
                          <i className="bi bi-sliders me-2"></i>Igenamiterere
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="text-danger">
                          <i className="bi bi-box-arrow-right me-2"></i>Sohoka
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4"
        >
          <Nav variant="pills" className="nav-pills-custom flex-nowrap overflow-auto">
            <Nav.Item>
              <Nav.Link
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
              >
                <i className="bi bi-grid-1x2 me-2"></i>Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "rukora"}
                onClick={() => setActiveTab("rukora")}
              >
                <i className="bi bi-briefcase me-2"></i>Urubyiruko Rukora
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "rudafite"}
                onClick={() => setActiveTab("rudafite")}
              >
                <i className="bi bi-person-x me-2"></i>Rudafite Akazi
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "abana"}
                onClick={() => setActiveTab("abana")}
              >
                <i className="bi bi-heart-pulse me-2"></i>Abana Mirire Mibi
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "abakobwa"}
                onClick={() => setActiveTab("abakobwa")}
              >
                <i className="bi bi-person-heart me-2"></i>Abakobwa Babyaye
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === "abagore"}
                onClick={() => setActiveTab("abagore")}
              >
                <i className="bi bi-people me-2"></i>Abagore Batwite
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </motion.div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "dashboard" && (
              <>
                {/* Statistics Cards */}
                <Row className="g-4 mb-4">
                  <Col xs={12} sm={6} lg={3}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card className="stat-card shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="text-muted small mb-2">ABATURAGE</p>
                              <h3 className="fw-bold mb-2">{abaturage.length}</h3>
                              <Badge bg="success" className="small">
                                <i className="bi bi-arrow-up me-1"></i>12%
                              </Badge>
                            </div>
                            <div className="stat-icon bg-primary bg-opacity-10 text-primary">
                              <i className="bi bi-people-fill"></i>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card className="stat-card shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="text-muted small mb-2">INGO</p>
                              <h3 className="fw-bold mb-2">{ingo.length}</h3>
                              <Badge bg="info" className="small">
                                <i className="bi bi-arrow-up me-1"></i>8%
                              </Badge>
                            </div>
                            <div className="stat-icon bg-info bg-opacity-10 text-info">
                              <i className="bi bi-house-door-fill"></i>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card className="stat-card shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="text-muted small mb-2">RAPORO</p>
                              <h3 className="fw-bold mb-2">{raporo.length}</h3>
                              <Badge bg="warning" className="small">
                                <i className="bi bi-arrow-down me-1"></i>3%
                              </Badge>
                            </div>
                            <div className="stat-icon bg-warning bg-opacity-10 text-warning">
                              <i className="bi bi-file-text-fill"></i>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                  <Col xs={12} sm={6} lg={3}>
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Card className="stat-card shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="text-muted small mb-2">GAHUNDA</p>
                              <h3 className="fw-bold mb-2">{imibereho.length}</h3>
                              <Badge bg="success" className="small">
                                <i className="bi bi-arrow-up me-1"></i>15%
                              </Badge>
                            </div>
                            <div className="stat-icon bg-success bg-opacity-10 text-success">
                              <i className="bi bi-clipboard-check-fill"></i>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                </Row>

                {/* Main Content Row */}
                <Row className="g-4">
                  {/* Progress Overview */}
                  <Col lg={8}>
                    <Card className="glass-card mb-4">
                      <Card.Header className="bg-transparent border-0 pb-0">
                        <h5 className="fw-bold">
                          <i className="bi bi-graph-up me-2"></i>
                          Iterambere ry'Imishinga
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <Row className="mb-4">
                          <Col md={4} className="text-center">
                            <div className="mb-3">
                              <svg width="120" height="120" viewBox="0 0 120 120">
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke="#e9ecef"
                                  strokeWidth="10"
                                />
                                <circle
                                  className="progress-ring-circle"
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  fill="none"
                                  stroke="#667eea"
                                  strokeWidth="10"
                                  strokeDasharray={`${completionRate * 3.14} 314`}
                                  transform="rotate(-90 60 60)"
                                />
                                <text x="60" y="60" textAnchor="middle" dy="0.3em" fontSize="24" fontWeight="bold">
                                  {completionRate}%
                                </text>
                              </svg>
                            </div>
                            <h6>Urwego rwo Kurangiza</h6>
                          </Col>
                          <Col md={8}>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Zarangiye</span>
                                <Badge bg="success">{completedProjects}</Badge>
                              </div>
                              <ProgressBar now={(completedProjects / totalProjects) * 100} variant="success" />
                            </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Ziri gukorwa</span>
                                <Badge bg="warning">{activeProjects}</Badge>
                              </div>
                              <ProgressBar now={(activeProjects / totalProjects) * 100} variant="warning" />
                            </div>
                            <div className="mb-3">
                              <div className="d-flex justify-content-between mb-2">
                                <span>Zose hamwe</span>
                                <Badge bg="primary">{totalProjects}</Badge>
                              </div>
                              <ProgressBar now={100} variant="primary" />
                            </div>
                          </Col>
                        </Row>

                        {/* Quick Actions */}
                        <h6 className="fw-bold mb-3">Ibikorwa byihuse</h6>
                        <Row className="g-3">
                          <Col xs={6} md={3}>
                            <Button 
                              variant="light" 
                              className="quick-action-btn w-100 h-100"
                              onClick={() => setShowQuickAdd(true)}
                            >
                              <i className="bi bi-plus-circle fs-4 d-block mb-2"></i>
                              <small>Ongeraho</small>
                            </Button>
                          </Col>
                          <Col xs={6} md={3}>
                            <Button variant="light" className="quick-action-btn w-100 h-100">
                              <i className="bi bi-file-earmark-text fs-4 d-block mb-2"></i>
                              <small>Raporo</small>
                            </Button>
                          </Col>
                          <Col xs={6} md={3}>
                            <Button variant="light" className="quick-action-btn w-100 h-100">
                              <i className="bi bi-graph-up-arrow fs-4 d-block mb-2"></i>
                              <small>Imibare</small>
                            </Button>
                          </Col>
                          <Col xs={6} md={3}>
                            <Button variant="light" className="quick-action-btn w-100 h-100">
                              <i className="bi bi-gear fs-4 d-block mb-2"></i>
                              <small>Igenamiterere</small>
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    {/* Recent Reports */}
                    <Card className="glass-card">
                      <Card.Header className="bg-transparent border-0">
                        <h5 className="fw-bold">
                          <i className="bi bi-clock-history me-2"></i>
                          Raporo za vuba
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <ListGroup variant="flush">
                          {raporo.slice(0, 5).map((r, index) => (
                            <ListGroup.Item key={index} className="px-0">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <h6 className="mb-1">{r.title || `Raporo #${index + 1}`}</h6>
                                  <small className="text-muted">
                                    <i className="bi bi-calendar3 me-1"></i>
                                    {new Date(r.date || Date.now()).toLocaleDateString('rw-RW')}
                                  </small>
                                </div>
                                <Button variant="outline-primary" size="sm">
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </div>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* Side Panel */}
                  <Col lg={4}>
                    {/* Recent Activities */}
                    <Card className="glass-card mb-4">
                      <Card.Header className="bg-transparent border-0">
                        <h5 className="fw-bold">
                          <i className="bi bi-activity me-2"></i>
                          Ibikorwa bya vuba
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {recentActivities.map((activity, index) => (
                          <div
                            key={index}
                            className={`activity-item border-${activity.type}`}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <Badge bg={activity.type} className="mb-2">
                                  <i className={`bi bi-${
                                    activity.type === 'success' ? 'check-circle' :
                                    activity.type === 'info' ? 'info-circle' :
                                    'exclamation-triangle'
                                  } me-1`}></i>
                                  {activity.type === 'success' ? 'Byarangiye' :
                                   activity.type === 'info' ? 'Amakuru' : 'Icyitonderwa'}
                                </Badge>
                                <p className="mb-1">{activity.message}</p>
                              </div>
                            </div>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              {activity.time}
                            </small>
                          </div>
                        ))}
                      </Card.Body>
                    </Card>

                    {/* Calendar Widget */}
                    <Card className="glass-card">
                      <Card.Header className="bg-transparent border-0">
                        <h5 className="fw-bold">
                          <i className="bi bi-calendar-week me-2"></i>
                          Kalendari
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        <div className="text-center p-3 bg-light rounded">
                          <h1 className="display-4 fw-bold text-primary">
                            {new Date().getDate()}
                          </h1>
                          <p className="mb-0">
                            {new Date().toLocaleDateString('rw-RW', { month: 'long' })}
                          </p>
                        </div>
                        <div className="mt-3">
                          <h6 className="fw-bold mb-3">Ibiri guteganywa</h6>
                          <div className="d-flex align-items-center mb-2">
                            <Badge bg="primary" className="me-2">09:00</Badge>
                            <small>Inama y'abaturage</small>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <Badge bg="warning" className="me-2">14:00</Badge>
                            <small>Isuzuma ry'imishinga</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <Badge bg="success" className="me-2">16:00</Badge>
                            <small>Gushyikiriza raporo</small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </>
            )}

            {activeTab === "rukora" && <UrubyirukoRukora />}
            {activeTab === "rudafite" && <UrubyirukoRudafiteAkazi />}
            {activeTab === "abana" && <AbanaMirireMibi />}
            {activeTab === "abakobwa" && <AbakobwaBabyaye />}
            {activeTab === "abagore" && <AbagoreBatwite />}
          </motion.div>
        </AnimatePresence>

        {/* Floating Action Button */}
        <button 
          className="floating-action-btn"
          onClick={() => setShowQuickAdd(true)}
        >
          <i className="bi bi-plus-lg"></i>
        </button>

        {/* Notifications Modal */}
        <Modal show={showNotifications} onHide={() => setShowNotifications(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title>
              <i className="bi bi-bell me-2"></i>
              Amatangazo
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ListGroup variant="flush">
              {notifications.map((notif) => (
                <ListGroup.Item key={notif.id} className="border-0">
                  <div className="d-flex align-items-start">
                    <Badge bg={notif.type} className="me-3 mt-1">
                      <i className={`bi bi-${
                        notif.type === 'success' ? 'check' :
                        notif.type === 'warning' ? 'exclamation' : 'info'
                      }`}></i>
                    </Badge>
                    <div className="flex-grow-1">
                      <p className="mb-1">{notif.message}</p>
                      <small className="text-muted">Hashize iminota 5</small>
                    </div>
                    <Button variant="light" size="sm">
                      <i className="bi bi-x"></i>
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>
          <Modal.Footer className="border-0">
            <Button variant="link" className="text-primary">
              Reba byose
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Quick Add Modal */}
        <Modal show={showQuickAdd} onHide={() => setShowQuickAdd(false)} centered>
          <Modal.Header closeButton className="border-0">
            <Modal.Title>
              <i className="bi bi-plus-circle me-2"></i>
              Ongeraho byihuse
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-grid gap-2">
              <Button variant="outline-primary" className="text-start">
                <i className="bi bi-person-plus me-2"></i>
                Ongeraho Umuturage
              </Button>
              <Button variant="outline-info" className="text-start">
                <i className="bi bi-house-add me-2"></i>
                Ongeraho Inzu
              </Button>
              <Button variant="outline-success" className="text-start">
                <i className="bi bi-clipboard-plus me-2"></i>
                Ongeraho Gahunda
              </Button>
              <Button variant="outline-warning" className="text-start">
                <i className="bi bi-file-earmark-plus me-2"></i>
                Andika Raporo
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default DashboardUmunyamabanga;