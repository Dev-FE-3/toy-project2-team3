import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SalaryData } from '../pages/mypage/ui/salary-section';

interface SalaryState {
  selectedSalary: SalaryData | null;
}

const initialState: SalaryState = {
  selectedSalary: null,
};

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    setSelectedSalary: (state, action: PayloadAction<SalaryData>) => {
      state.selectedSalary = action.payload;
    },
    clearSelectedSalary: (state) => {
      state.selectedSalary = null;
    },
  },
});

export const { setSelectedSalary, clearSelectedSalary } = salarySlice.actions;
export default salarySlice.reducer;
