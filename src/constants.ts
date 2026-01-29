
import { Employee, AttendanceInput } from './types';

export const EMPLOYEES: Employee[] = [
  { id: 'manh', name: 'Mạnh Huỳnh', baseSalary: 8752485 },
  { id: 'loan', name: 'Thanh Loan', baseSalary: 7875000 },
];

export const INITIAL_ATTENDANCE: AttendanceInput = {
  ngayCong: 0,
  ngayPhep: 0,
  ngoaiGioThuong: 0,
  ngoaiGioChuNhat: 0,
  ca3: 0,
};

export const CONSTANTS = {
  SALARY_SUBTRACTOR: 2200000,
  WORKING_DAYS: 22,
  MEAL_ALLOWANCE_PER_DAY: 100000,
  INSURANCE_RATE: 0.105,
  UNION_RATE: 0.005,
  NIGHT_SHIFT_BONUS_RATE: 0.3,
  OT_WEEKDAY_MULTIPLIER: 1.5,
  OT_SUNDAY_MULTIPLIER: 2,
};
