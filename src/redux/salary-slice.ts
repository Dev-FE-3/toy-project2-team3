import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalaryData } from '../pages/mypage/ui/salary-section';

interface SalaryState {
  availableSalaryDates: string[];
  selectedSalary: SalaryData | null;
}

const initialState: SalaryState = {
  availableSalaryDates: [],
  selectedSalary: null,
};

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    setAvailableSalaryDates: (state, action: PayloadAction<string[]>) => {
      state.availableSalaryDates = action.payload;
    },
    setSelectedSalary: (state, action: PayloadAction<SalaryData | null>) => {
      state.selectedSalary = action.payload;
    },
  },
});

export const { setAvailableSalaryDates, setSelectedSalary } =
  salarySlice.actions;
export default salarySlice.reducer;
