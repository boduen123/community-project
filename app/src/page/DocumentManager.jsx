import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaTrash, FaEdit, FaFileUpload, FaEye } from "react-icons/fa";

const API_URL = "http://localhost:5000/documents";

const DocumentManager = () => {
  const [currentUser, setCurrentUser] = useState({ name: "Admin" }); // for testing
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", file: null });
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    const res = await axios.get(API_URL);
    setDocuments(res.data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") setFormData({ ...formData, file: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("uploaded_by", currentUser.name);
    if (formData.file) data.append("file", formData.file);

    try {
      if (editingDoc) await axios.put(`${API_URL}/${editingDoc.id}`, data);
      else await axios.post(API_URL, data);
      fetchDocuments();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    await axios.delete(`${API_URL}/${id}`);
    fetchDocuments();
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({ title: doc.title, description: doc.description, file: null });
    if (fileInputRef.current) fileInputRef.current.value = null;
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingDoc(null);
    setFormData({ title: "", description: "", file: null });
    if (fileInputRef.current) fileInputRef.current.value = null;
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h3>📁 Document Management</h3>
      <Button variant="success" className="mb-3" onClick={() => setShowModal(true)}>
        <FaFileUpload /> Add Document
      </Button>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Description</th>
            <th>Uploaded By</th>
            <th>Date</th>
            <th>File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length ? (
            documents.map((doc, i) => (
              <tr key={doc.id}>
                <td>{i + 1}</td>
                <td>{doc.title}</td>
                <td>{doc.description}</td>
                <td>{doc.uploaded_by}</td>
                <td>{doc.uploaded_at && new Date(doc.uploaded_at).toLocaleString()}</td>
                <td>
                  {doc.file_path ? (
                    <a
                      href={`http://localhost:5000/uploads/${doc.file_path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <FaEye /> View
                    </a>
                  ) : (
                    "No file"
                  )}
                </td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => handleEdit(doc)} className="me-2">
                    <FaEdit />
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(doc.id)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                No documents found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDoc ? "Edit Document" : "Upload Document"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>File</Form.Label>
              <Form.Control type="file" name="file" ref={fileInputRef} onChange={handleChange} />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              {editingDoc ? "Update" : "Upload"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DocumentManager;
