import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Paper,
  styled,
  useTheme
} from '@mui/material';
import { CloudUpload, Image } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

const DropzoneContainer = styled(Paper)(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  cursor: 'pointer',
  transition: theme.transitions.create('background-color'),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  textAlign: 'center',
}));

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

interface ReceiptUploaderProps {
  onProcessingComplete: (data: ReceiptData) => void;
}

const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onProcessingComplete }) => {
  const theme = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useGoogleVision, setUseGoogleVision] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1,
  });

  const processReceipt = async () => {
    if (!file) return;

    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      toast.success('Loading form data..');
      formData.append('file', file);
      formData.append('useGoogleVision', String(useGoogleVision));
      toast.success('API call for receipt processing..');
      //hardcoded url to be configured from env file
      const response = await axios.post('http://127.0.0.1:3000/api/extract-receipt-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success(response.data);
      onProcessingComplete(response.data);
      toast.success('Receipt processed successfully!');
    } catch (error) {
      console.error('Error processing receipt:', error);
      toast.error('Failed to process receipt. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Upload Receipt
      </Typography>
      
      <DropzoneContainer {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Typography>Drop the receipt image here...</Typography>
        ) : (
          <>
            <CloudUpload fontSize="large" />
            <Typography>
              Drag & drop a receipt image here, or click to select
            </Typography>
            <Typography variant="caption" component="div">
              (Supports JPEG, JPG, PNG)
            </Typography>
          </>
        )}
      </DropzoneContainer>

      {preview && (
        <Box textAlign="center" mt={2}>
          <Typography variant="subtitle1">Preview:</Typography>
          <Typography variant="subtitle2">File: { file?.name} - { file?.type} ({(file?.size?file?.size:0)*0.001} KB)</Typography>
          <Box
            component="img"
            src={preview}
            alt="Receipt preview"
            sx={{
              maxWidth: '100%',
              maxHeight: 300,
              mt: 2,
              borderRadius: 1,
              boxShadow: 1,
            }}
          />
        </Box>
      )}

      <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
        <input
          type="checkbox"
          id="useGoogleVision"
          checked={useGoogleVision}
          onChange={(e) => setUseGoogleVision(e.target.checked)}
        />
        <label htmlFor="useGoogleVision" style={{ marginLeft: theme.spacing(1) }}>
          Use Google Vision API (more accurate)
        </label>
      </Box>

      <Box textAlign="center" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={processReceipt}
          disabled={!file || isProcessing}
          startIcon={isProcessing ? <CircularProgress size={20} /> : <Image />}
          sx={{
            px: 4,
            py: 1.5,
          }}
        >
          {isProcessing ? 'Processing...' : 'Process Receipt'}
        </Button>
      </Box>
    </Paper>
  );
};

export default ReceiptUploader;