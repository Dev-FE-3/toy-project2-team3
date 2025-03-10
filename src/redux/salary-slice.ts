import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SalaryState {
  availableSalaryDates: string[];
}

const initialState: SalaryState = {
  availableSalaryDates: [],
};

const salarySlice = createSlice({
  name: 'salary',
  initialState,
  reducers: {
    setAvailableSalaryDates: (state, action: PayloadAction<string[]>) => {
      state.availableSalaryDates = action.payload;
    },
  },
});

export const { setAvailableSalaryDates } = salarySlice.actions;
export default salarySlice.reducer;
