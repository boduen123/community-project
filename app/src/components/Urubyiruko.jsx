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

const API_URL = "http://localhost:5000/urubyiruko";

const Urubyiruko = () => {
  // State Management
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedYouth, setSelectedYouth] = useState(null);
  const [editId, setEditId] = useState(null);

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    employed: 0,
    unemployed: 0,
    avgAge: 0,
  });

  // Form State
  const [form, setForm] = useState({
    amazina: "",
    imyaka: "",
    igitsina: "Gabo",
    umurimo: "",
    nimero_ya_telephone: "",
    aderesi: "",
    id_number: "",
    status: "Rudafite akazi",
  });

  const [formErrors, setFormErrors] = useState({});

  // Calculate statistics
  const calculateStats = (dataArray) => {
    if (dataArray.length === 0) {
      setStats({
        total: 0,
        male: 0,
        female: 0,
        employed: 0,
        unemployed: 0,
        avgAge: 0,
      });
      return;
    }

    const totalAge = dataArray.reduce((sum, item) => sum + parseInt(item.imyaka || 0), 0);
    const avgAge = (totalAge / dataArray.length).toFixed(1);

    setStats({
      total: dataArray.length,
      male: dataArray.filter((item) => item.igitsina === "Gabo").length,
      female: dataArray.filter((item) => item.igitsina === "Gore").length,
      employed: dataArray.filter((item) => item.status === "Rufite akazi").length,
      unemployed: dataArray.filter((item) => item.status === "Rudafite akazi").length,
      avgAge,
    });
  };

  // Show alert function
  const showAlertMessage = (message, variant = "success") => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: "", variant: "" }), 4000);
  };

  // Load data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setData(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlertMessage("Amakuru yagaruwe neza!", "info");
    } catch (err) {
      console.error(err);
      showAlertMessage("Habaye ikosa mu gusoma amakuru!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Search and Filter Effect
  useEffect(() => {
    let result = [...data];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.amazina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.umurimo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.nimero_ya_telephone?.includes(searchTerm) ||
          item.id_number?.includes(searchTerm)
      );
    }

    // Apply gender filter
    if (filterGender !== "all") {
      result = result.filter((item) => item.igitsina === filterGender);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((item) => item.status === filterStatus);
    }

    // Apply age filter
    if (filterAge !== "all") {
      result = result.filter((item) => {
        const age = parseInt(item.imyaka);
        switch (filterAge) {
          case "15-20":
            return age >= 15 && age <= 20;
          case "21-25":
            return age >= 21 && age <= 25;
          case "26-30":
            return age >= 26 && age <= 30;
          case "31+":
            return age >= 31;
          default:
            return true;
        }
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterStatus, filterAge, data]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.amazina?.trim()) {
      errors.amazina = "Amazina ni ngombwa";
    }

    if (!form.imyaka || parseInt(form.imyaka) < 15 || parseInt(form.imyaka) > 35) {
      errors.imyaka = "Imyaka igomba kuba hagati ya 15 na 35";
    }

    if (form.nimero_ya_telephone && !/^07[2389]\d{7}$/.test(form.nimero_ya_telephone)) {
      errors.nimero_ya_telephone = "Numero ya telefoni ntago iri neza (Urugero: 0781234567)";
    }

    if (form.id_number && form.id_number.length !== 16) {
      errors.id_number = "Indangamuntu igomba kuba ifite imibare 16";
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
    setForm({
      amazina: "",
      imyaka: "",
      igitsina: "Gabo",
      umurimo: "",
      nimero_ya_telephone: "",
      aderesi: "",
      id_number: "",
      status: "Rudafite akazi",
    });
    setFormErrors({});
    setEditId(null);
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      showAlertMessage("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        showAlertMessage("Amakuru yahinduwe neza!", "success");
      } else {
        await axios.post(API_URL, form);
        showAlertMessage("Umusore/Umukobwa yashyizwemo neza!", "success");
      }
      setShow(false);
      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setForm(item);
    setEditId(item.id);
    setFormErrors({});
    setShow(true);
  };

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedYouth(item);
    setShowDetails(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba uyu musore/umukobwa?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlertMessage("Amakuru yasibwe neza!", "success");
        loadData();
      } catch (err) {
        console.error(err);
        showAlertMessage("Ntibikunze gusiba!", "danger");
      }
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Amazina",
      "Imyaka",
      "Igitsina",
      "Umurimo",
      "Telefoni",
      "Aderesi",
      "ID Number",
      "Status",
    ];

    const csvData = filteredData.map((item) => [
      item.amazina,
      item.imyaka,
      item.igitsina,
      item.umurimo || "-",
      item.nimero_ya_telephone || "-",
      item.aderesi || "-",
      item.id_number || "-",
      item.status,
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `urubyiruko_${new Date().toISOString().split("T")[0]}.csv`);
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
            Urubyiruko
            <Badge bg="primary" pill className="fs-6">
              {stats.total}
            </Badge>
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Gucunga amakuru y'urubyiruko rwo mu mudugudu
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo umusore/umukobwa")}>
            <Button
              variant="success"
              onClick={() => {
                resetForm();
                setShow(true);
              }}
              className="shadow-sm"
            >
              <i className="bi bi-person-plus-fill me-2"></i>Ongeraho
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Garura amakuru")}>
            <Button variant="outline-primary" onClick={loadData} className="shadow-sm">
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
                  <p className="text-muted mb-1 small">Urubyiruko Rwose</p>
                  <h3 className="fw-bold mb-0 text-primary">{stats.total}</h3>
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="bi bi-gender-male text-primary me-1"></i>
                      {stats.male} Abahungu
                    </small>
                    <br />
                    <small className="text-muted">
                      <i className="bi bi-gender-female text-danger me-1"></i>
                      {stats.female} Abakobwa
                    </small>
                  </div>
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
                  <p className="text-muted mb-1 small">Bafite Akazi</p>
                  <h3 className="fw-bold mb-0 text-success">{stats.employed}</h3>
                  <ProgressBar
                    now={(stats.employed / stats.total) * 100}
                    variant="success"
                    className="mt-2"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted">
                    {stats.total > 0 ? ((stats.employed / stats.total) * 100).toFixed(1) : 0}%
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-briefcase-fill text-success" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #dc3545" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Badafite Akazi</p>
                  <h3 className="fw-bold mb-0 text-danger">{stats.unemployed}</h3>
                  <ProgressBar
                    now={(stats.unemployed / stats.total) * 100}
                    variant="danger"
                    className="mt-2"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted">
                    {stats.total > 0 ? ((stats.unemployed / stats.total) * 100).toFixed(1) : 0}%
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-person-x-fill text-danger" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
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
                  placeholder="Shakisha amazina, umurimo, telefoni, cyangwa ID..."
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
            <Col xs={6} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-gender-ambiguous me-2"></i>
                    {filterGender === "all" ? "Igitsina" : filterGender}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterGender("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterGender("Gabo")}>
                  <i className="bi bi-gender-male me-2 text-primary"></i>Gabo
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterGender("Gore")}>
                  <i className="bi bi-gender-female me-2 text-danger"></i>Gore
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col xs={6} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-briefcase me-2"></i>
                    {filterStatus === "all"
                      ? "Status"
                      : filterStatus === "Rufite akazi"
                      ? "Bafite akazi"
                      : "Badafite akazi"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterStatus("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterStatus("Rufite akazi")}>
                  <i className="bi bi-check-circle me-2 text-success"></i>Bafite akazi
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterStatus("Rudafite akazi")}>
                  <i className="bi bi-x-circle me-2 text-danger"></i>Badafite akazi
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col xs={12} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-calendar-range me-2"></i>
                    {filterAge === "all" ? "Imyaka" : filterAge}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterAge("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterAge("15-20")}>15-20 imyaka</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterAge("21-25")}>21-25 imyaka</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterAge("26-30")}>26-30 imyaka</Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterAge("31+")}>31+ imyaka</Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm ||
            filterGender !== "all" ||
            filterStatus !== "all" ||
            filterAge !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu rubyiruko <strong>{data.length}</strong>
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
            <h5 className="mt-3 text-muted">Nta rubyiruko ruhari</h5>
            <p className="text-muted">
              {searchTerm ||
              filterGender !== "all" ||
              filterStatus !== "all" ||
              filterAge !== "all"
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
                      <th className="py-3 text-center">Imyaka</th>
                      <th className="py-3 text-center">Igitsina</th>
                      <th className="py-3">Umurimo</th>
                      <th className="py-3">Telefoni</th>
                      <th className="py-3 text-center">Status</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item, index) => (
                      <tr key={item.id} className="border-bottom">
                        <td className="text-center px-3 text-muted">{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">
                          <i
                            className={`bi bi-gender-${
                              item.igitsina === "Gabo" ? "male text-primary" : "female text-danger"
                            } me-2`}
                          ></i>
                          {item.amazina}
                        </td>
                        <td className="text-center">
                          <Badge bg="info" className="px-3">
                            {item.imyaka} imyaka
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg={item.igitsina === "Gabo" ? "primary" : "danger"} className="px-3">
                            {item.igitsina}
                          </Badge>
                        </td>
                        <td>
                          {item.umurimo ? (
                            <span>
                              <i className="bi bi-briefcase text-secondary me-2"></i>
                              {item.umurimo}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {item.nimero_ya_telephone ? (
                            <span>
                              <i className="bi bi-telephone text-success me-2"></i>
                              {item.nimero_ya_telephone}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {item.status === "Rufite akazi" ? (
                            <Badge bg="success" className="px-3">
                              <i className="bi bi-check-circle me-1"></i>Rufite akazi
                            </Badge>
                          ) : (
                            <Badge bg="danger" className="px-3">
                              <i className="bi bi-x-circle me-1"></i>Rudafite akazi
                            </Badge>
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
                                onClick={() => handleDelete(item.id)}
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
      <Modal show={show} onHide={() => setShow(false)} size="lg" centered backdrop="static">
        <Form>
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>
              {editId ? (
                <>
                  <i className="bi bi-pencil-square me-2"></i>Hindura Amakuru
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2"></i>Ongeraho Umusore/Umukobwa
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
                    Amazina <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="amazina"
                      value={form.amazina}
                      onChange={handleChange}
                      placeholder="Amazina yombi..."
                      isInvalid={!!formErrors.amazina}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.amazina}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Imyaka <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-calendar-range"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="imyaka"
                      value={form.imyaka}
                      onChange={handleChange}
                      min="15"
                      max="35"
                      placeholder="0"
                      isInvalid={!!formErrors.imyaka}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.imyaka}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    15-35 imyaka
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Igitsina <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-gender-ambiguous"></i>
                    </InputGroup.Text>
                    <Form.Select name="igitsina" value={form.igitsina} onChange={handleChange}>
                      <option value="Gabo">Gabo</option>
                      <option value="Gore">Gore</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-briefcase me-2"></i>Amakuru y'Akazi
                </h6>
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
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-check-circle"></i>
                    </InputGroup.Text>
                    <Form.Select name="status" value={form.status} onChange={handleChange}>
                      <option value="Rufite akazi">Rufite akazi</option>
                      <option value="Rudafite akazi">Rudafite akazi</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-geo-alt me-2"></i>Itumanaho n'Aho Atuye
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Nimero ya Telephone</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-telephone"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="nimero_ya_telephone"
                      value={form.nimero_ya_telephone}
                      onChange={handleChange}
                      placeholder="078XXXXXXX"
                      maxLength={10}
                      isInvalid={!!formErrors.nimero_ya_telephone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.nimero_ya_telephone}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Urugero: 078XXXXXXX
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Aderesi</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-geo-alt"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="aderesi"
                      value={form.aderesi}
                      onChange={handleChange}
                      placeholder="Aho atuye..."
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Indangamuntu (ID Number)</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-credit-card"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="id_number"
                      value={form.id_number}
                      onChange={handleChange}
                      placeholder="1199912345678912"
                      maxLength={16}
                      isInvalid={!!formErrors.id_number}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.id_number}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Imibare 16
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShow(false)}>
              <i className="bi bi-x-circle me-1"></i>Funga
            </Button>
            <Button variant="success" onClick={handleSave}>
              <i className={`bi me-1 ${editId ? "bi-save" : "bi-check-circle"}`}></i>
              {editId ? "Hindura" : "Bika Amakuru"}
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
          {selectedYouth && (
            <div>
              <Row className="g-4">
                <Col md={12}>
                  <Card className="border-primary border-2">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="mb-1 fw-bold text-primary">
                            <i
                              className={`bi bi-gender-${
                                selectedYouth.igitsina === "Gabo" ? "male" : "female"
                              } me-2`}
                            ></i>
                            {selectedYouth.amazina}
                          </h4>
                          <div className="d-flex gap-2 mt-2">
                            <Badge
                              bg={selectedYouth.igitsina === "Gabo" ? "primary" : "danger"}
                              className="px-3"
                            >
                              {selectedYouth.igitsina}
                            </Badge>
                            <Badge bg="info" className="px-3">
                              {selectedYouth.imyaka} imyaka
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <i className="bi bi-person-fill text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Umurimo</small>
                    <h5 className="mb-0">
                      {selectedYouth.umurimo ? (
                        <>
                          <i className="bi bi-briefcase text-success me-2"></i>
                          {selectedYouth.umurimo}
                        </>
                      ) : (
                        <span className="text-muted">Ntawufite</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Status</small>
                    <h5 className="mb-0">
                      <Badge
                        bg={selectedYouth.status === "Rufite akazi" ? "success" : "danger"}
                        className="px-3 py-2"
                      >
                        <i
                          className={`bi bi-${
                            selectedYouth.status === "Rufite akazi" ? "check-circle" : "x-circle"
                          } me-2`}
                        ></i>
                        {selectedYouth.status}
                      </Badge>
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-info ps-3">
                    <small className="text-muted">Telefoni</small>
                    <h5 className="mb-0">
                      {selectedYouth.nimero_ya_telephone ? (
                        <>
                          <i className="bi bi-telephone text-info me-2"></i>
                          {selectedYouth.nimero_ya_telephone}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-secondary ps-3">
                    <small className="text-muted">Aderesi</small>
                    <h5 className="mb-0">
                      {selectedYouth.aderesi ? (
                        <>
                          <i className="bi bi-geo-alt text-secondary me-2"></i>
                          {selectedYouth.aderesi}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={12}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <small className="text-muted d-block">Indangamuntu (ID Number)</small>
                      <h5 className="mb-0 font-monospace">
                        {selectedYouth.id_number ? (
                          <>
                            <i className="bi bi-credit-card text-primary me-2"></i>
                            {selectedYouth.id_number}
                          </>
                        ) : (
                          <span className="text-muted">Ntaho bivuye</span>
                        )}
                      </h5>
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
                      ID: <strong>{selectedYouth.id}</strong>
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
              handleEdit(selectedYouth);
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

export default Urubyiruko;