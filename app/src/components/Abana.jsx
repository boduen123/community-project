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

const API_URL = "http://localhost:5000/abana";

const Abana = () => {
  // State Management
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [editId, setEditId] = useState(null);

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterSchool, setFilterSchool] = useState("all");
  const [filterAge, setFilterAge] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    inSchool: 0,
    notInSchool: 0,
    avgAge: 0,
    under5: 0,
    age5to12: 0,
    age13to18: 0,
  });

  // Form State
  const [form, setForm] = useState({
    amazina: "",
    imyaka: "",
    igitsina: "Gabo",
    umubyeyi_wa_mwana: "",
    aderesi: "",
    aiga: "Yego",
  });

  const [formErrors, setFormErrors] = useState({});

  // Calculate statistics
  const calculateStats = (dataArray) => {
    if (dataArray.length === 0) {
      setStats({
        total: 0,
        male: 0,
        female: 0,
        inSchool: 0,
        notInSchool: 0,
        avgAge: 0,
        under5: 0,
        age5to12: 0,
        age13to18: 0,
      });
      return;
    }

    const totalAge = dataArray.reduce((sum, item) => sum + parseInt(item.imyaka || 0), 0);
    const avgAge = (totalAge / dataArray.length).toFixed(1);

    setStats({
      total: dataArray.length,
      male: dataArray.filter((item) => item.igitsina === "Gabo").length,
      female: dataArray.filter((item) => item.igitsina === "Gore").length,
      inSchool: dataArray.filter((item) => item.aiga === "Yego").length,
      notInSchool: dataArray.filter((item) => item.aiga === "Oya").length,
      avgAge,
      under5: dataArray.filter((item) => parseInt(item.imyaka) < 5).length,
      age5to12: dataArray.filter((item) => {
        const age = parseInt(item.imyaka);
        return age >= 5 && age <= 12;
      }).length,
      age13to18: dataArray.filter((item) => {
        const age = parseInt(item.imyaka);
        return age >= 13 && age <= 18;
      }).length,
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
          item.umubyeyi_wa_mwana?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.aderesi?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply gender filter
    if (filterGender !== "all") {
      result = result.filter((item) => item.igitsina === filterGender);
    }

    // Apply school filter
    if (filterSchool !== "all") {
      result = result.filter((item) => item.aiga === filterSchool);
    }

    // Apply age filter
    if (filterAge !== "all") {
      result = result.filter((item) => {
        const age = parseInt(item.imyaka);
        switch (filterAge) {
          case "under5":
            return age < 5;
          case "5-12":
            return age >= 5 && age <= 12;
          case "13-18":
            return age >= 13 && age <= 18;
          default:
            return true;
        }
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterSchool, filterAge, data]);

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

    if (!form.imyaka || parseInt(form.imyaka) < 0 || parseInt(form.imyaka) > 18) {
      errors.imyaka = "Imyaka igomba kuba hagati ya 0 na 18";
    }

    if (!form.umubyeyi_wa_mwana?.trim()) {
      errors.umubyeyi_wa_mwana = "Amazina y'umubyeyi ni ngombwa";
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
      umubyeyi_wa_mwana: "",
      aderesi: "",
      aiga: "Yego",
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
        showAlertMessage("Umwana yashyizwemo neza!", "success");
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
    setSelectedChild(item);
    setShowDetails(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba uyu mwana?")) {
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
    const headers = ["Amazina", "Imyaka", "Igitsina", "Umubyeyi", "Aderesi", "Aiga"];

    const csvData = filteredData.map((item) => [
      item.amazina,
      item.imyaka,
      item.igitsina,
      item.umubyeyi_wa_mwana,
      item.aderesi || "-",
      item.aiga,
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `abana_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlertMessage("Dosiye yakoboye neza!", "success");
  };

  // Get age category badge color
  const getAgeCategoryColor = (age) => {
    const ageNum = parseInt(age);
    if (ageNum < 5) return "info";
    if (ageNum <= 12) return "primary";
    return "warning";
  };

  // Render tooltip
  const renderTooltip = (text) => <Tooltip>{text}</Tooltip>;

  return (
    <Container fluid className="py-4 px-md-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold text-primary mb-1 d-flex align-items-center gap-2">
            <i className="bi bi-person-hearts" style={{ fontSize: "2rem" }}></i>
            Abana
            <Badge bg="primary" pill className="fs-6">
              {stats.total}
            </Badge>
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Gucunga amakuru y'abana bo mu mudugudu
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo umwana")}>
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
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Abana Bose</p>
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
                  <i className="bi bi-person-hearts text-primary" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #198754" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Baiga</p>
                  <h3 className="fw-bold mb-0 text-success">{stats.inSchool}</h3>
                  <ProgressBar
                    now={(stats.inSchool / stats.total) * 100}
                    variant="success"
                    className="mt-2"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted">
                    {stats.total > 0 ? ((stats.inSchool / stats.total) * 100).toFixed(1) : 0}%
                  </small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-book-fill text-success" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #dc3545" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Batige</p>
                  <h3 className="fw-bold mb-0 text-danger">{stats.notInSchool}</h3>
                  <ProgressBar
                    now={(stats.notInSchool / stats.total) * 100}
                    variant="danger"
                    className="mt-2"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted">
                    {stats.total > 0 ? ((stats.notInSchool / stats.total) * 100).toFixed(1) : 0}%
                  </small>
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-person-x-fill text-danger" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ikigereranyo cy'Imyaka</p>
                  <h3 className="fw-bold mb-0 text-info">{stats.avgAge}</h3>
                  <small className="text-muted">imyaka</small>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-calendar-heart text-info" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Age Distribution Cards */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Munsi ya 5</p>
                  <h4 className="fw-bold mb-0 text-info">{stats.under5}</h4>
                </div>
                <i className="bi bi-emoji-smile-fill text-info" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">5-12 imyaka</p>
                  <h4 className="fw-bold mb-0 text-primary">{stats.age5to12}</h4>
                </div>
                <i className="bi bi-backpack-fill text-primary" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #ffc107" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">13-18 imyaka</p>
                  <h4 className="fw-bold mb-0 text-warning">{stats.age13to18}</h4>
                </div>
                <i className="bi bi-mortarboard-fill text-warning" style={{ fontSize: "2rem" }}></i>
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
                  placeholder="Shakisha amazina y'umwana, umubyeyi, cyangwa aderesi..."
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
                    <i className="bi bi-book me-2"></i>
                    {filterSchool === "all"
                      ? "Ishuri"
                      : filterSchool === "Yego"
                      ? "Baiga"
                      : "Batige"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterSchool("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterSchool("Yego")}>
                  <i className="bi bi-check-circle me-2 text-success"></i>Baiga
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterSchool("Oya")}>
                  <i className="bi bi-x-circle me-2 text-danger"></i>Batige
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
                <Dropdown.Item onClick={() => setFilterAge("under5")}>
                  <i className="bi bi-emoji-smile me-2"></i>Munsi ya 5
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterAge("5-12")}>
                  <i className="bi bi-backpack me-2"></i>5-12 imyaka
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterAge("13-18")}>
                  <i className="bi bi-mortarboard me-2"></i>13-18 imyaka
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm || filterGender !== "all" || filterSchool !== "all" || filterAge !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu bana <strong>{data.length}</strong>
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
            <h5 className="mt-3 text-muted">Nta bana bahari</h5>
            <p className="text-muted">
              {searchTerm || filterGender !== "all" || filterSchool !== "all" || filterAge !== "all"
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
                      <th className="py-3">Umubyeyi</th>
                      <th className="py-3">Aderesi</th>
                      <th className="py-3 text-center">Aiga</th>
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
                          <Badge bg={getAgeCategoryColor(item.imyaka)} className="px-3">
                            {item.imyaka} imyaka
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg={item.igitsina === "Gabo" ? "primary" : "danger"} className="px-3">
                            {item.igitsina}
                          </Badge>
                        </td>
                        <td>
                          <i className="bi bi-person-fill text-secondary me-2"></i>
                          {item.umubyeyi_wa_mwana}
                        </td>
                        <td>
                          {item.aderesi ? (
                            <span>
                              <i className="bi bi-geo-alt text-info me-2"></i>
                              {item.aderesi}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          {item.aiga === "Yego" ? (
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
                          <div className="d-flex gap-1 justify-content-center">
                            <OverlayTrigger placement="top" overlay={renderTooltip("Reba amakuru")}>
                              <Button size="sm" variant="outline-info" onClick={() => handleViewDetails(item)}>
                                <i className="bi bi-eye"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                              <Button size="sm" variant="outline-primary" onClick={() => handleEdit(item)}>
                                <i className="bi bi-pencil-square"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                              <Button size="sm" variant="outline-danger" onClick={() => handleDelete(item.id)}>
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
                  <i className="bi bi-pencil-square me-2"></i>Hindura Amakuru y'Umwana
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill me-2"></i>Ongeraho Umwana
                </>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-4">
            <Row className="g-3">
              <Col md={12}>
                <h6 className="text-muted mb-3">
                  <i className="bi bi-person-vcard me-2"></i>Amakuru y'Umwana
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
                      placeholder="Amazina y'umwana..."
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
                      min="0"
                      max="18"
                      placeholder="0"
                      isInvalid={!!formErrors.imyaka}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.imyaka}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    0-18 imyaka
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
                  <i className="bi bi-people me-2"></i>Amakuru y'Umubyeyi
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Umubyeyi wa Mwana <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person-fill"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="umubyeyi_wa_mwana"
                      value={form.umubyeyi_wa_mwana}
                      onChange={handleChange}
                      placeholder="Amazina y'umubyeyi..."
                      isInvalid={!!formErrors.umubyeyi_wa_mwana}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formErrors.umubyeyi_wa_mwana}
                    </Form.Control.Feedback>
                  </InputGroup>
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
                      placeholder="Aho batuye..."
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-book me-2"></i>Amakuru y'Ishuri
                </h6>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Aiga</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-book"></i>
                    </InputGroup.Text>
                    <Form.Select name="aiga" value={form.aiga} onChange={handleChange}>
                      <option value="Yego">Yego - Aiga</option>
                      <option value="Oya">Oya - Ntago aiga</option>
                    </Form.Select>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Hitamo niba umwana aiga ishuri cyangwa ataiga
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
            <i className="bi bi-eye me-2"></i>Amakuru Arambuye y'Umwana
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedChild && (
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
                                selectedChild.igitsina === "Gabo" ? "male" : "female"
                              } me-2`}
                            ></i>
                            {selectedChild.amazina}
                          </h4>
                          <div className="d-flex gap-2 mt-2">
                            <Badge bg={selectedChild.igitsina === "Gabo" ? "primary" : "danger"} className="px-3">
                              {selectedChild.igitsina}
                            </Badge>
                            <Badge bg={getAgeCategoryColor(selectedChild.imyaka)} className="px-3">
                              {selectedChild.imyaka} imyaka
                            </Badge>
                          </div>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <i className="bi bi-person-hearts text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Umubyeyi</small>
                    <h5 className="mb-0">
                      <i className="bi bi-person-fill text-success me-2"></i>
                      {selectedChild.umubyeyi_wa_mwana}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-info ps-3">
                    <small className="text-muted">Aderesi</small>
                    <h5 className="mb-0">
                      {selectedChild.aderesi ? (
                        <>
                          <i className="bi bi-geo-alt text-info me-2"></i>
                          {selectedChild.aderesi}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={12}>
                  <Card
                    className={`border-2 ${
                      selectedChild.aiga === "Yego" ? "border-success" : "border-danger"
                    }`}
                  >
                    <Card.Body className="text-center">
                      <i
                        className={`bi bi-${
                          selectedChild.aiga === "Yego" ? "book-fill" : "book"
                        } ${selectedChild.aiga === "Yego" ? "text-success" : "text-danger"}`}
                        style={{ fontSize: "3rem" }}
                      ></i>
                      <h6 className="mt-2 mb-1">Ishuri</h6>
                      <Badge
                        bg={selectedChild.aiga === "Yego" ? "success" : "danger"}
                        className="px-4 py-2 fs-6"
                      >
                        <i
                          className={`bi bi-${selectedChild.aiga === "Yego" ? "check-circle" : "x-circle"} me-2`}
                        ></i>
                        {selectedChild.aiga === "Yego" ? "Aiga" : "Ntago aiga"}
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
                      ID: <strong>{selectedChild.id}</strong>
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
              handleEdit(selectedChild);
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

export default Abana;