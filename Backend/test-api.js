/**
 * Simple API test script
 * Run this after starting the server to test basic functionality
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';
let authToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  role: 'invoicing_user'
};

const testCustomer = {
  name: 'Test Customer',
  contact_email: 'customer@example.com',
  address: '123 Test Street, Test City'
};

const testProduct = {
  name: 'Test Product',
  description: 'A test product',
  price: 99.99
};

const testInvoice = {
  customer_id: 1,
  issue_date: '2024-01-01',
  due_date: '2024-01-31',
  status: 'draft',
  items: [
    {
      product_id: 1,
      quantity: 2,
      unit_price: 99.99
    }
  ]
};

async function makeRequest(method, url, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message,
      status: error.response?.status || 500
    };
  }
}

async function runTests() {
  console.log('🧪 Starting API Tests...\n');
  
  // Test 1: Health Check
  console.log('1. Testing health check...');
  const healthCheck = await makeRequest('GET', '/health');
  console.log(healthCheck.success ? '✅ Health check passed' : '❌ Health check failed');
  console.log('Response:', healthCheck.data || healthCheck.error);
  console.log('');
  
  // Test 2: Register User
  console.log('2. Testing user registration...');
  const registerResult = await makeRequest('POST', '/auth/register', testUser);
  console.log(registerResult.success ? '✅ User registration passed' : '❌ User registration failed');
  if (registerResult.success) {
    authToken = registerResult.data.data.token;
    console.log('Auth token received');
  } else {
    console.log('Error:', registerResult.error);
  }
  console.log('');
  
  // Test 3: Login
  console.log('3. Testing user login...');
  const loginResult = await makeRequest('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  console.log(loginResult.success ? '✅ User login passed' : '❌ User login failed');
  if (loginResult.success) {
    authToken = loginResult.data.data.token;
  }
  console.log('');
  
  if (!authToken) {
    console.log('❌ Cannot continue tests without authentication token');
    return;
  }
  
  const authHeaders = { Authorization: `Bearer ${authToken}` };
  
  // Test 4: Create Customer
  console.log('4. Testing customer creation...');
  const customerResult = await makeRequest('POST', '/customers', testCustomer, authHeaders);
  console.log(customerResult.success ? '✅ Customer creation passed' : '❌ Customer creation failed');
  console.log('');
  
  // Test 5: Create Product
  console.log('5. Testing product creation...');
  const productResult = await makeRequest('POST', '/products', testProduct, authHeaders);
  console.log(productResult.success ? '✅ Product creation passed' : '❌ Product creation failed');
  console.log('');
  
  // Test 6: Create Invoice
  console.log('6. Testing invoice creation...');
  const invoiceResult = await makeRequest('POST', '/invoices', testInvoice, authHeaders);
  console.log(invoiceResult.success ? '✅ Invoice creation passed' : '❌ Invoice creation failed');
  console.log('');
  
  // Test 7: Get Sales Summary
  console.log('7. Testing sales summary report...');
  const reportResult = await makeRequest('GET', '/reports/sales-summary', null, authHeaders);
  console.log(reportResult.success ? '✅ Sales summary report passed' : '❌ Sales summary report failed');
  console.log('');
  
  console.log('🎉 API tests completed!');
}

// Check if axios is available
try {
  require.resolve('axios');
  runTests().catch(console.error);
} catch (error) {
  console.log('❌ axios not found. Please install it first:');
  console.log('   npm install axios');
  console.log('   Then run: node test-api.js');
}


