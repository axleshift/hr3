import React from 'react'
import { CContainer, CRow, CCol, CImage } from '@coreui/react'

const About = () => {
  return (
    <CContainer fluid className="h-100 p-5 bg-primary shadow" data-aos="fade-up">
      <CRow className="h-100 justify-content-start align-items-center">
        <CCol xs={12} md={5} className="mb-4" data-aos="zoom-in">
          <CImage fluid src="/images/about.svg" />
        </CCol>
        <CCol xs={12} md={7} lg={6} xl={5} className="mb-4 p-2">
          <span className="text-white" data-aos="zoom-out-up">
            ABOUT US
          </span>
          <h1 className="text-white" data-aos="zoom-out-up">
            Axleshift HR 3
          </h1>
          <p className="lead text-white" data-aos="zoom-out-up">
            We specialize in transforming HR management for the freight industry with tailored
            solutions that enhance efficiency and engagement. Our innovative services streamline
            payroll, benefits, and compliance, while our user-friendly portal empowers employees. By
            turning HR into a strategic asset, we help you navigate industry challenges and focus on
            delivering excellence in your operations.
          </p>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default About
