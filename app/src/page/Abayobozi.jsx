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
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/abayobozi";

const roles = [
  { value: "Umukuru_w_Umudugudu", label: "Umukuru w'Umudugudu", icon: "person-badge", color: "primary" },
  { value: "Ushinzwe_Imibereho", label: "Ushinzwe Imibereho", icon: "heart-pulse", color: "danger" },
  { value: "Ushinzwe_Umutekano", label: "Ushinzwe Umutekano", icon: "shield-check", color: "success" },
  { value: "Ushinzwe_Uburezi", label: "Ushinzwe Uburezi", icon: "mortarboard", color: "info" },
  { value: "Ushinzwe_Ubukungu", label: "Ushinzwe Ubukungu", icon: "cash-stack", color: "warning" },
];

const Abayobozi = () => {
  // State Management
  const [abayobozi, setAbayobozi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    byRole: {},
  });

  // Form State
  const [form, setForm] = useState({
    amazina_yose: "",
    telefone: "",
    inshingano: "",
    umudugudu: "",
    itariki_yatangiye: "",
    itariki_yarangije: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Get role configuration
  const getRoleConfig = (roleValue) => {
    return roles.find((r) => r.value === roleValue) || roles[0];
  };

  // Calculate tenure duration
  const calculateTenure = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years} umwaka, ${remainingMonths} ukwezi`;
    } else if (years > 0) {
      return `${years} ${years === 1 ? "umwaka" : "imyaka"}`;
    } else {
      return `${remainingMonths} ${remainingMonths === 1 ? "ukwezi" : "amezi"}`;
    }
  };

  // Calculate statistics
  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        total: 0,
        active: 0,
        completed: 0,
        byRole: {},
      });
      return;
    }

    const byRole = {};
    roles.forEach((role) => {
      byRole[role.value] = data.filter((leader) => leader.inshingano === role.value).length;
    });

    setStats({
      total: data.length,
      active: data.filter((leader) => !leader.itariki_yarangije).length,
      completed: data.filter((leader) => leader.itariki_yarangije).length,
      byRole,
    });
  };

  // Show alert function
  const showAlertMessage = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setAbayobozi(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlertMessage("Amakuru yagaruwe neza!", "info");
    } catch (err) {
      console.error("Error fetching abayobozi:", err);
      showAlertMessage("Habaye ikosa mu gusoma amakuru!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search and Filter Effect
  useEffect(() => {
    let result = [...abayobozi];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (leader) =>
          leader.amazina_yose?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          leader.telefone?.includes(searchTerm) ||
          leader.umudugudu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply role filter
    if (filterRole !== "all") {
      result = result.filter((leader) => leader.inshingano === filterRole);
    }

    // Apply status filter
    if (filterStatus === "active") {
      result = result.filter((leader) => !leader.itariki_yarangije);
    } else if (filterStatus === "completed") {
      result = result.filter((leader) => leader.itariki_yarangije);
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, abayobozi]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.amazina_yose?.trim()) {
      errors.amazina_yose = "Amazina ni ngombwa";
    }

    if (!form.inshingano) {
      errors.inshingano = "Hitamo inshingano";
    }

    if (!form.itariki_yatangiye) {
      errors.itariki_yatangiye = "Itariki yatangiye ni ngombwa";
    }

    if (form.telefone && !/^07[2389]\d{7}$/.test(form.telefone)) {
      errors.telefone = "Numero ya telefoni ntago iri neza (Urugero: 0781234567)";
    }

    if (form.itariki_yarangije && form.itariki_yatangiye) {
      if (new Date(form.itariki_yarangije) < new Date(form.itariki_yatangiye)) {
        errors.itariki_yarangije = "Itariki yarangije ntishobora kuba mbere y'itariki yatangiye";
      }
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

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setForm({
      amazina_yose: "",
      telefone: "",
      inshingano: "",
      umudugudu: "",
      itariki_yatangiye: "",
      itariki_yarangije: "",
    });
    setFormErrors({});
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlertMessage("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
        showAlertMessage("Amakuru yahinduwe neza!", "success");
      } else {
        await axios.post(API_URL, form);
        showAlertMessage("Umuyobozi yashyizweho neza!", "success");
      }
      fetchData();
      setShow(false);
      resetForm();
    } catch (err) {
      console.error("Error saving abayobozi:", err);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingId(item.umuyobozi_id);
    setForm(item);
    setFormErrors({});
    setShow(true);
  };

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedLeader(item);
    setShowDetails(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba uyu muyobozi?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlertMessage("Umuyobozi yasibwe neza!", "success");
        fetchData();
      } catch (err) {
        console.error("Error deleting:", err);
        showAlertMessage("Ntibikunze gusiba!", "danger");
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Amazina",
      "Telefone",
      "Inshingano",
      "Umudugudu",
      "Itariki Yatangiye",
      "Itariki Yarangije",
      "Igihe",
    ];

    const csvData = filteredData.map((leader) => [
      leader.amazina_yose,
      leader.telefone || "-",
      getRoleConfig(leader.inshingano).label,
      leader.umudugudu || "-",
      leader.itariki_yatangiye,
      leader.itariki_yarangije || "Aracyakora",
      calculateTenure(leader.itariki_yatangiye, leader.itariki_yarangije),
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `abayobozi_${new Date().toISOString().split("T")[0]}.csv`);
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
            Abayobozi b'Umudugudu
            <Badge bg="primary" pill className="fs-6">
              {stats.total}
            </Badge>
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Kwandika, kureba, no gucunga amakuru y'abayobozi
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Andika umuyobozi mushya")}>
            <Button
              variant="primary"
              onClick={() => {
                resetForm();
                setShow(true);
              }}
              className="shadow-sm"
            >
              <i className="bi bi-person-plus-fill me-2"></i>Andika Umuyobozi
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Garura amakuru")}>
            <Button variant="outline-primary" onClick={fetchData} className="shadow-sm">
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
          className="shadow-sm"
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
        <Col xs={12} sm={6} lg={4}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Abayobozi Bose</p>
                  <h3 className="fw-bold mb-0 text-primary">{stats.total}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-people-fill text-primary" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #198754" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Baracyakora</p>
                  <h3 className="fw-bold mb-0 text-success">{stats.active}</h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-person-check-fill text-success" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #6c757d" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Barangije</p>
                  <h3 className="fw-bold mb-0 text-secondary">{stats.completed}</h3>
                </div>
                <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-person-x-fill text-secondary" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Roles Distribution Cards */}
      <Row className="mb-4 g-3">
        {roles.map((role) => (
          <Col key={role.value} xs={12} sm={6} lg={4} xl={2.4}>
            <Card className="border-0 shadow-sm hover-card h-100">
              <Card.Body className="text-center">
                <i className={`bi bi-${role.icon} text-${role.color}`} style={{ fontSize: "2.5rem" }}></i>
                <h6 className="mt-2 mb-1 small">{role.label}</h6>
                <h4 className="fw-bold mb-0 text-{role.color}">{stats.byRole[role.value] || 0}</h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search and Filter Section */}
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
                  placeholder="Shakisha amazina, telefoni, cyangwa umudugudu..."
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
            <Col xs={6} md={3}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-briefcase me-2"></i>
                    {filterRole === "all" ? "Inshingano Zose" : getRoleConfig(filterRole).label}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterRole("all")}>
                  <i className="bi bi-list-ul me-2"></i>Inshingano Zose
                </Dropdown.Item>
                <Dropdown.Divider />
                {roles.map((role) => (
                  <Dropdown.Item key={role.value} onClick={() => setFilterRole(role.value)}>
                    <i className={`bi bi-${role.icon} me-2 text-${role.color}`}></i>
                    {role.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col xs={6} md={3}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-funnel me-2"></i>
                    {filterStatus === "all" && "Byose"}
                    {filterStatus === "active" && "Baracyakora"}
                    {filterStatus === "completed" && "Barangije"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterStatus("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterStatus("active")}>
                  <i className="bi bi-person-check me-2 text-success"></i>Baracyakora
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("completed")}>
                  <i className="bi bi-person-x me-2 text-secondary"></i>Barangije
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm || filterRole !== "all" || filterStatus !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu bayobozi <strong>{abayobozi.length}</strong>
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
            <i className="bi bi-people-slash" style={{ fontSize: "4rem", color: "#dee2e6" }}></i>
            <h5 className="mt-3 text-muted">Nta bayobozi bahari</h5>
            <p className="text-muted">
              {searchTerm || filterRole !== "all" || filterStatus !== "all"
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Andika Umuyobozi' kugira ngo wongere amakuru"}
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
                      <th className="py-3">Telefone</th>
                      <th className="py-3">Inshingano</th>
                      <th className="py-3">Umudugudu</th>
                      <th className="py-3 text-center">Igihe</th>
                      <th className="py-3 text-center">Imimerere</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((leader, index) => {
                      const roleConfig = getRoleConfig(leader.inshingano);
                      const isActive = !leader.itariki_yarangije;
                      return (
                        <tr key={leader.umuyobozi_id} className="border-bottom">
                          <td className="text-center px-3 text-muted">{indexOfFirstItem + index + 1}</td>
                          <td className="fw-semibold">
                            <i className="bi bi-person-fill text-primary me-2"></i>
                            {leader.amazina_yose}
                          </td>
                          <td>
                            {leader.telefone ? (
                              <span>
                                <i className="bi bi-telephone text-success me-2"></i>
                                {leader.telefone}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            <Badge bg={roleConfig.color} className="px-3">
                              <i className={`bi bi-${roleConfig.icon} me-1`}></i>
                              {roleConfig.label}
                            </Badge>
                          </td>
                          <td>
                            {leader.umudugudu ? (
                              <span>
                                <i className="bi bi-geo-alt text-warning me-2"></i>
                                {leader.umudugudu}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            <small className="text-muted">
                              {calculateTenure(leader.itariki_yatangiye, leader.itariki_yarangije)}
                            </small>
                          </td>
                          <td className="text-center">
                            {isActive ? (
                              <Badge bg="success" className="px-3">
                                <i className="bi bi-check-circle me-1"></i>Aracyakora
                              </Badge>
                            ) : (
                              <Badge bg="secondary" className="px-3">
                                <i className="bi bi-x-circle me-1"></i>Yarangije
                              </Badge>
                            )}
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-1 justify-content-center">
                              <OverlayTrigger placement="top" overlay={renderTooltip("Reba amakuru")}>
                                <Button
                                  size="sm"
                                  variant="outline-info"
                                  onClick={() => handleViewDetails(leader)}
                                >
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleEdit(leader)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(leader.umuyobozi_id)}
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
                  <i className="bi bi-pencil-square me-2"></i>Hindura Amakuru y'Umuyobozi
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2"></i>Andika Umuyobozi Mushya
                </>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-4">
            <Row className="g-3">
              <Col md={12}>
                <h6 className="text-muted mb-3">
                  <i className="bi bi-person-vcard me-2"></i>Amakuru Banze
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Amazina Yose <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="amazina_yose"
                      value={form.amazina_yose}
                      onChange={handleChange}
                      placeholder="Andika amazina yombi..."
                      isInvalid={!!formErrors.amazina_yose}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.amazina_yose}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Telefone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-telephone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="telefone"
                      value={form.telefone}
                      onChange={handleChange}
                      placeholder="0781234567"
                      maxLength={10}
                      isInvalid={!!formErrors.telefone}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.telefone}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Urugero: 078XXXXXXX
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-briefcase me-2"></i>Inshingano n'Aho Akorera
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Inshingano <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-award"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="inshingano"
                      value={form.inshingano}
                      onChange={handleChange}
                      isInvalid={!!formErrors.inshingano}
                    >
                      <option value="">Hitamo inshingano...</option>
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formErrors.inshingano}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Umudugudu</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-geo-alt"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="umudugudu"
                      value={form.umudugudu}
                      onChange={handleChange}
                      placeholder="Shyiramo umudugudu..."
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-calendar-event me-2"></i>Igihe cy'Ubuyobozi
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Itariki Yatangiye <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-calendar-check"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      name="itariki_yatangiye"
                      value={form.itariki_yatangiye}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      isInvalid={!!formErrors.itariki_yatangiye}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.itariki_yatangiye}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Itariki Yarangije</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-calendar-x"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      name="itariki_yarangije"
                      value={form.itariki_yarangije}
                      onChange={handleChange}
                      isInvalid={!!formErrors.itariki_yarangije}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.itariki_yarangije}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Siga ubusa niba aracyakora
                  </Form.Text>
                </Form.Group>
              </Col>

              {form.itariki_yatangiye && (
                <Col md={12}>
                  <Alert variant="info" className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Igihe: <strong>{calculateTenure(form.itariki_yatangiye, form.itariki_yarangije)}</strong>
                  </Alert>
                </Col>
              )}
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShow(false)}>
              <i className="bi bi-x-circle me-1"></i>Funga
            </Button>
            <Button type="submit" variant={editingId ? "warning" : "primary"}>
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
            <i className="bi bi-eye me-2"></i>Amakuru Arambuye y'Umuyobozi
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedLeader && (
            <div>
              <Row className="g-4">
                <Col md={12}>
                  <Card className="border-primary border-2">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="mb-1 fw-bold text-primary">
                            <i className="bi bi-person-fill me-2"></i>
                            {selectedLeader.amazina_yose}
                          </h4>
                          <Badge bg={getRoleConfig(selectedLeader.inshingano).color} className="px-3 py-2">
                            <i className={`bi bi-${getRoleConfig(selectedLeader.inshingano).icon} me-2`}></i>
                            {getRoleConfig(selectedLeader.inshingano).label}
                          </Badge>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <i className="bi bi-person-badge text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Telefone</small>
                    <h5 className="mb-0">
                      {selectedLeader.telefone ? (
                        <>
                          <i className="bi bi-telephone text-success me-2"></i>
                          {selectedLeader.telefone}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Umudugudu</small>
                    <h5 className="mb-0">
                      {selectedLeader.umudugudu ? (
                        <>
                          <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                          {selectedLeader.umudugudu}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-calendar-event me-2"></i>Igihe cy'Ubuyobozi
                  </h6>
                </Col>

                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <small className="text-muted d-block">Itariki Yatangiye</small>
                      <h5 className="mb-0 text-primary">
                        <i className="bi bi-calendar-check me-2"></i>
                        {new Date(selectedLeader.itariki_yatangiye).toLocaleDateString("rw-RW")}
                      </h5>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <small className="text-muted d-block">Itariki Yarangije</small>
                      <h5 className="mb-0 text-secondary">
                        {selectedLeader.itariki_yarangije ? (
                          <>
                            <i className="bi bi-calendar-x me-2"></i>
                            {new Date(selectedLeader.itariki_yarangije).toLocaleDateString("rw-RW")}
                          </>
                        ) : (
                          <>
                            <i className="bi bi-infinity me-2"></i>
                            <span className="text-success">Aracyakora</span>
                          </>
                        )}
                      </h5>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <Card className={`border-2 ${!selectedLeader.itariki_yarangije ? 'border-success' : 'border-secondary'}`}>
                    <Card.Body className="text-center">
                      <i className={`bi bi-clock-history ${!selectedLeader.itariki_yarangije ? 'text-success' : 'text-secondary'}`} style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-1">Igihe cy'Ubuyobozi</h6>
                      <h4 className="fw-bold mb-0">
                        {calculateTenure(selectedLeader.itariki_yatangiye, selectedLeader.itariki_yarangije)}
                      </h4>
                      <Badge bg={!selectedLeader.itariki_yarangije ? "success" : "secondary"} className="mt-2">
                        {!selectedLeader.itariki_yarangije ? "Aracyakora" : "Yarangije"}
                      </Badge>
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
                      <i className="bi bi-hash me-2"></i>
                      ID: <strong>{selectedLeader.umuyobozi_id}</strong>
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
              handleEdit(selectedLeader);
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

export default Abayobozi;