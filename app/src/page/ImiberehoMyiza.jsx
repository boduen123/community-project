import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import {
  Modal,
  Button,
  Form,
  Table,
  Spinner,
  Alert,
  Toast,
  ToastContainer,
  InputGroup,
  Dropdown,
  Badge,
  OverlayTrigger,
  Tooltip,
  Pagination,
  Row,
  Col,
  Card,
} from "react-bootstrap";

const API = "http://localhost:5000";

const ImiberehoMyiza = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  // Enhanced state for new features
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [selectedItems, setSelectedItems] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const [form, setForm] = useState({
    muturage_id: "",
    gahunda_yafashwemo: "",
    ibisobanuro: "",
    itariki_yatangiranye: "",
    imiterere_yayo: "Iri_gukorwa",
    amazina_y_umuturage: "",
  });

  // Enhanced handleChange with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // LOAD DATA
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/imibereho`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      showToast("Error loading data", "error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // TOAST NOTIFICATIONS
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 3000);
  };

  // VALIDATION
  const validateForm = () => {
    const errors = {};
    
    if (!form.amazina_y_umuturage.trim()) {
      errors.amazina_y_umuturage = "Amazina ni ngombwa";
    }
    
    if (!form.muturage_id.trim()) {
      errors.muturage_id = "ID ni ngombwa";
    }
    
    if (!form.gahunda_yafashwemo.trim()) {
      errors.gahunda_yafashwemo = "Gahunda ni ngombwa";
    }
    
    if (!form.itariki_yatangiranye) {
      errors.itariki_yatangiranye = "Itariki ni ngombwa";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ENHANCED FILTERING AND SEARCH
  const filteredData = useMemo(() => {
    let filtered = data;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.amazina_y_umuturage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gahunda_yafashwemo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.muturage_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(item => item.imiterere_yayo === statusFilter);
    }

    // Sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, statusFilter, sortConfig]);

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // SORTING
  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  // OPEN ADD NEW
  const handleAdd = () => {
    setEditingId(null);
    setForm({
      muturage_id: "",
      gahunda_yafashwemo: "",
      ibisobanuro: "",
      itariki_yatangiranye: "",
      imiterere_yayo: "Iri_gukorwa",
      amazina_y_umuturage: "",
    });
    setFormErrors({});
    setShow(true);
  };

  // EDIT
  const handleEdit = (item) => {
    setEditingId(item.imibereho_id);
    setForm(item);
    setFormErrors({});
    setShow(true);
  };

  // DELETE CONFIRMATION
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  // DELETE
  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/imibereho/${deleteId}`);
      showToast("Item deleted successfully", "success");
      loadData();
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      showToast("Error deleting item", "error");
    }
  };

  // BULK DELETE
  const handleBulkDelete = async () => {
    if (!window.confirm(`Urashaka gusiba ibintu ${selectedItems.length} koko?`)) return;
    
    try {
      await Promise.all(
        selectedItems.map(id => axios.delete(`${API}/imibereho/${id}`))
      );
      showToast(`${selectedItems.length} items deleted successfully`, "success");
      setSelectedItems([]);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Error deleting items", "error");
    }
  };

  // SELECT ITEM
  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // SELECT ALL
  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(paginatedData.map(item => item.imibereho_id));
    }
  };

  // SUBMIT FORM
  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors", "error");
      return;
    }

    try {
      if (editingId === null) {
        // ADD NEW
        await axios.post(`${API}/imibereho`, form);
        setAlert("Byakigiyemo neza!");
        showToast("Item added successfully!", "success");
      } else {
        // UPDATE
        await axios.put(`${API}/imibereho/${editingId}`, form);
        setAlert("Havuguruwe neza!");
        showToast("Item updated successfully!", "success");
      }

      setShow(false);
      loadData();
      setTimeout(() => setAlert(""), 3000);
    } catch (err) {
      console.error(err);
      showToast("Error saving item", "error");
    }
  };

  // RESET FILTERS
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // GET STATUS BADGE
  const getStatusBadge = (status) => {
    switch (status) {
      case "Yarangiye":
        return <Badge bg="success">Yarangiye</Badge>;
      case "Iri_gukorwa":
        return <Badge bg="warning" className="text-dark">Iri gukorwa</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csvContent = [
      ["Amazina", "ID", "Gahunda", "Itariki", "Imiterere", "Ibisobanuro"],
      ...filteredData.map(item => [
        item.amazina_y_umuturage,
        item.muturage_id,
        item.gahunda_yafashwemo,
        item.itariki_yatangiranye,
        item.imiterere_yayo,
        item.ibisobanuro
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "imibereho_myiza.csv";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Statistics
  const stats = {
    total: data.length,
    completed: data.filter(item => item.imiterere_yayo === "Yarangiye").length,
    inProgress: data.filter(item => item.imiterere_yayo === "Iri_gukorwa").length,
    filtered: filteredData.length
  };

  return (
    <div className="container-fluid py-4">
      {/* Toast Notifications */}
      <ToastContainer position="top-end" className="p-3">
        <Toast 
          bg={toast.type === "error" ? "danger" : "success"} 
          show={toast.show} 
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Body className="text-white">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-bold text-primary">
            <i className="bi bi-list-check"></i> Imibereho Myiza
          </h2>
          <p className="text-muted mb-0">Manage quality of life projects and initiatives</p>
        </div>
        <Button variant="primary" onClick={handleAdd} className="px-4">
          <i className="bi bi-plus-circle me-2"></i> Ongeramo
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-primary">{stats.total}</div>
              <div className="text-muted">Byose</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-success">{stats.completed}</div>
              <div className="text-muted">Zarangiye</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-warning">{stats.inProgress}</div>
              <div className="text-muted">Ziri gukorwa</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-6 fw-bold text-info">{stats.filtered}</div>
              <div className="text-muted">Byasigaye</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control
                  placeholder="Shakisha..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">Amashyi yose</option>
                <option value="Iri_gukorwa">Iri gukorwa</option>
                <option value="Yarangiye">Yarangiye</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={25}>25 per page</option>
                <option value={50}>50 per page</option>
              </Form.Select>
            </Col>
            <Col md={2} className="d-flex gap-2">
              <Button variant="outline-secondary" onClick={resetFilters}>
                Reset
              </Button>
              <Button variant="outline-primary" onClick={exportToCSV}>
                <i className="bi bi-download"></i>
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <Alert variant="info" className="d-flex justify-content-between align-items-center">
          <span>{selectedItems.length} items selected</span>
          <div>
            <Button variant="danger" size="sm" onClick={handleBulkDelete}>
              <i className="bi bi-trash me-1"></i>Delete Selected
            </Button>
            <Button variant="outline-secondary" size="sm" className="ms-2" onClick={() => setSelectedItems([])}>
              Clear Selection
            </Button>
          </div>
        </Alert>
      )}

      {alert && <Alert variant="success">{alert}</Alert>}

      {/* Main Table */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>Projects List
          </h5>
          <small>{filteredData.length} results</small>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" />
              <div className="mt-2 text-muted">Loading projects...</div>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center p-5">
              <div className="display-1 text-muted mb-3">📋</div>
              <h4>No Projects Found</h4>
              <p className="text-muted">
                {searchTerm || statusFilter !== "all" 
                  ? "No projects match your current filters." 
                  : "Start by adding your first project."}
              </p>
              <Button variant="primary" onClick={handleAdd}>
                <i className="bi bi-plus-circle me-2"></i>Add New Project
              </Button>
            </div>
          ) : (
            <>
              <Table hover className="mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.length === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th 
                      className="cursor-pointer" 
                      onClick={() => handleSort("amazina_y_umuturage")}
                    >
                      <i className="bi bi-arrow-down-up me-1"></i>Amazina
                    </th>
                    <th>ID</th>
                    <th>Gahunda</th>
                    <th>Itariki</th>
                    <th>Imiterere</th>
                    <th>Ibisobanuro</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, i) => (
                    <tr key={item.imibereho_id}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedItems.includes(item.imibereho_id)}
                          onChange={() => handleSelectItem(item.imibereho_id)}
                        />
                      </td>
                      <td className="fw-medium">{item.amazina_y_umuturage}</td>
                      <td><code>{item.muturage_id}</code></td>
                      <td>{item.gahunda_yafashwemo}</td>
                      <td>{new Date(item.itariki_yatangiranye).toLocaleDateString()}</td>
                      <td>{getStatusBadge(item.imiterere_yayo)}</td>
                      <td>
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-${item.imibereho_id}`}>
                              {item.ibisobanuro}
                            </Tooltip>
                          }
                        >
                          <span className="text-truncate d-inline-block" style={{ maxWidth: "200px" }}>
                            {item.ibisobanuro}
                          </span>
                        </OverlayTrigger>
                      </td>
                      <td>
                        <div className="d-flex justify-content-center gap-2">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Button 
                              variant="outline-primary" 
                              size="sm" 
                              onClick={() => handleEdit(item)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => handleDeleteClick(item.imibereho_id)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center p-3">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      {/* Enhanced Add/Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} size="lg">
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <i className={`bi ${editingId ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
            {editingId ? "Hindura Ibyanditse" : "Ongeramo Ibyanditswe"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Amazina y'umuturage *</Form.Label>
                  <Form.Control
                    name="amazina_y_umuturage"
                    value={form.amazina_y_umuturage}
                    onChange={handleChange}
                    isInvalid={!!formErrors.amazina_y_umuturage}
                    placeholder="Enter resident name"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.amazina_y_umuturage}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Indangamuntu / ID *</Form.Label>
                  <Form.Control
                    name="muturage_id"
                    value={form.muturage_id}
                    onChange={handleChange}
                    isInvalid={!!formErrors.muturage_id}
                    placeholder="Enter national ID"
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.muturage_id}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Gahunda yafashwemo *</Form.Label>
              <Form.Control
                name="gahunda_yafashwemo"
                value={form.gahunda_yafashwemo}
                onChange={handleChange}
                isInvalid={!!formErrors.gahunda_yafashwemo}
                placeholder="Enter project name"
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.gahunda_yafashwemo}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Itariki yatangiranye *</Form.Label>
                  <Form.Control
                    type="date"
                    name="itariki_yatangiranye"
                    value={form.itariki_yatangiranye}
                    onChange={handleChange}
                    isInvalid={!!formErrors.itariki_yatangiranye}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formErrors.itariki_yatangiranye}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Imiterere yayo</Form.Label>
                  <Form.Select
                    name="imiterere_yayo"
                    value={form.imiterere_yayo}
                    onChange={handleChange}
                  >
                    <option value="Iri_gukorwa">Iri gukorwa</option>
                    <option value="Yarangiye">Yarangiye</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Ibisobanuro</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="ibisobanuro"
                value={form.ibisobanuro}
                onChange={handleChange}
                placeholder="Enter project description..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            <i className="bi bi-x-circle me-1"></i>Funga
          </Button>
          <Button variant="success" onClick={handleSubmit}>
            <i className="bi bi-check-circle me-1"></i>
            {editingId ? "Hindura" : "Bika"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteConfirm} 
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Emeza Gusiba
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Urashaka gusiba iki kintu koko? Iyi gikorwa ntishobora gutangirwa.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Hagarika
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            <i className="bi bi-trash me-1"></i>Siba
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Custom Styles */}
      <style>{`
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-pointer:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .card {
          transition: transform 0.2s ease-in-out;
        }
        .card:hover {
          transform: translateY(-2px);
        }
        .table th {
          border-top: none !important;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.5px;
        }
        .btn {
          border-radius: 8px;
          font-weight: 500;
          transition: all 0.2s ease-in-out;
        }
        .btn:hover {
          transform: translateY(-1px);
        }
        .form-control:focus,
        .form-select:focus {
          border-color: #6a11cb;
          box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
        }
        .toast-container {
          z-index: 1200;
        }
        @media (max-width: 768px) {
          .table-responsive {
            font-size: 0.875rem;
          }
          .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ImiberehoMyiza;