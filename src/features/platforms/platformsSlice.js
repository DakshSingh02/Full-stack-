import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 'p1', name: 'Twitter / X', maxChars: 280 },
    { id: 'p2', name: 'LinkedIn', maxChars: 3000 },
    { id: 'p3', name: 'Instagram', maxChars: 2200 },
    { id: 'p4', name: 'Facebook', maxChars: 63206 },
  ],
  selectedPlatformId: 'p4', // Default to Facebook
};

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    setSelectedPlatform: (state, action) => {
      state.selectedPlatformId = action.payload;
    },
  },
});

export const { setSelectedPlatform } = platformsSlice.actions;
export const selectAllPlatforms = (state) => state.platforms.list;
export const selectSelectedPlatformId = (state) => state.platforms.selectedPlatformId;

export default platformsSlice.reducer;