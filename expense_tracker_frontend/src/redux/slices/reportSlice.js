import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const API_URL = 'http://localhost:5000/api';

// Async thunk to fetch the monthly report
export const fetchMonthlyReport = createAsyncThunk(
  'report/fetchMonthlyReport',
  async ({ month, year }, { rejectWithValue }) => {
    const token = localStorage.getItem('token'); // Fetching JWT token from local storage

    try {
      const response = await axios.post(
        `${API_URL}/report/file`,
        { month, year }, // Sending month and year in the body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adding the token to the request headers
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchReportByMonthAndYear = createAsyncThunk(
  'report/fetchReportByMonthAndYear',
  async ({ month, year }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/report/report-file/email/pdf`, { month, year }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const fetchSummaryReport = createAsyncThunk(
  'report/fetchSummaryReport',
  async ({ month, year }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(`${API_URL}/report/report-file/email`, { month, year }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const downloadMonthlyReportPdf = createAsyncThunk(
  'report/downloadMonthlyReportPdf',
  async ({ month, year }, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${API_URL}/report/file/download`, // Ensure this points to the correct endpoint for generating the PDF
        { month, year },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Set content type if needed
          },
          responseType: 'blob', // Important for file download
        }
      );

      // Create a blob URL for the PDF file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `monthly_report_${month}_${year}.pdf`); // Set the file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data; // Return the data if needed for further processing
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Unknown error occurred');
    }
  }
);


const reportSlice = createSlice({
  name: 'report',
  initialState: {
    report: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetReport: (state) => {
      state.report = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMonthlyReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
        toast.success('Report fetched successfully!');
      })
      .addCase(fetchMonthlyReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch report';
        toast.error(state.error || 'Failed to fetch report');
      })
      .addCase(fetchReportByMonthAndYear.pending, (state) => {
        state.status = 'loading';
        toast.info("Sending Report as pdf to user registered mail")
      })
      .addCase(fetchReportByMonthAndYear.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        toast.success('Report sent as Pdf successfully to user registered mail!');
      })
      .addCase(fetchReportByMonthAndYear.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch report';
        toast.error(state.error || 'Failed to sent report');
      })
      .addCase(fetchSummaryReport.pending, (state) => {
        state.status = 'loading';
        toast.info("Sending Report as text to user registered mail");
      })
      .addCase(fetchSummaryReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
        toast.success('Report sent as text successfully to user registered mail!');
      })
      .addCase(fetchSummaryReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch summary report';
        toast.error(state.error || 'Failed to sent report');
      })
      .addCase(downloadMonthlyReportPdf.pending, (state) => {
        state.loading = true;
        state.error = null;
        toast.info("Downloading Report...");
      })
      .addCase(downloadMonthlyReportPdf.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload; 
        toast.success('Report downloaded successfully!');
      })
      .addCase(downloadMonthlyReportPdf.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to download report';
        toast.error(state.error || 'Failed to download report');
      });
  },
});

export const { resetReport } = reportSlice.actions;

export default reportSlice.reducer;
