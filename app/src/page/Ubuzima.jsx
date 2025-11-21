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
  ProgressBar,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/ubuzima";

const Ubuzima = () => {
  // State Management
  const [ubuzima, setUbuzima] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    withDisability: 0,
    withInsurance: 0,
    withChronicDisease: 0,
    insuranceRate: 0,
  });

  // Form State
  const [form, setForm] = useState({
    afite_ubumuga: 0,
    ubwoko_bw_ubumuga: "",
    indwara_y_igihe_kirekire: "",
    afite_mutuelle: 0,
    ubwoko_bwa_mutuelle: "",
    ivuriro_ajyamo: "",
    amazina_y_umuturage: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [editId, setEditId] = useState(null);

  // Insurance types
  const insuranceTypes = [
    { value: "Mutuelle de Santé", label: "Mutuelle de Santé", color: "primary" },
    { value: "RAMA", label: "RAMA", color: "success" },
    { value: "MMI", label: "MMI", color: "info" },
    { value: "Privée", label: "Ubwishingizi bwite", color: "warning" },
  ];

  // Calculate statistics
  const calculateStats = (data) => {
    const total = data.length;
    const withDisability = data.filter((item) => item.afite_ubumuga === 1).length;
    const withInsurance = data.filter((item) => item.afite_mutuelle === 1).length;
    const withChronicDisease = data.filter(
      (item) => item.indwara_y_igihe_kirekire && item.indwara_y_igihe_kirekire.trim() !== ""
    ).length;
    const insuranceRate = total > 0 ? ((withInsurance / total) * 100).toFixed(1) : 0;

    setStats({
      total,
      withDisability,
      withInsurance,
      withChronicDisease,
      insuranceRate,
    });
  };

  // Show alert function
  const showAlertMessage = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  // Fetch all data
  const fetchUbuzima = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setUbuzima(res.data);
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
    fetchUbuzima();
  }, []);

  // Search and Filter Effect
  useEffect(() => {
    let result = [...ubuzima];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.amazina_y_umuturage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ubwoko_bw_ubumuga?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.indwara_y_igihe_kirekire?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.ivuriro_ajyamo?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    switch (filterType) {
      case "disability":
        result = result.filter((item) => item.afite_ubumuga === 1);
        break;
      case "insurance":
        result = result.filter((item) => item.afite_mutuelle === 1);
        break;
      case "chronic":
        result = result.filter(
          (item) => item.indwara_y_igihe_kirekire && item.indwara_y_igihe_kirekire.trim() !== ""
        );
        break;
      case "no-insurance":
        result = result.filter((item) => item.afite_mutuelle === 0);
        break;
      default:
        break;
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterType, ubuzima]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.amazina_y_umuturage?.trim()) {
      errors.amazina_y_umuturage = "Amazina ni ngombwa";
    }

    if (form.afite_ubumuga === 1 && !form.ubwoko_bw_ubumuga?.trim()) {
      errors.ubwoko_bw_ubumuga = "Sobanura ubwoko bw'ubumuga";
    }

    if (form.afite_mutuelle === 1 && !form.ubwoko_bwa_mutuelle?.trim()) {
      errors.ubwoko_bwa_mutuelle = "Hitamo ubwoko bw'ubwishingizi";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Submit form (create/update)
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
      fetchUbuzima();
    } catch (error) {
      console.error(error);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      afite_ubumuga: 0,
      ubwoko_bw_ubumuga: "",
      indwara_y_igihe_kirekire: "",
      afite_mutuelle: 0,
      ubwoko_bwa_mutuelle: "",
      ivuriro_ajyamo: "",
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
    setForm({ ...ub });
    setEditId(ub.ubuzima_id);
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
        fetchUbuzima();
      } catch (error) {
        console.error(error);
        showAlertMessage("Ntibikunze gusiba!", "danger");
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Amazina",
      "Afite Ubumuga",
      "Ubwoko bw'Ubumuga",
      "Indwara",
      "Afite Mutuelle",
      "Ubwoko bw'Ubwishingizi",
      "Ivuriro",
    ];

    const csvData = filteredData.map((item) => [
      item.amazina_y_umuturage,
      item.afite_ubumuga ? "Yego" : "Oya",
      item.ubwoko_bw_ubumuga || "-",
      item.indwara_y_igihe_kirekire || "-",
      item.afite_mutuelle ? "Yego" : "Oya",
      item.ubwoko_bwa_mutuelle || "-",
      item.ivuriro_ajyamo || "-",
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ubuzima_${new Date().toISOString().split("T")[0]}.csv`);
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
          <i className="bi bi-heart-pulse-fill" style={{ fontSize: "2rem" }}></i>
          Ubuzima bw'Abaturage
        </h2>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo amakuru mashya")}>
            <Button variant="success" onClick={handleAdd} className="shadow-sm">
              <i className="bi bi-plus-circle me-2"></i>Ongeraho
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Garura amakuru")}>
            <Button variant="outline-primary" onClick={fetchUbuzima} className="shadow-sm">
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
          <i
            className={`bi bi-${
              alert.variant === "success"
                ? "check-circle"
                : alert.variant === "danger"
                ? "exclamation-circle"
                : "info-circle"
            } me-2`}
          ></i>
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
                <p className="text-muted mb-1 small">Bafite Ubwishingizi</p>
                <h3 className="fw-bold mb-0 text-success">{stats.withInsurance}</h3>
                <ProgressBar
                  now={stats.insuranceRate}
                  variant="success"
                  className="mt-2"
                  style={{ height: "6px" }}
                />
                <small className="text-muted">{stats.insuranceRate}%</small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-shield-check text-success" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #dc3545" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Bafite Ubumuga</p>
                <h3 className="fw-bold mb-0 text-danger">{stats.withDisability}</h3>
              </div>
              <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-person-wheelchair text-danger" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #fd7e14" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Indwara Zirambye</p>
                <h3 className="fw-bold mb-0 text-warning">{stats.withChronicDisease}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-thermometer-half text-warning" style={{ fontSize: "2rem" }}></i>
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
                  placeholder="Shakisha amazina, ubumuga, indwara, cyangwa ivuriro..."
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
                    {filterType === "all" && "Byose"}
                    {filterType === "disability" && "Bafite Ubumuga"}
                    {filterType === "insurance" && "Bafite Mutuelle"}
                    {filterType === "chronic" && "Indwara Zirambye"}
                    {filterType === "no-insurance" && "Nta Mutuelle"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterType("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterType("insurance")}>
                  <i className="bi bi-shield-check me-2 text-success"></i>Bafite Mutuelle
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType("no-insurance")}>
                  <i className="bi bi-shield-x me-2 text-danger"></i>Nta Mutuelle
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType("disability")}>
                  <i className="bi bi-person-wheelchair me-2 text-danger"></i>Bafite Ubumuga
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterType("chronic")}>
                  <i className="bi bi-thermometer-half me-2 text-warning"></i>Indwara Zirambye
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm || filterType !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu baturage <strong>{ubuzima.length}</strong>
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
              {searchTerm || filterType !== "all"
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
                      <th className="py-3 px-3 text-center" style={{ width: "60px" }}>
                        #
                      </th>
                      <th className="py-3">Amazina</th>
                      <th className="py-3 text-center">Ubumuga</th>
                      <th className="py-3">Ubwoko bw'Ubumuga</th>
                      <th className="py-3">Indwara</th>
                      <th className="py-3 text-center">Mutuelle</th>
                      <th className="py-3">Ubwoko bwa Mutuelle</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((ub, index) => (
                      <tr key={ub.ubuzima_id} className="border-bottom">
                        <td className="text-center px-3 text-muted">{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">
                          <i className="bi bi-person-fill text-primary me-2"></i>
                          {ub.amazina_y_umuturage}
                        </td>
                        <td className="text-center">
                          {ub.afite_ubumuga ? (
                            <Badge bg="danger" className="px-3">
                              <i className="bi bi-check-circle me-1"></i>Yego
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="px-3">
                              <i className="bi bi-x-circle me-1"></i>Oya
                            </Badge>
                          )}
                        </td>
                        <td>
                          {ub.ubwoko_bw_ubumuga ? (
                            <span className="text-danger">
                              <i className="bi bi-exclamation-triangle me-1"></i>
                              {ub.ubwoko_bw_ubumuga}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {ub.indwara_y_igihe_kirekire ? (
                            <span className="text-warning">
                              <i className="bi bi-thermometer-half me-1"></i>
                              {ub.indwara_y_igihe_kirekire}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {ub.afite_mutuelle ? (
                            <Badge bg="success" className="px-3">
                              <i className="bi bi-shield-check me-1"></i>Yego
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="px-3">
                              <i className="bi bi-shield-x me-1"></i>Oya
                            </Badge>
                          )}
                        </td>
                        <td>
                          {ub.ubwoko_bwa_mutuelle ? (
                            <Badge bg="info" text="dark" className="px-2">
                              {ub.ubwoko_bwa_mutuelle}
                            </Badge>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          <div className="d-flex gap-1 justify-content-center">
                            <OverlayTrigger placement="top" overlay={renderTooltip("Reba amakuru")}>
                              <Button size="sm" variant="outline-info" onClick={() => handleViewDetails(ub)}>
                                <i className="bi bi-eye"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                              <Button size="sm" variant="outline-primary" onClick={() => handleEdit(ub)}>
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(ub.ubuzima_id)}
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
                Kugaragaza {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredData.length)} kuri{" "}
                {filteredData.length}
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
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-person-wheelchair me-2"></i>Amakuru ku Bumuga
                </h6>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="switch-ubumuga"
                  name="afite_ubumuga"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-person-wheelchair me-2 text-danger"></i>
                      Afite Ubumuga
                    </span>
                  }
                  checked={form.afite_ubumuga === 1}
                  onChange={handleChange}
                  className="user-select-none mb-3"
                />
              </Col>

              {form.afite_ubumuga === 1 && (
                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Ubwoko bw'Ubumuga <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-exclamation-triangle"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="ubwoko_bw_ubumuga"
                        value={form.ubwoko_bw_ubumuga}
                        onChange={handleChange}
                        placeholder="Nk'ubumuga bwo kubona, kumva, kugenda..."
                        isInvalid={!!formErrors.ubwoko_bw_ubumuga}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.ubwoko_bw_ubumuga}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>
              )}

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-thermometer-half me-2"></i>Amakuru ku Ndwara
                </h6>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Indwara y'Igihe Kirekire</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-thermometer-half"></i>
                    </InputGroup.Text>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="indwara_y_igihe_kirekire"
                      value={form.indwara_y_igihe_kirekire}
                      onChange={handleChange}
                      placeholder="Nk'diyabete, tension, etc."
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Sobanura indwara irambye afite (optional)
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-shield-check me-2"></i>Amakuru ku Bwishingizi
                </h6>
              </Col>

              <Col md={12}>
                <Form.Check
                  type="switch"
                  id="switch-mutuelle"
                  name="afite_mutuelle"
                  label={
                    <span className="fw-semibold">
                      <i className="bi bi-shield-check me-2 text-success"></i>
                      Afite Ubwishingizi bw'Ubuzima (Mutuelle)
                    </span>
                  }
                  checked={form.afite_mutuelle === 1}
                  onChange={handleChange}
                  className="user-select-none mb-3"
                />
              </Col>

              {form.afite_mutuelle === 1 && (
                <>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Ubwoko bw'Ubwishingizi <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-shield-fill-check"></i>
                        </InputGroup.Text>
                        <Form.Select
                          name="ubwoko_bwa_mutuelle"
                          value={form.ubwoko_bwa_mutuelle}
                          onChange={handleChange}
                          isInvalid={!!formErrors.ubwoko_bwa_mutuelle}
                        >
                          <option value="">Hitamo ubwoko...</option>
                          {insuranceTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {formErrors.ubwoko_bwa_mutuelle}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Ivuriro Ajyamo</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <i className="bi bi-hospital"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="ivuriro_ajyamo"
                          value={form.ivuriro_ajyamo}
                          onChange={handleChange}
                          placeholder="Nk'Polyclinique, CHUK, etc."
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Ivuriro ajyamo cyangwa akoresha (optional)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </>
              )}
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
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-person-wheelchair me-2"></i>Ubumuga
                  </h6>
                </Col>

                <Col md={6}>
                  <Card className={`border-2 ${selectedItem.afite_ubumuga ? "border-danger" : "border-success"}`}>
                    <Card.Body className="text-center">
                      <i
                        className={`bi bi-person-wheelchair ${
                          selectedItem.afite_ubumuga ? "text-danger" : "text-success"
                        }`}
                        style={{ fontSize: "2rem" }}
                      ></i>
                      <h6 className="mt-2 mb-0">Afite Ubumuga</h6>
                      <Badge bg={selectedItem.afite_ubumuga ? "danger" : "success"} className="mt-2">
                        {selectedItem.afite_ubumuga ? "Yego" : "Oya"}
                      </Badge>
                      {selectedItem.ubwoko_bw_ubumuga && (
                        <p className="mt-2 mb-0 small text-muted">{selectedItem.ubwoko_bw_ubumuga}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card
                    className={`border-2 ${
                      selectedItem.indwara_y_igihe_kirekire ? "border-warning" : "border-success"
                    }`}
                  >
                    <Card.Body className="text-center">
                      <i
                        className={`bi bi-thermometer-half ${
                          selectedItem.indwara_y_igihe_kirekire ? "text-warning" : "text-success"
                        }`}
                        style={{ fontSize: "2rem" }}
                      ></i>
                      <h6 className="mt-2 mb-0">Indwara Irambye</h6>
                      <Badge
                        bg={selectedItem.indwara_y_igihe_kirekire ? "warning" : "success"}
                        text={selectedItem.indwara_y_igihe_kirekire ? "dark" : "white"}
                        className="mt-2"
                      >
                        {selectedItem.indwara_y_igihe_kirekire ? "Yego" : "Oya"}
                      </Badge>
                      {selectedItem.indwara_y_igihe_kirekire && (
                        <p className="mt-2 mb-0 small text-muted">{selectedItem.indwara_y_igihe_kirekire}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-shield-check me-2"></i>Ubwishingizi bw'Ubuzima
                  </h6>
                </Col>

                <Col md={12}>
                  <Card className={`border-2 ${selectedItem.afite_mutuelle ? "border-success" : "border-danger"}`}>
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="mb-1">Afite Ubwishingizi</h6>
                          <Badge bg={selectedItem.afite_mutuelle ? "success" : "danger"} className="px-3 py-2">
                            <i
                              className={`bi bi-shield-${selectedItem.afite_mutuelle ? "check" : "x"} me-1`}
                            ></i>
                            {selectedItem.afite_mutuelle ? "Yego" : "Oya"}
                          </Badge>
                        </div>
                        <i
                          className={`bi bi-shield-${selectedItem.afite_mutuelle ? "check" : "x"} ${
                            selectedItem.afite_mutuelle ? "text-success" : "text-danger"
                          }`}
                          style={{ fontSize: "3rem" }}
                        ></i>
                      </div>

                      {selectedItem.afite_mutuelle === 1 && (
                        <div className="mt-3">
                          <Row>
                            <Col md={6}>
                              <small className="text-muted d-block">Ubwoko bw'Ubwishingizi</small>
                              <Badge bg="info" text="dark" className="mt-1">
                                {selectedItem.ubwoko_bwa_mutuelle || "-"}
                              </Badge>
                            </Col>
                            <Col md={6}>
                              <small className="text-muted d-block">Ivuriro Ajyamo</small>
                              <p className="mb-0 mt-1">
                                <i className="bi bi-hospital text-info me-1"></i>
                                {selectedItem.ivuriro_ajyamo || "-"}
                              </p>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
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
                      Iyandikishwa: <strong>{new Date().toLocaleDateString("rw-RW")}</strong>
                    </small>
                  </Col>
                  <Col xs={12}>
                    <small className="text-muted d-block">
                      <i className="bi bi-hash me-2"></i>
                      ID: <strong>{selectedItem.ubuzima_id}</strong>
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

export default Ubuzima;