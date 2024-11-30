export const convertTo24HourFormat = (time) => {
  const [timeStr, modifier] = time.split(' ')
  const [hours, minutes] = timeStr.split(':').map((str) => parseInt(str))

  let newHours = hours
  if (modifier === 'PM' && newHours !== 12) {
    newHours += 12
  } else if (modifier === 'AM' && newHours === 12) {
    newHours = 0
  }

  const formattedHours = newHours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')

  return `${formattedHours}:${formattedMinutes}`
}

export const calculateTotalHoursWorked = (attendanceData) => {
  let totalHours = 0

  attendanceData.forEach((entry) => {
    // Check if the entry is marked as 'Present' and has valid time tracking
    if (
      entry.status === 'Present' &&
      entry.time_tracking &&
      entry.time_tracking.clock_in &&
      entry.time_tracking.clock_out
    ) {
      const { clock_in, clock_out } = entry.time_tracking

      try {
        // Convert 12-hour time format to 24-hour format
        const clockIn24 = convertTo24HourFormat(clock_in)
        const clockOut24 = convertTo24HourFormat(clock_out)

        // Convert times to Date objects in 24-hour format
        const startTime = new Date(`1970-01-01T${clockIn24}:00`)
        const endTime = new Date(`1970-01-01T${clockOut24}:00`)

        // Ensure the time conversion is valid
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.warn(`Invalid time data for ${entry.date}: ${clock_in} to ${clock_out}`)
          return
        }

        // Calculate the hours worked for the day
        const hoursWorked = (endTime - startTime) / (1000 * 60 * 60) // Convert milliseconds to hours
        totalHours += hoursWorked
      } catch (error) {
        console.error(`Error calculating hours for ${entry.date}:`, error)
      }
    }
  })

  return totalHours
}
