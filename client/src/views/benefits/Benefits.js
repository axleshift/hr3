import React, { useState, useEffect } from 'react'
import api from '../../util/api'
import {
  CCardHeader,
  CRow,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CButton,
  CCard,
  CCol,
  CCardBody,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CSpinner,
  CFormInput,
} from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

const Benefits = () => {
  const [type, setType] = useState('')
  const [amount, setAmount] = useState('')
  const [benefits, setBenefits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState(null)

  const benefitTypes = [
    'Pag-ibig',
    'SSS',
    'PhilHealth',
    '13th Month Pay',
    'Service Incentive Leave',
  ]

  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true)
        const response = await api.get('/benefits')
        setBenefits(response.data)
      } catch (err) {
        console.error('Error fetching benefits:', err)
        setError('Failed to fetch benefits.')
      } finally {
        setLoading(false)
      }
    }

    fetchBenefits()
  }, [])

  const handleApplyToAll = async () => {
    if (!type || !amount) {
      setError('Please select a benefit type and enter an amount.')
      return
    }

    setLoading(true)
    setError(null)

    const benefitData = {
      type,
      amount: parseFloat(amount),
    }

    try {
      if (editingBenefit) {
        await api.put(`/api/benefits/${editingBenefit.id}`, benefitData)
        alert('Benefit updated successfully!')
      } else {
        const response = await api.post('/benefits', benefitData)
        console.log('Success:', response.data)
        alert('Benefit applied successfully!')
      }

      const benefitsResponse = await api.get('/benefits')
      setBenefits(benefitsResponse.data)

      setModalVisible(false)
      setType('')
      setAmount('')
      setEditingBenefit(null)
    } catch (err) {
      console.error('Error:', err.response?.data || err.message)
      setError(err.response?.data?.error || 'Failed to apply/update benefit.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (benefitId) => {
    if (window.confirm('Are you sure you want to delete this benefit?')) {
      try {
        await api.delete(`/api/benefits/${benefitId}`)
        alert('Benefit deleted successfully!')

        const benefitsResponse = await api.get('/benefits')
        setBenefits(benefitsResponse.data)
      } catch (err) {
        console.error('Error:', err.response?.data || err.message)
        setError(err.response?.data?.error || 'Failed to delete benefit.')
      }
    }
  }

  const handleEdit = (benefit) => {
    setEditingBenefit(benefit)
    setType(benefit.type)
    setAmount(benefit.amount)
    setModalVisible(true)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Manage Employee Benefits</strong>
            <CButton color="primary" className="float-end" onClick={() => setModalVisible(true)}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
            </CButton>
          </CCardHeader>
          <CCardBody>
            {error && <div className="alert alert-danger mb-3">{error}</div>}

            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>ID</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Benefit Type</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {loading ? (
                  <CTableRow>
                    <CTableDataCell colSpan={5} className="text-center">
                      <CSpinner />
                      <span className="ms-2">Loading benefits...</span>
                    </CTableDataCell>
                  </CTableRow>
                ) : benefits.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={5} className="text-center">
                      No benefits found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  benefits.map((benefit) => (
                    <CTableRow key={benefit.id}>
                      <CTableDataCell>{benefit.id}</CTableDataCell>
                      <CTableDataCell>{benefit.name}</CTableDataCell>
                      <CTableDataCell>{benefit.type}</CTableDataCell>
                      <CTableDataCell>
                        ₱
                        {parseFloat(benefit.amount).toLocaleString('en-PH', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="warning"
                          size="sm"
                          onClick={() => handleEdit(benefit)}
                          className="me-2"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(benefit.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>

            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
              <CModalHeader>
                <CModalTitle>{editingBenefit ? 'Edit Benefit' : 'Add New Benefit'}</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Benefit Type</CInputGroupText>
                  <CFormSelect value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Select benefit type</option>
                    {benefitTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </CFormSelect>
                </CInputGroup>

                <CInputGroup className="mb-3">
                  <CInputGroupText>Amount</CInputGroupText>
                  <CFormInput
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </CInputGroup>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" onClick={() => setModalVisible(false)}>
                  Cancel
                </CButton>
                <CButton color="primary" onClick={handleApplyToAll} disabled={loading}>
                  {loading ? (
                    <>
                      <CSpinner component="span" size="sm" aria-hidden="true" />
                      <span className="ms-2">Processing...</span>
                    </>
                  ) : (
                    'Submit'
                  )}
                </CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Benefits

// import React, { useState, useEffect } from 'react'
// import axios from 'axios'
// import {
//   CCardHeader,
//   CRow,
//   CInputGroup,
//   CInputGroupText,
//   CFormSelect,
//   CButton,
//   CCard,
//   CCol,
//   CCardBody,
//   CModal,
//   CModalHeader,
//   CModalTitle,
//   CModalBody,
//   CModalFooter,
//   CTable,
//   CTableHead,
//   CTableRow,
//   CTableHeaderCell,
//   CTableBody,
//   CTableDataCell,
//   CDropdown,
//   CDropdownToggle,
//   CDropdownMenu,
//   CDropdownItem,
// } from '@coreui/react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPlus, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons'

// const Benefits = () => {
//   const [benefitType, setBenefitType] = useState('')
//   const [benefits, setBenefits] = useState([]) // Store all benefits
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)
//   const [benefitTypes, setBenefitTypes] = useState([]) // Store benefit types
//   const [modalVisible, setModalVisible] = useState(false) // Control modal visibility
//   const [editingBenefit, setEditingBenefit] = useState(null) // Track the benefit being edited

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const benefitsResponse = await axios.get('http://localhost:8000/api/benefits')
//         setBenefits(benefitsResponse.data)

//         const benefitTypesResponse = await axios.get('http://localhost:8000/api/benefit-types')
//         setBenefitTypes(benefitTypesResponse.data)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//         setError('Failed to fetch data.')
//       }
//     }

//     fetchData()
//   }, [])

//   const handleApplyToAll = async () => {
//     if (!benefitType) {
//       setError('Please select a benefit type.')
//       return
//     }

//     setLoading(true)
//     setError(null)

//     const benefitData = {
//       benefit_type: benefitType,
//     }

//     try {
//       if (editingBenefit) {
//         await axios.put(`http://localhost:8000/api/benefits/${editingBenefit.id}`, benefitData)
//         alert('Benefit updated successfully!')
//       } else {
//         const response = await axios.post('http://localhost:8000/api/benefits', benefitData)
//         console.log('Success:', response.data)
//         alert('Benefit applied successfully!')
//       }

//       const benefitsResponse = await axios.get('http://localhost:8000/api/benefits')
//       setBenefits(benefitsResponse.data)

//       setModalVisible(false)
//       setBenefitType('')
//       setEditingBenefit(null)
//     } catch (err) {
//       console.error('Error:', err.response?.data || err.message)
//       setError(err.response?.data?.error || 'Failed to apply/update benefit.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleDelete = async (benefitId) => {
//     if (window.confirm('Are you sure you want to delete this benefit?')) {
//       try {
//         await axios.delete(`http://localhost:8000/api/benefits/${benefitId}`)
//         alert('Benefit deleted successfully!')

//         const benefitsResponse = await axios.get('http://localhost:8000/api/benefits')
//         setBenefits(benefitsResponse.data)
//       } catch (err) {
//         console.error('Error:', err.response?.data || err.message)
//         setError(err.response?.data?.error || 'Failed to delete benefit.')
//       }
//     }
//   }

//   return (
//     <CRow>
//       <CCol xs={12}>
//         <CCard className="mb-4">
//           <CCardHeader>
//             <strong>Manage Employee Benefits</strong>
//             <CButton color="primary" className="float-end" onClick={() => setModalVisible(true)}>
//               <FontAwesomeIcon icon={faPlus} />
//             </CButton>
//           </CCardHeader>
//           <CCardBody>
//             {error && <p style={{ color: 'red' }}>{error}</p>}

//             <CTable striped hover responsive>
//               <CTableHead>
//                 <CTableRow>
//                   <CTableHeaderCell>#</CTableHeaderCell>
//                   <CTableHeaderCell>Name</CTableHeaderCell>
//                   <CTableHeaderCell>Benefit Types</CTableHeaderCell>
//                   <CTableHeaderCell>Amounts</CTableHeaderCell>
//                   <CTableHeaderCell>Actions</CTableHeaderCell>
//                 </CTableRow>
//               </CTableHead>
//               <CTableBody>
//                 {benefits.map((benefit) => (
//                   <CTableRow key={benefit.id}>
//                     <CTableDataCell>{benefit.id}</CTableDataCell>
//                     <CTableDataCell>{benefit.name}</CTableDataCell>
//                     <CTableDataCell>
//                       {benefit.benefits.map((item, index) => (
//                         <div key={index}>{item.benefit_type}</div>
//                       ))}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       {benefit.benefits.map((item, index) => (
//                         <div key={index}>{item.amount}</div>
//                       ))}
//                     </CTableDataCell>
//                     <CTableDataCell>
//                       <CButton color="danger" size="sm" onClick={() => handleDelete(benefit.id)}>
//                         <FontAwesomeIcon icon={faTrash} />
//                       </CButton>
//                       <CButton
//                         color="warning"
//                         size="sm"
//                         onClick={() => setEditingBenefit(benefit) || setModalVisible(true)}
//                         style={{ marginLeft: '10px' }}
//                       >
//                         <FontAwesomeIcon icon={faEdit} />
//                       </CButton>
//                     </CTableDataCell>
//                   </CTableRow>
//                 ))}
//               </CTableBody>
//             </CTable>

//             <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
//               <CModalHeader>
//                 <CModalTitle>
//                   {editingBenefit ? 'Edit Benefit' : 'Apply Benefit to All Employees'}
//                 </CModalTitle>
//               </CModalHeader>
//               <CModalBody>
//                 <CInputGroup className="mb-3">
//                   <CInputGroupText>Benefit Type:</CInputGroupText>
//                   <CFormSelect value={benefitType} onChange={(e) => setBenefitType(e.target.value)}>
//                     <option value="">Select benefit type</option>
//                     {benefitTypes.map((type) => (
//                       <option key={type.id} value={type.id}>
//                         {type.name}
//                       </option>
//                     ))}
//                   </CFormSelect>
//                 </CInputGroup>
//               </CModalBody>
//               <CModalFooter>
//                 <CButton color="secondary" onClick={() => setModalVisible(false)}>
//                   Close
//                 </CButton>
//                 <CButton color="primary" onClick={handleApplyToAll} disabled={loading}>
//                   {loading ? 'Processing...' : 'Submit'}
//                 </CButton>
//               </CModalFooter>
//             </CModal>
//           </CCardBody>
//         </CCard>
//       </CCol>
//     </CRow>
//   )
// }

// export default Benefits
