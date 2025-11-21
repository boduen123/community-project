import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import {
  Table,
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Badge,
  InputGroup,
  Dropdown,
  DropdownButton,
  Pagination,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

const API = "http://localhost:5000";

const Ubukungu = () => {
  // State management for data, modals, loading status, and alerts
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    withLand: 0,
    withAnimals: 0,
    withAccount: 0,
  });

  // State for the form inputs
  const [form, setForm] = useState({
    ubukungu_id: null,
    muturage_id: "",
    amazina_y_umuturage: "",
    umurimo: "",
    aho_akorera: "",
    inkomoko_y_amafaranga: "",
    afite_ubutaka: 0,
    afite_amatungo: 0,
    afite_konti_yo_kuzigama: 0,
  });

  // Form validation state
  const [formErrors, setFormErrors] = useState({});

  // Handler for form input changes, including checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  // Form validation function
  const validateForm = () => {
    const errors = {};
    
    if (!form.amazina_y_umuturage.trim()) {
      errors.amazina_y_umuturage = "Amazina ni ngombwa";
    }
    
    if (!form.muturage_id.trim()) {
      errors.muturage_id = "Indangamuntu ni ngombwa";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Function to display temporary alert messages
  const showAlert = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  // Calculate statistics
  const calculateStats = (dataArray) => {
    setStats({
      total: dataArray.length,
      withLand: dataArray.filter((item) => item.afite_ubutaka).length,
      withAnimals: dataArray.filter((item) => item.afite_amatungo).length,
      withAccount: dataArray.filter((item) => item.afite_konti_yo_kuzigama).length,
    });
  };

  // Function to fetch data from the API
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/ubukungu`);
      setData(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlert("Amakuru yagaruwe neza!", "info");
    } catch (err) {
      console.error(err);
      showAlert("Habaye ikosa mu gusoma amakuru!", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Load data on initial component mount
  useEffect(() => {
    loadData();
  }, []);

  // Search and filter effect
  useEffect(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.amazina_y_umuturage.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.muturage_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.umurimo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.aho_akorera.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterType !== "all") {
      switch (filterType) {
        case "ubutaka":
          result = result.filter((item) => item.afite_ubutaka === 1);
          break;
        case "amatungo":
          result = result.filter((item) => item.afite_amatungo === 1);
          break;
        case "konti":
          result = result.filter((item) => item.afite_konti_yo_kuzigama === 1);
          break;
        default:
          break;
      }
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, filterType, data]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handler to open the modal for adding a new entry
  const handleAdd = () => {
    setEditingId(null);
    setForm({
      ubukungu_id: null,
      muturage_id: "",
      amazina_y_umuturage: "",
      umurimo: "",
      aho_akorera: "",
      inkomoko_y_amafaranga: "",
      afite_ubutaka: 0,
      afite_amatungo: 0,
      afite_konti_yo_kuzigama: 0,
    });
    setFormErrors({});
    setShow(true);
  };

  // Handler to open the modal for editing an existing entry
  const handleEdit = (item) => {
    setEditingId(item.ubukungu_id);
    setForm(item);
    setFormErrors({});
    setShow(true);
  };

  // Handler to view details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  // Handler to delete an entry
  const handleDelete = async (id) => {
    if (!window.confirm("Uremeza ko ushaka gusiba aya makuru?")) return;
    try {
      await axios.delete(`${API}/ubukungu/${id}`);
      showAlert("Amakuru yasibwe neza!", "success");
      loadData(); // Refresh data after deletion
    } catch (err) {
      console.error(err);
      showAlert("Ntibikunze gusiba!", "danger");
    }
  };

  // Handler to submit the form (for both adding and editing)
  const handleSubmit = async () => {
    // Validate form before submission
    if (!validateForm()) {
      showAlert("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (editingId === null) {
        // Add new entry
        await axios.post(`${API}/ubukungu`, form);
        showAlert("Amakuru yashyizwemo neza!", "success");
      } else {
        // Update existing entry
        await axios.put(`${API}/ubukungu/${editingId}`, form);
        showAlert("Amakuru yavuguruwe neza!", "success");
      }
      setShow(false); // Close modal
      loadData(); // Refresh data
    } catch (err) {
      console.error(err);
      showAlert("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Export data to CSV
  const exportToCSV = () => {
    const headers = [
      "Amazina",
      "ID",
      "Umurimo",
      "Aho Akorera",
      "Inkomoko y'Amafaranga",
      "Ubutaka",
      "Amatungo",
      "Konti",
    ];
    
    const csvData = filteredData.map((item) => [
      item.amazina_y_umuturage,
      item.muturage_id,
      item.umurimo,
      item.aho_akorera,
      item.inkomoko_y_amafaranga,
      item.afite_ubutaka ? "Yego" : "Oya",
      item.afite_amatungo ? "Yego" : "Oya",
      item.afite_konti_yo_kuzigama ? "Yego" : "Oya",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ubukungu_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlert("Dosiye yakoboye neza!", "success");
  };

  // Render tooltip
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <Container fluid className="py-4 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="fw-bold text-primary mb-3 mb-md-0 d-flex align-items-center gap-2">
          <i className="bi bi-cash-stack" style={{ fontSize: "2rem" }}></i>
          Ubukungu bw'Abaturage
        </h2>
        <div className="d-flex gap-2">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo amakuru mashya")}>
            <Button variant="success" onClick={handleAdd} className="shadow-sm">
              <i className="bi bi-plus-circle me-1"></i> Ongeramo
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Garura amakuru")}>
            <Button variant="outline-primary" onClick={loadData} className="shadow-sm">
              <i className="bi bi-arrow-clockwise me-1"></i>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Koboramo CSV")}>
            <Button variant="outline-success" onClick={exportToCSV} className="shadow-sm">
              <i className="bi bi-download me-1"></i> Export
            </Button>
          </OverlayTrigger>
        </div>
      </div>

      {/* Alert message display */}
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          className="text-center shadow-sm animate__animated animate__fadeIn"
          dismissible 
          onClose={() => setAlert({ show: false, message: "", variant: "" })}
        >
          <i className={`bi bi-${alert.variant === 'success' ? 'check-circle' : alert.variant === 'danger' ? 'exclamation-circle' : 'info-circle'} me-2`}></i>
          {alert.message}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Row className="mb-4 g-3">
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #0d6efd" }}>
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
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #198754" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Bafite Ubutaka</p>
                <h3 className="fw-bold mb-0 text-success">{stats.withLand}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-geo-alt-fill text-success" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #fd7e14" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Bafite Amatungo</p>
                <h3 className="fw-bold mb-0 text-warning">{stats.withAnimals}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-piggy-bank-fill text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100" style={{ borderLeft: "4px solid #20c997" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Bafite Konti</p>
                <h3 className="fw-bold mb-0 text-info">{stats.withAccount}</h3>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-bank text-info" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter Section */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={6} lg={8}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Shakisha amazina, ID, umurimo cyangwa aho akorera..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-start-0"
                />
                {searchTerm && (
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="bi bi-x-lg"></i>
                  </Button>
                )}
              </InputGroup>
            </Col>
            <Col xs={12} md={6} lg={4}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-funnel me-2"></i>
                    {filterType === "all" && "Byose"}
                    {filterType === "ubutaka" && "Bafite Ubutaka"}
                    {filterType === "amatungo" && "Bafite Amatungo"}
                    {filterType === "konti" && "Bafite Konti"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterType("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterType("ubutaka")}>
                  <i className="bi bi-geo-alt me-2"></i>Bafite Ubutaka
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType("amatungo")}>
                  <i className="bi bi-piggy-bank me-2"></i>Bafite Amatungo
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType("konti")}>
                  <i className="bi bi-bank me-2"></i>Bafite Konti
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm || filterType !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu baturage{" "}
                <strong>{data.length}</strong>
              </small>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Loading spinner or data table */}
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
              {searchTerm || filterType !== "all"
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Ongeramo' kugira ngo wongere amakuru"}
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
                      <th className="py-3">Amazina</th>
                      <th className="py-3">ID</th>
                      <th className="py-3">Umurimo</th>
                      <th className="py-3">Aho Akorera</th>
                      <th className="py-3 text-center">Ubutaka</th>
                      <th className="py-3 text-center">Amatungo</th>
                      <th className="py-3 text-center">Konti</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>Ibikorwa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, i) => (
                      <tr key={item.ubukungu_id} className="border-bottom">
                        <td className="text-center px-3 text-muted">
                          {indexOfFirstItem + i + 1}
                        </td>
                        <td className="fw-semibold">{item.amazina_y_umuturage}</td>
                        <td>
                          <Badge bg="secondary" className="font-monospace">
                            {item.muturage_id}
                          </Badge>
                        </td>
                        <td>{item.umurimo || <span className="text-muted">-</span>}</td>
                        <td>{item.aho_akorera || <span className="text-muted">-</span>}</td>

                        {/* Status badges for boolean fields */}
                        <td className="text-center">
                          {item.afite_ubutaka ? (
                            <Badge bg="success" className="px-3">
                              <i className="bi bi-check-circle me-1"></i>Yego
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="px-3">
                              <i className="bi bi-x-circle me-1"></i>Oya
                            </Badge>
                          )}
                        </td>
                        <td className="text-center">
                          {item.afite_amatungo ? (
                            <Badge bg="success" className="px-3">
                              <i className="bi bi-check-circle me-1"></i>Yego
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="px-3">
                              <i className="bi bi-x-circle me-1"></i>Oya
                            </Badge>
                          )}
                        </td>
                        <td className="text-center">
                          {item.afite_konti_yo_kuzigama ? (
                            <Badge bg="success" className="px-3">
                              <i className="bi bi-check-circle me-1"></i>Yego
                            </Badge>
                          ) : (
                            <Badge bg="warning" text="dark" className="px-3">
                              <i className="bi bi-x-circle me-1"></i>Oya
                            </Badge>
                          )}
                        </td>

                        {/* Action buttons */}
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <OverlayTrigger placement="top" overlay={renderTooltip("Reba amakuru")}>
                              <Button
                                size="sm"
                                variant="outline-info"
                                onClick={() => handleViewDetails(item)}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => handleEdit(item)}
                              >
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(item.ubukungu_id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    ))}
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
                <Pagination.First 
                  onClick={() => paginate(1)} 
                  disabled={currentPage === 1}
                />
                <Pagination.Prev
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                />
                
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1;
                  // Show first page, last page, current page, and adjacent pages
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
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <Pagination.Ellipsis key={pageNumber} disabled />;
                  }
                  return null;
                })}
                
                <Pagination.Next
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                />
                <Pagination.Last
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                />
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Modal Form for Adding/Editing Data */}
      <Modal 
        show={show} 
        onHide={() => setShow(false)} 
        centered 
        size="lg"
        backdrop="static"
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            {editingId ? (
              <>
                <i className="bi bi-pencil-square me-2"></i> Hindura Amakuru
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-2"></i> Andika Amakuru Mashya
              </>
            )}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 py-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Amazina y'Umuturage <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="amazina_y_umuturage"
                      value={form.amazina_y_umuturage}
                      onChange={handleChange}
                      placeholder="Injiza amazina yombi"
                      isInvalid={!!formErrors.amazina_y_umuturage}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.amazina_y_umuturage}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Indangamuntu / ID <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-credit-card"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="muturage_id"
                      value={form.muturage_id}
                      onChange={handleChange}
                      placeholder="ID y'umuturage"
                      isInvalid={!!formErrors.muturage_id}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.muturage_id}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Umurimo</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-briefcase"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="umurimo"
                      value={form.umurimo}
                      onChange={handleChange}
                      placeholder="Akoramo iki?"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Aho Akorera</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-building"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="aho_akorera"
                      value={form.aho_akorera}
                      onChange={handleChange}
                      placeholder="Akorerera hehe?"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Inkomoko y'Amafaranga</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-cash-coin"></i>
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="inkomoko_y_amafaranga"
                      value={form.inkomoko_y_amafaranga}
                      onChange={handleChange}
                      placeholder="Nk'ubuhinzi, ubucuruzi, umushahara, etc."
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <p className="text-muted small mb-3">
                  <i className="bi bi-info-circle me-1"></i>
                  Hitamo ibyo afite:
                </p>
              </Col>

              {/* Checkboxes for boolean values */}
              <Col md={4}>
                <Form.Check
                  type="switch"
                  id="switch-ubutaka"
                  name="afite_ubutaka"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-geo-alt me-2 text-success"></i>
                      Afite Ubutaka
                    </span>
                  }
                  checked={form.afite_ubutaka === 1}
                  onChange={handleChange}
                  className="user-select-none"
                />
              </Col>
              
              <Col md={4}>
                <Form.Check
                  type="switch"
                  id="switch-amatungo"
                  name="afite_amatungo"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-piggy-bank me-2 text-warning"></i>
                      Afite Amatungo
                    </span>
                  }
                  checked={form.afite_amatungo === 1}
                  onChange={handleChange}
                  className="user-select-none"
                />
              </Col>
              
              <Col md={4}>
                <Form.Check
                  type="switch"
                  id="switch-konti"
                  name="afite_konti_yo_kuzigama"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-bank me-2 text-info"></i>
                      Afite Konti yo Kuzigama
                    </span>
                  }
                  checked={form.afite_konti_yo_kuzigama === 1}
                  onChange={handleChange}
                  className="user-select-none"
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={() => setShow(false)}>
            <i className="bi bi-x-circle me-1"></i> Funga
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            <i className="bi bi-check-circle me-1"></i> Bika Amakuru
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Details Modal */}
      <Modal 
        show={showDetails} 
        onHide={() => setShowDetails(false)} 
        centered
        size="lg"
      >
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>
            Amakuru Arambuye
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedItem && (
            <div>
              <Row className="g-4">
                <Col md={6}>
                  <div className="border-start border-4 border-primary ps-3">
                    <small className="text-muted">Amazina</small>
                    <h5 className="mb-0">{selectedItem.amazina_y_umuturage}</h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border-start border-4 border-secondary ps-3">
                    <small className="text-muted">Indangamuntu</small>
                    <h5 className="mb-0 font-monospace">{selectedItem.muturage_id}</h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Umurimo</small>
                    <h5 className="mb-0">{selectedItem.umurimo || <span className="text-muted">-</span>}</h5>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Aho Akorera</small>
                    <h5 className="mb-0">{selectedItem.aho_akorera || <span className="text-muted">-</span>}</h5>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="border-start border-4 border-info ps-3">
                    <small className="text-muted">Inkomoko y'Amafaranga</small>
                    <h5 className="mb-0">{selectedItem.inkomoko_y_amafaranga || <span className="text-muted">-</span>}</h5>
                  </div>
                </Col>
              </Row>

              <hr className="my-4" />

              <h6 className="text-muted mb-3">
                <i className="bi bi-list-check me-2"></i>
                Ibintu Afite
              </h6>
              <Row className="g-3">
                <Col md={4}>
                  <Card className={`border-2 ${selectedItem.afite_ubutaka ? 'border-success' : 'border-danger'}`}>
                    <Card.Body className="text-center">
                      <i className={`bi bi-geo-alt-fill ${selectedItem.afite_ubutaka ? 'text-success' : 'text-danger'}`} style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-0">Ubutaka</h6>
                      <Badge bg={selectedItem.afite_ubutaka ? "success" : "danger"} className="mt-2">
                        {selectedItem.afite_ubutaka ? "Yego" : "Oya"}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className={`border-2 ${selectedItem.afite_amatungo ? 'border-success' : 'border-danger'}`}>
                    <Card.Body className="text-center">
                      <i className={`bi bi-piggy-bank-fill ${selectedItem.afite_amatungo ? 'text-success' : 'text-danger'}`} style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-0">Amatungo</h6>
                      <Badge bg={selectedItem.afite_amatungo ? "success" : "danger"} className="mt-2">
                        {selectedItem.afite_amatungo ? "Yego" : "Oya"}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className={`border-2 ${selectedItem.afite_konti_yo_kuzigama ? 'border-success' : 'border-warning'}`}>
                    <Card.Body className="text-center">
                      <i className={`bi bi-bank ${selectedItem.afite_konti_yo_kuzigama ? 'text-success' : 'text-warning'}`} style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-0">Konti yo Kuzigama</h6>
                      <Badge bg={selectedItem.afite_konti_yo_kuzigama ? "success" : "warning"} text={selectedItem.afite_konti_yo_kuzigama ? "white" : "dark"} className="mt-2">
                        {selectedItem.afite_konti_yo_kuzigama ? "Yego" : "Oya"}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="primary" onClick={() => {
            setShowDetails(false);
            handleEdit(selectedItem);
          }}>
            <i className="bi bi-pencil-square me-1"></i> Hindura
          </Button>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            <i className="bi bi-x-circle me-1"></i> Funga
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Ubukungu;