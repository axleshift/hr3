<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payroll extends Model
{
    use HasFactory;
    protected $table = 'payrolls';

    protected $fillable = [
        'employeeId',
        'firstName',
        'lastName',
        'middleName',
        'department',
        'position',
        'base_salary',
        'daily_rate',
        'gross_salary',
        'leave_conversion',
        'net_salary',
        'total_regular_hours',
        'total_overtime_hours',
        'total_late_hours',
        'total_undertime_hours',
        'total_overtime_amount',
        'year',
        'working_days',
        'monthly_rate',
        'period',
        'month',
        'tax',
        'bonus',
        'deduction',
        'benefits_total',
        'paid_leave_amount',
        // 'pay_period',
        'status',
        'user_id',
        'start_date',
        'end_date',
        'days_worked',
        'month',
        'year',
        'leave_conversion_earnings',
    ];

    public function payslip()
    {
        return $this->belongsTo(Payslip::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class, 'employee_id', 'employee_id');
    }

    public function calculatePayroll()
    {
        $baseSalary = $this->base_salary;
        $dailyRate = $baseSalary / 30; // Assuming 30-day month
        
        // Get leave conversion if not already set
        if (empty($this->leave_conversion)) {
            $this->calculateLeaveConversion();
        }
        
        $earnings = $this->earnings ?? [];
        $deductions = $this->deductions ?? [];
        
        // Sum all earnings
        $totalEarnings = array_reduce($earnings, function($carry, $item) {
            return $carry + $item['amount'];
        }, 0);
        
        // Sum all deductions
        $totalDeductions = array_reduce($deductions, function($carry, $item) {
            return $carry + $item['amount'];
        }, 0);
        
        $this->net_pay = $baseSalary + $totalEarnings - $totalDeductions;
        $this->save();
        
        return $this;
    }
    
    protected function calculateLeaveConversion()
    {
        $employee = $this->employee;
        $year = $this->year;
        $month = $this->month;
        
        $leaveEntitlement = 15; // Default leave entitlement
            
        // Get used leave days in the month
        $usedLeaveDays = LeaveRequest::where('user_id', $employee->user_id)
            ->where('status', 'Approved')
            ->whereYear('start_date', $year)
            ->whereMonth('start_date', $month)
            ->sum('total_days');

        // Calculate unused leave days
        $unusedLeaveDays = max(0, $leaveEntitlement - $usedLeaveDays);

        if ($unusedLeaveDays > 0) {
            $dailyRate = $this->base_salary / 30; // Assuming 30-day month
            $leaveConversionAmount = $unusedLeaveDays * $dailyRate;
            
            $this->leave_conversion = $leaveConversionAmount;
            
            $earnings = $this->earnings ?? [];
            
            // Remove any existing leave conversion entry
            $earnings = array_filter($earnings, function($item) {
                return ($item['type'] ?? null) !== 'leave_conversion';
            });
            
            // Add new leave conversion entry
            $earnings[] = [
                'description' => "Unused Leave Conversion ($unusedLeaveDays days)",
                'amount' => $leaveConversionAmount,
                'type' => 'leave_conversion'
            ];
            
            $this->earnings = $earnings;
            $this->save();
        }
        
        return $this;
    }
}