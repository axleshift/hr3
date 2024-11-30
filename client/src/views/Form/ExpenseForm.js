import React, { useState } from 'react'
import { CButton, CForm, CFormGroup, CLabel, CInput, CCol } from '@coreui/react'

const ExpenseForm = () => {
  const [expenseData, setExpenseData] = useState({
    expenseType: '',
    amount: '',
    date: '',
    description: '',
    receipt: null,
  })

  const handleChange = (e) => {
    setExpenseData({ ...expenseData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setExpenseData({ ...expenseData, receipt: e.target.files[0] })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prepare FormData to send file and other data
    const formData = new FormData()
    formData.append('expenseType', expenseData.expenseType)
    formData.append('amount', expenseData.amount)
    formData.append('date', expenseData.date)
    formData.append('description', expenseData.description)
    if (expenseData.receipt) {
      formData.append('receipt', expenseData.receipt)
    }

    // Call the API to submit expense data
    console.log('Form Submitted:', expenseData)
    // Example of using axios to send data
    // axios.post('/api/expenses', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }

  return (
    <CForm onSubmit={handleSubmit}>
      <CFormGroup row>
        <CLabel htmlFor="expenseType" sm={2}>
          Expense Type
        </CLabel>
        <CCol sm={10}>
          <CInput
            type="text"
            name="expenseType"
            id="expenseType"
            value={expenseData.expenseType}
            onChange={handleChange}
            required
          />
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CLabel htmlFor="amount" sm={2}>
          Amount
        </CLabel>
        <CCol sm={10}>
          <CInput
            type="number"
            name="amount"
            id="amount"
            value={expenseData.amount}
            onChange={handleChange}
            required
          />
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CLabel htmlFor="date" sm={2}>
          Date
        </CLabel>
        <CCol sm={10}>
          <CInput
            type="date"
            name="date"
            id="date"
            value={expenseData.date}
            onChange={handleChange}
            required
          />
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CLabel htmlFor="description" sm={2}>
          Description
        </CLabel>
        <CCol sm={10}>
          <CInput
            type="text"
            name="description"
            id="description"
            value={expenseData.description}
            onChange={handleChange}
            required
          />
        </CCol>
      </CFormGroup>

      <CFormGroup row>
        <CLabel htmlFor="receipt" sm={2}>
          Receipt
        </CLabel>
        <CCol sm={10}>
          <CInput type="file" name="receipt" id="receipt" onChange={handleFileChange} required />
        </CCol>
      </CFormGroup>

      <CButton type="submit" color="primary">
        Submit
      </CButton>
    </CForm>
  )
}

export default ExpenseForm
