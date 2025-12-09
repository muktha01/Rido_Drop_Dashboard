// Test file to verify all API imports work correctly
console.log('Testing API imports...');

try {
  // Test config imports
  import { API_CONFIG } from './config.js';
  import API_CONFIG_DEFAULT from './config.js';
  
  console.log('✅ API_CONFIG named export:', API_CONFIG ? 'OK' : 'FAILED');
  console.log('✅ API_CONFIG default export:', API_CONFIG_DEFAULT ? 'OK' : 'FAILED');
  
  // Test adminApi imports
  import { adminApi } from './adminApi.js';
  console.log('✅ adminApi export:', adminApi ? 'OK' : 'FAILED');
  
  console.log('All imports successful!');
} catch (error) {
  console.error('❌ Import error:', error.message);
}
