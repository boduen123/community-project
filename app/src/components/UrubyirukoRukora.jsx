import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Container, Card, Row, Col, Table, Button, Form, Modal, Badge,
  InputGroup, Spinner, Toast, ToastContainer, OverlayTrigger, Tooltip,
  Alert, Pagination, Dropdown, ButtonGroup
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const API_URL = "http://localhost:5000/urubyiruko_rukora";

const initialForm = {
  amazina: "", imyaka: "", igitsina: "Gabo", umurimo: "",
  nimero_ya_telephone: "", aderesi: "", ubuhanga: "Ikindi"
};

function UrubyirukoRukora({ darkMode = false }) {
  const [data, setData] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState("All");
  const [filterSkill, setFilterSkill] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [sortConfig, setSortConfig] = useState({ key: "amazina", direction: "asc" });

  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });
  const showToast = (message, bg = "success") => {
    setToast({ show: true, message, bg });
    setTimeout(() => setToast({ ...toast, show: false }), 5000);
  };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(API_URL);
      setData(res.data || []);
    } catch (err) {
      setError("Ntibishoboka kubona amakuru. Ongera ugerageze.");
      showToast("Habaye ikibazo mu kubarura amakuru.", "danger");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setEditId(null);
  };

  const handleOpenAdd = () => { resetForm(); setShowForm(true); };

  const handleEdit = (item) => {
    setForm({ ...item });
    setEditId(item.id);
    setShowForm(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.amazina.trim()) newErrors.amazina = "Amazina arakenewe.";
    if (!form.imyaka) newErrors.imyaka = "Imyaka irakenewe.";
    else if (form.imyaka < 15 || form.imyaka > 35) newErrors.imyaka = "Imyaka igomba kuba 15–35.";
    if (!form.umurimo.trim()) newErrors.umurimo = "Umurimo urakenewe.";
    if (form.nimero_ya_telephone && !/^\d{9,10}$/.test(form.nimero_ya_telephone))
      newErrors.nimero_ya_telephone = "Telephone igomba kuba 9–10 imibare.";
    if (!form.aderesi.trim()) newErrors.aderesi = "Aderesi irakenewe.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        showToast("Byahinduwe neza!", "success");
      } else {
        await axios.post(API_URL, form);
        showToast("Urubyiruko rwiyongereye neza!", "success");
      }
      setShowForm(false); resetForm(); loadData();
    } catch (err) {
      showToast("Habaye ikibazo mu kubika.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const askDelete = (item) => { setItemToDelete(item); setShowDelete(true); };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/${itemToDelete.id}`);
      showToast(`${itemToDelete.amazina} yasibwe neza.`, "info");
      loadData();
    } catch (err) {
      showToast("Ntabwo byakunze gusiba.", "danger");
    } finally {
      setDeleting(false); setShowDelete(false); setItemToDelete(null);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const skillsOptions = useMemo(() => {
    const skills = [...new Set(data.map(d => d.ubuhanga).filter(Boolean))];
    return skills.filter(s => s !== "Ikindi").concat("Ikindi");
  }, [data]);

  const filteredAndSortedData = useMemo(() => {
    let filtered = [...data];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(d =>
        [d.amazina, d.umurimo, d.ubuhanga, d.nimero_ya_telephone, d.aderesi]
          .some(f => f?.toLowerCase().includes(q))
      );
    }

    if (filterGender !== "All") filtered = filtered.filter(d => d.igitsina === filterGender);
    if (filterSkill !== "All") filtered = filtered.filter(d => d.ubuhanga === filterSkill);

    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key] || "";
      let bVal = b[sortConfig.key] || "";
      if (sortConfig.key === "imyaka") { aVal = Number(aVal); bVal = Number(bVal); }
      else { aVal = aVal.toString().toLowerCase(); bVal = bVal.toString().toLowerCase(); }

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, filterGender, filterSkill, sortConfig]);

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  return (
    <>
      <style jsx>{`
        .card-hover { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 15px 35px rgba(0,0,0,0.15) !important; }
        .table tr { transition: background 0.2s; }
        .table tr:hover { background: ${darkMode ? "#2d3748" : "#f8fff9"} !important; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(25,135,84,.4); } 70% { box-shadow: 0 0 0 10px rgba(25,135,84,0); } }
      `}</style>

      <Container fluid className={`py-4 ${darkMode ? "text-light" : ""}`}>
        {/* Header */}
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-success mb-1">
              <i className="bi bi-briefcase-fill me-3 pulse"></i>
              Urubyiruko Rufite Imirimo
            </h2>
            <p className="text-muted mb-0">Reba, ongeraho, hindura cyangwa siba urubyiruko rukora</p>
          </div>
          <div className="d-flex gap-2 mt-3 mt-md-0">
            <OverlayTrigger placement="left" overlay={<Tooltip>Ongera usome amakuru</Tooltip>}>
              <Button variant={darkMode ? "outline-light" : "outline-secondary"} onClick={loadData} disabled={loading}>
                {loading ? <Spinner size="sm" /> : <i className="bi bi-arrow-repeat"></i>}
              </Button>
            </OverlayTrigger>
            <Button variant="success" size="lg" onClick={handleOpenAdd}>
              <i className="bi bi-plus-circle-fill me-2"></i> Ongeraho Urubyiruko
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className={`mb-4 shadow-sm border-0 ${darkMode ? "bg-dark" : "bg-white"}`}>
          <Card.Body>
            <Row className="g-3">
              <Col lg={5}>
                <InputGroup>
                  <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                  <Form.Control
                    placeholder="Shakisha amazina, umurimo, telephone..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  />
                </InputGroup>
              </Col>
              <Col lg={3}>
                <Form.Select value={filterGender} onChange={(e) => { setFilterGender(e.target.value); setCurrentPage(1); }}>
                  <option value="All">Igitsina cyose</option>
                  <option value="Gabo">Gabo</option>
                  <option value="Gore">Gore</option>
                </Form.Select>
              </Col>
              <Col lg={4}>
                <Form.Select value={filterSkill} onChange={(e) => { setFilterSkill(e.target.value); setCurrentPage(1); }}>
                  <option value="All">Ubuhanga bwose</option>
                  {skillsOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Stats */}
        <Row className="mb-4 g-3">
          <Col xs={6} md={3}>
            <Card className={`text-center shadow-sm border-0 ${darkMode ? "bg-dark" : "bg-white"}`}>
              <Card.Body>
                <h5 className="text-success">{data.length}</h5>
                <small>Bose</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className={`text-center shadow-sm border-0 ${darkMode ? "bg-dark" : "bg-white"}`}>
              <Card.Body>
                <h5 className="text-primary">{data.filter(d => d.igitsina === "Gabo").length}</h5>
                <small>Gabo</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className={`text-center shadow-sm border-0 ${darkMode ? "bg-dark" : "bg-white"}`}>
              <Card.Body>
                <h5 className="text-danger">{data.filter(d => d.igitsina === "Gore").length}</h5>
                <small>Gore</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className={`text-center shadow-sm border-0 ${darkMode ? "bg-dark" : "bg-white"}`}>
              <Card.Body>
                <h5 className="text-info">{filteredAndSortedData.length}</h5>
                <small>Kugaragaye</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Desktop Table */}
        <div className="d-none d-lg-block">
          <Card className={`shadow-sm border-0 ${darkMode ? "bg-dark" : ""}`}>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="success" />
                  <p className="mt-3">Dutegereje amakuru...</p>
                </div>
              ) : filteredAndSortedData.length === 0 ? (
                <Alert variant="info" className="m-4 text-center">
                  <i className="bi bi-info-circle fs-1"></i>
                  <h5>Nta rubyiruko rubonetse</h5>
                </Alert>
              ) : (
                <Table hover responsive className={darkMode ? "table-dark" : ""}>
                  <thead className="table-success text-dark">
                    <tr>
                      <th>#</th>
                      <th onClick={() => handleSort("amazina")} style={{ cursor: "pointer" }}>
                        Amazina {sortConfig.key === "amazina" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th onClick={() => handleSort("imyaka")} style={{ cursor: "pointer" }}>
                        Imyaka {sortConfig.key === "imyaka" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                      </th>
                      <th>Igitsina</th>
                      <th>Umurimo</th>
                      <th>Telephone</th>
                      <th>Ubuhanga</th>
                      <th className="text-center">Ibikorwa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((d, i) => (
                      <tr key={d.id} className="card-hover">
                        <td>{(currentPage - 1) * itemsPerPage + i + 1}</td>
                        <td><strong>{d.amazina}</strong></td>
                        <td>{d.imyaka}</td>
                        <td>
                          <Badge bg={d.igitsina === "Gabo" ? "primary" : "danger"}>{d.igitsina}</Badge>
                        </td>
                        <td>{d.umurimo}</td>
                        <td>
                          {d.nimero_ya_telephone ? (
                            <a href={`tel:${d.nimero_ya_telephone}`} className="text-success">
                              {d.nimero_ya_telephone}
                            </a>
                          ) : "-"}
                        </td>
                        <td><Badge bg="secondary">{d.ubuhanga}</Badge></td>
                        <td className="text-center">
                          <Button size="sm" variant="outline-warning" className="me-2" onClick={() => handleEdit(d)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button size="sm" variant="outline-danger" onClick={() => askDelete(d)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Mobile Cards */}
        <div className="d-lg-none">
          {paginatedData.map((d, i) => (
            <Card key={d.id} className={`mb-3 shadow-sm card-hover ${darkMode ? "bg-dark text-light" : ""}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0">{d.amazina}</h6>
                  <Badge bg={d.igitsina === "Gabo" ? "primary" : "danger"}>{d.igitsina}</Badge>
                </div>
                <small className="text-success fw-bold">{d.umurimo}</small>
                <hr />
                <div className="small">
                  <div><strong>Imyaka:</strong> {d.imyaka}</div>
                  <div><strong>Telephone:</strong> {d.nimero_ya_telephone ? <a href={`tel:${d.nimero_ya_telephone}`}>{d.nimero_ya_telephone}</a> : "Nta"}</div>
                  <div><strong>Ubuhanga:</strong> <Badge bg="secondary">{d.ubuhanga}</Badge></div>
                </div>
                <div className="mt-3 text-end">
                  <Button size="sm" variant="outline-warning" className="me-2" onClick={() => handleEdit(d)}>Hindura</Button>
                  <Button size="sm" variant="outline-danger" onClick={() => askDelete(d)}>Siba</Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} />
              {[...Array(totalPages)].map((_, i) => (
                <Pagination.Item key={i+1} active={i+1 === currentPage} onClick={() => setCurrentPage(i+1)}>
                  {i+1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} />
            </Pagination>
          </div>
        )}
      </Container>

      {/* Add/Edit Modal */}
      <Modal show={showForm} onHide={() => setShowForm(false)} size="lg" centered backdrop="static">
        <Modal.Header closeButton className={darkMode ? "bg-dark" : ""}>
          <Modal.Title className="text-success">
            <i className="bi bi-person-plus-fill me-2"></i>
            {editId ? "Hindura" : "Iyandikishe"} Urubyiruko
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? "bg-dark" : ""}>
          <Form>
            <Row className="g-3">
              <Col md={6}><Form.Control placeholder="Amazina yombi" value={form.amazina} onChange={e => setForm({...form, amazina: e.target.value})} isInvalid={!!errors.amazina} /></Col>
              <Col md={6}><Form.Control type="number" placeholder="Imyaka (15-35)" value={form.imyaka} onChange={e => setForm({...form, imyaka: e.target.value})} isInvalid={!!errors.imyaka} /></Col>
              <Col md={6}>
                <Form.Select value={form.igitsina} onChange={e => setForm({...form, igitsina: e.target.value})}>
                  <option>Gabo</option><option>Gore</option>
                </Form.Select>
              </Col>
              <Col md={6}><Form.Control placeholder="Umurimo" value={form.umurimo} onChange={e => setForm({...form, umurimo: e.target.value})} isInvalid={!!errors.umurimo} /></Col>
              <Col md={6}><Form.Control placeholder="078..." value={form.nimero_ya_telephone} onChange={e => setForm({...form, nimero_ya_telephone: e.target.value})} isInvalid={!!errors.nimero_ya_telephone} /></Col>
              <Col md={6}><Form.Control placeholder="Akagari, Umudugudu..." value={form.aderesi} onChange={e => setForm({...form, aderesi: e.target.value})} isInvalid={!!errors.aderesi} /></Col>
              <Col md={12}>
                <Form.Select value={form.ubuhanga} onChange={e => setForm({...form, ubuhanga: e.target.value})}>
                  <option>Ikoranabuhanga</option>
                  <option>Ubucuruzi</option>
                  <option>Ubuhinzi</option>
                  <option>Ubwubatsi</option>
                  <option>Ikindi</option>
                </Form.Select>
              </Col>
            </Row>
            {Object.values(errors).map((err, i) => (
              <Alert key={i} variant="danger" className="mt-3 py-2">{err}</Alert>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer className={darkMode ? "bg-dark" : ""}>
          <Button variant="secondary" onClick={() => setShowForm(false)} disabled={saving}>Funga</Button>
          <Button variant="success" onClick={handleSave} disabled={saving}>
            {saving ? <>Kubika...</> : <><i className="bi bi-check2"></i> Bika</>}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal & Toast */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>
        <Modal.Header closeButton><Modal.Title className="text-danger">Siba Urubyiruko</Modal.Title></Modal.Header>
        <Modal.Body>Uzi neza ko ushaka gusiba <strong>{itemToDelete?.amazina}</strong>?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDelete(false)}>Bireke</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? "Gusiba..." : "Siba"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast show={toast.show} bg={toast.bg} onClose={() => setToast({ ...toast, show: false })}>
          <Toast.Body className={toast.bg === "danger" || toast.bg === "dark" ? "text-white" : ""}>
            <strong>{toast.message}</strong>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default UrubyirukoRukora;