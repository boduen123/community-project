import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Container,
  Card,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  InputGroup,
  Dropdown,
  DropdownButton,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/uburezi";

const Uburezi = () => {
  // State Management
  const [uburezi, setUburezi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  
  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    ntagoYize: 0,
    abanza: 0,
    ayisumbuye: 0,
    kaminuza: 0,
  });

  // Form State
  const [form, setForm] = useState({
    urwego_rw_amashuri: "",
    umwuga: "",
    ishuri_yizemo: "",
    amazina_y_umuturage: "",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);

  // Education levels configuration
  const educationLevels = [
    { value: "Ntago yize", label: "Ntago yize", icon: "x-circle", color: "danger" },
    { value: "Abanza", label: "Abanza", icon: "book", color: "primary" },
    { value: "Ayisumbuye", label: "Ayisumbuye", icon: "mortarboard", color: "info" },
    { value: "Kaminuza", label: "Kaminuza", icon: "trophy", color: "success" },
  ];

  // Get education level configuration
  const getLevelConfig = (level) => {
    return educationLevels.find(l => l.value === level) || educationLevels[0];
  };

  // Calculate statistics
  const calculateStats = (data) => {
    setStats({
      total: data.length,
      ntagoYize: data.filter(item => item.urwego_rw_amashuri === "Ntago yize").length,
      abanza: data.filter(item => item.urwego_rw_amashuri === "Abanza").length,
      ayisumbuye: data.filter(item => item.urwego_rw_amashuri === "Ayisumbuye").length,
      kaminuza: data.filter(item => item.urwego_rw_amashuri === "Kaminuza").length,
    });
  };

  // Show alert function
  const showAlertMessage = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  // Fetch all data
  const fetchUburezi = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setUburezi(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlertMessage("Amakuru yagaruwe neza!", "info");
    } catch (error) {
      console.error(error);
      showAlertMessage("Habaye ikosa mu gusoma amakuru!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUburezi();
  }, []);

  // Search and Filter Effect
  useEffect(() => {
    let result = [...uburezi];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.amazina_y_umuturage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.umwuga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ishuri_yizemo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply level filter
    if (filterLevel !== "all") {
      result = result.filter((item) => item.urwego_rw_amashuri === filterLevel);
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterLevel, uburezi]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!form.urwego_rw_amashuri) {
      errors.urwego_rw_amashuri = "Hitamo urwego rw'amashuri";
    }
    
    if (!form.amazina_y_umuturage?.trim()) {
      errors.amazina_y_umuturage = "Amazina ni ngombwa";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Handle submit (create/update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showAlertMessage("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (editing) {
        await axios.put(`${API_URL}/${editId}`, form);
        showAlertMessage("Amakuru yavuguruwe neza!", "success");
      } else {
        await axios.post(API_URL, form);
        showAlertMessage("Amakuru yashyizwemo neza!", "success");
      }
      
      resetForm();
      setShow(false);
      fetchUburezi();
    } catch (error) {
      console.error(error);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      urwego_rw_amashuri: "",
      umwuga: "",
      ishuri_yizemo: "",
      amazina_y_umuturage: "",
    });
    setFormErrors({});
    setEditing(false);
    setEditId(null);
  };

  // Handle Add
  const handleAdd = () => {
    resetForm();
    setShow(true);
  };

  // Handle Edit
  const handleEdit = (ub) => {
    setForm({
      urwego_rw_amashuri: ub.urwego_rw_amashuri,
      umwuga: ub.umwuga || "",
      ishuri_yizemo: ub.ishuri_yizemo || "",
      amazina_y_umuturage: ub.amazina_y_umuturage,
    });
    setEditId(ub.uburezi_id);
    setEditing(true);
    setFormErrors({});
    setShow(true);
  };

  // Handle View Details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba aya makuru?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlertMessage("Amakuru yasibwe neza!", "success");
        fetchUburezi();
      } catch (error) {
        console.error(error);
        showAlertMessage("Ntibikunze gusiba!", "danger");
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Amazina", "Urwego", "Umwuga", "Ishuri"];
    
    const csvData = filteredData.map((item) => [
      item.amazina_y_umuturage,
      item.urwego_rw_amashuri,
      item.umwuga || "-",
      item.ishuri_yizemo || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `uburezi_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlertMessage("Dosiye yakoboye neza!", "success");
  };

  // Render tooltip
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <Container fluid className="py-4 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h2 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
          <i className="bi bi-mortarboard-fill" style={{ fontSize: "2rem" }}></i>
          Uburezi bw'Abaturage
        </h2>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo amakuru mashya")}>
            <Button variant="success" onClick={handleAdd} className="shadow-sm">
              <i className="bi bi-plus-circle me-2"></i>Ongeraho
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Garura amakuru")}>
            <Button variant="outline-primary" onClick={fetchUburezi} className="shadow-sm">
              <i className="bi bi-arrow-clockwise"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Koboramo CSV")}>
            <Button variant="outline-success" onClick={exportToCSV} className="shadow-sm">
              <i className="bi bi-download me-2"></i>Export
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      {/* Alert Message */}
      {alert.show && (
        <Alert
          variant={alert.variant}
          dismissible
          onClose={() => setAlert({ show: false, message: "", variant: "" })}
          className="shadow-sm animate__animated animate__fadeIn"
        >
          <i className={`bi bi-${alert.variant === 'success' ? 'check-circle' : alert.variant === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2`}></i>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Abaturage Bose</p>
                <h3 className="fw-bold mb-0 text-primary">{stats.total}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-people-fill text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #198754" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Kaminuza</p>
                <h3 className="fw-bold mb-0 text-success">{stats.kaminuza}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-trophy-fill text-success" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Ayisumbuye</p>
                <h3 className="fw-bold mb-0 text-info">{stats.ayisumbuye}</h3>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-mortarboard text-info" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Abanza</p>
                <h3 className="fw-bold mb-0 text-primary">{stats.abanza}</h3>
              </div>
              <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-book text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={8}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Shakisha amazina, umwuga, cyangwa ishuri..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
                {searchTerm && (
                  <Button variant="outline-secondary" onClick={() => setSearchTerm("")}>
                    <i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col xs={12} md={4}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-funnel me-2"></i>
                    {filterLevel === "all" && "Urwego rwose"}
                    {filterLevel !== "all" && filterLevel}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterLevel("all")}>
                  <i className="bi bi-list-ul me-2"></i>Urwego rwose
                </Dropdown.Item>
                <Dropdown.Divider />
                {educationLevels.map((level) => (
                  <Dropdown.Item key={level.value} onClick={() => setFilterLevel(level.value)}>
                    <i className={`bi bi-${level.icon} me-2 text-${level.color}`}></i>
                    {level.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm || filterLevel !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu baturage <strong>{uburezi.length}</strong>
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Table or Loading State */}
      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
          <p className="mt-3 text-muted">Amakuru aragarurwa...</p>
        </div>
      ) : filteredData.length === 0 ? (
        <Card className="shadow-sm border-0">
          <Card.Body className="text-center py-5">
            <i className="bi bi-inbox" style={{ fontSize: "4rem", color: "#dee2e6" }}></i>
            <h5 className="mt-3 text-muted">Nta makuru ahari</h5>
            <p className="text-muted">
              {searchTerm || filterLevel !== "all"
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Ongeraho' kugira ngo wongere amakuru"}
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="align-middle mb-0">
                  <thead style={{ backgroundColor: "#e7f1ff" }}>
                    <tr>
                      <th className="py-3 px-3 text-center" style={{ width: "60px" }}>#</th>
                      <th className="py-3">Amazina y'Umuturage</th>
                      <th className="py-3">Urwego rw'Amashuri</th>
                      <th className="py-3">Umwuga</th>
                      <th className="py-3">Ishuri Yizemo</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>Ibikorwa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((ub, index) => {
                      const levelConfig = getLevelConfig(ub.urwego_rw_amashuri);
                      return (
                        <tr key={ub.uburezi_id} className="border-bottom">
                          <td className="text-center px-3 text-muted">
                            {indexOfFirstItem + index + 1}
                          </td>
                          <td className="fw-semibold">
                            <i className="bi bi-person-fill text-primary me-2"></i>
                            {ub.amazina_y_umuturage}
                          </td>
                          <td>
                            <Badge bg={levelConfig.color} className="px-3 py-2">
                              <i className={`bi bi-${levelConfig.icon} me-1`}></i>
                              {ub.urwego_rw_amashuri}
                            </Badge>
                          </td>
                          <td>
                            {ub.umwuga ? (
                              <span>
                                <i className="bi bi-briefcase text-secondary me-2"></i>
                                {ub.umwuga}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {ub.ishuri_yizemo ? (
                              <span>
                                <i className="bi bi-building text-info me-2"></i>
                                {ub.ishuri_yizemo}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-1 justify-content-center">
                              <OverlayTrigger placement="top" overlay={renderTooltip("Reba amakuru")}>
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() => handleViewDetails(ub)}
                                >
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEdit(ub)}
                                >
                                  <i className="bi bi-pencil-square"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(ub.uburezi_id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
              <div className="text-muted small">
                Kugaragaza {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} kuri {filteredData.length}
              </div>
              <Pagination className="mb-0">
                <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />

                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Pagination.Item
                        key={pageNumber}
                        active={pageNumber === currentPage}
                        onClick={() => paginate(pageNumber)}
                      >
                        {pageNumber}
                      </Pagination.Item>
                    );
                  } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                    return <Pagination.Ellipsis key={pageNumber} disabled />;
                  }
                  return null;
                })}

                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered size="lg" backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              {editing ? (
                <>
                  <i className="bi bi-pencil-square me-2"></i>Hindura Amakuru
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>Ongeraho Amakuru Mashya
                </>
              )}
            </Modal.Title>
          </Modal.Header>
          
          <Modal.Body className="px-4 py-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Amazina y'Umuturage <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="amazina_y_umuturage"
                      value={form.amazina_y_umuturage}
                      onChange={handleChange}
                      placeholder="Injiza amazina yombi"
                      isInvalid={!!formErrors.amazina_y_umuturage}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.amazina_y_umuturage}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Urwego rw'Amashuri <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-mortarboard"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="urwego_rw_amashuri"
                      value={form.urwego_rw_amashuri}
                      onChange={handleChange}
                      isInvalid={!!formErrors.urwego_rw_amashuri}
                    >
                      <option value="">Hitamo urwego...</option>
                      {educationLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {formErrors.urwego_rw_amashuri}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Umwuga</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="umwuga"
                      value={form.umwuga}
                      onChange={handleChange}
                      placeholder="Nk'umwalimu, umuganga, etc."
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Hitamo umwuga kuri ino ntera (optional)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Ishuri Yizemo</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-building"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="ishuri_yizemo"
                      value={form.ishuri_yizemo}
                      onChange={handleChange}
                      placeholder="Nk'GS Kigali, UR, etc."
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Izina ry'ishuri yigiyemo cyangwa yarangije (optional)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShow(false)}>
              <i className="bi bi-x-circle me-1"></i>Hagarika
            </Button>
            <Button variant="success" type="submit">
              <i className="bi bi-check-circle me-1"></i>
              {editing ? "Hindura" : "Bika Amakuru"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered size="lg">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>Amakuru Arambuye
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedItem && (
            <div>
              <Row className="g-4">
                <Col md={12}>
                  <div className="border-start border-4 border-primary ps-3">
                    <small className="text-muted">Amazina y'Umuturage</small>
                    <h5 className="mb-0">
                      <i className="bi bi-person-fill text-primary me-2"></i>
                      {selectedItem.amazina_y_umuturage}
                    </h5>
                  </div>
                </Col>

                <Col md={12}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Urwego rw'Amashuri</small>
                    <h5 className="mb-0">
                      <Badge bg={getLevelConfig(selectedItem.urwego_rw_amashuri).color} className="px-3 py-2 fs-6">
                        <i className={`bi bi-${getLevelConfig(selectedItem.urwego_rw_amashuri).icon} me-2`}></i>
                        {selectedItem.urwego_rw_amashuri}
                      </Badge>
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Umwuga</small>
                    <h5 className="mb-0">
                      {selectedItem.umwuga ? (
                        <>
                          <i className="bi bi-briefcase text-warning me-2"></i>
                          {selectedItem.umwuga}
                        </>
                      ) : (
                        <span className="text-muted">Ntawufite</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-info ps-3">
                    <small className="text-muted">Ishuri Yizemo</small>
                    <h5 className="mb-0">
                      {selectedItem.ishuri_yizemo ? (
                        <>
                          <i className="bi bi-building text-info me-2"></i>
                          {selectedItem.ishuri_yizemo}
                        </>
                      ) : (
                        <span className="text-muted">Nta shuri</span>
                      )}
                    </h5>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              <div className="bg-light p-3 rounded">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-info-circle me-2"></i>Ibisobanuro
                </h6>
                <Row className="g-2">
                  <Col xs={12}>
                    <small className="text-muted d-block">
                      <i className="bi bi-calendar3 me-2"></i>
                      Iyandikishwa: <strong>{new Date().toLocaleDateString('rw-RW')}</strong>
                    </small>
                  </Col>
                  <Col xs={12}>
                    <small className="text-muted d-block">
                      <i className="bi bi-hash me-2"></i>
                      ID: <strong>{selectedItem.uburezi_id}</strong>
                    </small>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button
            variant="primary"
            onClick={() => {
              setShowDetails(false);
              handleEdit(selectedItem);
            }}
          >
            <i className="bi bi-pencil-square me-1"></i>Hindura
          </Button>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            <i className="bi bi-x-circle me-1"></i>Funga
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .hover-card {
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </Container>
  );
};

export default Uburezi;