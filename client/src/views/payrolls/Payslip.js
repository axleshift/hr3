import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Payslip = () => {
  const [payslips, setPayslips] = useState([])

  useEffect(() => {
    const fetchPayslips = async () => {
      const response = await axios.get('/api/payslips')
      setPayslips(response.data)
    }

    fetchPayslips()
  }, [])

  const downloadPayslip = (id) => {
    window.open(`/api/payslips/${id}/download`, '_blank')
  }

  return (
    <div>
      <h1>Your Payslips</h1>
      <ul>
        {payslips.map((payslip) => (
          <li key={payslip.id}>
            <span>Net Salary: {payslip.net_salary}</span>
            <button onClick={() => downloadPayslip(payslip.id)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Payslip

// import React, { useState } from 'react'
// import axios from 'axios'

// const Payslip = () => {
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState(null)

//   const handleDownloadPayslip = () => {
//     setLoading(true)
//     const token = localStorage.getItem('authToken')

//     axios
//       .get('https://localhost:8000/api/user/payslip', {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob', // Important to handle file download
//       })
//       .then((response) => {
//         const url = window.URL.createObjectURL(new Blob([response.data]))
//         const link = document.createElement('a')
//         link.href = url
//         link.setAttribute('download', 'payslip.pdf')
//         document.body.appendChild(link)
//         link.click()
//         setLoading(false)
//       })
//       .catch(() => {
//         setError('Failed to fetch payslip.')
//         setLoading(false)
//       })
//   }

//   return (
//     <div>
//       <h2>Payslip</h2>
//       <button onClick={handleDownloadPayslip} disabled={loading}>
//         {loading ? 'Downloading...' : 'Download Payslip'}
//       </button>
//       {error && <div>{error}</div>}
//     </div>
//   )
// }

// export default Payslip
