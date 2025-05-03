import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CCol,
  CRow,
  CFormSelect,
  CInputGroup,
  CFormInput,
  CInputGroupText,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormCheck,
  CFormLabel,
  CSpinner,
  CTooltip,
  CPagination,
  CPaginationItem,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react'
import api from '../../util/api'
import CIcon from '@coreui/icons-react'
import { cilFilter, cilPlus, cilInfo, cilSearch } from '@coreui/icons'

const LeaveBalances = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()

  const [balances, setBalances] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const [toasts, setToasts] = useState([])
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [filter, setFilter] = useState({
    employeeId: '',
    year: currentYear,
    page: 1,
    per_page: 10,
  })
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [employees, setEmployees] = useState([])

  const [allocationData, setAllocationData] = useState({
    days: 15,
    year: currentYear,
    employeeIds: [],
    convert_to_earnings: true,
    conversion_rate: 100,
  })

  const handleSearchChange = (e) => {
    const { name, value } = e.target

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Set new timeout
    setSearchTimeout(
      setTimeout(() => {
        setFilter((prev) => ({ ...prev, [name]: value, page: 1 }))
      }, 500), // 500ms delay
    )
  }

  const showToast = (message, color) => {
    const id = Date.now()
    const newToast = (
      <CToast key={id} autohide={true} delay={5000} color={color} visible={true}>
        <CToastHeader closeButton>
          <strong className="me-auto">Notification</strong>
        </CToastHeader>
        <CToastBody>{message}</CToastBody>
      </CToast>
    )

    setToasts((prev) => [...prev, newToast])

    // Auto-remove toast after delay
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.key !== id.toString()))
    }, 5000)
  }

  useEffect(() => {
    fetchLeaveBalances()
    fetchEmployees()
  }, [filter])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const response = await fetch('https://backend-hr1.axleshift.com/api/employees')
      if (!response.ok) {
        throw new Error('Failed to fetch employees')
      }
      const data = await response.json()
      setEmployees(data.data || data)
      showToast('Employee data loaded successfully', 'success')
    } catch (error) {
      console.error('Error fetching employees:', error)
      showToast('Failed to load employee data', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setAllocationData({
      days: 15,
      year: currentYear,
      employeeIds: [],
      convert_to_earnings: true,
      conversion_rate: 100,
    })
    setSelectedEmployees([])
  }

  const handleAllocateLeave = async () => {
    try {
      setLoading(true)
      const payload = {
        ...allocationData,
        employeeIds:
          selectedEmployees.length > 0 ? selectedEmployees : employees.map((emp) => emp.employeeId),
      }

      if (payload.employeeIds.length === 0) {
        showToast('Please select at least one employee', 'warning')
        return
      }

      const response = await api.post('/leave-balances', payload)
      fetchLeaveBalances()
      setModalVisible(false)
      showToast('Leave days allocated successfully!', 'success')
      handleModalClose()
    } catch (error) {
      console.error('Error allocating leave:', error)
      showToast(
        error.response?.data?.message || 'Failed to allocate leave days. Please try again.',
        'danger',
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAllocationChange = (e) => {
    const { name, value, type, checked } = e.target
    setAllocationData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const fetchLeaveBalances = async () => {
    try {
      setLoading(true)
      const params = {
        year: currentYear,
        employeeId: filter.employeeId,
        page: filter.page,
        per_page: filter.per_page,
      }
      const response = await api.get('/leave-balances', { params })
      setBalances(response.data.data || response.data)
      setTotalRecords(response.data.total || response.data.length)
      showToast('Leave balances loaded successfully', 'success')
    } catch (error) {
      console.error('Error fetching leave balances:', error)
      showToast('Failed to load leave balances. Please try again.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilter((prev) => ({ ...prev, [name]: value, page: 1 }))

    if (name !== 'employeeId') {
      showToast(`Filter updated: ${name} = ${value}`, 'info')
    }
  }

  const handlePageChange = (page) => {
    setFilter((prev) => ({ ...prev, page }))
    showToast(`Viewing page ${page} of ${totalPages}`, 'info')
  }

  // const handleEmployeeSelect = (employeeId) => {
  //   setSelectedEmployees((prev) =>
  //     prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
  //   )
  //   showToast(
  //     `Employee ${prev.includes(employeeId) ? 'removed from' : 'added to'} selection`,
  //     'info',
  //   )
  // }

  // const handleSelectAll = (e) => {
  //   if (e.target.checked) {
  //     setSelectedEmployees(employees.map((emp) => emp.employeeId))
  //     showToast('All employees selected', 'info')
  //   } else {
  //     setSelectedEmployees([])
  //     showToast('Selection cleared', 'info')
  //   }
  // }

  const handleResetFilters = () => {
    setFilter({
      employeeId: '',
      year: currentYear,
      page: 1,
      per_page: 10,
    })
    showToast('Filters reset to default', 'info')
  }

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
  const totalPages = Math.ceil(totalRecords / filter.per_page)

  return (
    <div>
      <CToaster placement="top-end">{toasts}</CToaster>

      {loading && (
        <div className="loading-overlay">
          <CSpinner color="primary" variant="grow" />
        </div>
      )}

      <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-0">Employee Leave Balances</h4>
            <small className="text-medium-emphasis">Showing {filter.year} data</small>
          </div>
          <CButton
            color="primary"
            onClick={() => setModalVisible(true)}
            className="d-flex align-items-center"
          >
            <CIcon icon={cilPlus} className="me-2" />
          </CButton>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-4 g-3">
            {/* <CCol md={3}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilFilter} />
                </CInputGroupText>
                <CFormSelect
                  name="year"
                  value={filter.year}
                  onChange={handleFilterChange}
                  aria-label="Filter by year"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </CFormSelect>
              </CInputGroup>
            </CCol> */}

            {/* <CCol md={4}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput
                  name="employeeId"
                  placeholder="Search.."
                  value={filter.employeeId}
                  onChange={handleSearchChange}
                  aria-label="Search employees"
                />
              </CInputGroup>
            </CCol> */}
          </CRow>

          {balances.length === 0 ? (
            <div className="text-center py-5">
              <h5>No leave balances found</h5>
              <p>Try adjusting your filters or allocate leave days to employees</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <CTable striped hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Employee ID</CTableHeaderCell>
                      <CTableHeaderCell>Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Allocated Days</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Used Days</CTableHeaderCell>
                      <CTableHeaderCell className="text-end">Remaining Days</CTableHeaderCell>
                      <CTableHeaderCell>Convertible</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {balances.map((balance) => (
                      <CTableRow key={balance.id}>
                        <CTableDataCell>{balance.employeeId}</CTableDataCell>
                        <CTableDataCell>
                          {[balance.firstName, balance.middleName, balance.lastName]
                            .filter(Boolean)
                            .join(' ')}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          {balance.allocated_days}
                        </CTableDataCell>
                        <CTableDataCell className="text-end">{balance.used_days}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <strong
                            className={balance.remaining_days < 3 ? 'text-warning' : 'text-success'}
                          >
                            {balance.remaining_days}
                          </strong>
                        </CTableDataCell>
                        <CTableDataCell>
                          <CTooltip
                            content={
                              balance.convert_to_earnings
                                ? `Unused days will be converted at ${balance.conversion_rate}% of daily rate`
                                : 'Not convertible to earnings'
                            }
                          >
                            <CBadge color={balance.convert_to_earnings ? 'success' : 'secondary'}>
                              {balance.convert_to_earnings ? 'Yes' : 'No'}
                            </CBadge>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <CPagination>
                    <CPaginationItem
                      disabled={filter.page === 1}
                      onClick={() => handlePageChange(filter.page - 1)}
                    >
                      Previous
                    </CPaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <CPaginationItem
                        key={page}
                        active={page === filter.page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </CPaginationItem>
                    ))}
                    <CPaginationItem
                      disabled={filter.page === totalPages}
                      onClick={() => handlePageChange(filter.page + 1)}
                    >
                      Next
                    </CPaginationItem>
                  </CPagination>
                </div>
              )}
            </>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={modalVisible} onClose={handleModalClose} size="lg" backdrop="static">
        <CModalHeader closeButton>
          <CModalTitle>Allocate Leave Days</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CRow className="mb-3">
              <CCol md={6}>
                <CFormLabel>Days to Allocate *</CFormLabel>
                <CFormInput
                  type="number"
                  name="days"
                  value={allocationData.days}
                  onChange={handleAllocationChange}
                  min="1"
                  placeholder="Enter number of days"
                  required
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Year *</CFormLabel>
                <CFormSelect
                  name="year"
                  value={allocationData.year}
                  onChange={handleAllocationChange}
                  required
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow className="mb-3">
              <CCol md={6} className="d-flex align-items-end">
                <CFormCheck
                  name="convert_to_earnings"
                  label="Convert unused leave to earnings"
                  checked={allocationData.convert_to_earnings}
                  onChange={handleAllocationChange}
                  className="mt-3"
                />
              </CCol>
            </CRow>

            {allocationData.convert_to_earnings && (
              <CRow className="mb-4">
                <CCol md={6}>
                  <CFormLabel>Conversion Rate (% of daily rate)</CFormLabel>
                  <CFormInput
                    type="number"
                    name="conversion_rate"
                    value={allocationData.conversion_rate}
                    onChange={handleAllocationChange}
                    min="0"
                    max="100"
                    placeholder="Enter percentage"
                  />
                </CCol>
                <CCol md={6} className="d-flex align-items-end">
                  <small className="text-medium-emphasis">
                    Example: 100% means full daily rate per unused leave day
                  </small>
                </CCol>
              </CRow>
            )}
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleModalClose}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAllocateLeave} disabled={loading}>
            {loading ? <CSpinner size="sm" /> : 'Allocate Leave Days'}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default LeaveBalances
