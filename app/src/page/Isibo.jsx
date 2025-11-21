import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  Container,
  Row,
  Col,
  Card,
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

const API_URL = "http://localhost:5000/isibo";

const Isibo = () => {
  // State Management
  const [isiboList, setIsiboList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    totalMembers: 0,
    avgMembersPerCoop: 0,
    largestCoop: null,
    uniqueVillages: 0,
  });

  // Form State
  const [formData, setFormData] = useState({
    izina_ry_isibo: "",
    umuyobozi_w_isibo: "",
    umubare_w_abaturage: "",
    umudugudu: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Calculate statistics
  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        total: 0,
        totalMembers: 0,
        avgMembersPerCoop: 0,
        largestCoop: null,
        uniqueVillages: 0,
      });
      return;
    }

    const totalMembers = data.reduce((sum, item) => sum + parseInt(item.umubare_w_abaturage || 0), 0);
    const avgMembers = (totalMembers / data.length).toFixed(1);
    const largestCoop = data.reduce((max, item) =>
      parseInt(item.umubare_w_abaturage || 0) > parseInt(max.umubare_w_abaturage || 0) ? item : max
    );
    const uniqueVillages = [...new Set(data.map((item) => item.umudugudu))].length;

    setStats({
      total: data.length,
      totalMembers,
      avgMembersPerCoop: avgMembers,
      largestCoop,
      uniqueVillages,
    });
  };

  // Show alert function
  const showAlertMessage = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  // Fetch all cooperatives
  const fetchIsibo = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setIsiboList(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlertMessage("Amakuru yagaruwe neza!", "info");
    } catch (err) {
      console.error("❌ Error fetching cooperatives:", err);
      showAlertMessage("Habaye ikosa mu gusoma amakuru!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIsibo();
  }, []);

  // Search and Sort Effect
  useEffect(() => {
    let result = [...isiboList];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.izina_ry_isibo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.umuyobozi_w_isibo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.umudugudu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "name":
          compareA = a.izina_ry_isibo?.toLowerCase() || "";
          compareB = b.izina_ry_isibo?.toLowerCase() || "";
          break;
        case "members":
          compareA = parseInt(a.umubare_w_abaturage || 0);
          compareB = parseInt(b.umubare_w_abaturage || 0);
          break;
        case "village":
          compareA = a.umudugudu?.toLowerCase() || "";
          compareB = b.umudugudu?.toLowerCase() || "";
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return compareA > compareB ? 1 : -1;
      } else {
        return compareA < compareB ? 1 : -1;
      }
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, sortBy, sortOrder, isiboList]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.izina_ry_isibo?.trim()) {
      errors.izina_ry_isibo = "Izina ry'isibo ni ngombwa";
    }

    if (!formData.umuyobozi_w_isibo?.trim()) {
      errors.umuyobozi_w_isibo = "Amazina y'umuyobozi ni ngombwa";
    }

    if (!formData.umubare_w_abaturage || parseInt(formData.umubare_w_abaturage) < 1) {
      errors.umubare_w_abaturage = "Shyiramo umubare wibura 1";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Submit handler (Add or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlertMessage("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        showAlertMessage("Isibo yavuguruwe neza!", "success");
      } else {
        await axios.post(API_URL, formData);
        showAlertMessage("Isibo yashyizwemo neza!", "success");
      }

      resetForm();
      setShow(false);
      fetchIsibo();
    } catch (err) {
      console.error("❌ Error saving data:", err);
      showAlertMessage(
        err.response?.data?.message || "Kwiyandikisha ntabwo yabaye!",
        "danger"
      );
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      izina_ry_isibo: "",
      umuyobozi_w_isibo: "",
      umubare_w_abaturage: "",
      umudugudu: "",
    });
    setFormErrors({});
    setEditingId(null);
  };

  // Handle Add
  const handleAdd = () => {
    resetForm();
    setShow(true);
  };

  // Edit mode
  const handleEdit = (item) => {
    setEditingId(item.isibo_id);
    setFormData({
      izina_ry_isibo: item.izina_ry_isibo,
      umuyobozi_w_isibo: item.umuyobozi_w_isibo,
      umubare_w_abaturage: item.umubare_w_abaturage,
      umudugudu: item.umudugudu,
    });
    setFormErrors({});
    setShow(true);
  };

  // View Details
  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setShowDetails(true);
  };

  // Delete cooperative
  const handleDelete = async (id) => {
    const item = isiboList.find((i) => i.isibo_id === id);
    if (window.confirm(`Uremeza ko ushaka gusiba isibo "${item?.izina_ry_isibo}"?`)) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlertMessage("Isibo yasibwe neza!", "success");
        fetchIsibo();
      } catch (err) {
        console.error("❌ Error deleting:", err);
        showAlertMessage("Ntibikunze gusiba!", "danger");
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Izina ry'Isibo", "Umuyobozi", "Abaturage", "Umudugudu"];

    const csvData = filteredData.map((item) => [
      item.izina_ry_isibo,
      item.umuyobozi_w_isibo,
      item.umubare_w_abaturage,
      item.umudugudu || "-",
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `isibo_${new Date().toISOString().split("T")[0]}.csv`);
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
        <div>
          <h2 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-people-fill" style={{ fontSize: "2rem" }}></i>
            Urutonde rw'Isibo
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Gucuruza, gukora imisoro, no kuba muri kiganiro
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo isibo nshya")}>
            <Button variant="success" onClick={handleAdd} className="shadow-sm">
              <i className="bi bi-plus-circle me-2"></i>Ongeramo Isibo
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Garura amakuru")}>
            <Button variant="outline-primary" onClick={fetchIsibo} className="shadow-sm">
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
                <p className="text-muted mb-1 small">Isibo Zose</p>
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
                <p className="text-muted mb-1 small">Abaturage Bose</p>
                <h3 className="fw-bold mb-0 text-success">{stats.totalMembers}</h3>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-person-check-fill text-success" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Ikigereranyo</p>
                <h3 className="fw-bold mb-0 text-info">{stats.avgMembersPerCoop}</h3>
                <small className="text-muted">abaturage/isibo</small>
              </div>
              <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-bar-chart-fill text-info" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #fd7e14" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Imidugudu</p>
                <h3 className="fw-bold mb-0 text-warning">{stats.uniqueVillages}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-geo-alt-fill text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Sort Section */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={6}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Shakisha izina, umuyobozi, cyangwa umudugudu..."
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
            <Col xs={12} md={3}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-sort-down me-2"></i>
                    {sortBy === "name" && "Izina"}
                    {sortBy === "members" && "Abaturage"}
                    {sortBy === "village" && "Umudugudu"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setSortBy("name")}>
                  <i className="bi bi-sort-alpha-down me-2"></i>Izina
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("members")}>
                  <i className="bi bi-sort-numeric-down me-2"></i>Abaturage
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("village")}>
                  <i className="bi bi-geo-alt me-2"></i>Umudugudu
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col xs={12} md={3}>
              <Button
                variant={sortOrder === "asc" ? "outline-primary" : "outline-secondary"}
                className="w-100"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <i className={`bi bi-sort-${sortOrder === "asc" ? "up" : "down"} me-2`}></i>
                {sortOrder === "asc" ? "Kuva hasi" : "Kuva hejuru"}
              </Button>
            </Col>
          </Row>
          {searchTerm && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu baturage <strong>{isiboList.length}</strong>
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
              {searchTerm
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Ongeramo Isibo' kugira ngo wongere amakuru"}
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
                      <th className="py-3">Izina ry'Isibo</th>
                      <th className="py-3">Umuyobozi</th>
                      <th className="py-3 text-center">Abaturage</th>
                      <th className="py-3">Umudugudu</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={item.isibo_id} className="border-bottom">
                        <td className="text-center px-3 text-muted">{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">
                          <i className="bi bi-people-fill text-primary me-2"></i>
                          {item.izina_ry_isibo}
                        </td>
                        <td>
                          <i className="bi bi-person-badge text-secondary me-2"></i>
                          {item.umuyobozi_w_isibo}
                        </td>
                        <td className="text-center">
                          <Badge bg="success" className="px-3 py-2">
                            <i className="bi bi-person-fill me-1"></i>
                            {item.umubare_w_abaturage}
                          </Badge>
                        </td>
                        <td>
                          {item.umudugudu ? (
                            <span>
                              <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                              {item.umudugudu}
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
                                onClick={() => handleDelete(item.isibo_id)}
                              >
                                <i className="bi bi-trash3-fill"></i>
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
      <Modal show={show} onHide={() => setShow(false)} size="lg" centered backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              {editingId ? (
                <>
                  <i className="bi bi-pencil-square me-2"></i>Hindura Isibo
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>Andika Isibo Nshya
                </>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-4">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Izina ry'Isibo <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-people-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="izina_ry_isibo"
                      value={formData.izina_ry_isibo}
                      onChange={handleChange}
                      placeholder="Urugero: Isibo ya Gatare"
                      isInvalid={!!formErrors.izina_ry_isibo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.izina_ry_isibo}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Umuyobozi w'Isibo <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person-badge"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="umuyobozi_w_isibo"
                      value={formData.umuyobozi_w_isibo}
                      onChange={handleChange}
                      placeholder="Shyiramo amazina y'umuyobozi..."
                      isInvalid={!!formErrors.umuyobozi_w_isibo}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.umuyobozi_w_isibo}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Umubare w'Abaturage <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="umubare_w_abaturage"
                      value={formData.umubare_w_abaturage}
                      onChange={handleChange}
                      min="1"
                      placeholder="Shyiramo umubare..."
                      isInvalid={!!formErrors.umubare_w_abaturage}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.umubare_w_abaturage}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Umubare w'abantu bagize isibo
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Umudugudu</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-geo-alt-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="umudugudu"
                      value={formData.umudugudu}
                      onChange={handleChange}
                      placeholder="Shyiramo umudugudu..."
                    />
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Aha isibo ikorera (optional)
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShow(false)}>
              <i className="bi bi-x-circle me-1"></i>Funga
            </Button>
            <Button type="submit" variant={editingId ? "warning" : "success"}>
              <i className={`bi me-1 ${editingId ? "bi-save" : "bi-check-circle"}`}></i>
              {editingId ? "Hindura" : "Bika Amakuru"}
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
                  <Card className="border-primary border-2">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <small className="text-muted">Izina ry'Isibo</small>
                          <h4 className="mb-0 fw-bold text-primary">
                            <i className="bi bi-people-fill me-2"></i>
                            {selectedItem.izina_ry_isibo}
                          </h4>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <i className="bi bi-people-fill text-primary" style={{ fontSize: "2.5rem" }}></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Umuyobozi</small>
                    <h5 className="mb-0">
                      <i className="bi bi-person-badge text-success me-2"></i>
                      {selectedItem.umuyobozi_w_isibo}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Umudugudu</small>
                    <h5 className="mb-0">
                      {selectedItem.umudugudu ? (
                        <>
                          <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                          {selectedItem.umudugudu}
                        </>
                      ) : (
                        <span className="text-muted">Ntawufite</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={12}>
                  <Card className="border-success border-2 bg-success bg-opacity-10">
                    <Card.Body className="text-center">
                      <i className="bi bi-person-fill text-success" style={{ fontSize: "3rem" }}></i>
                      <h6 className="mt-2 mb-1 text-muted">Umubare w'Abaturage</h6>
                      <h2 className="fw-bold text-success mb-0">{selectedItem.umubare_w_abaturage}</h2>
                      <small className="text-muted">abantu</small>
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
                      ID: <strong>{selectedItem.isibo_id}</strong>
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

export default Isibo;