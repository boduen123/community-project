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
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function AbanaMirireMibi() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNutrition, setFilterNutrition] = useState("all");
  const [filterAssisted, setFilterAssisted] = useState("all");
  const [filterGender, setFilterGender] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [errors, setErrors] = useState({});
  const [statistics, setStatistics] = useState({
    total: 0,
    bikabije: 0,
    bito: 0,
    bisanzwe: 0,
    afashijwe: 0,
    ntibafashijwe: 0,
    gabo: 0,
    gore: 0,
    avgAge: 0
  });

  const [form, setForm] = useState({
    amazina: "",
    imyaka: "",
    igitsina: "Gabo",
    umubyeyi_wa_mwana: "",
    aderesi: "",
    urwego_rw_imirire: "Bisanzwe",
    afashijwe: "Oya"
  });

  // Nutrition level colors and icons
  const nutritionConfig = {
    "Bikabije": { color: "danger", icon: "exclamation-triangle-fill", label: "Bikabije Cyane" },
    "Bito": { color: "warning", icon: "exclamation-circle", label: "Bito" },
    "Bisanzwe": { color: "info", icon: "info-circle", label: "Bisanzwe" }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.amazina.trim()) newErrors.amazina = "Amazina arakenewe";
    if (!form.imyaka || form.imyaka < 0 || form.imyaka > 18) 
      newErrors.imyaka = "Imyaka igomba kuba hagati ya 0-18";
    if (!form.umubyeyi_wa_mwana.trim()) 
      newErrors.umubyeyi_wa_mwana = "Amazina y'umubyeyi arakenewe";
    if (!form.aderesi.trim()) newErrors.aderesi = "Aderesi irakenewe";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/abana_barimwo_mirire_mibi");
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
      bikabije: data.filter(d => d.urwego_rw_imirire === "Bikabije").length,
      bito: data.filter(d => d.urwego_rw_imirire === "Bito").length,
      bisanzwe: data.filter(d => d.urwego_rw_imirire === "Bisanzwe").length,
      afashijwe: data.filter(d => d.afashijwe === "Yego").length,
      ntibafashijwe: data.filter(d => d.afashijwe === "Oya").length,
      gabo: data.filter(d => d.igitsina === "Gabo").length,
      gore: data.filter(d => d.igitsina === "Gore").length,
      avgAge: data.length > 0 ? 
        Math.round(data.reduce((sum, d) => sum + parseInt(d.imyaka || 0), 0) / data.length) : 0
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
        item.umubyeyi_wa_mwana?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.aderesi?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Nutrition level filter
    if (filterNutrition !== "all") {
      filtered = filtered.filter(item => item.urwego_rw_imirire === filterNutrition);
    }

    // Assistance filter
    if (filterAssisted !== "all") {
      filtered = filtered.filter(item => item.afashijwe === filterAssisted);
    }

    // Gender filter
    if (filterGender !== "all") {
      filtered = filtered.filter(item => item.igitsina === filterGender);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterNutrition, filterAssisted, filterGender, data]);

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
        await axios.put(`http://localhost:5000/abana_barimwo_mirire_mibi/${editId}`, form);
        showAlert("Amakuru yahinduwe neza!", "success");
      } else {
        await axios.post("http://localhost:5000/abana_barimwo_mirire_mibi", form);
        showAlert("Umwana yongeweho neza!", "success");
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
      await axios.delete(`http://localhost:5000/abana_barimwo_mirire_mibi/${deleteId}`);
      showAlert("Amakuru yasibwe neza!", "success");
      loadData();
    } catch (error) {
      showAlert("Habaye ikosa mu gusiba amakuru", "danger");
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  // Reset Form
  const resetForm = () => {
    setForm({
      amazina: "",
      imyaka: "",
      igitsina: "Gabo",
      umubyeyi_wa_mwana: "",
      aderesi: "",
      urwego_rw_imirire: "Bisanzwe",
      afashijwe: "Oya"
    });
    setEditId(null);
    setErrors({});
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Amazina", "Imyaka", "Igitsina", "Umubyeyi", "Aderesi", "Urwego rw'Imirire", "Afashijwe"],
      ...filteredData.map(d => [
        d.amazina, d.imyaka, d.igitsina, d.umubyeyi_wa_mwana, 
        d.aderesi, d.urwego_rw_imirire, d.afashijwe
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abana_mirire_mibi.csv';
    a.click();
  };

  // Priority Badge
  const PriorityBadge = ({ level }) => {
    const config = nutritionConfig[level] || nutritionConfig["Bisanzwe"];
    return (
      <Badge bg={config.color} className="d-inline-flex align-items-center px-2 py-1">
        <i className={`bi bi-${config.icon} me-1`}></i>
        {config.label}
      </Badge>
    );
  };

  // Card View Component
  const CardViewItem = ({ item, index }) => {
    const config = nutritionConfig[item.urwego_rw_imirire] || nutritionConfig["Bisanzwe"];
    
    return (
      <Col md={6} lg={4} className="mb-4">
        <Card className={`h-100 shadow-sm hover-card border-${config.color}`}>
          <Card.Header className={`bg-${config.color} bg-opacity-10`}>
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>{item.amazina}
              </h6>
              <Badge bg={item.igitsina === "Gabo" ? "primary" : "pink"} className="rounded-pill">
                {item.igitsina}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0 d-flex justify-content-between">
                <span><i className="bi bi-calendar3 me-2 text-muted"></i>Imyaka:</span>
                <strong>{item.imyaka} {item.imyaka == 1 ? 'umwaka' : 'imyaka'}</strong>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <i className="bi bi-person-heart me-2 text-muted"></i>
                <strong>Umubyeyi:</strong> {item.umubyeyi_wa_mwana}
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <i className="bi bi-geo-alt me-2 text-muted"></i>
                <strong>Aderesi:</strong> {item.aderesi}
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-heart-pulse me-2 text-muted"></i>Imirire:</span>
                  <PriorityBadge level={item.urwego_rw_imirire} />
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <div className="d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-hand-thumbs-up me-2 text-muted"></i>Ubufasha:</span>
                  <Badge bg={item.afashijwe === "Yego" ? "success" : "secondary"}>
                    {item.afashijwe === "Yego" ? "Yafashijwe" : "Ntiyafashijwe"}
                  </Badge>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
          <Card.Footer className="bg-light">
            <div className="d-flex justify-content-end gap-2">
              <Button variant="outline-primary" size="sm" onClick={() => handleEdit(item)}>
                <i className="bi bi-pencil-square"></i>
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => handleDeleteClick(item.id)}>
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    );
  };

  // Statistics Card
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card className="border-0 shadow-sm h-100 hover-card">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <p className="text-muted mb-1 small text-uppercase fw-semibold">{title}</p>
            <h2 className="mb-0 fw-bold">{value}</h2>
            {subtitle && <small className="text-muted">{subtitle}</small>}
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
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .bg-gradient-danger {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        .bg-pink {
          background-color: #e91e63;
        }
        .border-danger {
          border-left: 4px solid #dc3545 !important;
        }
        .border-warning {
          border-left: 4px solid #ffc107 !important;
        }
        .border-info {
          border-left: 4px solid #0dcaf0 !important;
        }
        .priority-indicator {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>

      <Container>
        {/* Header */}
        <Card className="mb-4 border-0 shadow bg-gradient-primary text-white">
          <Card.Body className="py-4">
            <Row className="align-items-center">
              <Col>
                <h2 className="fw-bold mb-0">
                  <i className="bi bi-heart-pulse-fill me-3"></i>
                  Abana Bafite Imirire Mibi
                </h2>
                <p className="mb-0 opacity-90">
                  Gucunga no gukurikirana abana bafite ibibazo by'imirire
                </p>
                <Breadcrumb className="mt-2 bg-transparent">
                  <Breadcrumb.Item className="text-white-50">Ahabanza</Breadcrumb.Item>
                  <Breadcrumb.Item className="text-white" active>Imirire Mibi</Breadcrumb.Item>
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
                    <i className="bi bi-plus-circle-fill me-2"></i>Ongeraho Umwana
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
                    <i className="bi bi-bar-chart-line me-2"></i>Imibare n'Imikorere
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="priority">
                    <i className="bi bi-exclamation-triangle me-2"></i>Abakeneye Ubufasha bwihuse
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
                    title="Abana Bose" 
                    value={statistics.total} 
                    icon="people-fill" 
                    color="primary"
                    subtitle="Banditswe muri sisiteme"
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Bikabije Cyane" 
                    value={statistics.bikabije}
                    icon="exclamation-triangle-fill" 
                    color="danger"
                    subtitle={`${statistics.total > 0 ? Math.round((statistics.bikabije/statistics.total)*100) : 0}% by'abana`}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Bafashijwe" 
                    value={statistics.afashijwe}
                    icon="check-circle-fill" 
                    color="success"
                    subtitle={`${statistics.total > 0 ? Math.round((statistics.afashijwe/statistics.total)*100) : 0}% bafashijwe`}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Ikigezi cy'Imyaka" 
                    value={`${statistics.avgAge} imyaka`}
                    icon="calendar-heart" 
                    color="info"
                    subtitle="Ikigereranyo"
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
                          placeholder="Shakisha amazina, umubyeyi, aderesi..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="border-start-0"
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterNutrition}
                        onChange={(e) => setFilterNutrition(e.target.value)}
                      >
                        <option value="all">Imirire Yose</option>
                        <option value="Bikabije">Bikabije</option>
                        <option value="Bito">Bito</option>
                        <option value="Bisanzwe">Bisanzwe</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterAssisted}
                        onChange={(e) => setFilterAssisted(e.target.value)}
                      >
                        <option value="all">Ubufasha Bwose</option>
                        <option value="Yego">Bafashijwe</option>
                        <option value="Oya">Batafashijwe</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                      >
                        <option value="all">Igitsina Cyose</option>
                        <option value="Gabo">Abahungu</option>
                        <option value="Gore">Abakobwa</option>
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
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <small className="text-muted">
                        Habonetse {filteredData.length} muri {data.length}
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
                            <th><i className="bi bi-gender-ambiguous me-1"></i>Igitsina</th>
                            <th><i className="bi bi-person-heart me-1"></i>Umubyeyi</th>
                            <th><i className="bi bi-geo-alt me-1"></i>Aderesi</th>
                            <th><i className="bi bi-heart-pulse me-1"></i>Imirire</th>
                            <th><i className="bi bi-shield-check me-1"></i>Ubufasha</th>
                            <th className="text-center">Ibikorwa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentItems.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center py-5">
                                <i className="bi bi-inbox display-1 text-muted"></i>
                                <p className="text-muted mt-2">Nta makuru abonetse</p>
                              </td>
                            </tr>
                          ) : (
                            currentItems.map((d, i) => (
                              <tr key={d.id} className="align-middle">
                                <td className="text-center">{indexOfFirstItem + i + 1}</td>
                                <td className="fw-semibold">{d.amazina}</td>
                                <td>
                                  <Badge bg="secondary" className="rounded-pill">
                                    {d.imyaka} {d.imyaka == 1 ? 'umwaka' : 'imyaka'}
                                  </Badge>
                                </td>
                                <td>
                                  <Badge bg={d.igitsina === "Gabo" ? "primary" : "pink"}>
                                    <i className={`bi bi-gender-${d.igitsina === "Gabo" ? "male" : "female"} me-1`}></i>
                                    {d.igitsina === "Gabo" ? "Umuhungu" : "Umukobwa"}
                                  </Badge>
                                </td>
                                <td>{d.umubyeyi_wa_mwana}</td>
                                <td>
                                  <small>{d.aderesi}</small>
                                </td>
                                <td>
                                  <PriorityBadge level={d.urwego_rw_imirire} />
                                </td>
                                <td>
                                  {d.afashijwe === "Yego" ? (
                                    <Badge bg="success">
                                      <i className="bi bi-check-circle me-1"></i>Yafashijwe
                                    </Badge>
                                  ) : (
                                    <Badge bg="secondary" className={d.urwego_rw_imirire === "Bikabije" ? "priority-indicator" : ""}>
                                      <i className="bi bi-x-circle me-1"></i>Ntiyafashijwe
                                    </Badge>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-1 justify-content-center">
                                    <OverlayTrigger overlay={<Tooltip>Hindura</Tooltip>}>
                                      <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={() => handleEdit(d)}
                                      >
                                        <i className="bi bi-pencil-square"></i>
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
                            ))
                          )}
                        </tbody>
                      </Table>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Row>
                  {currentItems.map((item, i) => (
                    <CardViewItem key={item.id} item={item} index={indexOfFirstItem + i} />
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
                        <i className="bi bi-bar-chart-line me-2"></i>Imibare y'Imirire
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6} className="mb-4">
                          <h6 className="text-center text-muted mb-3">Urwego rw'Imirire</h6>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-danger fw-semibold">Bikabije</span>
                              <span>{statistics.bikabije} ({Math.round((statistics.bikabije/statistics.total)*100 || 0)}%)</span>
                            </div>
                            <ProgressBar 
                              variant="danger" 
                              now={statistics.total > 0 ? (statistics.bikabije/statistics.total)*100 : 0}
                              style={{height: '10px'}}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-warning fw-semibold">Bito</span>
                              <span>{statistics.bito} ({Math.round((statistics.bito/statistics.total)*100 || 0)}%)</span>
                            </div>
                            <ProgressBar 
                              variant="warning" 
                              now={statistics.total > 0 ? (statistics.bito/statistics.total)*100 : 0}
                              style={{height: '10px'}}
                            />
                          </div>
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-2">
                              <span className="text-info fw-semibold">Bisanzwe</span>
                              <span>{statistics.bisanzwe} ({Math.round((statistics.bisanzwe/statistics.total)*100 || 0)}%)</span>
                            </div>
                            <ProgressBar 
                              variant="info" 
                              now={statistics.total > 0 ? (statistics.bisanzwe/statistics.total)*100 : 0}
                              style={{height: '10px'}}
                            />
                          </div>
                        </Col>
                        <Col md={6} className="mb-4">
                          <h6 className="text-center text-muted mb-3">Igitsina</h6>
                          <div className="d-flex justify-content-center align-items-center mb-3">
                            <div className="text-center me-4">
                              <i className="bi bi-gender-male display-3 text-primary"></i>
                              <h4 className="mt-2">{statistics.gabo}</h4>
                              <small className="text-muted">Abahungu</small>
                            </div>
                            <div className="text-center ms-4">
                              <i className="bi bi-gender-female display-3 text-danger"></i>
                              <h4 className="mt-2">{statistics.gore}</h4>
                              <small className="text-muted">Abakobwa</small>
                            </div>
                          </div>
                          <ProgressBar>
                            <ProgressBar 
                              variant="primary" 
                              now={statistics.total > 0 ? (statistics.gabo/statistics.total)*100 : 0} 
                              label={`${Math.round((statistics.gabo/statistics.total)*100 || 0)}%`}
                            />
                            <ProgressBar 
                              variant="danger" 
                              now={statistics.total > 0 ? (statistics.gore/statistics.total)*100 : 0} 
                              label={`${Math.round((statistics.gore/statistics.total)*100 || 0)}%`}
                            />
                          </ProgressBar>
                        </Col>
                      </Row>
                      <hr />
                      <Row>
                        <Col className="text-center">
                          <h6 className="text-muted mb-3">Ubufasha Batangiweko</h6>
                          <div className="d-flex justify-content-center align-items-center">
                            <div className="me-5">
                              <i className="bi bi-check-circle-fill display-4 text-success"></i>
                              <h3 className="mt-2">{statistics.afashijwe}</h3>
                              <small className="text-muted">Bafashijwe</small>
                              <div className="mt-1">
                                <Badge bg="success">{Math.round((statistics.afashijwe/statistics.total)*100 || 0)}%</Badge>
                              </div>
                            </div>
                            <div className="ms-5">
                              <i className="bi bi-x-circle-fill display-4 text-secondary"></i>
                              <h3 className="mt-2">{statistics.ntibafashijwe}</h3>
                              <small className="text-muted">Batafashijwe</small>
                              <div className="mt-1">
                                <Badge bg="secondary">{Math.round((statistics.ntibafashijwe/statistics.total)*100 || 0)}%</Badge>
                              </div>
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
                          <span>Abana bose:</span>
                          <strong>{statistics.total}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span>Ikigezi cy'imyaka:</span>
                          <strong>{statistics.avgAge} imyaka</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span className="text-danger">Bikeneye ubufasha bwihuse:</span>
                          <strong className="text-danger">{statistics.bikabije}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span className="text-success">Bafashijwe:</span>
                          <strong className="text-success">{statistics.afashijwe}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span className="text-warning">Bakeneye gukurikiranwa:</span>
                          <strong className="text-warning">{statistics.ntibafashijwe}</strong>
                        </ListGroup.Item>
                      </ListGroup>
                      {statistics.bikabije > 0 && statistics.ntibafashijwe > 0 && (
                        <Alert variant="danger" className="mt-3">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          <strong>{statistics.bikabije}</strong> abana bakeneye ubufasha bwihuse!
                        </Alert>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>

            {/* Priority Tab */}
            <Tab.Pane eventKey="priority">
              <Row>
                <Col>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-danger bg-opacity-10 border-danger">
                      <h5 className="mb-0 text-danger">
                        <i className="bi bi-exclamation-triangle-fill me-2 priority-indicator"></i>
                        Abana bakeneye ubufasha bwihuse
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table hover>
                          <thead>
                            <tr>
                              <th>Amazina</th>
                              <th>Imyaka</th>
                              <th>Umubyeyi</th>
                              <th>Aderesi</th>
                              <th>Urwego</th>
                              <th>Ubufasha</th>
                              <th>Ibikorwa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {data.filter(d => d.urwego_rw_imirire === "Bikabije" && d.afashijwe === "Oya").length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center py-4">
                                  <i className="bi bi-emoji-smile display-3 text-success"></i>
                                  <p className="text-success mt-2 mb-0">Nta mwana ukeneye ubufasha bwihuse!</p>
                                </td>
                              </tr>
                            ) : (
                              data.filter(d => d.urwego_rw_imirire === "Bikabije" && d.afashijwe === "Oya").map((d) => (
                                <tr key={d.id} className="table-danger">
                                  <td className="fw-semibold">{d.amazina}</td>
                                  <td>{d.imyaka} {d.imyaka == 1 ? 'umwaka' : 'imyaka'}</td>
                                  <td>{d.umubyeyi_wa_mwana}</td>
                                  <td>{d.aderesi}</td>
                                  <td><PriorityBadge level={d.urwego_rw_imirire} /></td>
                                  <td>
                                    <Badge bg="danger" className="priority-indicator">
                                      <i className="bi bi-x-circle me-1"></i>Ntiyafashijwe
                                    </Badge>
                                  </td>
                                  <td>
                                    <Button 
                                      variant="success" 
                                      size="sm"
                                      onClick={() => {
                                        handleEdit(d);
                                        setForm({...d, afashijwe: "Yego"});
                                      }}
                                    >
                                      <i className="bi bi-hand-thumbs-up me-1"></i>Fasha
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </Table>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        {/* Add/Edit Modal */}
        <Modal show={show} onHide={() => { setShow(false); resetForm(); }} size="lg" centered>
          <Modal.Header closeButton className="bg-gradient-primary text-white">
            <Modal.Title>
              <i className={`bi bi-${editId ? 'pencil' : 'plus-circle'} me-2`}></i>
              {editId ? "Hindura" : "Ongeraho"} Umwana
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person me-1"></i>Amazina y'umwana <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      name="amazina"
                      value={form.amazina} 
                      onChange={handleChange}
                      isInvalid={!!errors.amazina}
                      placeholder="Andika amazina yombi"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.amazina}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
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
                      placeholder="0-18"
                      min="0"
                      max="18"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.imyaka}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-gender-ambiguous me-1"></i>Igitsina
                    </Form.Label>
                    <Form.Select 
                      name="igitsina"
                      value={form.igitsina} 
                      onChange={handleChange}
                    >
                      <option value="Gabo">Umuhungu</option>
                      <option value="Gore">Umukobwa</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-person-heart me-1"></i>Umubyeyi wa mwana <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control 
                      name="umubyeyi_wa_mwana"
                      value={form.umubyeyi_wa_mwana} 
                      onChange={handleChange}
                      isInvalid={!!errors.umubyeyi_wa_mwana}
                      placeholder="Amazina y'umubyeyi"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.umubyeyi_wa_mwana}
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
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-heart-pulse me-1"></i>Urwego rw'Imirire
                    </Form.Label>
                    <Form.Select 
                      name="urwego_rw_imirire"
                      value={form.urwego_rw_imirire} 
                      onChange={handleChange}
                      className={`form-select ${
                        form.urwego_rw_imirire === "Bikabije" ? "border-danger" :
                        form.urwego_rw_imirire === "Bito" ? "border-warning" : "border-info"
                      }`}
                    >
                      <option value="Bisanzwe">Bisanzwe</option>
                      <option value="Bito">Bito</option>
                      <option value="Bikabije">Bikabije</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      {form.urwego_rw_imirire === "Bikabije" && (
                        <span className="text-danger">
                          <i className="bi bi-exclamation-triangle me-1"></i>
                          Umwana akeneye ubufasha bwihuse!
                        </span>
                      )}
                    </Form.Text>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-shield-check me-1"></i>Afashijwe
                    </Form.Label>
                    <Form.Select 
                      name="afashijwe"
                      value={form.afashijwe} 
                      onChange={handleChange}
                      className={form.afashijwe === "Yego" ? "border-success" : ""}
                    >
                      <option value="Oya">Oya</option>
                      <option value="Yego">Yego</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              {form.urwego_rw_imirire === "Bikabije" && form.afashijwe === "Oya" && (
                <Alert variant="danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>Icyitonderwa:</strong> Uyu mwana afite imirire mibi bikabije kandi ntiyafashijwe. 
                  Ni ngombwa ko ahabwa ubufasha bwihuse!
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
            <p className="fs-5">Uremeza ko ushaka gusiba uyu mwana mu sisiteme?</p>
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

export default AbanaMirireMibi;