import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Alert, 
  Box,
  CircularProgress 
} from '@mui/material';
import { runFullConnectionTest } from '../../api/testConnection';

const ApiTestComponent = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState(null);

  const handleTestConnection = async () => {
    setTesting(true);
    setResults(null);
    
    try {
      const testResults = await runFullConnectionTest();
      setResults(testResults);
    } catch (error) {
      setResults({
        health: { success: false, error: error.message },
        customer: { success: false, error: error.message }
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          API Connection Test
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleTestConnection}
            disabled={testing}
            startIcon={testing && <CircularProgress size={20} />}
          >
            {testing ? 'Testing...' : 'Test API Connection'}
          </Button>
        </Box>

        {results && (
          <Box>
            <Alert 
              severity={results.health.success ? 'success' : 'error'} 
              sx={{ mb: 1 }}
            >
              Health Endpoint: {results.health.success ? '✅ Connected' : '❌ Failed'}
              {!results.health.success && ` - ${results.health.error}`}
            </Alert>
            
            <Alert 
              severity={results.customer.success ? 'success' : 'warning'} 
              sx={{ mb: 1 }}
            >
              Customer API: {results.customer.success ? '✅ Working' : '⚠️ Issues'}
              {!results.customer.success && ` - ${results.customer.error}`}
            </Alert>

            {!results.health.success && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Troubleshooting:</Typography>
                <Typography variant="body2">
                  • Check if backend server is running on port 5000<br/>
                  • Verify MongoDB connection<br/>
                  • Check firewall/antivirus settings<br/>
                  • Ensure CORS is properly configured
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTestComponent;
