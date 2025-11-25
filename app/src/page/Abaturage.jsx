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
  Badge,
  Card,
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

// Create axios instance that always sends JWT if it exists
const api = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token saved at login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Use relative endpoint (baseURL is set above)
const API_URL = "/abaturage";

const Abaturage = () => {
  // State Management
  const [abaturage, setAbaturage] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("all");
  const [filterUbudehe, setFilterUbudehe] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    present: 0,
    moved: 0,
    deceased: 0,
    ubudeheA: 0,
    ubudeheB: 0,
    ubudeheC: 0,
  });

  // Form State
  const [form, setForm] = useState({
    izina_ribanza: "",
    izina_risoza: "",
    igitsina: "",
    itariki_y_amavuko: "",
    indangamuntu: "",
    telefone: "",
    isibo_id: "",
    urugo_id: "",
    icyiciro_cy_ubudehe: "",
    aho_ari: "Abarimo",
  });

  const [formErrors, setFormErrors] = useState({});

  // Ubudehe categories configuration
  const ubudeheCategories = [
    { value: "A", label: "Icyiciro cya 1 (A)", color: "danger", icon: "exclamation-triangle" },
    { value: "B", label: "Icyiciro cya 2 (B)", color: "warning", icon: "dash-circle" },
    { value: "C", label: "Icyiciro cya 3 (C)", color: "info", icon: "circle" },
    { value: "D", label: "Icyiciro cya 4 (D)", color: "primary", icon: "check-circle" },
    { value: "E", label: "Icyiciro cya 5 (E)", color: "success", icon: "star" },
  ];

  // Status configuration
  const statusConfig = {
    Abarimo: { label: "Ariho", color: "success", icon: "house-check" },
    Yimukiye_Ahandi: { label: "Yimukiye Ahandi", color: "warning", icon: "box-arrow-right" },
    Yitabye_Imana: { label: "Yitabye Imana", color: "secondary", icon: "heart" },
  };

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate statistics
  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        total: 0,
        male: 0,
        female: 0,
        present: 0,
        moved: 0,
        deceased: 0,
        ubudeheA: 0,
        ubudeheB: 0,
        ubudeheC: 0,
      });
      return;
    }

    setStats({
      total: data.length,
      male: data.filter((a) => a.igitsina === "Gabo").length,
      female: data.filter((a) => a.igitsina === "Gore").length,
      present: data.filter((a) => a.aho_ari === "Abarimo").length,
      moved: data.filter((a) => a.aho_ari === "Yimukiye_Ahandi").length,
      deceased: data.filter((a) => a.aho_ari === "Yitabye_Imana").length,
      ubudeheA: data.filter((a) => a.icyiciro_cy_ubudehe === "A").length,
      ubudeheB: data.filter((a) => a.icyiciro_cy_ubudehe === "B").length,
      ubudeheC: data.filter((a) => ["C", "D", "E"].includes(a.icyiciro_cy_ubudehe)).length,
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
      const res = await api.get(API_URL);
      setAbaturage(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlertMessage("Amakuru yagaruwe neza!", "info");
    } catch (err) {
      console.error("Error fetching residents:", err);
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        showAlertMessage("Nta burenganzira: banza winjire (Login).", "danger");
      } else {
        showAlertMessage("Habaye ikosa mu gusoma amakuru!", "danger");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search and Filter Effect
  useEffect(() => {
    let result = [...abaturage];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (person) =>
          person.izina_ribanza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.izina_risoza?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.indangamuntu?.includes(searchTerm) ||
          person.telefone?.includes(searchTerm)
      );
    }

    // Apply gender filter
    if (filterGender !== "all") {
      result = result.filter((person) => person.igitsina === filterGender);
    }

    // Apply Ubudehe filter
    if (filterUbudehe !== "all") {
      result = result.filter((person) => person.icyiciro_cy_ubudehe === filterUbudehe);
    }

    // Apply status filter
    if (filterStatus !== "all") {
      result = result.filter((person) => person.aho_ari === filterStatus);
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterGender, filterUbudehe, filterStatus, abaturage]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.izina_ribanza?.trim()) {
      errors.izina_ribanza = "Izina ribanza ni ngombwa";
    }

    if (!form.izina_risoza?.trim()) {
      errors.izina_risoza = "Izina risoza ni ngombwa";
    }

    if (!form.igitsina) {
      errors.igitsina = "Hitamo igitsina";
    }

    if (form.indangamuntu && form.indangamuntu.length !== 16) {
      errors.indangamuntu = "Indangamuntu igomba kuba ifite imibare 16";
    }

    if (form.telefone && !/^07[2389]\d{7}$/.test(form.telefone)) {
      errors.telefone = "Numero ya telefoni ntago iri neza (Urugero: 0781234567)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Handle form submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showAlertMessage("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (editingId) {
        await api.put(`${API_URL}/${editingId}`, form);
        showAlertMessage("Umuturage yavuguruwe neza!", "success");
      } else {
        await api.post(API_URL, form);
        showAlertMessage("Umuturage yashyizwemo neza!", "success");
      }
      setShow(false);
      resetForm();
      fetchData();
    } catch (err) {
      console.error("Error saving resident:", err);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setForm({
      izina_ribanza: "",
      izina_risoza: "",
      igitsina: "",
      itariki_y_amavuko: "",
      indangamuntu: "",
      telefone: "",
      isibo_id: "",
      urugo_id: "",
      icyiciro_cy_ubudehe: "",
      aho_ari: "Abarimo",
    });
    setFormErrors({});
  };

  // Delete resident
  const handleDelete = async (id) => {
    const person = abaturage.find((a) => a.umuturage_id === id);
    if (window.confirm(`Uremeza ko ushaka gusiba ${person?.izina_ribanza} ${person?.izina_risoza}?`)) {
      try {
        await api.delete(`${API_URL}/${id}`);
        showAlertMessage("Umuturage yasibwe neza!", "success");
        fetchData();
      } catch (err) {
        console.error("Error deleting resident:", err);
        showAlertMessage("Ntibikunze gusiba!", "danger");
      }
    }
  };

  // Edit resident
  const handleEdit = (person) => {
    setEditingId(person.umuturage_id);
    setForm(person);
    setFormErrors({});
    setShow(true);
  };

  // View Details
  const handleViewDetails = (person) => {
    setSelectedPerson(person);
    setShowDetails(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Izina Ribanza",
      "Izina Risoza",
      "Igitsina",
      "Itariki y'Amavuko",
      "Imyaka",
      "Indangamuntu",
      "Telefoni",
      "Ubudehe",
      "Aho Ari",
    ];

    const csvData = filteredData.map((person) => [
      person.izina_ribanza,
      person.izina_risoza,
      person.igitsina,
      person.itariki_y_amavuko || "-",
      calculateAge(person.itariki_y_amavuko) || "-",
      person.indangamuntu || "-",
      person.telefone || "-",
      person.icyiciro_cy_ubudehe || "-",
      statusConfig[person.aho_ari]?.label || person.aho_ari,
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `abaturage_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showAlertMessage("Dosiye yakoboye neza!", "success");
  };

  // Get Ubudehe config
  const getUbudeheConfig = (category) => {
    return ubudeheCategories.find((c) => c.value === category) || ubudeheCategories[0];
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
            Urutonde rw'Abaturage
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Kwandika no gukurikirana abaturage bose
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Andika umuturage mushya")}>
            <Button
              variant="success"
              onClick={() => {
                resetForm();
                setShow(true);
              }}
              className="shadow-sm"
            >
              <i className="bi bi-person-plus-fill me-2"></i>Andika Umuturage
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
                <div className="mt-2">
                  <small className="text-muted">
                    <i className="bi bi-gender-male text-primary me-1"></i>
                    {stats.male} Abagabo
                  </small>
                  <br />
                  <small className="text-muted">
                    <i className="bi bi-gender-female text-danger me-1"></i>
                    {stats.female} Abagore
                  </small>
                </div>
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
                <p className="text-muted mb-1 small">Bariho</p>
                <h3 className="fw-bold mb-0 text-success">{stats.present}</h3>
                <ProgressBar
                  now={stats.total ? (stats.present / stats.total) * 100 : 0}
                  variant="success"
                  className="mt-2"
                  style={{ height: "6px" }}
                />
                <small className="text-muted">
                  {stats.total ? ((stats.present / stats.total) * 100).toFixed(1) : 0}%
                </small>
              </div>
              <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-house-check-fill text-success" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #ffc107" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Bimukiye</p>
                <h3 className="fw-bold mb-0 text-warning">{stats.moved}</h3>
              </div>
              <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-box-arrow-right text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #6c757d" }}>
            <Card.Body className="d-flex align-items-center">
              <div className="flex-grow-1">
                <p className="text-muted mb-1 small">Batavye Imana</p>
                <h3 className="fw-bold mb-0 text-secondary">{stats.deceased}</h3>
              </div>
              <div className="bg-secondary bg-opacity-10 p-3 rounded-circle">
                <i className="bi bi-heart text-secondary" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ubudehe Statistics */}
      <Row className="mb-4 g-3">
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #dc3545" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ubudehe A</p>
                  <h4 className="fw-bold mb-0 text-danger">{stats.ubudeheA}</h4>
                </div>
                <i className="bi bi-exclamation-triangle-fill text-danger" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #ffc107" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ubudehe B</p>
                  <h4 className="fw-bold mb-0 text-warning">{stats.ubudeheB}</h4>
                </div>
                <i className="bi bi-dash-circle-fill text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ubudehe C/D/E</p>
                  <h4 className="fw-bold mb-0 text-info">{stats.ubudeheC}</h4>
                </div>
                <i className="bi bi-star-fill text-info" style={{ fontSize: "2rem" }}></i>
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
                  placeholder="Shakisha amazina, indangamuntu, cyangwa telefoni..."
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
                    {filterGender === "all" && "Igitsina"}
                    {filterGender === "Gabo" && "Gabo"}
                    {filterGender === "Gore" && "Gore"}
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
                    <i className="bi bi-funnel me-2"></i>
                    {filterUbudehe === "all" ? "Ubudehe" : filterUbudehe}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterUbudehe("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                {ubudeheCategories.map((cat) => (
                  <Dropdown.Item key={cat.value} onClick={() => setFilterUbudehe(cat.value)}>
                    <i className={`bi bi-${cat.icon} me-2 text-${cat.color}`}></i>
                    {cat.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col xs={12} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-geo-alt me-2"></i>
                    {filterStatus === "all" ? "Aho Ari" : statusConfig[filterStatus]?.label}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterStatus("all")}>
                  <i className="bi bi-list-ul me-2"></i>Byose
                </Dropdown.Item>
                <Dropdown.Divider />
                {Object.entries(statusConfig).map(([key, config]) => (
                  <Dropdown.Item key={key} onClick={() => setFilterStatus(key)}>
                    <i className={`bi bi-${config.icon} me-2 text-${config.color}`}></i>
                    {config.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm || filterGender !== "all" || filterUbudehe !== "all" || filterStatus !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu baturage <strong>{abaturage.length}</strong>
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
            <h5 className="mt-3 text-muted">Nta baturage bahari</h5>
            <p className="text-muted">
              {searchTerm || filterGender !== "all" || filterUbudehe !== "all" || filterStatus !== "all"
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Andika Umuturage' kugira ngo wongere amakuru"}
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
                      <th className="py-3 text-center">Igitsina</th>
                      <th className="py-3 text-center">Imyaka</th>
                      <th className="py-3">Indangamuntu</th>
                      <th className="py-3">Telefoni</th>
                      <th className="py-3 text-center">Ubudehe</th>
                      <th className="py-3 text-center">Aho Ari</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((a, i) => {
                      const age = calculateAge(a.itariki_y_amavuko);
                      const ubudeheConfig = getUbudeheConfig(a.icyiciro_cy_ubudehe);
                      const status = statusConfig[a.aho_ari] || statusConfig.Abarimo;

                      return (
                        <tr key={a.umuturage_id} className="border-bottom">
                          <td className="text-center px-3 text-muted">{indexOfFirstItem + i + 1}</td>
                          <td className="fw-semibold">
                            <i
                              className={`bi bi-gender-${
                                a.igitsina === "Gabo" ? "male text-primary" : "female text-danger"
                              } me-2`}
                            ></i>
                            {a.izina_ribanza} {a.izina_risoza}
                          </td>
                          <td className="text-center">
                            <Badge bg={a.igitsina === "Gabo" ? "primary" : "danger"} className="px-3">
                              {a.igitsina}
                            </Badge>
                          </td>
                          <td className="text-center">
                            {age !== null ? (
                              <span className="badge bg-info">{age} imyaka</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {a.indangamuntu ? (
                              <span className="font-monospace small">{a.indangamuntu}</span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>
                            {a.telefone ? (
                              <span>
                                <i className="bi bi-telephone text-success me-1"></i>
                                {a.telefone}
                              </span>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {a.icyiciro_cy_ubudehe ? (
                              <Badge bg={ubudeheConfig.color} className="px-3">
                                <i className={`bi bi-${ubudeheConfig.icon} me-1`}></i>
                                {a.icyiciro_cy_ubudehe}
                              </Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            <Badge bg={status.color} className="px-2">
                              <i className={`bi bi-${status.icon} me-1`}></i>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="text-center">
                            <div className="d-flex gap-1 justify-content-center">
                              <OverlayTrigger placement="top" overlay={renderTooltip("Reba amakuru")}>
                                <Button size="sm" variant="outline-info" onClick={() => handleViewDetails(a)}>
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                                <Button size="sm" variant="outline-primary" onClick={() => handleEdit(a)}>
                                  <i className="bi bi-pencil-square"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(a.umuturage_id)}
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
          <Modal.Header closeButton className="bg-success text-white">
            <Modal.Title>
              {editingId ? (
                <>
                  <i className="bi bi-pencil-square me-2"></i>Hindura Amakuru y'Umuturage
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>Andika Umuturage Mushya
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
                    Izina Ribanza <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="izina_ribanza"
                      value={form.izina_ribanza}
                      onChange={handleChange}
                      placeholder="Izina ribanza..."
                      isInvalid={!!formErrors.izina_ribanza}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.izina_ribanza}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Izina Risoza <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="izina_risoza"
                      value={form.izina_risoza}
                      onChange={handleChange}
                      placeholder="Izina risoza..."
                      isInvalid={!!formErrors.izina_risoza}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.izina_risoza}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Igitsina <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-gender-ambiguous"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="igitsina"
                      value={form.igitsina}
                      onChange={handleChange}
                      isInvalid={!!formErrors.igitsina}
                    >
                      <option value="">Hitamo igitsina</option>
                      <option value="Gabo">Gabo</option>
                      <option value="Gore">Gore</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{formErrors.igitsina}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Itariki y'Amavuko</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-calendar-event"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="date"
                      name="itariki_y_amavuko"
                      value={form.itariki_y_amavuko}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </InputGroup>
                  {form.itariki_y_amavuko && (
                    <Form.Text className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Imyaka: {calculateAge(form.itariki_y_amavuko)}
                    </Form.Text>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-card-text me-2"></i>Irangamuntu n'Itumanaho
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Indangamuntu</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-credit-card"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="indangamuntu"
                      value={form.indangamuntu}
                      onChange={handleChange}
                      placeholder="1199912345678912"
                      maxLength={16}
                      isInvalid={!!formErrors.indangamuntu}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.indangamuntu}</Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Imibare 16
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Telefoni</Form.Label>
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
                  <i className="bi bi-house me-2"></i>Amakuru y'Ubudehe n'Aho Ari
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Icyiciro cy'Ubudehe</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-bar-chart-steps"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="icyiciro_cy_ubudehe"
                      value={form.icyiciro_cy_ubudehe}
                      onChange={handleChange}
                    >
                      <option value="">Hitamo icyiciro</option>
                      {ubudeheCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Aho Ari</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-geo-alt"></i>
                    </InputGroup.Text>
                    <Form.Select name="aho_ari" value={form.aho_ari} onChange={handleChange}>
                      {Object.entries(statusConfig).map(([key, config]) => (
                        <option key={key} value={key}>
                          {config.label}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
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
          {selectedPerson && (
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
                                selectedPerson.igitsina === "Gabo" ? "male" : "female"
                              } me-2`}
                            ></i>
                            {selectedPerson.izina_ribanza} {selectedPerson.izina_risoza}
                          </h4>
                          <Badge bg={selectedPerson.igitsina === "Gabo" ? "primary" : "danger"} className="px-3">
                            {selectedPerson.igitsina}
                          </Badge>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <i className="bi bi-person-fill text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-info ps-3">
                    <small className="text-muted">Itariki y'Amavuko</small>
                    <h5 className="mb-0">
                      {selectedPerson.itariki_y_amavuko ? (
                        <>
                          <i className="bi bi-calendar-event text-info me-2"></i>
                          {new Date(selectedPerson.itariki_y_amavuko).toLocaleDateString("rw-RW")}
                          <Badge bg="info" className="ms-2">
                            {calculateAge(selectedPerson.itariki_y_amavuko)} imyaka
                          </Badge>
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Aho Ari</small>
                    <h5 className="mb-0">
                      <Badge bg={statusConfig[selectedPerson.aho_ari]?.color || "secondary"} className="px-3 py-2">
                        <i className={`bi bi-${statusConfig[selectedPerson.aho_ari]?.icon || "geo-alt"} me-2`}></i>
                        {statusConfig[selectedPerson.aho_ari]?.label || selectedPerson.aho_ari}
                      </Badge>
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-secondary ps-3">
                    <small className="text-muted">Indangamuntu</small>
                    <h5 className="mb-0 font-monospace">
                      {selectedPerson.indangamuntu ? (
                        <>
                          <i className="bi bi-credit-card text-secondary me-2"></i>
                          {selectedPerson.indangamuntu}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Telefoni</small>
                    <h5 className="mb-0">
                      {selectedPerson.telefone ? (
                        <>
                          <i className="bi bi-telephone text-warning me-2"></i>
                          {selectedPerson.telefone}
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
                      <h6 className="text-muted mb-3">
                        <i className="bi bi-bar-chart-steps me-2"></i>Icyiciro cy'Ubudehe
                      </h6>
                      {selectedPerson.icyiciro_cy_ubudehe ? (
                        <Badge
                          bg={getUbudeheConfig(selectedPerson.icyiciro_cy_ubudehe).color}
                          className="px-4 py-2 fs-5"
                        >
                          <i
                            className={`bi bi-${getUbudeheConfig(selectedPerson.icyiciro_cy_ubudehe).icon} me-2`}
                          ></i>
                          {getUbudeheConfig(selectedPerson.icyiciro_cy_ubudehe).label}
                        </Badge>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
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
                      ID: <strong>{selectedPerson.umuturage_id}</strong>
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
              handleEdit(selectedPerson);
            }}
          >
            <i className="bi bi-pencil-square me-1"></i>Hindura
          </Button>
          <Button variant="secondary" onClick={() => setShowDetails(false)}>
            <i className="bi bi-x-circle me-1"></i>Funga
          </Button>
        </Modal.Footer>
      </Modal>

      {/* FIXED STYLE: no jsx attribute */}
      <style>{`
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

export default Abaturage;