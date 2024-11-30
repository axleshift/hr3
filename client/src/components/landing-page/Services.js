import React from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faClipboardList,
  faChartPie,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons'

const Services = () => {
  return (
    <CContainer fluid className="h-100">
      <CRow className="h-100 justify-content-center align-items-center p-5">
        <CCol xs={12} lg={5} className="order-md-1 mb-4">
          <span data-aos="fade-up">OUR SERVICES</span>
          <h1 className="text-primary" data-aos="fade-up">
            We Provide Businesses with Cutting-edge Platforms
          </h1>
          <p className="lead" data-aos="fade-up">
            We provide HR, payroll, benefits, and compliance management services for the freight
            industry. Our goal is to make your HR processes smooth and efficient, so you can focus
            on delivering great freight services.
          </p>
        </CCol>
        <CCol xs={12} lg={7} className="order-md-2 mb-4">
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }}>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faBriefcase}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Payroll Management</h3>
              <p>
                We handle all aspects of payroll, from calculating wages to managing bonuses and
                leave. Our system ensures accurate and timely payroll processing.
              </p>
            </CCol>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faClipboardList}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Benefits Administration</h3>
              <p>
                We manage health insurance, retirement plans, and other benefits. Our platform lets
                employees easily access and manage their benefits through a user-friendly portal,
                keeping them informed and satisfied.
              </p>
            </CCol>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faChartPie}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Compliance Management</h3>
              <p>
                We help you stay compliant with all relevant laws and regulations, reducing the risk
                of penalties. We keep you updated with the latest requirements and provide tools to
                manage compliance activities effectively.
              </p>
            </CCol>
            <CCol xs data-aos="zoom-out-up">
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  style={{ width: '40px', height: '40px' }}
                  icon={faHeadset}
                  className="fa-2x text-primary"
                />
              </div>
              <h3>Employee Portal</h3>
              <p>
                Our easy-to-use employee portal gives your workforce access to their personal
                information, payroll details, benefits, and more. Employees can update their payroll
                details, view pay slip, and manage benefits all in one place.
              </p>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Services
