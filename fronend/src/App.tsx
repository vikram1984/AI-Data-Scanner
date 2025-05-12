import React, { useState } from 'react';
import {
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Typography,
  createTheme
} from '@mui/material';
import ReceiptUploader from './components/ReceiptUploader';
import ReceiptDetails  from './components/ReceiptDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface ReceiptData {
  vendor_name: string;
  currency: string;
  date: string;
  amount: number;
  tax: number;
  receipt_items: Array<{
    description: string;
    price: number;
    quantity: number;
    tax: number;
    amount: number;
  }>;
}


const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

const App: React.FC = () => {
  //console.log('App component rendering');
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);

  const handleProcessingComplete = (data: ReceiptData) => {
    setReceiptData(data);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom>
            AI Data Extractor v1
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Upload a receipt image to extract vendor, items, totals and other details. Use Google APIs for better accuracy.
          </Typography>
        </Box>

        <ReceiptUploader onProcessingComplete={handleProcessingComplete} />
        
        {receiptData && (
          <Box mt={4}>
            <ReceiptDetails data={receiptData} />
          </Box>
        )}

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Container>
    </ThemeProvider>
  );
};

export default App;