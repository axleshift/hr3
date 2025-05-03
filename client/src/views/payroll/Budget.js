// import React, { useState } from 'react'
// import {
//   CCard,
//   CCardBody,
//   CCardHeader,
//   CForm,
//   CFormInput,
//   CFormSelect,
//   CButton,
//   CAlert,
//   CSpinner,
// } from '@coreui/react'
// import axios from 'axios'

// const BudgetRequestForm = () => {
//   const [formData, setFormData] = useState({
//     department: '',
//     typeOfRequest: '',
//     category: '',
//     reason: '',
//     totalRequest: '',
//     documents: null,
//   })

//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState(false)

//   const departments = ['Logistics', 'HR', 'Finance', 'IT', 'Operations']
//   const requestTypes = ['Training Cost', 'Equipment', 'Travel', 'Software', 'Freight Cost']
//   const categories = [
//     'Employee Development',
//     'Finance',
//     'Operational Costs',
//     'Payroll',
//     'Miscellaneous',
//   ]

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({ ...prev, documents: e.target.files[0] }))
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setSuccess(false)

//     try {
//       // First submit to HR API
//       const hrFormData = new FormData()
//       for (const key in formData) {
//         hrFormData.append(key, formData[key])
//       }

//       await axios.post('https://backend-finance.axleshift.com/api/budgetRequest', hrFormData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })

//       setSuccess(true)
//       setFormData({
//         department: '',
//         typeOfRequest: '',
//         category: '',
//         reason: '',
//         totalRequest: '',
//         documents: null,
//       })
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to submit request')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <CCard>
//       <CCardHeader>
//         <h5>Budget Request Form</h5>
//       </CCardHeader>
//       <CCardBody>
//         {error && <CAlert color="danger">{error}</CAlert>}
//         {success && (
//           <CAlert color="success">
//             Request submitted successfully to both HR and Finance systems!
//           </CAlert>
//         )}

//         <CForm onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <CFormSelect
//               name="department"
//               value={formData.department}
//               onChange={handleChange}
//               label="Department"
//               required
//             >
//               <option value="">Select Department</option>
//               {departments.map((dept) => (
//                 <option key={dept} value={dept}>
//                   {dept}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormSelect
//               name="typeOfRequest"
//               value={formData.typeOfRequest}
//               onChange={handleChange}
//               label="Type of Request"
//               required
//             >
//               <option value="">Select Request Type</option>
//               {requestTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormSelect
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               label="Category"
//               required
//             >
//               <option value="">Select Category</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </CFormSelect>
//           </div>

//           <div className="mb-3">
//             <CFormInput
//               type="textarea"
//               name="reason"
//               value={formData.reason}
//               onChange={handleChange}
//               label="Reason for Request"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <CFormInput
//               type="number"
//               name="totalRequest"
//               value={formData.totalRequest}
//               onChange={handleChange}
//               label="Total Amount Requested"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <CFormInput
//               type="file"
//               name="documents"
//               onChange={handleFileChange}
//               label="Supporting Document"
//             />
//           </div>

//           <div className="d-grid gap-2">
//             <CButton type="submit" color="primary" disabled={loading}>
//               {loading ? (
//                 <>
//                   <CSpinner component="span" size="sm" aria-hidden="true" />
//                   Submitting...
//                 </>
//               ) : (
//                 'Submit Request'
//               )}
//             </CButton>
//           </div>
//         </CForm>
//       </CCardBody>
//     </CCard>
//   )
// }

// export default BudgetRequestForm

import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
  CAlert,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilPencil, cilTrash, cilCheckCircle, cilXCircle, cilInfo } from '@coreui/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const BudgetRequestPage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionType, setActionType] = useState('create')
  const [departments, setDepartments] = useState([])
  const [categories, setCategories] = useState([])
  const [requestTypes, setRequestTypes] = useState([])
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    department: '',
    typeOfRequest: '',
    category: '',
    reason: '',
    totalRequest: '',
    documents: [],
    comment: '',
    status: 'Pending',
  })

  // Fetch departments, categories, and request types from your backend
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // These would be replaced with actual API calls to your backend
        setDepartments(['Finance', 'HR', 'IT', 'Operations', 'Marketing'])
        setCategories(['Equipment', 'Travel', 'Payroll', 'Office Supplies', 'Software'])
        setRequestTypes(['Freight Cost', 'Regular', 'Special Project'])
      } catch (err) {
        setError('Failed to load dropdown data')
      }
    }

    fetchDropdownData()
    fetchBudgetRequests()
  }, [])

  const fetchBudgetRequests = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/budget-requests')
      // Ensure we always set an array, even if response.data is null/undefined
      setRequests(Array.isArray(response.data) ? response.data : [])
      setError('')
    } catch (err) {
      setError('Failed to fetch budget requests')
      setRequests([]) // Reset to empty array on error
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        if (key !== 'documents') {
          formDataToSend.append(key, formData[key])
        }
      })

      if (file) {
        formDataToSend.append('documents', file)
      }

      if (actionType === 'create') {
        await axios.post(
          'https://backend-finance.axleshift.com/api/budgetRequest',
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        )
        setSuccess('Budget request created successfully!')
      } else {
        await axios.put(`/api/budget-requests/${selectedRequest._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        setSuccess('Budget request updated successfully!')
      }

      setShowModal(false)
      fetchBudgetRequests()
      resetForm()
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleEdit = (request) => {
    setSelectedRequest(request)
    setFormData({
      department: request.department,
      typeOfRequest: request.typeOfRequest,
      category: request.category,
      reason: request.reason,
      totalRequest: request.totalRequest,
      documents: request.documents,
      comment: request.comment,
      status: request.status,
    })
    setActionType('edit')
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to archive this request?')) {
      try {
        await axios.delete(`/api/budget-requests/${id}`)
        setSuccess('Request archived successfully!')
        fetchBudgetRequests()
      } catch (err) {
        setError('Failed to archive request')
      }
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`/api/budget-requests/status/${id}`, { status })
      setSuccess(`Request ${status.toLowerCase()} successfully!`)
      fetchBudgetRequests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status')
    }
  }

  const resetForm = () => {
    setFormData({
      department: '',
      typeOfRequest: '',
      category: '',
      reason: '',
      totalRequest: '',
      documents: [],
      comment: '',
      status: 'Pending',
    })
    setFile(null)
    setSelectedRequest(null)
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return 'success'
      case 'Declined':
        return 'danger'
      case 'Pending':
        return 'warning'
      case 'Processing':
        return 'info'
      default:
        return 'secondary'
    }
  }

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Budget Requests</strong>
            <div className="float-end">
              <CButton
                color="primary"
                onClick={() => {
                  setActionType('create')
                  setShowModal(true)
                  resetForm()
                }}
              >
                <CIcon icon={cilPlus} className="me-2" />
                New Request
              </CButton>
            </div>
          </CCardHeader>
          <CCardBody>
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                {error}
              </CAlert>
            )}
            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                {success}
              </CAlert>
            )}

            {loading ? (
              <div className="text-center">
                <CSpinner />
              </div>
            ) : (
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Request ID</CTableHeaderCell>
                    <CTableHeaderCell>Department</CTableHeaderCell>
                    <CTableHeaderCell>Type</CTableHeaderCell>
                    <CTableHeaderCell>Category</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {requests && requests.length > 0 ? (
                    requests.map((request) => (
                      <CTableRow key={request._id}>
                        <CTableDataCell>{request.requestId}</CTableDataCell>
                        <CTableDataCell>{request.department}</CTableDataCell>
                        <CTableDataCell>{request.typeOfRequest}</CTableDataCell>
                        <CTableDataCell>{request.category}</CTableDataCell>
                        <CTableDataCell>
                          ${parseFloat(request.totalRequest).toFixed(2)}
                        </CTableDataCell>
                        <CTableDataCell>
                          <CBadge color={getStatusBadge(request.status)}>{request.status}</CBadge>
                        </CTableDataCell>
                        <CTableDataCell>{formatDate(request.createdAt)}</CTableDataCell>
                        <CTableDataCell>
                          <CDropdown>
                            <CDropdownToggle color="secondary" size="sm">
                              Actions
                            </CDropdownToggle>
                            <CDropdownMenu>
                              <CDropdownItem
                                onClick={() => navigate(`/budget-requests/${request._id}`)}
                              >
                                <CIcon icon={cilInfo} className="me-2" /> View Details
                              </CDropdownItem>
                              {request.status === 'Pending' && (
                                <>
                                  <CDropdownItem onClick={() => handleEdit(request)}>
                                    <CIcon icon={cilPencil} className="me-2" /> Edit
                                  </CDropdownItem>
                                  <CDropdownItem
                                    onClick={() => handleStatusUpdate(request._id, 'Approved')}
                                  >
                                    <CIcon icon={cilCheckCircle} className="me-2" /> Approve
                                  </CDropdownItem>
                                  <CDropdownItem
                                    onClick={() => handleStatusUpdate(request._id, 'Declined')}
                                  >
                                    <CIcon icon={cilXCircle} className="me-2" /> Decline
                                  </CDropdownItem>
                                </>
                              )}
                              <CDropdownItem onClick={() => handleDelete(request._id)}>
                                <CIcon icon={cilTrash} className="me-2" /> Archive
                              </CDropdownItem>
                            </CDropdownMenu>
                          </CDropdown>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No budget requests found
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>

      {/* Create/Edit Modal */}
      <CModal visible={showModal} onClose={() => setShowModal(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>
            {actionType === 'create' ? 'Create New Budget Request' : 'Edit Budget Request'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit}>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Department</CFormLabel>
                <CFormSelect
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Type of Request</CFormLabel>
                <CFormSelect
                  name="typeOfRequest"
                  value={formData.typeOfRequest}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Type</option>
                  {requestTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Category</CFormLabel>
                <CFormSelect
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={6}>
                <CFormLabel>Total Amount Requested</CFormLabel>
                <CInputGroup>
                  <CInputGroupText>$</CInputGroupText>
                  <CFormInput
                    type="number"
                    name="totalRequest"
                    value={formData.totalRequest}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    required
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Reason for Request</CFormLabel>
                <CFormTextarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Supporting Documents</CFormLabel>
                <CFormInput
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.jpg,.png"
                />
                {selectedRequest?.documents?.length > 0 && (
                  <div className="mt-2">
                    <small>Current document: {selectedRequest.documents[0]}</small>
                  </div>
                )}
              </CCol>
            </CRow>

            {actionType === 'edit' && (
              <CRow className="mb-3">
                <CCol>
                  <CFormLabel>Comment</CFormLabel>
                  <CFormTextarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </CCol>
              </CRow>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? (
              <CSpinner size="sm" />
            ) : actionType === 'create' ? (
              'Submit Request'
            ) : (
              'Update Request'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default BudgetRequestPage
