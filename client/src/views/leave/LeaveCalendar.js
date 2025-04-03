import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormSelect,
  CSpinner,
  CBadge,
  CContainer,
  CWidgetStatsA,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import api from '../../util/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendar,
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faTimes,
} from '@fortawesome/free-solid-svg-icons'

const LeaveCalendar = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('dayGridMonth')
  const [statusCounts, setStatusCounts] = useState({
    approved: 0,
    pending: 0,
    rejected: 0,
  })
  const [selectedLeave, setSelectedLeave] = useState(null)
  const [leaveModalVisible, setLeaveModalVisible] = useState(false)

  const statusColors = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const [calendarResponse, approvedCount, pendingCount, rejectedCount] = await Promise.all([
          api.get('/leave/calendar'),
          api.get('/leave-requests/count/approved'),
          api.get('/leave-requests/count/pending'),
          api.get('/leave-requests/count/rejected'),
        ])

        const formattedEvents = calendarResponse.data.map((event) => ({
          ...event,
          extendedProps: {
            status: event.status,
            leave_type: event.leave_type,
            user_name: event.user_name,
            department: event.department,
            leave_id: event.id,
          },
        }))

        setStatusCounts({
          approved: approvedCount.data.count || 0,
          pending: pendingCount.data.count || 0,
          rejected: rejectedCount.data.count || 0,
        })

        setEvents(formattedEvents)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderEventContent = (eventInfo) => {
    return (
      <div className="fc-event-content">
        <strong>{eventInfo.event.title}</strong>
        <div className="fc-event-status">
          <CBadge color={statusColors[eventInfo.event.extendedProps.status] || 'primary'}>
            {eventInfo.event.extendedProps.status}
          </CBadge>
        </div>
      </div>
    )
  }

  const handleEventClick = async (clickInfo) => {
    try {
      const leaveId = clickInfo.event.extendedProps.leave_id
      const response = await api.get(`/leave-requests/${leaveId}`)

      if (response.data.leaveRequests && response.data.leaveRequests.length > 0) {
        setSelectedLeave(response.data.leaveRequests[0])
        setLeaveModalVisible(true)
      }
    } catch (error) {
      console.error('Error fetching leave details:', error)
    }
  }

  const formatDocuments = (documents) => {
    if (!documents) return []
    try {
      if (Array.isArray(documents)) return documents
      const parsed = JSON.parse(documents)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  return (
    <CContainer fluid>
      <CRow className="mb-4">
        <CCol xs={12} md={6} lg={3}>
          <CWidgetStatsA
            color="success"
            value={statusCounts.approved}
            title="Approved"
            icon={
              <div className="fs-4">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CWidgetStatsA
            color="warning"
            value={statusCounts.pending}
            title="Pending"
            icon={
              <div className="fs-4">
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CWidgetStatsA
            color="danger"
            value={statusCounts.rejected}
            title="Rejected"
            icon={
              <div className="fs-4">
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
            }
          />
        </CCol>
        <CCol xs={12} md={6} lg={3}>
          <CWidgetStatsA
            color="info"
            value={statusCounts.approved + statusCounts.pending + statusCounts.rejected}
            title="Total Leaves"
            icon={
              <div className="fs-4">
                <FontAwesomeIcon icon={faCalendar} />
              </div>
            }
          />
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h5>Leave Calendar</h5>
              <div className="d-flex gap-2">
                <CFormSelect
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  style={{ width: '150px' }}
                >
                  <option value="dayGridMonth">Month</option>
                  <option value="timeGridWeek">Week</option>
                  <option value="timeGridDay">Day</option>
                  <option value="listMonth">List</option>
                </CFormSelect>
              </div>
            </CCardHeader>
            <CCardBody>
              {loading ? (
                <div className="text-center">
                  <CSpinner color="primary" />
                  <p>Loading calendar data...</p>
                </div>
              ) : (
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                  initialView={view}
                  headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                  }}
                  events={events}
                  eventContent={renderEventContent}
                  height="70vh"
                  nowIndicator
                  eventClick={handleEventClick}
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Leave Details Modal */}
      <CModal visible={leaveModalVisible} onClose={() => setLeaveModalVisible(false)} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Leave Request Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedLeave ? (
            <div className="row">
              <div className="col-md-6">
                <p>
                  <strong>Employee:</strong> {selectedLeave.name}
                </p>
                <p>
                  <strong>Department:</strong> {selectedLeave.department}
                </p>
                <p>
                  <strong>Job Position:</strong> {selectedLeave.job_position}
                </p>
                <p>
                  <strong>Leave Type:</strong> {selectedLeave.leave_type}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>Duration:</strong>{' '}
                  {new Date(selectedLeave.start_date).toLocaleDateString()} -{' '}
                  {new Date(selectedLeave.end_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Total Days:</strong> {selectedLeave.total_days}
                </p>
                <p>
                  <strong>Status:</strong>
                  <CBadge
                    color={statusColors[selectedLeave.status.toLowerCase()] || 'primary'}
                    className="ms-2"
                  >
                    {selectedLeave.status}
                  </CBadge>
                </p>
                <p>
                  <strong>Paid Status:</strong>
                  <CBadge
                    color={selectedLeave.is_paid === 'Paid' ? 'success' : 'secondary'}
                    className="ms-2"
                  >
                    {selectedLeave.is_paid}
                  </CBadge>
                </p>
              </div>
              <div className="col-12 mt-3">
                <p>
                  <strong>Reason:</strong>
                </p>
                <p>{selectedLeave.reason}</p>
              </div>
              <div className="col-12 mt-3">
                <p>
                  <strong>Documents:</strong>
                </p>
                {formatDocuments(selectedLeave.document_path).length > 0 ? (
                  <div className="d-flex flex-wrap gap-2">
                    {formatDocuments(selectedLeave.document_path).map((doc, index) => {
                      const docName = doc.split('/').pop()
                      const isImage = /\.(jpg|jpeg|png|gif)$/i.test(docName)
                      return (
                        <div key={index} className="border p-2 rounded">
                          {isImage ? (
                            <img
                              src={`https://hr3.axleshift.com/storage/${doc}`}
                              alt={`Document ${index + 1}`}
                              style={{ maxWidth: '100px', maxHeight: '100px' }}
                              className="img-thumbnail"
                            />
                          ) : (
                            <a
                              href={`https://hr3.axleshift.com/storage/${doc}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="d-block"
                            >
                              {docName}
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p>No documents attached</p>
                )}
              </div>
            </div>
          ) : (
            <p>Loading leave details...</p>
          )}
        </CModalBody>
      </CModal>
    </CContainer>
  )
}

export default LeaveCalendar
