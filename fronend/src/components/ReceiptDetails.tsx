import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled
} from '@mui/material';
import { format } from 'date-fns';

const TotalRow = styled(TableRow)(({ theme }) => ({
  '& td, & th': {
    fontWeight: 700, 
    fontSize: '0.875rem',
  },
  '& td': {
    borderBottom: 'none',
    padding: theme.spacing(1.2),
  },
}));

const ItemRow = styled(TableRow)(({ theme }) => ({
  '&:last-child td, &:last-child th': {
    borderBottom: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '& td, & th': {
    padding: theme.spacing(1.5),
  },
}));

interface ReceiptItem {
  description: string;
  price: number;
  quantity: number;
  tax: number;
  amount: number;
}


interface ReceiptDetailsProps {
  data: {
  vendor_name: string;
  currency: string;
  date: string;
  amount: number;
  tax: number;
  receipt_items: ReceiptItem[];
  };
}

const ReceiptDetails: React.FC<ReceiptDetailsProps> = ({ data }) => {
  
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? dateString : format(date, 'PPP');
    } catch {
      return dateString;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Receipt Details
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1">
          <Box component="span" sx={{ fontWeight: 'bold' }}>Vendor Name:</Box> {data.vendor_name || 'Not detected'}
        </Typography>
        <Typography variant="subtitle1">
          <Box component="span" sx={{ fontWeight: 'bold' }}>Purchase Date:</Box> {formatDate(data.date) || 'Not detected'}
        </Typography>
        <Typography variant="subtitle1">
          <Box component="span" sx={{ fontWeight: 'bold' }}>Currency:</Box> {data.currency || 'Not detected'}
        </Typography>
        <Typography variant="subtitle1">
          <Box component="span" sx={{ fontWeight: 'bold' }}>Items count:</Box> {data.receipt_items.length}
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Item</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.receipt_items.map((item, index) => (
              <ItemRow key={index}>
                <TableCell>{item.description?item.description:'N/A'} ({item.quantity?item.quantity:0})</TableCell>
                <TableCell align="right">${item.price?.toFixed?.(2) ?? '0.00'}</TableCell>
              </ItemRow>
            ))}
            <TotalRow>
              <TableCell>Tax</TableCell>
              <TableCell align="right">${data.tax?data.tax:0}</TableCell>
            </TotalRow>
            <TotalRow>
              <TableCell>Total</TableCell>
              <TableCell align="right">${data.amount?.toFixed?.(2) ?? '0.00'}</TableCell>
            </TotalRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReceiptDetails;