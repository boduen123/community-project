import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Navbar,
  Container,
  Row,
  Col,
  Nav,
  Tab,
  Button,
  Card,
  Spinner,
  Toast,
  ToastContainer,
  OverlayTrigger,
  Tooltip,
  Badge,
} from "react-bootstrap";

// 👉 Section components
import Urubyiruko from "./Urubyiruko";
import Abana from "./Abana";
import AbashesheAkanguhe from "./AbashesheAkanguhe";

// -------------- Styles injection --------------
const IsiboStyles = () => (
  <style>{`
    :root{
      --bg-light-start:#f0faf5;
      --bg-light-mid:#e6f7ee;
      --bg-light-end:#d9f0e5;
      --bg-dark-1:#071322;
      --bg-dark-2:#0b172a;
      --bg-dark-3:#0e2139;
      --border:#dbe7df;
      --shadow: 0 10px 28px rgba(9,30,66,.12);
      --shadow-strong: 0 18px 45px rgba(15,35,52,.55);
    }
    .isibo-shell{
      min-height:100vh;
      background:linear-gradient(to bottom,var(--bg-light-start),var(--bg-light-mid),var(--bg-light-end));
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    }
    .isibo-shell.dm{
      background:linear-gradient(to bottom,var(--bg-dark-1),var(--bg-dark-2),var(--bg-dark-3));
      color:#e5f4e8;
    }
    .isibo-shell.dm .card{
      background:rgba(6,18,32,.9);
      border-color:rgba(255,255,255,.06);
      color:#e5f4e8;
    }
    .isibo-shell .navbar{
      border-radius:1rem;
      box-shadow:var(--shadow);
    }
    .isibo-shell.dm .navbar{
      background:rgba(5,17,30,.95)!important;
      box-shadow:var(--shadow-strong);
    }
    .nav-tabs{
      border-bottom:none;
    }
    .nav-tabs .nav-link{
      color:#198754;
      font-weight:600;
      border-radius:0.8rem 0.8rem 0 0;
      border:none;
      padding:0.6rem 1.1rem;
      white-space:nowrap;
      transition:background-color .25s, color .25s, transform .15s;
    }
    .nav-tabs .nav-link:hover{
      background-color:rgba(25,135,84,.08);
      transform:translateY(-1px);
    }
    .nav-tabs .nav-link.active{
      background:linear-gradient(135deg,#198754,#20c997);
      color:#fff!important;
      box-shadow:0 6px 14px rgba(25,135,84,.4);
      transform:translateY(0);
    }
    .summary-card{
      border-radius:1.2rem;
      box-shadow:var(--shadow);
      transition:transform .18s ease, box-shadow .18s ease;
    }
    .summary-card:hover{
      transform:translateY(-4px);
      box-shadow:var(--shadow-strong);
    }
    .summary-icon{
      width:3rem;
      height:3rem;
      border-radius:999px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:1.3rem;
    }
    .isibo-shell.dm .nav-tabs .nav-link{
      color:#9fe7bf;
    }
    .isibo-shell.dm .nav-tabs .nav-link.active{
      color:#fff!important;
    }
    .isibo-shell.dm .text-muted{
      color:#b7c9c1!important;
    }
  `}</style>
);

// -------------- Main Component --------------
function DashboardIsibo() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [abayobozi, setAbayobozi] = useState([]);
  const [abaturage, setAbaturage] = useState([]);
  const [ingo, setIngo] = useState([]);
  const [raporo, setRaporo] = useState([]);
  const [imibereho, setImibereho] = useState([]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const API = "http://localhost:5000";
  const navigate = useNavigate();

  const fetchData = useCallback(
    async (background = false) => {
      if (background) setIsRefreshing(true);
      else setInitialLoading(true);

      try {
        const [abayoboziRes, abaturageRes, ingoRes, raporoRes, imiberehoRes] =
          await Promise.all([
            axios.get(`${API}/abayobozi`).catch(() => ({ data: [] })),
            axios.get(`${API}/abaturage`).catch(() => ({ data: [] })),
            axios.get(`${API}/ingo`).catch(() => ({ data: [] })),
            axios.get(`${API}/raporo`).catch(() => ({ data: [] })),
            axios.get(`${API}/imibereho-myiza`).catch(() => ({ data: [] })),
          ]);

        setAbayobozi(abayoboziRes.data);
        setAbaturage(abaturageRes.data);
        setIngo(ingoRes.data);
        setRaporo(raporoRes.data);
        setImibereho(imiberehoRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        if (background) setIsRefreshing(false);
        else setInitialLoading(false);
      }
    },
    [API]
  );

  useEffect(() => {
    fetchData(false);
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  const handleRefresh = () => {
    fetchData(true);
  };

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <Spinner animation="border" variant="success" role="status" />
      </div>
    );
  }

  return (
    <div className={`isibo-shell ${darkMode ? "dm" : ""}`}>
      <IsiboStyles />

      <Container fluid="md" className="py-4">
        {/* Header / Navbar */}
        <Navbar
          expand="md"
          bg={darkMode ? "dark" : "light"}
          variant={darkMode ? "dark" : "light"}
          className="mb-4 px-3"
        >
          <Navbar.Brand className="fw-bold text-success d-flex align-items-center">
            <i className="bi bi-geo-alt-fill me-2"></i>
            <span>Dashboard y&apos;Isibo</span>
            <Badge
              bg="success"
              className="ms-2 d-none d-sm-inline-flex align-items-center"
            >
              <i className="bi bi-shield-check me-1" /> Online
            </Badge>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="isibo-navbar" />

          <Navbar.Collapse
            id="isibo-navbar"
            className="justify-content-end gap-2 mt-2 mt-md-0"
          >
            <div className="d-flex align-items-center gap-2">
              {/* Refresh button */}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="refresh-tooltip">
                    Vugurura amakuru y&apos;isibo
                  </Tooltip>
                }
              >
                <span className="d-inline-block">
                  <Button
                    variant={darkMode ? "outline-light" : "outline-success"}
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                  >
                    {isRefreshing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Kuvugurura...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-arrow-clockwise me-1"></i>
                        Vugurura
                      </>
                    )}
                  </Button>
                </span>
              </OverlayTrigger>

              {/* Dark mode toggle */}
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="theme-tooltip">
                    Hindura {darkMode ? "umuco w&apos;umucyo" : "umuco w&apos;ijoro"}
                  </Tooltip>
                }
              >
                <Button
                  variant={darkMode ? "outline-light" : "outline-secondary"}
                  size="sm"
                  onClick={() => setDarkMode((prev) => !prev)}
                >
                  <i
                    className={`bi ${
                      darkMode ? "bi-sun-fill text-warning" : "bi-moon-stars"
                    }`}
                  ></i>
                </Button>
              </OverlayTrigger>

              {/* Logout */}
              <Button
                variant="outline-danger"
                size="sm"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>
                Sohoka
              </Button>
            </div>
          </Navbar.Collapse>
        </Navbar>

        {/* Navigation Tabs & Content */}
        <Tab.Container
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k || "dashboard")}
        >
          <Nav
            variant="tabs"
            className="mb-4 flex-nowrap overflow-auto pb-1"
            as="ul"
          >
            <Nav.Item as="li">
              <Nav.Link eventKey="dashboard">
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="urubyiruko">
                <i className="bi bi-people-fill me-1"></i>
                Urubyiruko
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="abana">
                <i className="bi bi-person-heart me-1"></i>
                Abana
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link eventKey="abasheshe">
                <i className="bi bi-person-badge me-1"></i>
                Abasheshe Akanguhe
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Dashboard overview */}
            <Tab.Pane eventKey="dashboard">
              <Row className="gy-3 gx-3">
                <Col xs={12} md={6} lg={3}>
                  <SummaryCard
                    label="Abaturage bose"
                    value={abaturage.length}
                    icon="bi-people-fill"
                    color="success"
                    subtitle="Abo muri iyi sibo bose"
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <SummaryCard
                    label="Ingo"
                    value={ingo.length}
                    icon="bi-house-fill"
                    color="info"
                    subtitle="Imiryango yanditse"
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <SummaryCard
                    label="Abayobozi b'isibo"
                    value={abayobozi.length}
                    icon="bi-person-lines-fill"
                    color="warning"
                    subtitle="Abayoboye iyi sibo"
                  />
                </Col>
                <Col xs={12} md={6} lg={3}>
                  <SummaryCard
                    label="Raporo"
                    value={raporo.length}
                    icon="bi-clipboard-data"
                    color="primary"
                    subtitle="Ibyegeranyo byatanzwe"
                  />
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xs={12} lg={6}>
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <Card.Title className="mb-3 d-flex align-items-center">
                        <i className="bi bi-activity text-danger me-2"></i>
                        Imibereho myiza
                        <Badge bg="danger" className="ms-2">
                          {imibereho.length}
                        </Badge>
                      </Card.Title>
                      <Card.Text className="text-muted mb-1">
                        Ibyiciro by&apos;imibereho myiza byanditswe muri iyi
                        sibo.
                      </Card.Text>
                      <Card.Text className="small text-muted">
                        Kanda ku bice byo hejuru nka Urubyiruko, Abana, cyangwa
                        Abasheshe Akanguhe kugira ngo urebe amakuru arambuye ku
                        byiciro by&apos;abaturage.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} lg={6} className="mt-3 mt-lg-0">
                  <Card className="shadow-sm h-100">
                    <Card.Body>
                      <Card.Title className="mb-3 d-flex align-items-center">
                        <i className="bi bi-lightbulb text-warning me-2"></i>
                        Ibyo ushobora gukora vuba
                      </Card.Title>
                      <div className="d-flex flex-wrap gap-2">
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => setActiveTab("urubyiruko")}
                        >
                          <i className="bi bi-people-fill me-1"></i>
                          Reba urubyiruko
                        </Button>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setActiveTab("abana")}
                        >
                          <i className="bi bi-person-heart me-1"></i>
                          Reba abana
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => setActiveTab("abasheshe")}
                        >
                          <i className="bi bi-person-badge me-1"></i>
                          Reba abasheshe
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Other tabs */}
            <Tab.Pane eventKey="urubyiruko">
              <Urubyiruko />
            </Tab.Pane>

            <Tab.Pane eventKey="abana">
              <Abana />
            </Tab.Pane>

            <Tab.Pane eventKey="abasheshe">
              <AbashesheAkanguhe />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Welcome toast */}
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 1060 }}
        >
          <Toast
            bg={darkMode ? "dark" : "light"}
            show={showWelcome}
            onClose={() => setShowWelcome(false)}
            delay={7000}
            autohide
          >
            <Toast.Header closeButton>
              <i className="bi bi-emoji-smile text-success me-2"></i>
              <strong className="me-auto">Murakaza neza</strong>
              <small className="text-muted">Dashboard y&apos;isibo</small>
            </Toast.Header>
            <Toast.Body className={darkMode ? "text-light" : ""}>
              Murakaza neza kuri dashboard y&apos;isibo. Hitamo agace hejuru
              kugira ngo urebe amakuru arambuye ku baturage, urubyiruko, abana
              n&apos;abasheshe akanguhe.
            </Toast.Body>
          </Toast>
        </ToastContainer>
      </Container>
    </div>
  );
}

// -------------- Summary Card Component --------------
const SummaryCard = ({ label, value, icon, color, subtitle }) => (
  <Card className="summary-card border-0">
    <Card.Body className="d-flex align-items-center">
      <div
        className={`summary-icon me-3 bg-${color}-subtle text-${color}`}
      >
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div className="text-muted text-uppercase small fw-semibold">
          {label}
        </div>
        <div className="fs-3 fw-bold">{value}</div>
        {subtitle && (
          <div className="small text-muted mt-1">{subtitle}</div>
        )}
      </div>
    </Card.Body>
  </Card>
);

export default DashboardIsibo;