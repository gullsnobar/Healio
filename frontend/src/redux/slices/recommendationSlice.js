import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recommendationAPI } from '../../services/api/recommendationAPI';

export const fetchRecommendations = createAsyncThunk('recommendation/fetchAll', async () => (await recommendationAPI.getAll()).data);

const slice = createSlice({
  name: 'recommendation',
  initialState: { recommendations: [], insights: null, tips: [], loading: false },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRecommendations.pending, (s) => { s.loading = true; })
<<<<<<< HEAD
      .addCase(fetchRecommendations.fulfilled, (s, a) => { s.loading = false; s.recommendations = a.payload.recommendations || []; s.insights = a.payload.insights; s.tips = a.payload.tips || []; });
=======
     .addCase(fetchRecommendations.fulfilled, (s, a) => { s.loading = false; const payload = a.payload || {}; s.recommendations = payload.recommendations || []; s.insights = payload.insights || null; s.tips = payload.tips || []; });
>>>>>>> origin/rabail-dev2
  },
});
export default slice.reducer;
