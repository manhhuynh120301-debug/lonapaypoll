
export interface Employee {
  id: string;
  name: string;
  baseSalary: number;
}

export interface AttendanceInput {
  ngayCong: number;
  ngayPhep: number;
  ngoaiGioThuong: number;
  ngoaiGioChuNhat: number;
  ca3: number;
}

export interface CalculationResult {
  dailyRate: number;
  otWeekdayRate: number;
  otSundayRate: number;
  nightShiftRate: number;
  insurance: number;
  unionFee: number;
  amounts: {
    ngayCong: number;
    tienAn: number;
    ngayPhep: number;
    ngoaiGioThuong: number;
    ngoaiGioChuNhat: number;
    ca3: number;
  };
  totalIncome: number;
  netSalary: number;
}
