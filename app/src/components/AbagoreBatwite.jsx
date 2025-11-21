import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Form,
  Modal,
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Spinner,
  InputGroup,
  Pagination,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
  Nav,
  Tab,
  ListGroup,
  Breadcrumb,
  ButtonGroup,
  Accordion,
  Timeline
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AbagoreBatwite() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTrimester, setFilterTrimester] = useState("all");
  const [filterCheckup, setFilterCheckup] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [errors, setErrors] = useState({});
  const [statistics, setStatistics] = useState({
    total: 0,
    firstTrimester: 0,
    secondTrimester: 0,
    thirdTrimester: 0,
    checkedUp: 0,
    notCheckedUp: 0,
    highRisk: 0,
    avgMonths: 0,
    dueThisMonth: 0
  });

  const [form, setForm] = useState({
    amazina: "",
    imyaka: "",
    nimero_ya_telephone: "",
    aderesi: "",
    amezi_atwite: "",
    asuzumwe_kuvuzi: "Oya",
    itariki_yo_gusuzuma: "",
    inshuro_yasuzumwe: 0,
    ibibazo_byihariye: "",
    umuganga_umukurikirana: "",
    itariki_ateganijwe_kubyarira: ""
  });

  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    type: "",
    notes: ""
  });

  // Calculate trimester
  const getTrimester = (months) => {
    if (months <= 3) return 1;
    if (months <= 6) return 2;
    return 3;
  };

  // Get risk level
  const getRiskLevel = (age, months, hasCheckup, specialIssues) => {
    if (specialIssues || (age < 18 || age > 40) || (months >= 7 && hasCheckup === "Oya")) {
      return "high";
    }
    if ((age < 20 || age > 35) || (months >= 4 && hasCheckup === "Oya")) {
      return "medium";
    }
    return "low";
  };

  // Calculate due date
  const calculateDueDate = (months) => {
    const remainingMonths = 9 - parseInt(months);
    const dueDate = new Date();
    dueDate.setMonth(dueDate.getMonth() + remainingMonths);
    return dueDate.toLocaleDateString('rw-RW');
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.amazina.trim()) newErrors.amazina = "Amazina arakenewe";
    if (!form.imyaka || form.imyaka < 15 || form.imyaka > 50) 
      newErrors.imyaka = "Imyaka igomba kuba hagati ya 15-50";
    if (!form.nimero_ya_telephone.trim()) 
      newErrors.nimero_ya_telephone = "Telephone irakenewe";
    if (form.nimero_ya_telephone && !/^\d{10}$/.test(form.nimero_ya_telephone.replace(/\s/g, ''))) 
      newErrors.nimero_ya_telephone = "Telephone igomba kuba imibare 10";
    if (!form.aderesi.trim()) newErrors.aderesi = "Aderesi irakenewe";
    if (!form.amezi_atwite || form.amezi_atwite < 1 || form.amezi_atwite > 9) 
      newErrors.amezi_atwite = "Amezi agomba kuba hagati ya 1-9";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/abagore_batwite");
      setData(res.data);
      setFilteredData(res.data);
      calculateStatistics(res.data);
    } catch (error) {
      showAlert("Habaye ikosa mu gushaka amakuru", "danger");
    }
    setLoading(false);
  };

  // Calculate Statistics
  const calculateStatistics = (data) => {
    const now = new Date();
    const stats = {
      total: data.length,
      firstTrimester: data.filter(d => getTrimester(d.amezi_atwite) === 1).length,
      secondTrimester: data.filter(d => getTrimester(d.amezi_atwite) === 2).length,
      thirdTrimester: data.filter(d => getTrimester(d.amezi_atwite) === 3).length,
      checkedUp: data.filter(d => d.asuzumwe_kuvuzi === "Yego").length,
      notCheckedUp: data.filter(d => d.asuzumwe_kuvuzi === "Oya").length,
      highRisk: data.filter(d => {
        const risk = getRiskLevel(d.imyaka, d.amezi_atwite, d.asuzumwe_kuvuzi, d.ibibazo_byihariye);
        return risk === "high";
      }).length,
      avgMonths: data.length > 0 ? 
        Math.round(data.reduce((sum, d) => sum + parseInt(d.amezi_atwite || 0), 0) / data.length) : 0,
      dueThisMonth: data.filter(d => parseInt(d.amezi_atwite) >= 8).length
    };
    setStatistics(stats);
  };

  // Filter and Search
  useEffect(() => {
    let filtered = data;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.amazina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.aderesi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nimero_ya_telephone?.includes(searchTerm) ||
        item.umuganga_umukurikirana?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Trimester filter
    if (filterTrimester !== "all") {
      filtered = filtered.filter(item => getTrimester(item.amezi_atwite) === parseInt(filterTrimester));
    }

    // Checkup filter
    if (filterCheckup !== "all") {
      filtered = filtered.filter(item => item.asuzumwe_kuvuzi === filterCheckup);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterTrimester, filterCheckup, data]);

  useEffect(() => {
    loadData();
  }, []);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Alert
  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 5000);
  };

  // Handle Form Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Save
  const handleSave = async () => {
    if (!validateForm()) return;

    // Calculate due date if not set
    if (!form.itariki_ateganijwe_kubyarira && form.amezi_atwite) {
      form.itariki_ateganijwe_kubyarira = calculateDueDate(form.amezi_atwite);
    }

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/abagore_batwite/${editId}`, form);
        showAlert("Amakuru yahinduwe neza!", "success");
      } else {
        await axios.post("http://localhost:5000/abagore_batwite", form);
        showAlert("Amakuru yongeweho neza!", "success");
      }
      setShow(false);
      resetForm();
      loadData();
    } catch (error) {
      showAlert("Habaye ikosa mu kubika amakuru", "danger");
    }
    setLoading(false);
  };

  // Edit
  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setErrors({});
    setShow(true);
  };

  // Delete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5000/abagore_batwite/${deleteId}`);
      showAlert("Amakuru yasibwe neza!", "success");
      loadData();
    } catch (error) {
      showAlert("Habaye ikosa mu gusiba amakuru", "danger");
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Schedule Appointment
  const handleScheduleAppointment = (person) => {
    setSelectedPerson(person);
    setShowAppointmentModal(true);
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      amazina: "",
      imyaka: "",
      nimero_ya_telephone: "",
      aderesi: "",
      amezi_atwite: "",
      asuzumwe_kuvuzi: "Oya",
      itariki_yo_gusuzuma: "",
      inshuro_yasuzumwe: 0,
      ibibazo_byihariye: "",
      umuganga_umukurikirana: "",
      itariki_ateganijwe_kubyarira: ""
    });
    setEditId(null);
    setErrors({});
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Amazina", "Imyaka", "Telephone", "Aderesi", "Amezi Atwite", "Asuzumwe", "Umuganga", "Itariki y'kubyara"],
      ...filteredData.map(d => [
        d.amazina, d.imyaka, d.nimero_ya_telephone, d.aderesi, 
        d.amezi_atwite, d.asuzumwe_kuvuzi, d.umuganga_umukurikirana || "", 
        d.itariki_ateganijwe_kubyarira || calculateDueDate(d.amezi_atwite)
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abagore_batwite.csv';
    a.click();
  };

  // Trimester Badge
  const TrimesterBadge = ({ months }) => {
    const trimester = getTrimester(months);
    const config = {
      1: { color: "info", icon: "1-circle", label: "Igihembwe cya 1" },
      2: { color: "warning", icon: "2-circle", label: "Igihembwe cya 2" },
      3: { color: "success", icon: "3-circle", label: "Igihembwe cya 3" }
    };
    const settings = config[trimester];
    return (
      <Badge bg={settings.color} className="d-inline-flex align-items-center">
        <i className={`bi bi-${settings.icon} me-1`}></i>
        {settings.label}
      </Badge>
    );
  };

  // Risk Badge
  const RiskBadge = ({ age, months, hasCheckup, issues }) => {
    const risk = getRiskLevel(age, months, hasCheckup, issues);
    const config = {
      high: { color: "danger", icon: "exclamation-triangle-fill", label: "Ibyago Byinshi" },
      medium: { color: "warning", icon: "exclamation-circle", label: "Ibyago Biri Hagati" },
      low: { color: "success", icon: "check-circle", label: "Ibyago Bike" }
    };
    const settings = config[risk];
    return (
      <Badge bg={settings.color} className={risk === "high" ? "priority-indicator" : ""}>
        <i className={`bi bi-${settings.icon} me-1`}></i>
        {settings.label}
      </Badge>
    );
  };

  // Card View Component
  const CardViewItem = ({ item }) => {
    const risk = getRiskLevel(item.imyaka, item.amezi_atwite, item.asuzumwe_kuvuzi, item.ibibazo_byihariye);
    const dueDate = item.itariki_ateganijwe_kubyarira || calculateDueDate(item.amezi_atwite);
    
    return (
      <Col md={6} lg={4} className="mb-4">
        <Card className={`h-100 shadow-sm hover-card ${risk === "high" ? 'border-danger border-2' : ''}`}>
          <Card.Header className={`${risk === "high" ? 'bg-danger bg-opacity-10' : 'bg-light'}`}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>{item.amazina}
              </h6>
              <TrimesterBadge months={item.amezi_atwite} />
            </div>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <span><i className="bi bi-calendar3 me-2 text-muted"></i>Imyaka:</span>
                <strong>{item.imyaka}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <span><i className="bi bi-clock me-2 text-muted"></i>Amezi:</span>
                <strong>{item.amezi_atwite} amezi</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <i className="bi bi-telephone me-2 text-muted"></i>
                <a href={`tel:${item.nimero_ya_telephone}`} className="text-decoration-none">
                  {item.nimero_ya_telephone}
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <i className="bi bi-geo-alt me-2 text-muted"></i>
                {item.aderesi}
              </ListGroup.Item>
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <span><i className="bi bi-hospital me-2 text-muted"></i>Isuzuma:</span>
                <Badge bg={item.asuzumwe_kuvuzi === "Yego" ? "success" : "secondary"}>
                  {item.asuzumwe_kuvuzi === "Yego" ? "Yasuzumwe" : "Ntiyasuzumwe"}
                </Badge>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-shield-check me-2 text-muted"></i>Ibyago:</span>
                  <RiskBadge 
                    age={item.imyaka} 
                    months={item.amezi_atwite} 
                    hasCheckup={item.asuzumwe_kuvuzi}
                    issues={item.ibibazo_byihariye}
                  />
                </div>
              </ListGroup.Item>
            </ListGroup>
            <Alert variant="info" className="mt-2 mb-0 py-1 px-2">
              <small>
                <i className="bi bi-calendar-event me-1"></i>
                Azabyara: <strong>{dueDate}</strong>
              </small>
            </Alert>
          </Card.Body>
          <Card.Footer className="bg-light">
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => handleScheduleAppointment(item)}
              >
                <i className="bi bi-calendar-plus"></i> Gahunda
              </Button>
              <ButtonGroup size="sm">
                <Button variant="outline-warning" onClick={() => handleEdit(item)}>
                  <i className="bi bi-pencil"></i>
                </Button>
                <Button variant="outline-danger" onClick={() => handleDeleteClick(item.id)}>
                  <i className="bi bi-trash"></i>
                </Button>
              </ButtonGroup>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    );
  };

  // Statistics Card
  const StatCard = ({ title, value, icon, color, subtitle, progress }) => (
    <Card className="border-0 shadow-sm h-100 hover-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1">
            <p className="text-muted mb-1 small text-uppercase fw-semibold">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {progress !== undefined && (
              <ProgressBar 
                variant={color} 
                now={progress} 
                className="mt-2" 
                style={{height: '5px'}}
              />
            )}
          </div>
          <div className={`stat-icon bg-${color} bg-opacity-10 text-${color} rounded-3 p-3`}>
            <i className={`bi bi-${icon} fs-4`}></i>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid className="py-4 bg-light min-vh-100">
      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
        }
        .stat-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .bg-gradient-pink {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .priority-indicator {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        .timeline-item {
          position: relative;
          padding-left: 40px;
          margin-bottom: 20px;
        }
        .timeline-item::before {
          content: '';
          position: absolute;
          left: 9px;
          top: 5px;
          height: calc(100% + 10px);
          width: 2px;
          background: #dee2e6;
        }
        .timeline-item:last-child::before {
          display: none;
        }
        .timeline-dot {
          position: absolute;
          left: 0;
          top: 0;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 3px solid #6c757d;
        }
        .timeline-dot.active {
          border-color: #28a745;
          background: #28a745;
        }
      `}</style>

      <Container>
        {/* Header */}
        <Card className="mb-4 border-0 shadow bg-gradient-pink text-white">
          <Card.Body className="py-4">
            <Row className="align-items-center">
              <Col>
                <h2 className="fw-bold mb-0">
                  <i className="bi bi-heart-pulse-fill me-3"></i>
                  Abagore Batwite
                </h2>
                <p className="mb-0 opacity-90">
                  Gukurikirana no gufasha abagore batwite mu buzima bwabo
                </p>
                <Breadcrumb className="mt-2 bg-transparent">
                  <Breadcrumb.Item className="text-white-50">Ahabanza</Breadcrumb.Item>
                  <Breadcrumb.Item className="text-white-50">Ubuzima</Breadcrumb.Item>
                  <Breadcrumb.Item className="text-white" active>Abagore Batwite</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xs="auto">
                <div className="d-flex gap-2">
                  <Button 
                    variant="light" 
                    onClick={exportToCSV}
                    className="shadow-sm"
                  >
                    <i className="bi bi-download me-2"></i>Export
                  </Button>
                  <Button 
                    variant="warning" 
                    onClick={() => { resetForm(); setShow(true); }}
                    className="shadow-sm text-dark"
                  >
                    <i className="bi bi-plus-circle-fill me-2"></i>Ongeraho
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Alert */}
        {alert.show && (
          <Alert 
            variant={alert.type} 
            dismissible 
            onClose={() => setAlert({ show: false, message: "", type: "" })}
            className="shadow-sm border-0"
          >
            <i className={`bi bi-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            {alert.message}
          </Alert>
        )}

        {/* High Risk Alert */}
        {statistics.highRisk > 0 && (
          <Alert variant="danger" className="shadow-sm border-0 mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2 priority-indicator"></i>
            <strong>Icyitonderwa:</strong> Hari abagore <strong>{statistics.highRisk}</strong> bafite ibyago byinshi, bakeneye gukurikiranwa cyane!
          </Alert>
        )}

        {/* Tabs */}
        <Tab.Container defaultActiveKey="data">
          <Card className="mb-3 border-0 shadow-sm">
            <Card.Body>
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="data">
                    <i className="bi bi-table me-2"></i>Amakuru
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="statistics">
                    <i className="bi bi-graph-up me-2"></i>Imibare
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="checkups">
                    <i className="bi bi-hospital me-2"></i>Amasuzuma
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="timeline">
                    <i className="bi bi-calendar-week me-2"></i>Gahunda
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="resources">
                    <i className="bi bi-book me-2"></i>Ubumenyi
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>

          <Tab.Content>
            {/* Data Tab */}
            <Tab.Pane eventKey="data">
              {/* Quick Stats */}
              <Row className="mb-4">
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Abagore Bose" 
                    value={statistics.total} 
                    icon="people-fill" 
                    color="primary"
                    subtitle="Banditswe muri sisiteme"
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Basuzumwe" 
                    value={statistics.checkedUp}
                    icon="hospital" 
                    color="success"
                    subtitle={`${statistics.total > 0 ? Math.round((statistics.checkedUp/statistics.total)*100) : 0}% basuzumwe`}
                    progress={statistics.total > 0 ? (statistics.checkedUp/statistics.total)*100 : 0}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Ibyago Byinshi" 
                    value={statistics.highRisk}
                    icon="exclamation-triangle-fill" 
                    color="danger"
                    subtitle="Bakeneye ubufasha"
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Bazabyara Vuba" 
                    value={statistics.dueThisMonth}
                    icon="calendar-heart" 
                    color="warning"
                    subtitle="Iki kwezi"
                  />
                </Col>
              </Row>

              {/* Filters */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0">
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Shakisha amazina, aderesi, telephone..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border-start-0"
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterTrimester}
                        onChange={(e) => setFilterTrimester(e.target.value)}
                      >
                        <option value="all">Ibihembwe Byose</option>
                        <option value="1">Igihembwe cya 1</option>
                        <option value="2">Igihembwe cya 2</option>
                        <option value="3">Igihembwe cya 3</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterCheckup}
                        onChange={(e) => setFilterCheckup(e.target.value)}
                      >
                        <option value="all">Isuzuma - Byose</option>
                        <option value="Yego">Basuzumwe</option>
                        <option value="Oya">Batasuzumwe</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <div className="btn-group w-100">
                        <Button 
                          variant={viewMode === "table" ? "primary" : "outline-primary"}
                          onClick={() => setViewMode("table")}
                        >
                          <i className="bi bi-table"></i>
                        </Button>
                        <Button 
                          variant={viewMode === "card" ? "primary" : "outline-primary"}
                          onClick={() => setViewMode("card")}
                        >
                          <i className="bi bi-grid-3x3-gap"></i>
                        </Button>
                      </div>
                    </Col>
                    <Col md={2}>
                      <small className="text-muted d-block text-end mt-2">
                        Habonetse {filteredData.length} / {data.length}
                      </small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Data Display */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" className="mb-3" />
                  <p className="text-muted">Tegereza gato...</p>
                </div>
              ) : viewMode === "table" ? (
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th className="text-center">#</th>
                            <th><i className="bi bi-person me-1"></i>Amazina</th>
                            <th><i className="bi bi-calendar me-1"></i>Imyaka</th>
                            <th><i className="bi bi-telephone me-1"></i>Telephone</th>
                            <th><i className="bi bi-geo-alt me-1"></i>Aderesi</th>
                            <th><i className="bi bi-clock me-1"></i>Amezi</th>
                            <th><i className="bi bi-layers me-1"></i>Igihembwe</th>
                            <th><i className="bi bi-hospital me-1"></i>Isuzuma</th>
                            <th><i className="bi bi-shield me-1"></i>Ibyago</th>
                            <th className="text-center">Ibikorwa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="text-center py-5">
                                <i className="bi bi-inbox display-1 text-muted"></i>
                                <p className="text-muted mt-2">Nta makuru abonetse</p>
                              </td>
                            </tr>
                          ) : (
                            currentItems.map((d, i) => {
                              const risk = getRiskLevel(d.imyaka, d.amezi_atwite, d.asuzumwe_kuvuzi, d.ibibazo_byihariye);
                              return (
                                <tr key={d.id} className={`align-middle ${risk === "high" ? 'table-danger' : ''}`}>
                                  <td className="text-center">{indexOfFirstItem + i + 1}</td>
                                  <td className="fw-semibold">{d.amazina}</td>
                                  <td>{d.imyaka} imyaka</td>
                                  <td>
                                    <a href={`tel:${d.nimero_ya_telephone}`} className="text-decoration-none">
                                      {d.nimero_ya_telephone}
                                    </a>
                                  </td>
                                  <td><small>{d.aderesi}</small></td>
                                  <td>
                                    <Badge bg="info" className="rounded-pill">
                                      {d.amezi_atwite} amezi
                                    </Badge>
                                  </td>
                                  <td>
                                    <TrimesterBadge months={d.amezi_atwite} />
                                  </td>
                                  <td>
                                    <Badge bg={d.asuzumwe_kuvuzi === "Yego" ? "success" : "secondary"}>
                                      {d.asuzumwe_kuvuzi === "Yego" ? (
                                        <><i className="bi bi-check-circle me-1"></i>Yasuzumwe</>
                                      ) : (
                                        <><i className="bi bi-x-circle me-1"></i>Ntiyasuzumwe</>
                                      )}
                                    </Badge>
                                  </td>
                                  <td>
                                    <RiskBadge 
                                      age={d.imyaka} 
                                      months={d.amezi_atwite} 
                                      hasCheckup={d.asuzumwe_kuvuzi}
                                      issues={d.ibibazo_byihariye}
                                    />
                                  </td>
                                  <td>
                                    <div className="d-flex gap-1 justify-content-center">
                                      <OverlayTrigger overlay={<Tooltip>Gahunda y'Isuzuma</Tooltip>}>
                                        <Button 
                                          variant="outline-primary" 
                                          size="sm"
                                          onClick={() => handleScheduleAppointment(d)}
                                        >
                                          <i className="bi bi-calendar-plus"></i>
                                        </Button>
                                      </OverlayTrigger>
                                      <OverlayTrigger overlay={<Tooltip>Hindura</Tooltip>}>
                                        <Button 
                                          variant="outline-warning" 
                                          size="sm"
                                          onClick={() => handleEdit(d)}
                                        >
                                          <i className="bi bi-pencil"></i>
                                        </Button>
                                      </OverlayTrigger>
                                      <OverlayTrigger overlay={<Tooltip>Siba</Tooltip>}>
                                        <Button 
                                          variant="outline-danger" 
                                          size="sm"
                                          onClick={() => handleDeleteClick(d.id)}
                                        >
                                          <i className="bi bi-trash"></i>
                                        </Button>
                                      </OverlayTrigger>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {currentItems.map((item) => (
                    <CardViewItem key={item.id} item={item} />
                  ))}
                </Row>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Pagination.Item
                          key={pageNum}
                          active={pageNum === currentPage}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Pagination.Item>
                      );
                    })}
                    {totalPages > 5 && <Pagination.Ellipsis />}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                  </Pagination>
                </div>
              )}
            </Tab.Pane>

            {/* Statistics Tab */}
            <Tab.Pane eventKey="statistics">
              <Row>
                <Col lg={8}>
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-graph-up me-2"></i>Imibare y'Abagore Batwite
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6} className="mb-4">
                          <h6 className="text-center text-muted mb-3">Ibihembwe by'Inda</h6>
                          <div className="text-center mb-3">
                            <div className="d-flex justify-content-around">
                              <div>
                                <Badge bg="info" className="p-3 rounded-circle">
                                  <h4 className="mb-0">{statistics.firstTrimester}</h4>
                                </Badge>
                                <p className="text-muted mt-2 small">Igihembwe 1</p>
                              </div>
                              <div>
                                <Badge bg="warning" className="p-3 rounded-circle">
                                  <h4 className="mb-0">{statistics.secondTrimester}</h4>
                                </Badge>
                                <p className="text-muted mt-2 small">Igihembwe 2</p>
                              </div>
                              <div>
                                <Badge bg="success" className="p-3 rounded-circle">
                                  <h4 className="mb-0">{statistics.thirdTrimester}</h4>
                                </Badge>
                                <p className="text-muted mt-2 small">Igihembwe 3</p>
                              </div>
                            </div>
                          </div>
                        </Col>
                        <Col md={6} className="mb-4">
                          <h6 className="text-center text-muted mb-3">Uko Amasuzuma Ahagaze</h6>
                          <div className="d-flex justify-content-center align-items-center mb-3">
                            <div className="text-center me-4">
                              <i className="bi bi-check-circle-fill display-3 text-success"></i>
                              <h4 className="mt-2">{statistics.checkedUp}</h4>
                              <small className="text-muted">Basuzumwe</small>
                            </div>
                            <div className="text-center ms-4">
                              <i className="bi bi-x-circle-fill display-3 text-secondary"></i>
                              <h4 className="mt-2">{statistics.notCheckedUp}</h4>
                              <small className="text-muted">Batasuzumwe</small>
                            </div>
                          </div>
                          <ProgressBar>
                            <ProgressBar 
                              variant="success" 
                              now={statistics.total > 0 ? (statistics.checkedUp/statistics.total)*100 : 0} 
                              label={`${Math.round((statistics.checkedUp/statistics.total)*100 || 0)}%`}
                            />
                            <ProgressBar 
                              variant="secondary" 
                              now={statistics.total > 0 ? (statistics.notCheckedUp/statistics.total)*100 : 0} 
                              label={`${Math.round((statistics.notCheckedUp/statistics.total)*100 || 0)}%`}
                            />
                          </ProgressBar>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col className="text-center">
                          <h6 className="text-muted mb-3">Urwego rw'Ibyago</h6>
                          <div className="d-flex justify-content-around">
                            <div>
                              <i className="bi bi-shield-check display-4 text-success"></i>
                              <h5 className="mt-2">{statistics.total - statistics.highRisk}</h5>
                              <small className="text-muted">Ibyago Bike</small>
                            </div>
                            <div>
                              <i className="bi bi-exclamation-triangle-fill display-4 text-danger"></i>
                              <h5 className="mt-2">{statistics.highRisk}</h5>
                              <small className="text-muted">Ibyago Byinshi</small>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card className="mb-4 border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>Incamake
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span>Abagore bose:</span>
                          <strong>{statistics.total}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span>Ikigezi cy'amezi:</span>
                          <strong>{statistics.avgMonths} amezi</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0 text-success">
                          <span>Basuzumwe:</span>
                          <strong>{statistics.checkedUp} ({Math.round((statistics.checkedUp/statistics.total)*100 || 0)}%)</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0 text-danger">
                          <span>Ibyago byinshi:</span>
                          <strong>{statistics.highRisk}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0 text-warning">
                          <span>Bazabyara vuba:</span>
                          <strong>{statistics.dueThisMonth}</strong>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Checkups Tab */}
            <Tab.Pane eventKey="checkups">
              <Row>
                <Col md={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-hospital me-2"></i>Amasuzuma Ateganijwe
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Amazina</th>
                              <th>Telephone</th>
                              <th>Amezi</th>
                              <th>Isuzuma Rikurikira</th>
                              <th>Ibikorwa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.filter(d => d.asuzumwe_kuvuzi === "Oya" || parseInt(d.amezi_atwite) >= 7).slice(0, 5).map(d => (
                              <tr key={d.id}>
                                <td className="fw-semibold">{d.amazina}</td>
                                <td>{d.nimero_ya_telephone}</td>
                                <td>
                                  <Badge bg="info">{d.amezi_atwite} amezi</Badge>
                                </td>
                                <td>
                                  <Badge bg="warning">
                                    <i className="bi bi-calendar-event me-1"></i>
                                    Vuba
                                  </Badge>
                                </td>
                                <td>
                                  <Button size="sm" variant="outline-primary">
                                    <i className="bi bi-telephone me-1"></i>Hamagara
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-calendar-check me-2"></i>Amasuzuma
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="timeline">
                        <div className="timeline-item">
                          <div className="timeline-dot active"></div>
                          <div>
                            <h6 className="mb-1">Isuzuma rya mbere</h6>
                            <small className="text-muted">Ukwezi 1-3</small>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div>
                            <h6 className="mb-1">Isuzuma rya kabiri</h6>
                            <small className="text-muted">Ukwezi 4-6</small>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div>
                            <h6 className="mb-1">Isuzuma rya gatatu</h6>
                            <small className="text-muted">Ukwezi 7-8</small>
                          </div>
                        </div>
                        <div className="timeline-item">
                          <div className="timeline-dot"></div>
                          <div>
                            <h6 className="mb-1">Isuzuma rya kane</h6>
                            <small className="text-muted">Ukwezi 9</small>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Timeline Tab */}
            <Tab.Pane eventKey="timeline">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-bottom">
                  <h5 className="mb-0">
                    <i className="bi bi-calendar-week me-2"></i>Abazabyara Mu Mezi 3 Ari Imbere
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {data.filter(d => parseInt(d.amezi_atwite) >= 7).map(d => {
                      const dueDate = d.itariki_ateganijwe_kubyarira || calculateDueDate(d.amezi_atwite);
                      return (
                        <Col md={6} key={d.id} className="mb-3">
                          <Card className="border-start border-4 border-warning">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{d.amazina}</h6>
                                  <p className="text-muted mb-1 small">
                                    <i className="bi bi-telephone me-1"></i>{d.nimero_ya_telephone}
                                  </p>
                                  <p className="text-muted mb-0 small">
                                    <i className="bi bi-geo-alt me-1"></i>{d.aderesi}
                                  </p>
                                </div>
                                <div className="text-end">
                                  <Badge bg="warning" className="mb-1">
                                    {d.amezi_atwite} amezi
                                  </Badge>
                                  <p className="mb-0 small text-muted">
                                    Azabyara: <strong>{dueDate}</strong>
                                  </p>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Tab.Pane>

            {/* Resources Tab */}
            <Tab.Pane eventKey="resources">
              <Row>
                <Col md={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-book me-2"></i>Inama ku Bagore Batwite
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <i className="bi bi-egg-fried me-2"></i>
                            Imirire Myiza
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>✓ Kurya imboga n'imbuto buri munsi</ListGroup.Item>
                              <ListGroup.Item>✓ Kunywa amazi menshi (nibura 8 ibikombe)</ListGroup.Item>
                              <ListGroup.Item>✓ Gufata vitamini za foliki aside</ListGroup.Item>
                              <ListGroup.Item>✓ Kwirinda inzoga n'itabi</ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>
                            <i className="bi bi-activity me-2"></i>
                            Siporo n'Ikiruhuko
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>✓ Gukora siporo yoroshye iminota 30 buri munsi</ListGroup.Item>
                              <ListGroup.Item>✓ Kuruhuka nibura amasaha 8 mu ijoro</ListGroup.Item>
                              <ListGroup.Item>✓ Kwirinda imirimo iremereye</ListGroup.Item>
                              <ListGroup.Item>✓ Gukora yoga y'abagore batwite</ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>
                            <i className="bi bi-shield-check me-2"></i>
                            Ibimenyetso byo Kwitonderaho
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item className="text-danger">⚠ Kuva amaraso cyane</ListGroup.Item>
                              <ListGroup.Item className="text-danger">⚠ Ububabare bukabije bw'inda</ListGroup.Item>
                              <ListGroup.Item className="text-danger">⚠ Kuruka umutwe bikabije</ListGroup.Item>
                              <ListGroup.Item className="text-danger">⚠ Kubyimba amaguru cyane</ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-telephone me-2"></i>Aho Basaba Ubufasha
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="px-0">
                          <strong>Ambulance</strong><br/>
                          <small className="text-muted">Tel: 912 (24/7)</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>Ivuriro rya Leta</strong><br/>
                          <small className="text-muted">Tel: 0788 XXX XXX</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>RBC - Maternal Health</strong><br/>
                          <small className="text-muted">Tel: 114 (Hotline)</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>Umuganga w'Akarere</strong><br/>
                          <small className="text-muted">Tel: 0788 XXX XXX</small>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Add/Edit Modal */}
        <Modal show={show} onHide={() => { setShow(false); resetForm(); }} size="lg" centered>
          <Modal.Header closeButton className="bg-gradient-pink text-white">
            <Modal.Title>
              <i className={`bi bi-${editId ? 'pencil' : 'plus-circle'} me-2`}></i>
              {editId ? "Hindura" : "Ongeraho"} Umugore Utwite
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person me-1"></i>Amazina <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      name="amazina"
                      value={form.amazina} 
                      onChange={handleChange}
                      isInvalid={!!errors.amazina}
                      placeholder="Amazina yombi"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amazina}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-calendar3 me-1"></i>Imyaka <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="imyaka"
                      value={form.imyaka} 
                      onChange={handleChange}
                      isInvalid={!!errors.imyaka}
                      placeholder="15-50"
                      min="15"
                      max="50"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.imyaka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-telephone me-1"></i>Telephone <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      name="nimero_ya_telephone"
                      value={form.nimero_ya_telephone} 
                      onChange={handleChange}
                      isInvalid={!!errors.nimero_ya_telephone}
                      placeholder="07xxxxxxxx"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nimero_ya_telephone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-geo-alt me-1"></i>Aderesi <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      name="aderesi"
                      value={form.aderesi} 
                      onChange={handleChange}
                      isInvalid={!!errors.aderesi}
                      placeholder="Akarere, Umurenge, Akagari"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.aderesi}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-clock me-1"></i>Amezi atwite <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="amezi_atwite"
                      value={form.amezi_atwite} 
                      onChange={handleChange}
                      isInvalid={!!errors.amezi_atwite}
                      placeholder="1-9"
                      min="1"
                      max="9"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amezi_atwite}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-hospital me-1"></i>Asuzumwe ku muganga
                    </Form.Label>
                    <Form.Select 
                      name="asuzumwe_kuvuzi"
                      value={form.asuzumwe_kuvuzi} 
                      onChange={handleChange}
                      className={form.asuzumwe_kuvuzi === "Yego" ? "border-success" : "border-warning"}
                    >
                      <option value="Oya">Oya</option>
                      <option value="Yego">Yego</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-calendar-check me-1"></i>Inshuro yasuzumwe
                    </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="inshuro_yasuzumwe"
                      value={form.inshuro_yasuzumwe} 
                      onChange={handleChange}
                      placeholder="0-9"
                      min="0"
                      max="9"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person-badge me-1"></i>Umuganga umukurikirana
                    </Form.Label>
                    <Form.Control 
                      name="umuganga_umukurikirana"
                      value={form.umuganga_umukurikirana} 
                      onChange={handleChange}
                      placeholder="Izina ry'umuganga (optional)"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-calendar-heart me-1"></i>Itariki ateganijwe kubyarira
                    </Form.Label>
                    <Form.Control 
                      type="date"
                      name="itariki_ateganijwe_kubyarira"
                      value={form.itariki_ateganijwe_kubyarira} 
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-exclamation-triangle me-1"></i>Ibibazo byihariye
                    </Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      name="ibibazo_byihariye"
                      value={form.ibibazo_byihariye} 
                      onChange={handleChange}
                      placeholder="Andika ibibazo byihariye niba bihari (optional)"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {(form.amezi_atwite >= 7 && form.asuzumwe_kuvuzi === "Oya") && (
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Icyitonderwa:</strong> Umugore ufite amezi {form.amezi_atwite} ariko ntiyasuzumwe. Ni ngombwa gusura umuganga vuba!
                </Alert>
              )}
              {getRiskLevel(form.imyaka, form.amezi_atwite, form.asuzumwe_kuvuzi, form.ibibazo_byihariye) === "high" && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Ibyago Byinshi:</strong> Uyu mugore afite ibyago byinshi, akeneye gukurikiranwa cyane!
                </Alert>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => { setShow(false); resetForm(); }}>
              <i className="bi bi-x-circle me-1"></i>Hagarika
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" animation="border" className="me-2" />
                  Tegereza...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i>
                  {editId ? "Hindura" : "Bika"}
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Appointment Modal */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} centered>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              <i className="bi bi-calendar-plus me-2"></i>
              Gahunda y'Isuzuma
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPerson && (
              <div>
                <Alert variant="info">
                  <strong>{selectedPerson.amazina}</strong><br/>
                  <small>
                    Amezi: {selectedPerson.amezi_atwite} | Tel: {selectedPerson.nimero_ya_telephone}
                  </small>
                </Alert>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Itariki y'isuzuma</Form.Label>
                    <Form.Control 
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Isaha</Form.Label>
                    <Form.Control 
                      type="time"
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Ubwoko bw'isuzuma</Form.Label>
                    <Form.Select 
                      value={appointmentForm.type}
                      onChange={(e) => setAppointmentForm({...appointmentForm, type: e.target.value})}
                    >
                      <option value="">-- Hitamo --</option>
                      <option value="routine">Isuzuma risanzwe</option>
                      <option value="ultrasound">Ultrasound</option>
                      <option value="lab">Ibizamini</option>
                      <option value="special">Isuzuma ryihariye</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Inyongera</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={2}
                      value={appointmentForm.notes}
                      onChange={(e) => setAppointmentForm({...appointmentForm, notes: e.target.value})}
                      placeholder="Andika inyongera niba zihari"
                    />
                  </Form.Group>
                </Form>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
              <i className="bi bi-x-circle me-1"></i>Hagarika
            </Button>
            <Button variant="primary">
              <i className="bi bi-check-circle me-1"></i>Emeza Gahunda
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton className="bg-danger text-white">
            <Modal.Title>
              <i className="bi bi-exclamation-triangle me-2"></i>
              Emeza ko usiba
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center py-4">
            <i className="bi bi-trash display-1 text-danger mb-3"></i>
            <p className="fs-5">Uremeza ko ushaka gusiba aya makuru?</p>
            <p className="text-muted">Ibi bikorwa ntibizasubirwaho.</p>
          </Modal.Body>
          <Modal.Footer className="justify-content-center">
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              <i className="bi bi-x-circle me-1"></i>Oya
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              <i className="bi bi-trash me-1"></i>Yego, Siba
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </Container>
  );
}

export default AbagoreBatwite;