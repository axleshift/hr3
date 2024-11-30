export const checkCompliance = (benefitType) => {
  const legalBenefits = ['Health_insurance', 'Retirement_plan', 'Paid Time Off', 'Life Insurance']

  if (legalBenefits.includes(benefitType)) {
    return 'Approved by Compliance as it meets legal requirements.'
  }
  return 'Not approved by Compliance; does not meet legal requirements.'
}
