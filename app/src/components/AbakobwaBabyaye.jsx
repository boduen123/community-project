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
  Dropdown
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AbakobwaBabyaye() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSchool, setFilterSchool] = useState("all");
  const [filterAgeGroup, setFilterAgeGroup] = useState("all");
  const [filterSupport, setFilterSupport] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [errors, setErrors] = useState({});
  const [statistics, setStatistics] = useState({
    total: 0,
    inSchool: 0,
    outOfSchool: 0,
    under16: 0,
    age16to18: 0,
    above18: 0,
    avgMotherAge: 0,
    avgChildAge: 0,
    needsUrgentSupport: 0,
    withSupport: 0
  });

  const [form, setForm] = useState({
    amazina: "",
    imyaka: "",
    aderesi: "",
    nimero_ya_telephone: "",
    umwana_ufite_imyaka: "",
    asubiye_mw_ishuri: "Oya",
    ubufasha_yahawe: "",
    icyo_akeneye: "",
    ishuri_ryiga: "",
    umwaka_w_amashuri: "",
    ababyeyi_bazi: "Yego",
    afite_ubufasha: "Oya"
  });

  const [supportForm, setSupportForm] = useState({
    type: "",
    description: "",
    provider: "",
    date: new Date().toISOString().split('T')[0],
    followUp: ""
  });

  // Priority calculation
  const getPriorityLevel = (age, inSchool, hasSupport) => {
    if (parseInt(age) < 16 && inSchool === "Oya" && hasSupport === "Oya") {
      return "critical";
    }
    if (parseInt(age) <= 18 && inSchool === "Oya") {
      return "high";
    }
    if (inSchool === "Oya" || hasSupport === "Oya") {
      return "medium";
    }
    return "low";
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.amazina.trim()) newErrors.amazina = "Amazina arakenewe";
    if (!form.imyaka || form.imyaka < 10 || form.imyaka > 25) 
      newErrors.imyaka = "Imyaka igomba kuba hagati ya 10-25";
    if (!form.aderesi.trim()) newErrors.aderesi = "Aderesi irakenewe";
    if (!form.nimero_ya_telephone.trim()) 
      newErrors.nimero_ya_telephone = "Telephone irakenewe";
    if (form.nimero_ya_telephone && !/^\d{10}$/.test(form.nimero_ya_telephone.replace(/\s/g, ''))) 
      newErrors.nimero_ya_telephone = "Telephone igomba kuba imibare 10";
    if (!form.umwana_ufite_imyaka && form.umwana_ufite_imyaka !== 0) 
      newErrors.umwana_ufite_imyaka = "Imyaka y'umwana irakenewe";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/abakobwa_babyaye");
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
    const stats = {
      total: data.length,
      inSchool: data.filter(d => d.asubiye_mw_ishuri === "Yego").length,
      outOfSchool: data.filter(d => d.asubiye_mw_ishuri === "Oya").length,
      under16: data.filter(d => parseInt(d.imyaka) < 16).length,
      age16to18: data.filter(d => parseInt(d.imyaka) >= 16 && parseInt(d.imyaka) <= 18).length,
      above18: data.filter(d => parseInt(d.imyaka) > 18).length,
      avgMotherAge: data.length > 0 ? 
        Math.round(data.reduce((sum, d) => sum + parseInt(d.imyaka || 0), 0) / data.length) : 0,
      avgChildAge: data.length > 0 ? 
        Math.round(data.reduce((sum, d) => sum + parseInt(d.umwana_ufite_imyaka || 0), 0) / data.length) : 0,
      needsUrgentSupport: data.filter(d => 
        parseInt(d.imyaka) < 16 && d.asubiye_mw_ishuri === "Oya" && d.afite_ubufasha !== "Yego"
      ).length,
      withSupport: data.filter(d => d.afite_ubufasha === "Yego").length
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
        item.ishuri_ryiga?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // School status filter
    if (filterSchool !== "all") {
      filtered = filtered.filter(item => item.asubiye_mw_ishuri === filterSchool);
    }

    // Age group filter
    if (filterAgeGroup !== "all") {
      if (filterAgeGroup === "under16") {
        filtered = filtered.filter(item => parseInt(item.imyaka) < 16);
      } else if (filterAgeGroup === "16to18") {
        filtered = filtered.filter(item => parseInt(item.imyaka) >= 16 && parseInt(item.imyaka) <= 18);
      } else if (filterAgeGroup === "above18") {
        filtered = filtered.filter(item => parseInt(item.imyaka) > 18);
      }
    }

    // Support filter
    if (filterSupport !== "all") {
      filtered = filtered.filter(item => item.afite_ubufasha === filterSupport);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterSchool, filterAgeGroup, filterSupport, data]);

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

    setLoading(true);
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/abakobwa_babyaye/${editId}`, form);
        showAlert("Amakuru yahinduwe neza!", "success");
      } else {
        await axios.post("http://localhost:5000/abakobwa_babyaye", form);
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
      await axios.delete(`http://localhost:5000/abakobwa_babyaye/${deleteId}`);
      showAlert("Amakuru yasibwe neza!", "success");
      loadData();
    } catch (error) {
      showAlert("Habaye ikosa mu gusiba amakuru", "danger");
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Support
  const handleSupport = (person) => {
    setSelectedPerson(person);
    setShowSupportModal(true);
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      amazina: "",
      imyaka: "",
      aderesi: "",
      nimero_ya_telephone: "",
      umwana_ufite_imyaka: "",
      asubiye_mw_ishuri: "Oya",
      ubufasha_yahawe: "",
      icyo_akeneye: "",
      ishuri_ryiga: "",
      umwaka_w_amashuri: "",
      ababyeyi_bazi: "Yego",
      afite_ubufasha: "Oya"
    });
    setEditId(null);
    setErrors({});
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Amazina", "Imyaka", "Aderesi", "Telephone", "Umwana Afite Imyaka", "Asubiye mw'Ishuri", "Afite Ubufasha"],
      ...filteredData.map(d => [
        d.amazina, d.imyaka, d.aderesi, 
        d.nimero_ya_telephone, d.umwana_ufite_imyaka, 
        d.asubiye_mw_ishuri, d.afite_ubufasha || "Oya"
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abakobwa_babyaye.csv';
    a.click();
  };

  // Priority Badge
  const PriorityBadge = ({ age, inSchool, hasSupport }) => {
    const priority = getPriorityLevel(age, inSchool, hasSupport);
    const config = {
      critical: { color: "danger", icon: "exclamation-triangle-fill", label: "Byihutirwa Cyane", animate: true },
      high: { color: "warning", icon: "exclamation-circle", label: "Byihutirwa" },
      medium: { color: "info", icon: "info-circle", label: "Bisanzwe" },
      low: { color: "success", icon: "check-circle", label: "Byiza" }
    };
    const settings = config[priority];
    return (
      <Badge bg={settings.color} className={settings.animate ? "priority-indicator" : ""}>
        <i className={`bi bi-${settings.icon} me-1`}></i>
        {settings.label}
      </Badge>
    );
  };

  // Card View Component
  const CardViewItem = ({ item }) => {
    const priority = getPriorityLevel(item.imyaka, item.asubiye_mw_ishuri, item.afite_ubufasha);
    
    return (
      <Col md={6} lg={4} className="mb-4">
        <Card className={`h-100 shadow-sm hover-card ${priority === "critical" ? 'border-danger border-2' : ''}`}>
          <Card.Header className={`${priority === "critical" ? 'bg-danger bg-opacity-10' : 'bg-light'}`}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>{item.amazina}
              </h6>
              <PriorityBadge 
                age={item.imyaka} 
                inSchool={item.asubiye_mw_ishuri} 
                hasSupport={item.afite_ubufasha}
              />
            </div>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <span><i className="bi bi-calendar3 me-2 text-muted"></i>Imyaka ye:</span>
                <strong className={parseInt(item.imyaka) < 16 ? "text-danger" : ""}>
                  {item.imyaka} imyaka
                </strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <span><i className="bi bi-person-heart me-2 text-muted"></i>Umwana:</span>
                <strong>{item.umwana_ufite_imyaka} {item.umwana_ufite_imyaka == 1 ? 'umwaka' : 'imyaka'}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <i className="bi bi-geo-alt me-2 text-muted"></i>
                {item.aderesi}
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <i className="bi bi-telephone me-2 text-muted"></i>
                <a href={`tel:${item.nimero_ya_telephone}`} className="text-decoration-none">
                  {item.nimero_ya_telephone}
                </a>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-mortarboard me-2 text-muted"></i>Ishuri:</span>
                  <Badge bg={item.asubiye_mw_ishuri === "Yego" ? "success" : "secondary"}>
                    {item.asubiye_mw_ishuri === "Yego" ? "Yasubiye" : "Ntiyasubiye"}
                  </Badge>
                </div>
              </ListGroup.Item>
              {item.ishuri_ryiga && (
                <ListGroup.Item className="px-0">
                  <i className="bi bi-building me-2 text-muted"></i>
                  <small>{item.ishuri_ryiga}</small>
                </ListGroup.Item>
              )}
              <ListGroup.Item className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-hand-thumbs-up me-2 text-muted"></i>Ubufasha:</span>
                  <Badge bg={item.afite_ubufasha === "Yego" ? "success" : "secondary"}>
                    {item.afite_ubufasha === "Yego" ? "Afite" : "Nta bufasha"}
                  </Badge>
                </div>
              </ListGroup.Item>
            </ListGroup>
            {item.icyo_akeneye && (
              <Alert variant="info" className="mt-2 mb-0 py-1 px-2">
                <small><i className="bi bi-info-circle me-1"></i>Akeneye: {item.icyo_akeneye}</small>
              </Alert>
            )}
          </Card.Body>
          <Card.Footer className="bg-light">
            <div className="d-flex justify-content-between">
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => handleSupport(item)}
              >
                <i className="bi bi-heart"></i> Fasha
              </Button>
              <ButtonGroup size="sm">
                <Button variant="outline-primary" onClick={() => handleEdit(item)}>
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
  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <Card className="border-0 shadow-sm h-100 hover-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 small text-uppercase fw-semibold">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {subtitle && <small className="text-muted">{subtitle}</small>}
            {trend && (
              <div className="mt-1">
                <Badge bg={trend > 0 ? "success" : "danger"} className="small">
                  <i className={`bi bi-arrow-${trend > 0 ? 'up' : 'down'} me-1`}></i>
                  {Math.abs(trend)}%
                </Badge>
              </div>
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
        .bg-gradient-purple {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .priority-indicator {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        .timeline-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #6c757d;
          display: inline-block;
          margin-right: 10px;
        }
        .timeline-dot.active {
          background: #28a745;
        }
      `}</style>

      <Container>
        {/* Header */}
        <Card className="mb-4 border-0 shadow bg-gradient-purple text-white">
          <Card.Body className="py-4">
            <Row className="align-items-center">
              <Col>
                <h2 className="fw-bold mb-0">
                  <i className="bi bi-people-fill me-3"></i>
                  Abakobwa Babyaye Bakiri Bato
                </h2>
                <p className="mb-0 opacity-90">
                  Gucunga, gukurikirana no gufasha abakobwa babyaye bakiri bato
                </p>
                <Breadcrumb className="mt-2 bg-transparent">
                  <Breadcrumb.Item className="text-white-50">Ahabanza</Breadcrumb.Item>
                  <Breadcrumb.Item className="text-white-50">Imibereho</Breadcrumb.Item>
                  <Breadcrumb.Item className="text-white" active>Abakobwa Babyaye</Breadcrumb.Item>
                </Breadcrumb>
              </Col>
              <Col xs="auto">
                <div className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="light" className="shadow-sm">
                      <i className="bi bi-three-dots-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={exportToCSV}>
                        <i className="bi bi-download me-2"></i>Export CSV
                      </Dropdown.Item>
                      <Dropdown.Item href="#">
                        <i className="bi bi-printer me-2"></i>Print
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="#">
                        <i className="bi bi-gear me-2"></i>Settings
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
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

        {/* Urgent Alert */}
        {statistics.needsUrgentSupport > 0 && (
          <Alert variant="danger" className="shadow-sm border-0 mb-3">
            <Row className="align-items-center">
              <Col>
                <i className="bi bi-exclamation-triangle-fill me-2 priority-indicator"></i>
                <strong>Icyitonderwa:</strong> Hari abakobwa <strong>{statistics.needsUrgentSupport}</strong> bafite imyaka 
                iri munsi ya 16, batari mw'ishuri kandi nta bufasha bafite. Bakeneye ubufasha bwihuse!
              </Col>
              <Col xs="auto">
                <Button variant="danger" size="sm">
                  <i className="bi bi-eye me-1"></i>Reba Lista
                </Button>
              </Col>
            </Row>
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
                  <Nav.Link eventKey="priority">
                    <i className="bi bi-exclamation-triangle me-2"></i>Byihutirwa
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="education">
                    <i className="bi bi-mortarboard me-2"></i>Uburezi
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="support">
                    <i className="bi bi-heart me-2"></i>Ubufasha
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
                    title="Abakobwa Bose" 
                    value={statistics.total} 
                    icon="people-fill" 
                    color="primary"
                    subtitle="Banditswe muri sisiteme"
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Bari mw'Ishuri" 
                    value={statistics.inSchool}
                    icon="mortarboard-fill" 
                    color="success"
                    subtitle={`${statistics.total > 0 ? Math.round((statistics.inSchool/statistics.total)*100) : 0}% bakomeje kwiga`}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Bafite Ubufasha" 
                    value={statistics.withSupport}
                    icon="hand-thumbs-up-fill" 
                    color="info"
                    subtitle={`${statistics.total > 0 ? Math.round((statistics.withSupport/statistics.total)*100) : 0}% bafashwa`}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Byihutirwa Cyane" 
                    value={statistics.needsUrgentSupport}
                    icon="exclamation-triangle-fill" 
                    color="danger"
                    subtitle="Bakeneye ubufasha"
                  />
                </Col>
              </Row>

              {/* Filters */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={3}>
                      <InputGroup>
                        <InputGroup.Text className="bg-white border-end-0">
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Shakisha..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border-start-0"
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterSchool}
                        onChange={(e) => setFilterSchool(e.target.value)}
                      >
                        <option value="all">Ishuri - Byose</option>
                        <option value="Yego">Bari mw'ishuri</option>
                        <option value="Oya">Batari mw'ishuri</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterAgeGroup}
                        onChange={(e) => setFilterAgeGroup(e.target.value)}
                      >
                        <option value="all">Imyaka - Yose</option>
                        <option value="under16">Munsi ya 16</option>
                        <option value="16to18">16 - 18</option>
                        <option value="above18">Hejuru ya 18</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterSupport}
                        onChange={(e) => setFilterSupport(e.target.value)}
                      >
                        <option value="all">Ubufasha - Bwose</option>
                        <option value="Yego">Bafite ubufasha</option>
                        <option value="Oya">Nta bufasha</option>
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
                    <Col md={1}>
                      <Badge bg="secondary" className="p-2 w-100 text-center">
                        {filteredData.length}
                      </Badge>
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
                            <th><i className="bi bi-geo-alt me-1"></i>Aderesi</th>
                            <th><i className="bi bi-telephone me-1"></i>Telephone</th>
                            <th><i className="bi bi-person-heart me-1"></i>Umwana</th>
                            <th><i className="bi bi-mortarboard me-1"></i>Ishuri</th>
                            <th><i className="bi bi-hand-thumbs-up me-1"></i>Ubufasha</th>
                            <th><i className="bi bi-flag me-1"></i>Icyiciro</th>
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
                              const priority = getPriorityLevel(d.imyaka, d.asubiye_mw_ishuri, d.afite_ubufasha);
                              return (
                                <tr key={d.id} className={`align-middle ${priority === "critical" ? 'table-danger' : ''}`}>
                                  <td className="text-center">{indexOfFirstItem + i + 1}</td>
                                  <td className="fw-semibold">{d.amazina}</td>
                                  <td>
                                    <Badge bg={parseInt(d.imyaka) < 16 ? "danger" : "secondary"} className="rounded-pill">
                                      {d.imyaka} imyaka
                                    </Badge>
                                  </td>
                                  <td><small>{d.aderesi}</small></td>
                                  <td>
                                    <a href={`tel:${d.nimero_ya_telephone}`} className="text-decoration-none">
                                      <i className="bi bi-telephone me-1"></i>
                                      {d.nimero_ya_telephone}
                                    </a>
                                  </td>
                                  <td>
                                    <Badge bg="info" className="rounded-pill">
                                      {d.umwana_ufite_imyaka} {d.umwana_ufite_imyaka == 1 ? 'umwaka' : 'imyaka'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={d.asubiye_mw_ishuri === "Yego" ? "success" : "secondary"}>
                                      {d.asubiye_mw_ishuri === "Yego" ? (
                                        <><i className="bi bi-check-circle me-1"></i>Yasubiye</>
                                      ) : (
                                        <><i className="bi bi-x-circle me-1"></i>Ntiyasubiye</>
                                      )}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={d.afite_ubufasha === "Yego" ? "success" : "secondary"}>
                                      {d.afite_ubufasha === "Yego" ? "Afite" : "Nta bufasha"}
                                    </Badge>
                                  </td>
                                  <td>
                                    <PriorityBadge 
                                      age={d.imyaka} 
                                      inSchool={d.asubiye_mw_ishuri} 
                                      hasSupport={d.afite_ubufasha}
                                    />
                                  </td>
                                  <td>
                                    <div className="d-flex gap-1 justify-content-center">
                                      <OverlayTrigger overlay={<Tooltip>Tanga Ubufasha</Tooltip>}>
                                        <Button 
                                          variant="outline-success" 
                                          size="sm"
                                          onClick={() => handleSupport(d)}
                                        >
                                          <i className="bi bi-heart"></i>
                                        </Button>
                                      </OverlayTrigger>
                                      <OverlayTrigger overlay={<Tooltip>Hindura</Tooltip>}>
                                        <Button 
                                          variant="outline-primary" 
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
                        <i className="bi bi-bar-chart-line me-2"></i>Imibare n'Ihererekanyabuzima
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6} className="mb-4">
                          <h6 className="text-center text-muted mb-3">Itsinda ry'Imyaka</h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-danger fw-semibold">
                                <i className="bi bi-exclamation-triangle me-1"></i>Munsi ya 16
                              </span>
                              <span>{statistics.under16} ({Math.round((statistics.under16/statistics.total)*100 || 0)}%)</span>
                            </div>
                            <ProgressBar 
                              variant="danger" 
                              now={statistics.total > 0 ? (statistics.under16/statistics.total)*100 : 0}
                              className="mb-3"
                              style={{height: '8px'}}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-warning fw-semibold">16 - 18 Imyaka</span>
                              <span>{statistics.age16to18} ({Math.round((statistics.age16to18/statistics.total)*100 || 0)}%)</span>
                            </div>
                            <ProgressBar 
                              variant="warning" 
                              now={statistics.total > 0 ? (statistics.age16to18/statistics.total)*100 : 0}
                              className="mb-3"
                              style={{height: '8px'}}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-info fw-semibold">Hejuru ya 18</span>
                              <span>{statistics.above18} ({Math.round((statistics.above18/statistics.total)*100 || 0)}%)</span>
                            </div>
                            <ProgressBar 
                              variant="info" 
                              now={statistics.total > 0 ? (statistics.above18/statistics.total)*100 : 0}
                              style={{height: '8px'}}
                            />
                          </div>
                        </Col>
                        <Col md={6} className="mb-4">
                          <h6 className="text-center text-muted mb-3">Uko Byifashe</h6>
                          <div className="text-center">
                            <Row>
                              <Col>
                                <div className="mb-3">
                                  <i className="bi bi-mortarboard-fill display-4 text-success"></i>
                                  <h4 className="mt-2">{statistics.inSchool}</h4>
                                  <small className="text-muted">Bari mw'ishuri</small>
                                </div>
                              </Col>
                              <Col>
                                <div className="mb-3">
                                  <i className="bi bi-house-door display-4 text-secondary"></i>
                                  <h4 className="mt-2">{statistics.outOfSchool}</h4>
                                  <small className="text-muted">Batari mw'ishuri</small>
                                </div>
                              </Col>
                            </Row>
                            <ProgressBar className="mt-3">
                              <ProgressBar 
                                variant="success" 
                                now={statistics.total > 0 ? (statistics.inSchool/statistics.total)*100 : 0} 
                                label={`${Math.round((statistics.inSchool/statistics.total)*100 || 0)}%`}
                              />
                              <ProgressBar 
                                variant="secondary" 
                                now={statistics.total > 0 ? (statistics.outOfSchool/statistics.total)*100 : 0} 
                                label={`${Math.round((statistics.outOfSchool/statistics.total)*100 || 0)}%`}
                              />
                            </ProgressBar>
                          </div>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col>
                          <h6 className="text-muted mb-3">Ubufasha Batangiweko</h6>
                          <div className="d-flex justify-content-around text-center">
                            <div>
                              <Badge bg="success" className="p-3 rounded-circle">
                                <h3 className="mb-0">{statistics.withSupport}</h3>
                              </Badge>
                              <p className="text-muted mt-2 small">Bafite Ubufasha</p>
                            </div>
                            <div>
                              <Badge bg="warning" className="p-3 rounded-circle">
                                <h3 className="mb-0">{statistics.total - statistics.withSupport}</h3>
                              </Badge>
                              <p className="text-muted mt-2 small">Nta Bufasha</p>
                            </div>
                            <div>
                              <Badge bg="danger" className="p-3 rounded-circle">
                                <h3 className="mb-0">{statistics.needsUrgentSupport}</h3>
                              </Badge>
                              <p className="text-muted mt-2 small">Byihutirwa Cyane</p>
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
                          <span>Abakobwa bose:</span>
                          <strong>{statistics.total}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span>Ikigezi cy'imyaka y'ababyeyi:</span>
                          <strong>{statistics.avgMotherAge} imyaka</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span>Ikigezi cy'imyaka y'abana:</span>
                          <strong>{statistics.avgChildAge} {statistics.avgChildAge == 1 ? 'umwaka' : 'imyaka'}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0 text-success">
                          <span>Basubiye mw'ishuri:</span>
                          <strong>{statistics.inSchool} ({Math.round((statistics.inSchool/statistics.total)*100 || 0)}%)</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0 text-danger">
                          <span>Bakeneye ubufasha bwihuse:</span>
                          <strong>{statistics.needsUrgentSupport}</strong>
                        </ListGroup.Item>
                      </ListGroup>
                      {statistics.needsUrgentSupport > 0 && (
                        <Alert variant="danger" className="mt-3">
                          <small>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Hari abakobwa {statistics.needsUrgentSupport} bakeneye ubufasha bwihuse!
                          </small>
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Priority Tab */}
            <Tab.Pane eventKey="priority">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-danger bg-opacity-10 border-danger">
                  <h5 className="mb-0 text-danger">
                    <i className="bi bi-exclamation-triangle-fill me-2 priority-indicator"></i>
                    Abakeneye Ubufasha bwihuse
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="table-responsive">
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Amazina</th>
                          <th>Imyaka</th>
                          <th>Aderesi</th>
                          <th>Telephone</th>
                          <th>Umwana</th>
                          <th>Ishuri</th>
                          <th>Icyo Akeneye</th>
                          <th>Ibikorwa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.filter(d => 
                          getPriorityLevel(d.imyaka, d.asubiye_mw_ishuri, d.afite_ubufasha) === "critical" || 
                          getPriorityLevel(d.imyaka, d.asubiye_mw_ishuri, d.afite_ubufasha) === "high"
                        ).length === 0 ? (
                          <tr>
                            <td colSpan="8" className="text-center py-4">
                              <i className="bi bi-emoji-smile display-3 text-success"></i>
                              <p className="text-success mt-2 mb-0">Nta mukobwa ukeneye ubufasha bwihuse!</p>
                            </td>
                          </tr>
                        ) : (
                          data.filter(d => 
                            getPriorityLevel(d.imyaka, d.asubiye_mw_ishuri, d.afite_ubufasha) === "critical" || 
                            getPriorityLevel(d.imyaka, d.asubiye_mw_ishuri, d.afite_ubufasha) === "high"
                          ).map((d) => {
                            const priority = getPriorityLevel(d.imyaka, d.asubiye_mw_ishuri, d.afite_ubufasha);
                            return (
                              <tr key={d.id} className={priority === "critical" ? 'table-danger' : 'table-warning'}>
                                <td className="fw-semibold">{d.amazina}</td>
                                <td>
                                  <Badge bg={priority === "critical" ? "danger" : "warning"} className="rounded-pill">
                                    {d.imyaka} imyaka
                                  </Badge>
                                </td>
                                <td>{d.aderesi}</td>
                                <td>{d.nimero_ya_telephone}</td>
                                <td>{d.umwana_ufite_imyaka} {d.umwana_ufite_imyaka == 1 ? 'umwaka' : 'imyaka'}</td>
                                <td>
                                  <Badge bg={d.asubiye_mw_ishuri === "Yego" ? "success" : "secondary"}>
                                    {d.asubiye_mw_ishuri === "Yego" ? "Yasubiye" : "Ntiyasubiye"}
                                  </Badge>
                                </td>
                                <td>
                                  {d.icyo_akeneye || (
                                    <em className="text-muted">
                                      {d.asubiye_mw_ishuri === "Oya" ? "Gusubira mw'ishuri" : "Ubufasha"}
                                    </em>
                                  )}
                                </td>
                                <td>
                                  <Button 
                                    variant="success" 
                                    size="sm"
                                    onClick={() => handleSupport(d)}
                                  >
                                    <i className="bi bi-heart me-1"></i>Fasha
                                  </Button>
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
            </Tab.Pane>

            {/* Education Tab */}
            <Tab.Pane eventKey="education">
              <Row>
                <Col md={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-mortarboard me-2"></i>Gahunda yo Gusubira mw'Ishuri
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        {data.filter(d => d.asubiye_mw_ishuri === "Oya").slice(0, 10).map(d => (
                          <ListGroup.Item key={d.id} className="px-0">
                            <Row className="align-items-center">
                              <Col>
                                <h6 className="mb-0">{d.amazina}</h6>
                                <small className="text-muted">
                                  {d.imyaka} imyaka | Umwana: {d.umwana_ufite_imyaka} {d.umwana_ufite_imyaka == 1 ? 'umwaka' : 'imyaka'}
                                </small>
                              </Col>
                              <Col xs="auto">
                                <Badge bg="secondary">Ntari mw'ishuri</Badge>
                              </Col>
                              <Col xs="auto">
                                <Button size="sm" variant="outline-primary">
                                  <i className="bi bi-plus-circle me-1"></i>Shyira muri gahunda
                                </Button>
                              </Col>
                            </Row>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>Gahunda z'Ishuri
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="mb-3">
                        <h6 className="text-muted">Catch-up Programs</h6>
                        <ProgressBar now={65} label="65%" variant="success" className="mb-2" />
                        <small className="text-muted">65% basubiye mw'ishuri</small>
                      </div>
                      <div className="mb-3">
                        <h6 className="text-muted">Vocational Training</h6>
                        <ProgressBar now={35} label="35%" variant="info" className="mb-2" />
                        <small className="text-muted">35% biga imyuga</small>
                      </div>
                      <hr />
                      <ListGroup variant="flush">
                        <ListGroup.Item className="px-0">
                          <small>
                            <i className="timeline-dot active"></i>
                            <strong>Kwezi 1:</strong> Kwandikisha
                          </small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <small>
                            <i className="timeline-dot"></i>
                            <strong>Kwezi 2-3:</strong> Amasomo y'ikuzimu
                          </small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <small>
                            <i className="timeline-dot"></i>
                            <strong>Kwezi 4-6:</strong> Gusubira mu ishuri
                          </small>
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Support Tab */}
            <Tab.Pane eventKey="support">
              <Row>
                <Col md={8}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white border-bottom">
                      <h5 className="mb-0">
                        <i className="bi bi-heart-fill text-danger me-2"></i>
                        Gahunda z'Ubufasha
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <i className="bi bi-mortarboard me-2"></i>
                            Gusubira mw'Ishuri
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>✓ Kwishyura amafaranga y'ishuri</ListGroup.Item>
                              <ListGroup.Item>✓ Gutanga ibikoresho by'ishuri</ListGroup.Item>
                              <ListGroup.Item>✓ Ubujyanama ku burezi</ListGroup.Item>
                              <ListGroup.Item>✓ Gahunda yo kubarinzaho abana</ListGroup.Item>
                              <ListGroup.Item>✓ Amasomo y'ikuzimu</ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                          <Accordion.Header>
                            <i className="bi bi-heart me-2"></i>
                            Ubuzima n'Ubujyanama
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>✓ Kwivuza ku buntu</ListGroup.Item>
                              <ListGroup.Item>✓ Inama z'ubyaro bw'abana</ListGroup.Item>
                              <ListGroup.Item>✓ Ubujyanama bwo mu mutwe</ListGroup.Item>
                              <ListGroup.Item>✓ Amatsinda y'inkunga</ListGroup.Item>
                              <ListGroup.Item>✓ Ubufasha bw'abajyanama b'urubyiruko</ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                          <Accordion.Header>
                            <i className="bi bi-cash-coin me-2"></i>
                            Ubufasha mu bukungu
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>✓ Imyigire y'imyuga</ListGroup.Item>
                              <ListGroup.Item>✓ Ibihembo by'akazi gakomeye</ListGroup.Item>
                              <ListGroup.Item>✓ Inguzanyo zihoraho</ListGroup.Item>
                              <ListGroup.Item>✓ Itsinda ry'iterambere</ListGroup.Item>
                              <ListGroup.Item>✓ Gufasha gushinga imishinga mito</ListGroup.Item>
                            </ListGroup>
                          </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="3">
                          <Accordion.Header>
                            <i className="bi bi-people me-2"></i>
                            Ubufasha bw'Umuryango
                          </Accordion.Header>
                          <Accordion.Body>
                            <ListGroup variant="flush">
                              <ListGroup.Item>✓ Inama z'umuryango</ListGroup.Item>
                              <ListGroup.Item>✓ Ubujyanama ku burere bw'abana</ListGroup.Item>
                              <ListGroup.Item>✓ Gufasha ababyeyi gusobanukirwa</ListGroup.Item>
                              <ListGroup.Item>✓ Ubufatanye n'abaturanyi</ListGroup.Item>
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
                        <i className="bi bi-telephone me-2"></i>
                        Aho Basaba Ubufasha
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="px-0">
                          <strong>Isange Family</strong><br/>
                          <small className="text-muted">Tel: 3029 (24/7)</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>REB - Uburezi</strong><br/>
                          <small className="text-muted">Tel: 0788 XXX XXX</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>MIGEPROF</strong><br/>
                          <small className="text-muted">Tel: 0788 XXX XXX</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>Plan International</strong><br/>
                          <small className="text-muted">Tel: 0788 XXX XXX</small>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-0">
                          <strong>Save the Children</strong><br/>
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
          <Modal.Header closeButton className="bg-gradient-purple text-white">
            <Modal.Title>
              <i className={`bi bi-${editId ? 'pencil' : 'plus-circle'} me-2`}></i>
              {editId ? "Hindura" : "Ongeraho"} Amakuru
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
                      <i className="bi bi-calendar3 me-1"></i>Imyaka ye <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="imyaka"
                      value={form.imyaka} 
                      onChange={handleChange}
                      isInvalid={!!errors.imyaka}
                      placeholder="10-25"
                      min="10"
                      max="25"
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
              </Row>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person-heart me-1"></i>Umwana afite imyaka <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      type="number" 
                      name="umwana_ufite_imyaka"
                      value={form.umwana_ufite_imyaka} 
                      onChange={handleChange}
                      isInvalid={!!errors.umwana_ufite_imyaka}
                      placeholder="0-10"
                      min="0"
                      max="10"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.umwana_ufite_imyaka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-mortarboard me-1"></i>Asubiye mw'ishuri
                    </Form.Label>
                    <Form.Select 
                      name="asubiye_mw_ishuri"
                      value={form.asubiye_mw_ishuri} 
                      onChange={handleChange}
                      className={form.asubiye_mw_ishuri === "Yego" ? "border-success" : "border-warning"}
                    >
                      <option value="Oya">Oya</option>
                      <option value="Yego">Yego</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-hand-thumbs-up me-1"></i>Afite ubufasha
                    </Form.Label>
                    <Form.Select 
                      name="afite_ubufasha"
                      value={form.afite_ubufasha} 
                      onChange={handleChange}
                      className={form.afite_ubufasha === "Yego" ? "border-success" : ""}
                    >
                      <option value="Oya">Oya</option>
                      <option value="Yego">Yego</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-building me-1"></i>Ishuri ryiga (niba ari mw'ishuri)
                    </Form.Label>
                    <Form.Control 
                      name="ishuri_ryiga"
                      value={form.ishuri_ryiga} 
                      onChange={handleChange}
                      placeholder="Izina ry'ishuri"
                      disabled={form.asubiye_mw_ishuri === "Oya"}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-calendar-check me-1"></i>Umwaka w'amashuri
                    </Form.Label>
                    <Form.Control 
                      name="umwaka_w_amashuri"
                      value={form.umwaka_w_amashuri} 
                      onChange={handleChange}
                      placeholder="Urugero: S1, S2, ..."
                      disabled={form.asubiye_mw_ishuri === "Oya"}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-gift me-1"></i>Ubufasha yahawe
                    </Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      name="ubufasha_yahawe"
                      value={form.ubufasha_yahawe} 
                      onChange={handleChange}
                      placeholder="Sobanura ubufasha yahawe (optional)"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-list-check me-1"></i>Icyo akeneye
                    </Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      name="icyo_akeneye"
                      value={form.icyo_akeneye} 
                      onChange={handleChange}
                      placeholder="Icyo akeneye cyane cyane (optional)"
                    />
                  </Form.Group>
                </Col>
              </Row>
              {parseInt(form.imyaka) < 16 && form.asubiye_mw_ishuri === "Oya" && form.afite_ubufasha === "Oya" && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Icyitonderwa:</strong> Uyu mukobwa afite imyaka iri munsi ya 16, ntari mw'ishuri kandi nta bufasha afite. 
                  Akeneye ubufasha bwihuse!
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

        {/* Support Modal */}
        <Modal show={showSupportModal} onHide={() => setShowSupportModal(false)} centered size="lg">
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>
              <i className="bi bi-heart-fill me-2"></i>
              Tanga Ubufasha
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPerson && (
              <div>
                <Alert variant="info">
                  <Row>
                    <Col>
                      <strong>{selectedPerson.amazina}</strong><br/>
                      <small>
                        Imyaka: {selectedPerson.imyaka} | 
                        Umwana: {selectedPerson.umwana_ufite_imyaka} {selectedPerson.umwana_ufite_imyaka == 1 ? 'umwaka' : 'imyaka'} | 
                        Ishuri: {selectedPerson.asubiye_mw_ishuri}
                      </small>
                    </Col>
                  </Row>
                </Alert>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ubwoko bw'ubufasha</Form.Label>
                        <Form.Select 
                          value={supportForm.type} 
                          onChange={(e) => setSupportForm({...supportForm, type: e.target.value})}
                        >
                          <option value="">-- Hitamo --</option>
                          <option value="ishuri">Gusubira mw'ishuri</option>
                          <option value="ubuzima">Ubuzima n'ubujyanama</option>
                          <option value="ubukungu">Ubufasha mu bukungu</option>
                          <option value="imyuga">Imyigire y'imyuga</option>
                          <option value="umuryango">Ubufasha bw'umuryango</option>
                          <option value="ibindi">Ibindi</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Uwatanze ubufasha</Form.Label>
                        <Form.Control 
                          value={supportForm.provider}
                          onChange={(e) => setSupportForm({...supportForm, provider: e.target.value})}
                          placeholder="Ikigo cyangwa umuntu"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Ibisobanuro</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={3}
                      value={supportForm.description}
                      onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                      placeholder="Sobanura ubufasha watanze"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Itariki</Form.Label>
                        <Form.Control 
                          type="date"
                          value={supportForm.date}
                          onChange={(e) => setSupportForm({...supportForm, date: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gukurikiranwa</Form.Label>
                        <Form.Control 
                          type="date"
                          value={supportForm.followUp}
                          onChange={(e) => setSupportForm({...supportForm, followUp: e.target.value})}
                          placeholder="Itariki yo gukurikiranwa"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowSupportModal(false)}>
              <i className="bi bi-x-circle me-1"></i>Hagarika
            </Button>
            <Button variant="success">
              <i className="bi bi-check-circle me-1"></i>Emeza Ubufasha
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

export default AbakobwaBabyaye;