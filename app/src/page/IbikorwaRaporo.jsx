import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Modal,
  Button,
  Form,
  Table,
  Spinner,
  Alert,
  Badge,
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Dropdown,
  DropdownButton,
  Pagination,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/raporo";

const Raporo = () => {
  // State Management
  const [raporoList, setRaporoList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentRaporo, setCurrentRaporo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  // Search and Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterVillage, setFilterVillage] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    totalResidents: 0,
    totalHouses: 0,
    totalVulnerable: 0,
    avgResidentsPerReport: 0,
    uniqueVillages: 0,
  });

  // Form State
  const initialForm = {
    umutwe_wa_raporo: "",
    ibisobanuro: "",
    itariki_ya_raporo: "",
    umubare_w_abaturage: "",
    umubare_w_ingo: "",
    abanyantege_nke: "",
    yakozwe_na: "",
    umudugudu: "",
  };

  const [formErrors, setFormErrors] = useState({});

  // Calculate statistics
  const calculateStats = (data) => {
    if (data.length === 0) {
      setStats({
        total: 0,
        totalResidents: 0,
        totalHouses: 0,
        totalVulnerable: 0,
        avgResidentsPerReport: 0,
        uniqueVillages: 0,
      });
      return;
    }

    const totalResidents = data.reduce((sum, r) => sum + parseInt(r.umubare_w_abaturage || 0), 0);
    const totalHouses = data.reduce((sum, r) => sum + parseInt(r.umubare_w_ingo || 0), 0);
    const totalVulnerable = data.reduce((sum, r) => sum + parseInt(r.abanyantege_nke || 0), 0);
    const avgResidents = (totalResidents / data.length).toFixed(1);
    const uniqueVillages = [...new Set(data.map((r) => r.umudugudu).filter(Boolean))].length;

    setStats({
      total: data.length,
      totalResidents,
      totalHouses,
      totalVulnerable,
      avgResidentsPerReport: avgResidents,
      uniqueVillages,
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
      setRaporoList(res.data);
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
    fetchData();
  }, []);

  // Search, Filter, and Sort Effect
  useEffect(() => {
    let result = [...raporoList];

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (report) =>
          report.umutwe_wa_raporo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.ibisobanuro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.yakozwe_na?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.umudugudu?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply village filter
    if (filterVillage !== "all") {
      result = result.filter((report) => report.umudugudu === filterVillage);
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA, compareB;

      switch (sortBy) {
        case "date":
          compareA = new Date(a.itariki_ya_raporo || 0);
          compareB = new Date(b.itariki_ya_raporo || 0);
          break;
        case "title":
          compareA = a.umutwe_wa_raporo?.toLowerCase() || "";
          compareB = b.umutwe_wa_raporo?.toLowerCase() || "";
          break;
        case "residents":
          compareA = parseInt(a.umubare_w_abaturage || 0);
          compareB = parseInt(b.umubare_w_abaturage || 0);
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
  }, [searchTerm, filterVillage, sortBy, sortOrder, raporoList]);

  // Get unique villages for filter
  const uniqueVillages = [...new Set(raporoList.map((r) => r.umudugudu).filter(Boolean))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Form validation
  const validateForm = (data) => {
    const errors = {};

    if (!data.umutwe_wa_raporo?.trim()) {
      errors.umutwe_wa_raporo = "Umutwe wa raporo urakenewe";
    }

    if (!data.umudugudu?.trim()) {
      errors.umudugudu = "Umudugudu urakenewe";
    }

    if (data.itariki_ya_raporo && !/^\d{4}-\d{2}-\d{2}$/.test(data.itariki_ya_raporo)) {
      errors.itariki_ya_raporo = "Itariki ntabwo iri mu buryo bukwiye";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentRaporo((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(currentRaporo)) {
      showAlertMessage("Uzuza neza amakuru yose akenewe!", "warning");
      return;
    }

    try {
      if (currentRaporo.raporo_id) {
        await axios.put(`${API_URL}/${currentRaporo.raporo_id}`, currentRaporo);
        showAlertMessage("Raporo yahinduwe neza!", "success");
      } else {
        await axios.post(API_URL, currentRaporo);
        showAlertMessage("Raporo yongewe neza!", "success");
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
      showAlertMessage("Ntibikunze kubika! Gerageza ukundi.", "danger");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Uremeza ko ushaka gusiba iyi raporo?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      showAlertMessage("Raporo yasibwe neza!", "success");
      fetchData();
    } catch (err) {
      console.error(err);
      showAlertMessage("Ntibikunze gusiba!", "danger");
    }
  };

  // Open modal
  const openModal = (raporo = null) => {
    setCurrentRaporo(raporo || initialForm);
    setFormErrors({});
    setShowModal(true);
  };

  // View details
  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetails(true);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Umutwe",
      "Ibisobanuro",
      "Itariki",
      "Abaturage",
      "Ingo",
      "Abanyantege nke",
      "Umudugudu",
      "Yakozwe na",
    ];

    const csvData = filteredData.map((report) => [
      report.umutwe_wa_raporo,
      report.ibisobanuro || "-",
      report.itariki_ya_raporo || "-",
      report.umubare_w_abaturage || "0",
      report.umubare_w_ingo || "0",
      report.abanyantege_nke || "0",
      report.umudugudu || "-",
      report.yakozwe_na || "-",
    ]);

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `raporo_${new Date().toISOString().split("T")[0]}.csv`);
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
            <i className="bi bi-file-earmark-text-fill" style={{ fontSize: "2rem" }}></i>
            Raporo z'Umudugudu
            <Badge bg="primary" pill className="fs-6">
              {stats.total}
            </Badge>
          </h2>
          <p className="text-muted mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Kwandika, kureba, no gucunga raporo z'umudugudu
          </p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <OverlayTrigger placement="bottom" overlay={renderTooltip("Ongeramo raporo nshya")}>
            <Button variant="success" onClick={() => openModal()} className="shadow-sm">
              <i className="bi bi-plus-circle me-2"></i>Ongeramo Raporo
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
                  <p className="text-muted mb-1 small">Raporo Zose</p>
                  <h3 className="fw-bold mb-0 text-primary">{stats.total}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-file-earmark-text-fill text-primary" style={{ fontSize: "2rem" }}></i>
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
                  <p className="text-muted mb-1 small">Abaturage Bose</p>
                  <h3 className="fw-bold mb-0 text-success">{stats.totalResidents.toLocaleString()}</h3>
                  <small className="text-muted">{stats.avgResidentsPerReport} ikigereranyo</small>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-people-fill text-success" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xs={12} sm={6} lg={4}>
          <Card className="border-0 shadow-sm h-100 hover-card" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Ingo Zose</p>
                  <h3 className="fw-bold mb-0 text-info">{stats.totalHouses.toLocaleString()}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-house-fill text-info" style={{ fontSize: "2rem" }}></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Additional Stats Row */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #ffc107" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Abanyantege nke</p>
                  <h4 className="fw-bold mb-0 text-warning">{stats.totalVulnerable.toLocaleString()}</h4>
                </div>
                <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "2rem" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm hover-card" style={{ borderLeft: "4px solid #6f42c1" }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Imidugudu</p>
                  <h4 className="fw-bold mb-0" style={{ color: "#6f42c1" }}>
                    {stats.uniqueVillages}
                  </h4>
                </div>
                <i className="bi bi-geo-alt-fill" style={{ fontSize: "2rem", color: "#6f42c1" }}></i>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search, Filter, and Sort Section */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col xs={12} md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white">
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Shakisha umutwe, ibisobanuro, cyangwa yakozwe na..."
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
                    <i className="bi bi-funnel me-2"></i>
                    {filterVillage === "all" ? "Umudugudu wose" : filterVillage}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setFilterVillage("all")}>
                  <i className="bi bi-list-ul me-2"></i>Umudugudu wose
                </Dropdown.Item>
                {uniqueVillages.length > 0 && <Dropdown.Divider />}
                {uniqueVillages.map((village) => (
                  <Dropdown.Item key={village} onClick={() => setFilterVillage(village)}>
                    <i className="bi bi-geo-alt me-2"></i>
                    {village}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
            <Col xs={6} md={2}>
              <DropdownButton
                variant="outline-secondary"
                title={
                  <>
                    <i className="bi bi-sort-down me-2"></i>
                    {sortBy === "date" && "Itariki"}
                    {sortBy === "title" && "Umutwe"}
                    {sortBy === "residents" && "Abaturage"}
                  </>
                }
                className="w-100"
              >
                <Dropdown.Item onClick={() => setSortBy("date")}>
                  <i className="bi bi-calendar me-2"></i>Itariki
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("title")}>
                  <i className="bi bi-sort-alpha-down me-2"></i>Umutwe
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("residents")}>
                  <i className="bi bi-people me-2"></i>Abaturage
                </Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col xs={12} md={2}>
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
          {(searchTerm || filterVillage !== "all") && (
            <div className="mt-3">
              <small className="text-muted">
                <i className="bi bi-info-circle me-1"></i>
                Byasanze: <strong>{filteredData.length}</strong> mu raporo <strong>{raporoList.length}</strong>
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
            <i className="bi bi-file-earmark-x" style={{ fontSize: "4rem", color: "#dee2e6" }}></i>
            <h5 className="mt-3 text-muted">Nta raporo zihari</h5>
            <p className="text-muted">
              {searchTerm || filterVillage !== "all"
                ? "Nta makuru ahuye n'ibyo ushakisha"
                : "Tangira ukoreshe buto 'Ongeramo Raporo' kugira ngo wongere amakuru"}
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
                      <th className="py-3">Umutwe wa Raporo</th>
                      <th className="py-3 text-center">Itariki</th>
                      <th className="py-3 text-center">Abaturage</th>
                      <th className="py-3 text-center">Ingo</th>
                      <th className="py-3 text-center">Abanyantege nke</th>
                      <th className="py-3">Umudugudu</th>
                      <th className="py-3 text-center" style={{ width: "180px" }}>
                        Ibikorwa
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((report, index) => (
                      <tr key={report.raporo_id} className="border-bottom">
                        <td className="text-center px-3 text-muted">{indexOfFirstItem + index + 1}</td>
                        <td className="fw-semibold">
                          <i className="bi bi-file-earmark-text text-primary me-2"></i>
                          {report.umutwe_wa_raporo}
                        </td>
                        <td className="text-center">
                          {report.itariki_ya_raporo ? (
                            <span className="text-muted small">
                              <i className="bi bi-calendar-event me-1"></i>
                              {new Date(report.itariki_ya_raporo).toLocaleDateString("rw-RW")}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="text-center">
                          <Badge bg="info" className="px-3">
                            <i className="bi bi-people-fill me-1"></i>
                            {report.umubare_w_abaturage || 0}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg="secondary" className="px-3">
                            <i className="bi bi-house-fill me-1"></i>
                            {report.umubare_w_ingo || 0}
                          </Badge>
                        </td>
                        <td className="text-center">
                          <Badge bg="warning" text="dark" className="px-3">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            {report.abanyantege_nke || 0}
                          </Badge>
                        </td>
                        <td>
                          {report.umudugudu ? (
                            <span>
                              <i className="bi bi-geo-alt text-success me-2"></i>
                              {report.umudugudu}
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
                                onClick={() => handleViewDetails(report)}
                              >
                                <i className="bi bi-eye"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Hindura")}>
                              <Button size="sm" variant="outline-primary" onClick={() => openModal(report)}>
                                <i className="bi bi-pencil"></i>
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={renderTooltip("Siba")}>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                onClick={() => handleDelete(report.raporo_id)}
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
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered backdrop="static">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title>
              {currentRaporo?.raporo_id ? (
                <>
                  <i className="bi bi-pencil-square me-2"></i>Hindura Raporo
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>Ongeramo Raporo Nshya
                </>
              )}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="px-4 py-4">
            {currentRaporo && (
              <Row className="g-3">
                <Col md={12}>
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-file-earmark-text me-2"></i>Amakuru y'Ibanze
                  </h6>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Umutwe wa Raporo <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-card-heading"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="umutwe_wa_raporo"
                        value={currentRaporo.umutwe_wa_raporo}
                        onChange={handleChange}
                        placeholder="Shyiramo umutwe..."
                        isInvalid={!!formErrors.umutwe_wa_raporo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.umutwe_wa_raporo}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">
                      Umudugudu <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-geo-alt"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="umudugudu"
                        value={currentRaporo.umudugudu}
                        onChange={handleChange}
                        placeholder="Shyiramo umudugudu..."
                        isInvalid={!!formErrors.umudugudu}
                      />
                      <Form.Control.Feedback type="invalid">{formErrors.umudugudu}</Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Ibisobanuro</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-text-paragraph"></i>
                      </InputGroup.Text>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="ibisobanuro"
                        value={currentRaporo.ibisobanuro}
                        onChange={handleChange}
                        placeholder="Andika ibisobanuro..."
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-bar-chart me-2"></i>Imibare
                  </h6>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Itariki ya Raporo</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-calendar-event"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="itariki_ya_raporo"
                        value={currentRaporo.itariki_ya_raporo}
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]}
                        isInvalid={!!formErrors.itariki_ya_raporo}
                      />
                      <Form.Control.Feedback type="invalid">
                        {formErrors.itariki_ya_raporo}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Yakozwe na</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-person"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        name="yakozwe_na"
                        value={currentRaporo.yakozwe_na}
                        onChange={handleChange}
                        placeholder="Izina ry'uwayanditse..."
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Umubare w'Abaturage</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-people"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        name="umubare_w_abaturage"
                        value={currentRaporo.umubare_w_abaturage}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Umubare w'Ingo</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-house"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        name="umubare_w_ingo"
                        value={currentRaporo.umubare_w_ingo}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label className="fw-semibold">Abanyantege nke</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <i className="bi bi-exclamation-triangle"></i>
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        min="0"
                        name="abanyantege_nke"
                        value={currentRaporo.abanyantege_nke}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              </Row>
            )}
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              <i className="bi bi-x-circle me-1"></i>Funga
            </Button>
            <Button type="submit" variant={currentRaporo?.raporo_id ? "warning" : "success"}>
              <i
                className={`bi me-1 ${currentRaporo?.raporo_id ? "bi-save" : "bi-check-circle"}`}
              ></i>
              {currentRaporo?.raporo_id ? "Hindura" : "Bika Raporo"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Details Modal */}
      <Modal show={showDetails} onHide={() => setShowDetails(false)} centered size="lg">
        <Modal.Header closeButton className="bg-info text-white">
          <Modal.Title>
            <i className="bi bi-eye me-2"></i>Amakuru Arambuye ya Raporo
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {selectedReport && (
            <div>
              <Row className="g-4">
                <Col md={12}>
                  <Card className="border-primary border-2">
                    <Card.Body>
                      <h4 className="mb-1 fw-bold text-primary">
                        <i className="bi bi-file-earmark-text-fill me-2"></i>
                        {selectedReport.umutwe_wa_raporo}
                      </h4>
                      {selectedReport.itariki_ya_raporo && (
                        <small className="text-muted">
                          <i className="bi bi-calendar-event me-1"></i>
                          {new Date(selectedReport.itariki_ya_raporo).toLocaleDateString("rw-RW", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </small>
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                {selectedReport.ibisobanuro && (
                  <Col md={12}>
                    <Card className="border-0 bg-light">
                      <Card.Body>
                        <h6 className="text-muted mb-2">
                          <i className="bi bi-text-paragraph me-2"></i>Ibisobanuro
                        </h6>
                        <p className="mb-0">{selectedReport.ibisobanuro}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-bar-chart me-2"></i>Imibare
                  </h6>
                </Col>

                <Col md={4}>
                  <Card className="border-info border-2">
                    <Card.Body className="text-center">
                      <i className="bi bi-people-fill text-info" style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-1">Abaturage</h6>
                      <h3 className="fw-bold mb-0 text-info">{selectedReport.umubare_w_abaturage || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="border-secondary border-2">
                    <Card.Body className="text-center">
                      <i className="bi bi-house-fill text-secondary" style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-1">Ingo</h6>
                      <h3 className="fw-bold mb-0 text-secondary">{selectedReport.umubare_w_ingo || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card className="border-warning border-2">
                    <Card.Body className="text-center">
                      <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: "2rem" }}></i>
                      <h6 className="mt-2 mb-1">Abanyantege nke</h6>
                      <h3 className="fw-bold mb-0 text-warning">{selectedReport.abanyantege_nke || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={12}>
                  <hr />
                  <h6 className="text-muted mb-3">
                    <i className="bi bi-info-circle me-2"></i>Amakuru Y'inyongera
                  </h6>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-success ps-3">
                    <small className="text-muted">Umudugudu</small>
                    <h5 className="mb-0">
                      {selectedReport.umudugudu ? (
                        <>
                          <i className="bi bi-geo-alt-fill text-success me-2"></i>
                          {selectedReport.umudugudu}
                        </>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="border-start border-4 border-primary ps-3">
                    <small className="text-muted">Yakozwe na</small>
                    <h5 className="mb-0">
                      {selectedReport.yakozwe_na ? (
                        <>
                          <i className="bi bi-person-fill text-primary me-2"></i>
                          {selectedReport.yakozwe_na}
                        </>
                      ) : (
                        <span className="text-muted">-</span>
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
                      <i className="bi bi-hash me-2"></i>
                      ID: <strong>{selectedReport.raporo_id}</strong>
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
              openModal(selectedReport);
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

export default Raporo;