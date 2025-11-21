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

const API_URL = "http://localhost:5000/ingo";

const Ingo = () => {
  // State Management
  const [ingoList, setIngoList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedHousehold, setSelectedHousehold] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUbudehe, setFilterUbudehe] = useState("all");
  const [filterWater, setFilterWater] = useState("all");
  const [filterElectricity, setFilterElectricity] = useState("all");
  const [filterHomeType, setFilterHomeType] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    totalMembers: 0,
    avgMembersPerHouse: 0,
    withWater: 0,
    withElectricity: 0,
    ownedHouses: 0,
    rentedHouses: 0,
    ubudeheA: 0,
    ubudeheB: 0,
    ubudeheC: 0,
  });

  // Form State
  const [form, setForm] = useState({
    umukuru_w_urugo: "",
    umubare_w_abagize: "",
    aho_batuye: "",
    ubwoko_bw_inzu: "",
    bafite_amazi: "",
    bafite_umuyoboro_wamashanyarazi: "",
    icyiciro_cy_ubudehe: "",
    umudugudu: "",
    akagari: "",
    umurenge: "",
    akarere: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // Configuration
  const ubudeheCategories = [
    { value: "A", label: "Icyiciro cya 1 (A)", color: "danger", icon: "exclamation-triangle" },
    { value: "B", label: "Icyiciro cya 2 (B)", color: "warning", icon: "dash-circle" },
    { value: "C", label: "Icyiciro cya 3 (C)", color: "info", icon: "circle" },
    { value: "D", label: "Icyiciro cya 4 (D)", color: "primary", icon: "check-circle" },
    { value: "E", label: "Icyiciro cya 5 (E)", color: "success", icon: "star" },
  ];

  // Calculate statistics
  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        total: 0,
        totalMembers: 0,
        avgMembersPerHouse: 0,
        withWater: 0,
        withElectricity: 0,
        ownedHouses: 0,
        rentedHouses: 0,
        ubudeheA: 0,
        ubudeheB: 0,
        ubudeheC: 0,
      });
      return;
    }

    const totalMembers = data.reduce((sum, h) => sum + parseInt(h.umubare_w_abagize || 0), 0);
    const avgMembers = (totalMembers / data.length).toFixed(1);

    setStats({
      total: data.length,
      totalMembers,
      avgMembersPerHouse: avgMembers,
      withWater: data.filter((h) => h.bafite_amazi === "yego").length,
      withElectricity: data.filter((h) => h.bafite_umuyoboro_wamashanyarazi === "yego").length,
      ownedHouses: data.filter((h) => h.ubwoko_bw_inzu === "Iyabo").length,
      rentedHouses: data.filter((h) => h.ubwoko_bw_inzu === "Ikodeshejwe").length,
      ubudeheA: data.filter((h) => h.icyiciro_cy_ubudehe === "A").length,
      ubudeheB: data.filter((h) => h.icyiciro_cy_ubudehe === "B").length,
      ubudeheC: data.filter((h) => ["C", "D", "E"].includes(h.icyiciro_cy_ubudehe)).length,
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
      setIngoList(res.data);
      setFilteredData(res.data);
      calculateStats(res.data);
      showAlertMessage("Amakuru yagaruwe neza!", "info");
    } catch (err) {
      console.error("Error fetching households:", err);
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
    let result = [...ingoList];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (house) =>
          house.umukuru_w_urugo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.aho_batuye?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.umudugudu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          house.akagari?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filterUbudehe !== "all") {
      result = result.filter((house) => house.icyiciro_cy_ubudehe === filterUbudehe);
    }

    if (filterWater !== "all") {
      result = result.filter((house) => house.bafite_amazi === filterWater);
    }

    if (filterElectricity !== "all") {
      result = result.filter((house) => house.bafite_umuyoboro_wamashanyarazi === filterElectricity);
    }

    if (filterHomeType !== "all") {
      result = result.filter((house) => house.ubwoko_bw_inzu === filterHomeType);
    }

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchTerm, filterUbudehe, filterWater, filterElectricity, filterHomeType, ingoList]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!form.umukuru_w_urugo?.trim()) {
      errors.umukuru_w_urugo = "Izina ry'umukuru ni ngombwa";
    }

    if (!form.umubare_w_abagize || parseInt(form.umubare_w_abagize) < 1) {
      errors.umubare_w_abagize = "Shyiramo umubare w'abagize";
    }

    if (!form.umudugudu?.trim()) {
      errors.umudugudu = "Umudugudu ni ngombwa";
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
      umukuru_w_urugo: "",
      umubare_w_abagize: "",
      aho_batuye: "",
      ubwoko_bw_inzu: "",
      bafite_amazi: "",
      bafite_umuyoboro_wamashanyarazi: "",
      icyiciro_cy_ubudehe: "",
      umudugudu: "",
      akagari: "",
      umurenge: "",
      akarere: "",
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
        showAlertMessage("Urugo ruvuguruwe neza!", "success");
      } else {
        await axios.post(API_URL, form);
        showAlertMessage("Urugo rushyizwemo neza!", "success");
      }
      fetchData();
      setShow(false);
      resetForm();
    } catch (err) {
      console.error("Error saving household:", err);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Handle edit
  const handleEdit = (item) => {
    setEditingId(item.urugo_id);
    setForm(item);
    setFormErrors({});
    setShow(true);
  };

  // Handle view details
  const handleViewDetails = (item) => {
    setSelectedHousehold(item);
    setShowDetails(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm("Uremeza ko ushaka gusiba uru rugo?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        showAlertMessage("Urugo rusibwe neza!", "success");
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
      "Umukuru w'Urugo",
      "Abagize",
      "Aho Bature",
      "Ubwoko bw'Inzu",
      "Amazi",
      "Amashanyarazi",
      "Ubudehe",
      "Umudugudu",
      "Akagari",
      "Umurenge",
      "Akarere",
    ];

    const csvData = filteredData.map((house) => [
      house.umukuru_w_urugo,
      house.umubare_w_abagize,
      house.aho_batuye || "-",
      house.ubwoko_bw_inzu || "-",
      house.bafite_amazi === "yego" ? "Yego" : "Oya",
      house.bafite_umuyoboro_wamashanyarazi === "yego" ? "Yego" : "Oya",
      house.icyiciro_cy_ubudehe || "-",
      house.umudugudu,
      house.akagari || "-",
      house.umurenge || "-",
      house.akarere || "-",
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ingo_${new Date().toISOString().split("T")[0]}.csv`);
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
            <i className="bi bi-house-door-fill" style={{ fontSize: "2rem" }}></i>
            Urutonde rw'Ingo
            <Badge bg="success" pill className="fs-6">
              {stats.total}
            </Badge>
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Kwandika, kureba, no gucunga amakuru y'ingo n'imiryango
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Andika urugo rushya")}>
            <Button
              variant="success"
              onClick={() => {
                resetForm();
                setShow(true);
              }}
              className="shadow-sm"
            >
              <i className="bi bi-house-add me-2"></i>Andika Urugo
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
        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0d6efd" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ingo Zose</p>
                  <h3 className="fw-bold mb-0 text-primary">{stats.total}</h3>
                  <small className="text-muted">
                    {stats.totalMembers} abaturage
                  </small>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-houses-fill text-primary" style={{ fontSize: "2rem" }}></i>
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
                  <p className="text-muted mb-1 small">Amazi</p>
                  <h3 className="fw-bold mb-0 text-info">{stats.withWater}</h3>
                  <ProgressBar
                    now={(stats.withWater / stats.total) * 100}
                    variant="info"
                    className="mt-2"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted">
                    {((stats.withWater / stats.total) * 100).toFixed(1)}%
                  </small>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-droplet-fill text-info" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={3}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #ffc107" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Amashanyarazi</p>
                  <h3 className="fw-bold mb-0 text-warning">{stats.withElectricity}</h3>
                  <ProgressBar
                    now={(stats.withElectricity / stats.total) * 100}
                    variant="warning"
                    className="mt-2"
                    style={{ height: "6px" }}
                  />
                  <small className="text-muted">
                    {((stats.withElectricity / stats.total) * 100).toFixed(1)}%
                  </small>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-lightning-charge-fill text-warning" style={{ fontSize: "2rem" }}></i>
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
                  <p className="text-muted mb-1 small">Ikigereranyo</p>
                  <h3 className="fw-bold mb-0 text-success">{stats.avgMembersPerHouse}</h3>
                  <small className="text-muted">abaturage/urugo</small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-people-fill text-success" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
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
                  placeholder="Shakisha umukuru w'urugo, umudugudu, cyangwa akagari..."
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
            <Col xs={6} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-droplet me-2"></i>
                    {filterWater === "all" ? "Amazi" : filterWater === "yego" ? "Yego" : "Oya"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterWater("all")}>Byose</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterWater("yego")}>
                  <i className="bi bi-check-circle me-2 text-success"></i>Bafite
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterWater("oya")}>
                  <i className="bi bi-x-circle me-2 text-danger"></i>Ntibafite
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col xs={12} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-lightning me-2"></i>
                    {filterElectricity === "all"
                      ? "Amashanyarazi"
                      : filterElectricity === "yego"
                      ? "Yego"
                      : "Oya"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterElectricity("all")}>Byose</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => setFilterElectricity("yego")}>
                  <i className="bi bi-check-circle me-2 text-success"></i>Bafite
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setFilterElectricity("oya")}>
                  <i className="bi bi-x-circle me-2 text-danger"></i>Ntibafite
                </Dropdown.Item>
              </DropdownButton>
            </Col>
          </Row>
          {(searchTerm ||
            filterUbudehe !== "all" ||
            filterWater !== "all" ||
            filterElectricity !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu ngo <strong>{ingoList.length}</strong>
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
            <i className="bi bi-house-slash" style={{ fontSize: "4rem", color: "#dee2e6" }}></i>
            <h5 className="mt-3 text-muted">Nta ngo zihari</h5>
            <p className="text-muted">
              {searchTerm ||
              filterUbudehe !== "all" ||
              filterWater !== "all" ||
              filterElectricity !== "all"
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Andika Urugo' kugira ngo wongere amakuru"}
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
                      <th className="py-3">Umukuru w'Urugo</th>
                      <th className="py-3 text-center">Abagize</th>
                      <th className="py-3">Umudugudu</th>
                      <th className="py-3">Ubwoko bw'Inzu</th>
                      <th className="py-3 text-center">Amazi</th>
                      <th className="py-3 text-center">Amashanyarazi</th>
                      <th className="py-3 text-center">Ubudehe</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((house, index) => {
                      const ubudeheConfig = getUbudeheConfig(house.icyiciro_cy_ubudehe);
                      return (
                        <tr key={house.urugo_id} className="border-bottom">
                          <td className="text-center px-3 text-muted">{indexOfFirstItem + index + 1}</td>
                          <td className="fw-semibold">
                            <i className="bi bi-house-door text-primary me-2"></i>
                            {house.umukuru_w_urugo}
                          </td>
                          <td className="text-center">
                            <Badge bg="primary" className="px-3">
                              <i className="bi bi-people-fill me-1"></i>
                              {house.umubare_w_abagize}
                            </Badge>
                          </td>
                          <td>
                            <i className="bi bi-geo-alt text-warning me-2"></i>
                            {house.umudugudu}
                          </td>
                          <td>
                            {house.ubwoko_bw_inzu ? (
                              <Badge bg={house.ubwoko_bw_inzu === "Iyabo" ? "success" : "info"}>
                                <i
                                  className={`bi bi-${
                                    house.ubwoko_bw_inzu === "Iyabo" ? "house-check" : "house"
                                  } me-1`}
                                ></i>
                                {house.ubwoko_bw_inzu}
                              </Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td className="text-center">
                            {house.bafite_amazi === "yego" ? (
                              <i
                                className="bi bi-check-circle-fill text-success"
                                style={{ fontSize: "1.2rem" }}
                                title="Yego"
                              ></i>
                            ) : (
                              <i
                                className="bi bi-x-circle-fill text-danger"
                                style={{ fontSize: "1.2rem" }}
                                title="Oya"
                              ></i>
                            )}
                          </td>
                          <td className="text-center">
                            {house.bafite_umuyoboro_wamashanyarazi === "yego" ? (
                              <i
                                className="bi bi-lightning-charge-fill text-warning"
                                style={{ fontSize: "1.2rem" }}
                                title="Yego"
                              ></i>
                            ) : (
                              <i
                                className="bi bi-lightning text-secondary"
                                style={{ fontSize: "1.2rem" }}
                                title="Oya"
                              ></i>
                            )}
                          </td>
                          <td className="text-center">
                            {house.icyiciro_cy_ubudehe ? (
                              <Badge bg={ubudeheConfig.color} className="px-3">
                                <i className={`bi bi-${ubudeheConfig.icon} me-1`}></i>
                                {house.icyiciro_cy_ubudehe}
                              </Badge>
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
                                  onClick={() => handleViewDetails(house)}
                                >
                                  <i className="bi bi-eye"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                                <Button size="sm" variant="outline-primary" onClick={() => handleEdit(house)}>
                                  <i className="bi bi-pencil"></i>
                                </Button>
                              </OverlayTrigger>
                              <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleDelete(house.urugo_id)}
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
                  <i className="bi bi-pencil-square me-2"></i>Hindura Amakuru y'Urugo
                </>
              ) : (
                <>
                  <i className="bi bi-house-add me-2"></i>Andika Urugo Rushya
                </>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-4">
            <Row className="g-3">
              <Col md={12}>
                <h6 className="text-muted mb-3">
                  <i className="bi bi-person-badge me-2"></i>Amakuru y'Umukuru w'Urugo
                </h6>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Umukuru w'Urugo <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-person"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="umukuru_w_urugo"
                      value={form.umukuru_w_urugo}
                      onChange={handleChange}
                      placeholder="Izina ry'umukuru..."
                      isInvalid={!!formErrors.umukuru_w_urugo}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.umukuru_w_urugo}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Abagize <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-people"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="umubare_w_abagize"
                      value={form.umubare_w_abagize}
                      onChange={handleChange}
                      type="number"
                      min="1"
                      placeholder="0"
                      isInvalid={!!formErrors.umubare_w_abagize}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.umubare_w_abagize}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Ubwoko bw'Inzu</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-house-door"></i>
                    </InputGroup.Text>
                    <Form.Select name="ubwoko_bw_inzu" value={form.ubwoko_bw_inzu} onChange={handleChange}>
                      <option value="">Hitamo</option>
                      <option value="Iyabo">Iyabo</option>
                      <option value="Ikodeshejwe">Ikodeshejwe</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Aho Bature</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-geo-alt"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="aho_batuye"
                      value={form.aho_batuye}
                      onChange={handleChange}
                      placeholder="Aho batuye..."
                    />
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-lightning-charge me-2"></i>Ibyegeranye n'Ibikorwa Remezo
                </h6>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Bafite Amazi</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-droplet"></i>
                    </InputGroup.Text>
                    <Form.Select name="bafite_amazi" value={form.bafite_amazi} onChange={handleChange}>
                      <option value="">Hitamo</option>
                      <option value="yego">Yego</option>
                      <option value="oya">Oya</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Amashanyarazi</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-lightning-charge"></i>
                    </InputGroup.Text>
                    <Form.Select
                      name="bafite_umuyoboro_wamashanyarazi"
                      value={form.bafite_umuyoboro_wamashanyarazi}
                      onChange={handleChange}
                    >
                      <option value="">Hitamo</option>
                      <option value="yego">Yego</option>
                      <option value="oya">Oya</option>
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={4}>
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
                      <option value="">Hitamo</option>
                      {ubudeheCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </Form.Select>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={12}>
                <hr />
                <h6 className="text-muted mb-3">
                  <i className="bi bi-map me-2"></i>Aho Urugo Ruherereye
                </h6>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">
                    Umudugudu <span className="text-danger">*</span>
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-geo"></i>
                    </InputGroup.Text>
                    <Form.Control
                      name="umudugudu"
                      value={form.umudugudu}
                      onChange={handleChange}
                      placeholder="Umudugudu..."
                      isInvalid={!!formErrors.umudugudu}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.umudugudu}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Akagari</Form.Label>
                  <Form.Control name="akagari" value={form.akagari} onChange={handleChange} placeholder="Akagari..." />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Umurenge</Form.Label>
                  <Form.Control
                    name="umurenge"
                    value={form.umurenge}
                    onChange={handleChange}
                    placeholder="Umurenge..."
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Akarere</Form.Label>
                  <Form.Control name="akarere" value={form.akarere} onChange={handleChange} placeholder="Akarere..." />
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
            <i className="bi bi-eye me-2"></i>Amakuru Arambuye y'Urugo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedHousehold && (
            <div>
              <Row className="g-4">
                <Col md={12}>
                  <Card className="border-primary border-2">
                    <Card.Body>
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h4 className="mb-1 fw-bold text-primary">
                            <i className="bi bi-house-door-fill me-2"></i>
                            {selectedHousehold.umukuru_w_urugo}
                          </h4>
                          <Badge bg="primary" className="px-3">
                            <i className="bi bi-people-fill me-1"></i>
                            {selectedHousehold.umubare_w_abagize} abagize
                          </Badge>
                        </div>
                        <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                          <i className="bi bi-house-fill text-primary" style={{ fontSize: "3rem" }}></i>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-warning ps-3">
                    <small className="text-muted">Aho Bature</small>
                    <h5 className="mb-0">
                      {selectedHousehold.aho_batuye ? (
                        <>
                          <i className="bi bi-geo-alt-fill text-warning me-2"></i>
                          {selectedHousehold.aho_batuye}
                        </>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Ubwoko bw'Inzu</small>
                    <h5 className="mb-0">
                      {selectedHousehold.ubwoko_bw_inzu ? (
                        <Badge
                          bg={selectedHousehold.ubwoko_bw_inzu === "Iyabo" ? "success" : "info"}
                          className="px-3 py-2"
                        >
                          <i
                            className={`bi bi-${
                              selectedHousehold.ubwoko_bw_inzu === "Iyabo" ? "house-check" : "house"
                            } me-2`}
                          ></i>
                          {selectedHousehold.ubwoko_bw_inzu}
                        </Badge>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-lightning-charge me-2"></i>Ibikorwa Remezo
                  </h6>
                </Col>

                <Col md={6}>
                  <Card
                    className={`border-2 ${
                      selectedHousehold.bafite_amazi === "yego" ? "border-info" : "border-danger"
                    }`}
                  >
                    <Card.Body className="text-center">
                      <i
                        className={`bi bi-droplet-fill ${
                          selectedHousehold.bafite_amazi === "yego" ? "text-info" : "text-danger"
                        }`}
                        style={{ fontSize: "2rem" }}
                      ></i>
                      <h6 className="mt-2 mb-0">Amazi</h6>
                      <Badge
                        bg={selectedHousehold.bafite_amazi === "yego" ? "info" : "danger"}
                        className="mt-2"
                      >
                        {selectedHousehold.bafite_amazi === "yego" ? "Bafite" : "Ntibafite"}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card
                    className={`border-2 ${
                      selectedHousehold.bafite_umuyoboro_wamashanyarazi === "yego"
                        ? "border-warning"
                        : "border-secondary"
                    }`}
                  >
                    <Card.Body className="text-center">
                      <i
                        className={`bi bi-lightning-charge-fill ${
                          selectedHousehold.bafite_umuyoboro_wamashanyarazi === "yego"
                            ? "text-warning"
                            : "text-secondary"
                        }`}
                        style={{ fontSize: "2rem" }}
                      ></i>
                      <h6 className="mt-2 mb-0">Amashanyarazi</h6>
                      <Badge
                        bg={
                          selectedHousehold.bafite_umuyoboro_wamashanyarazi === "yego"
                            ? "warning"
                            : "secondary"
                        }
                        text={
                          selectedHousehold.bafite_umuyoboro_wamashanyarazi === "yego" ? "dark" : "white"
                        }
                        className="mt-2"
                      >
                        {selectedHousehold.bafite_umuyoboro_wamashanyarazi === "yego"
                          ? "Bafite"
                          : "Ntibafite"}
                      </Badge>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-bar-chart-steps me-2"></i>Icyiciro cy'Ubudehe
                  </h6>
                </Col>

                <Col md={12}>
                  <Card className="border-0 bg-light">
                    <Card.Body className="text-center">
                      {selectedHousehold.icyiciro_cy_ubudehe ? (
                        <Badge
                          bg={getUbudeheConfig(selectedHousehold.icyiciro_cy_ubudehe).color}
                          className="px-4 py-2 fs-5"
                        >
                          <i
                            className={`bi bi-${
                              getUbudeheConfig(selectedHousehold.icyiciro_cy_ubudehe).icon
                            } me-2`}
                          ></i>
                          {getUbudeheConfig(selectedHousehold.icyiciro_cy_ubudehe).label}
                        </Badge>
                      ) : (
                        <span className="text-muted">Ntaho bivuye</span>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-map me-2"></i>Aho Urugo Ruherereye
                  </h6>
                </Col>

                <Col md={12}>
                  <Card className="border-0 bg-light">
                    <Card.Body>
                      <Row className="g-3">
                        <Col md={3}>
                          <small className="text-muted d-block">Umudugudu</small>
                          <strong>{selectedHousehold.umudugudu || "-"}</strong>
                        </Col>
                        <Col md={3}>
                          <small className="text-muted d-block">Akagari</small>
                          <strong>{selectedHousehold.akagari || "-"}</strong>
                        </Col>
                        <Col md={3}>
                          <small className="text-muted d-block">Umurenge</small>
                          <strong>{selectedHousehold.umurenge || "-"}</strong>
                        </Col>
                        <Col md={3}>
                          <small className="text-muted d-block">Akarere</small>
                          <strong>{selectedHousehold.akarere || "-"}</strong>
                        </Col>
                      </Row>
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
                      ID: <strong>{selectedHousehold.urugo_id}</strong>
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
              handleEdit(selectedHousehold);
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

export default Ingo;