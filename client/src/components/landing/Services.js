import React from 'react'
import { CContainer, CRow, CCol } from '@coreui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShip, faRoute, faUser, faUserShield } from '@fortawesome/free-solid-svg-icons'

const Services = () => {
  // Define animation types as strings
  const fadeUp = 'fade-up'
  const zoomOutUp = 'zoom-out-up'

  return (
    <CContainer fluid className="h-100">
      <CRow className="h-100 justify-content-center align-items-center p-5">
        <CCol xs={12} lg={5} className="order-md-1 mb-4">
          <span data-aos={fadeUp}>OUR SERVICES</span>
          <h1 className="text-primary" data-aos={fadeUp}>
            We Provide Businesses with cutting-edge platform
          </h1>
          <p className="lead" data-aos={fadeUp}>
            With advanced cybersecurity measures in place, businesses can trust that their data is
            protected while simplifying the complexities of management. Experience seamless
            logistics and improved operational performance with our state-of-the-art platform.
          </p>
        </CCol>
        <CCol xs={12} lg={7} className="order-md-2 mb-4">
          <CRow xs={{ cols: 1, gutter: 4 }} md={{ cols: 2 }}>
            <CCol xs data-aos={zoomOutUp}>
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  icon={faShip}
                  className="fa-2x text-primary"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <h3>Freight Management</h3>
              <p>
                Optimize your logistics with our comprehensive freight management solutions,
                ensuring timely and cost-effective deliveries.
              </p>
            </CCol>

            <CCol xs data-aos={zoomOutUp}>
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  icon={faRoute}
                  className="fa-2x text-primary"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <h3>AI Powered Route</h3>
              <p>
                Leverage AI algorithms to determine the most efficient routes, reducing travel time
                and fuel costs.
              </p>
            </CCol>

            <CCol xs data-aos={zoomOutUp}>
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  icon={faUser}
                  className="fa-2x text-primary"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <h3>Real Time Customer Service</h3>
              <p>
                Experience unparalleled support with our real-time customer service, available 24/7.
              </p>
            </CCol>

            <CCol xs data-aos={zoomOutUp}>
              <div className="mb-2 d-inline-block rounded-pill bg-primary bg-opacity-25 p-3">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="fa-2x text-primary"
                  style={{ width: '40px', height: '40px' }}
                />
              </div>
              <h3>Advanced Cybersecurity Measures</h3>
              <p>Protect your data with state-of-the-art cybersecurity solutions.</p>
            </CCol>
          </CRow>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Services
