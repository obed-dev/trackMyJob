import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  id: string;
  date: string;
  title: string;
  company: string;
  location: string;
  status: string;
  notes: string;
  user: {
    _id: string;
    name: string;
  };
}

interface JobState {
  jobs: Job[];
}

const initialState: JobState = {
  jobs: [],
};

export const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
    },
    editJob: (state, action: PayloadAction<Job>) => {
      const index = state.jobs.findIndex((job) => job.id === action.payload.id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    deleteJob: (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((job) => job.id !== action.payload);
    },
  },
});

export const { setJobs, addJob, deleteJob , editJob } = jobSlice.actions;
export default jobSlice.reducer;