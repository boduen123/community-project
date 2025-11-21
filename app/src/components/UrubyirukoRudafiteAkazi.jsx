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
  Dropdown,
  ProgressBar,
  Nav,
  Tab,
  ListGroup,
} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function UrubyirukoRudafiteAkazi() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterWork, setFilterWork] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("table");
  const [errors, setErrors] = useState({});
  const [statistics, setStatistics] = useState({
    total: 0,
    gabo: 0,
    gore: 0,
    yigeze_kora: 0,
    ntigeze_kora: 0,
    avgAge: 0
  });

  const [form, setForm] = useState({
    amazina: "",
    imyaka: "",
    igitsina: "Gabo",
    aderesi: "",
    nimero_ya_telephone: "",
    impamvu_yubushomeri: "",
    yigeze_kora: "Oya",
    yifuza_umurimo_mwene: "Ikindi"
  });

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!form.amazina.trim()) newErrors.amazina = "Amazina arakenewe";
    if (!form.imyaka || form.imyaka < 15 || form.imyaka > 35) 
      newErrors.imyaka = "Imyaka igomba kuba hagati ya 15-35";
    if (!form.aderesi.trim()) newErrors.aderesi = "Aderesi irakenewe";
    if (!form.nimero_ya_telephone.trim()) 
      newErrors.nimero_ya_telephone = "Telephone irakenewe";
    if (form.nimero_ya_telephone && !/^\d{10}$/.test(form.nimero_ya_telephone.replace(/\s/g, ''))) 
      newErrors.nimero_ya_telephone = "Telephone igomba kuba imibare 10";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/urubyiruko_rudafite_akazi");
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
      gabo: data.filter(d => d.igitsina === "Gabo").length,
      gore: data.filter(d => d.igitsina === "Gore").length,
      yigeze_kora: data.filter(d => d.yigeze_kora === "Yego").length,
      ntigeze_kora: data.filter(d => d.yigeze_kora === "Oya").length,
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
        item.aderesi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nimero_ya_telephone?.includes(searchTerm)
      );
    }

    // Gender filter
    if (filterGender !== "all") {
      filtered = filtered.filter(item => item.igitsina === filterGender);
    }

    // Work experience filter
    if (filterWork !== "all") {
      filtered = filtered.filter(item => item.yigeze_kora === filterWork);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterWork, data]);

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
        await axios.put(`http://localhost:5000/urubyiruko_rudafite_akazi/${editId}`, form);
        showAlert("Amakuru yahinduwe neza!", "success");
      } else {
        await axios.post("http://localhost:5000/urubyiruko_rudafite_akazi", form);
        showAlert("Amakuru yongeyeho neza!", "success");
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
      await axios.delete(`http://localhost:5000/urubyiruko_rudafite_akazi/${deleteId}`);
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
      aderesi: "",
      nimero_ya_telephone: "",
      impamvu_yubushomeri: "",
      yigeze_kora: "Oya",
      yifuza_umurimo_mwene: "Ikindi"
    });
    setEditId(null);
    setErrors({});
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Amazina", "Imyaka", "Igitsina", "Aderesi", "Telephone", "Impamvu y'Ubushomeri", "Yigeze Kora", "Yifuza Umurimo"],
      ...filteredData.map(d => [
        d.amazina, d.imyaka, d.igitsina, d.aderesi, 
        d.nimero_ya_telephone, d.impamvu_yubushomeri, 
        d.yigeze_kora, d.yifuza_umurimo_mwene
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'urubyiruko_rudafite_akazi.csv';
    a.click();
  };

  // Card View Component
  const CardViewItem = ({ item, index }) => (
    <Col md={6} lg={4} className="mb-4">
      <Card className="h-100 shadow-sm hover-card">
        <Card.Header className="bg-gradient-primary text-white">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0">
              <i className="bi bi-person-circle me-2"></i>{item.amazina}
            </h6>
            <Badge bg={item.igitsina === "Gabo" ? "info" : "pink"}>
              {item.igitsina}
            </Badge>
          </div>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="px-0">
              <i className="bi bi-calendar3 me-2 text-muted"></i>
              <strong>Imyaka:</strong> {item.imyaka}
            </ListGroup.Item>
            <ListGroup.Item className="px-0">
              <i className="bi bi-geo-alt me-2 text-muted"></i>
              <strong>Aderesi:</strong> {item.aderesi}
            </ListGroup.Item>
            <ListGroup.Item className="px-0">
              <i className="bi bi-telephone me-2 text-muted"></i>
              <strong>Tel:</strong> {item.nimero_ya_telephone}
            </ListGroup.Item>
            <ListGroup.Item className="px-0">
              <i className="bi bi-briefcase me-2 text-muted"></i>
              <strong>Yigeze kora:</strong>
              <Badge bg={item.yigeze_kora === "Yego" ? "success" : "secondary"} className="ms-2">
                {item.yigeze_kora}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="px-0">
              <i className="bi bi-star me-2 text-muted"></i>
              <strong>Yifuza:</strong> {item.yifuza_umurimo_mwene}
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

  // Statistics Cards
  const StatCard = ({ title, value, icon, color, percentage }) => (
    <Card className="border-0 shadow-sm h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1 small">{title}</p>
            <h3 className="mb-0 fw-bold">{value}</h3>
            {percentage && (
              <small className="text-muted">{percentage}% y'abantu bose</small>
            )}
          </div>
          <div className={`stat-icon bg-${color}-subtle text-${color} rounded-circle p-3`}>
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
          border: none;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
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
        .bg-pink {
          background-color: #e91e63;
        }
        .nav-pills .nav-link.active {
          background-color: #6c63ff;
        }
        .search-box {
          border-radius: 25px;
        }
      `}</style>

      <Container>
        {/* Header */}
        <Card className="mb-4 border-0 shadow-sm bg-gradient-primary text-white">
          <Card.Body className="py-4">
            <Row className="align-items-center">
              <Col>
                <h2 className="fw-bold mb-0">
                  <i className="bi bi-people-fill me-3"></i>
                  Urubyiruko Rudafite Akazi
                </h2>
                <p className="mb-0 opacity-75">
                  Gucunga amakuru y'urubyiruko rushaka akazi
                </p>
              </Col>
              <Col xs="auto">
                <div className="d-flex gap-2">
                  <Button 
                    variant="light" 
                    onClick={exportToCSV}
                    className="shadow-sm"
                  >
                    <i className="bi bi-download me-2"></i>Export CSV
                  </Button>
                  <Button 
                    variant="warning" 
                    onClick={() => { resetForm(); setShow(true); }}
                    className="shadow-sm"
                  >
                    <i className="bi bi-plus-circle me-2"></i>Ongeraho
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
            className="shadow-sm"
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
                    <i className="bi bi-graph-up me-2"></i>Imibare
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>

          <Tab.Content>
            {/* Data Tab */}
            <Tab.Pane eventKey="data">
              {/* Statistics Summary */}
              <Row className="mb-4">
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Abantu Bose" 
                    value={statistics.total} 
                    icon="people" 
                    color="primary"
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Gabo" 
                    value={statistics.gabo}
                    icon="gender-male" 
                    color="info"
                    percentage={statistics.total > 0 ? Math.round((statistics.gabo/statistics.total)*100) : 0}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Gore" 
                    value={statistics.gore}
                    icon="gender-female" 
                    color="danger"
                    percentage={statistics.total > 0 ? Math.round((statistics.gore/statistics.total)*100) : 0}
                  />
                </Col>
                <Col md={3} className="mb-3">
                  <StatCard 
                    title="Ikigezi cy'Imyaka" 
                    value={statistics.avgAge}
                    icon="calendar3" 
                    color="success"
                  />
                </Col>
              </Row>

              {/* Filters */}
              <Card className="mb-4 border-0 shadow-sm">
                <Card.Body>
                  <Row className="g-3">
                    <Col md={4}>
                      <InputGroup>
                        <InputGroup.Text className="bg-white">
                          <i className="bi bi-search"></i>
                        </InputGroup.Text>
                        <Form.Control
                          placeholder="Shakisha amazina, aderesi, telephone..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="search-box border-start-0"
                        />
                      </InputGroup>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                      >
                        <option value="all">Igitsina Cyose</option>
                        <option value="Gabo">Gabo</option>
                        <option value="Gore">Gore</option>
                      </Form.Select>
                    </Col>
                    <Col md={2}>
                      <Form.Select 
                        value={filterWork}
                        onChange={(e) => setFilterWork(e.target.value)}
                      >
                        <option value="all">Uburambe Bwose</option>
                        <option value="Yego">Yigeze Kora</option>
                        <option value="Oya">Ntigeze Kora</option>
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
                    <Col md={2} className="text-end">
                      <small className="text-muted">
                        Habonetse {filteredData.length} / {data.length}
                      </small>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Data Display */}
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-muted">Tegereza gato...</p>
                </div>
              ) : viewMode === "table" ? (
                <Card className="shadow-sm border-0">
                  <Card.Body className="p-0">
                    <div className="table-responsive">
                      <Table hover className="mb-0">
                        <thead className="bg-light">
                          <tr>
                            <th>#</th>
                            <th><i className="bi bi-person me-1"></i>Amazina</th>
                            <th><i className="bi bi-calendar me-1"></i>Imyaka</th>
                            <th><i className="bi bi-gender-ambiguous me-1"></i>Igitsina</th>
                            <th><i className="bi bi-geo-alt me-1"></i>Aderesi</th>
                            <th><i className="bi bi-telephone me-1"></i>Telephone</th>
                            <th><i className="bi bi-mortarboard me-1"></i>Ubushomeri</th>
                            <th><i className="bi bi-briefcase me-1"></i>Uburambe</th>
                            <th><i className="bi bi-star me-1"></i>Yifuza</th>
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
                            currentItems.map((d, i) => (
                              <tr key={d.id}>
                                <td>{indexOfFirstItem + i + 1}</td>
                                <td className="fw-semibold">{d.amazina}</td>
                                <td>
                                  <Badge bg="secondary" className="rounded-pill">
                                    {d.imyaka} imyaka
                                  </Badge>
                                </td>
                                <td>
                                  <Badge bg={d.igitsina === "Gabo" ? "info" : "pink"}>
                                    <i className={`bi bi-gender-${d.igitsina === "Gabo" ? "male" : "female"} me-1`}></i>
                                    {d.igitsina}
                                  </Badge>
                                </td>
                                <td>{d.aderesi}</td>
                                <td>
                                  <a href={`tel:${d.nimero_ya_telephone}`} className="text-decoration-none">
                                    {d.nimero_ya_telephone}
                                  </a>
                                </td>
                                <td>{d.impamvu_yubushomeri || "-"}</td>
                                <td>
                                  <Badge bg={d.yigeze_kora === "Yego" ? "success" : "secondary"}>
                                    {d.yigeze_kora}
                                  </Badge>
                                </td>
                                <td>{d.yifuza_umurimo_mwene}</td>
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
                    {[...Array(totalPages)].map((_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
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
                        <i className="bi bi-bar-chart me-2"></i>Imibare y'Urubyiruko
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Row className="text-center">
                        <Col md={6} className="mb-4">
                          <h6 className="text-muted mb-3">Igitsina</h6>
                          <div className="d-flex justify-content-center align-items-center mb-3">
                            <div className="me-4">
                              <i className="bi bi-gender-male display-1 text-info"></i>
                              <h4 className="mt-2">{statistics.gabo}</h4>
                              <small className="text-muted">Gabo</small>
                            </div>
                            <div className="ms-4">
                              <i className="bi bi-gender-female display-1 text-danger"></i>
                              <h4 className="mt-2">{statistics.gore}</h4>
                              <small className="text-muted">Gore</small>
                            </div>
                          </div>
                          <ProgressBar>
                            <ProgressBar 
                              variant="info" 
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
                        <Col md={6} className="mb-4">
                          <h6 className="text-muted mb-3">Uburambe bw'Akazi</h6>
                          <div className="d-flex justify-content-center align-items-center mb-3">
                            <div className="me-4">
                              <i className="bi bi-check-circle display-1 text-success"></i>
                              <h4 className="mt-2">{statistics.yigeze_kora}</h4>
                              <small className="text-muted">Yigeze kora</small>
                            </div>
                            <div className="ms-4">
                              <i className="bi bi-x-circle display-1 text-secondary"></i>
                              <h4 className="mt-2">{statistics.ntigeze_kora}</h4>
                              <small className="text-muted">Ntigeze kora</small>
                            </div>
                          </div>
                          <ProgressBar>
                            <ProgressBar 
                              variant="success" 
                              now={statistics.total > 0 ? (statistics.yigeze_kora/statistics.total)*100 : 0} 
                              label={`${Math.round((statistics.yigeze_kora/statistics.total)*100 || 0)}%`}
                            />
                            <ProgressBar 
                              variant="secondary" 
                              now={statistics.total > 0 ? (statistics.ntigeze_kora/statistics.total)*100 : 0} 
                              label={`${Math.round((statistics.ntigeze_kora/statistics.total)*100 || 0)}%`}
                            />
                          </ProgressBar>
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
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Abantu bose:</span>
                          <strong>{statistics.total}</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Ikigezi cy'imyaka:</span>
                          <strong>{statistics.avgAge} imyaka</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Gabo:</span>
                          <strong>{statistics.gabo} ({Math.round((statistics.gabo/statistics.total)*100 || 0)}%)</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Gore:</span>
                          <strong>{statistics.gore} ({Math.round((statistics.gore/statistics.total)*100 || 0)}%)</strong>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between">
                          <span>Bafite uburambe:</span>
                          <strong>{statistics.yigeze_kora} ({Math.round((statistics.yigeze_kora/statistics.total)*100 || 0)}%)</strong>
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
          <Modal.Header closeButton className="bg-gradient-primary text-white">
            <Modal.Title>
              <i className={`bi bi-${editId ? 'pencil' : 'plus-circle'} me-2`}></i>
              {editId ? "Hindura" : "Ongeraho"} Urubyiruko Rudafite Akazi
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
                      placeholder="Andika amazina yombi"
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
                      placeholder="15-35"
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
                      <i className="bi bi-gender-ambiguous me-1"></i>Igitsina
                    </Form.Label>
                    <Form.Select 
                      name="igitsina"
                      value={form.igitsina} 
                      onChange={handleChange}
                    >
                      <option value="Gabo">Gabo</option>
                      <option value="Gore">Gore</option>
                    </Form.Select>
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
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-mortarboard me-1"></i>Impamvu y'Ubushomeri
                </Form.Label>
                <Form.Control 
                  as="textarea"
                  rows={2}
                  name="impamvu_yubushomeri"
                  value={form.impamvu_yubushomeri} 
                  onChange={handleChange}
                  placeholder="Sobanura impamvu y'ubushomeri (ntabwo ari ngombwa)"
                />
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-briefcase me-1"></i>Yigeze Kora
                    </Form.Label>
                    <Form.Select 
                      name="yigeze_kora"
                      value={form.yigeze_kora} 
                      onChange={handleChange}
                    >
                      <option value="Yego">Yego</option>
                      <option value="Oya">Oya</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <i className="bi bi-star me-1"></i>Yifuza Umurimo Mwene
                    </Form.Label>
                    <Form.Select 
                      name="yifuza_umurimo_mwene"
                      value={form.yifuza_umurimo_mwene} 
                      onChange={handleChange}
                    >
                      <option value="Ubuhinzi">Ubuhinzi</option>
                      <option value="Ubwubatsi">Ubwubatsi</option>
                      <option value="Ubucuruzi">Ubucuruzi</option>
                      <option value="Ikoranabuhanga">Ikoranabuhanga</option>
                      <option value="Ikindi">Ikindi</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
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
            <p className="fs-5">Uremeza ko ushaka gusiba uru rubyiruko?</p>
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

export default UrubyirukoRudafiteAkazi;