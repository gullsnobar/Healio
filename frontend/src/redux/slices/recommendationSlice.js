import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationAPI } from '../../services/api/recommendationAPI';

export const fetchRecommendations = createAsyncThunk('recommendation/fetchAll', async () => (await recommendationAPI.getAll()).data);

const slice = createSlice({
  name: 'recommendation',
  initialState: { recommendations: [], insights: null, tips: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRecommendations.pending, (s) => { s.loading = true; })
     .addCase(fetchRecommendations.fulfilled, (s, a) => { s.loading = false; s.recommendations = a.payload.recommendations || []; s.insights = a.payload.insights; s.tips = a.payload.tips || []; });
  },
});
export default slice.reducer;
