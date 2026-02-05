const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:3000';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testHealth() {
  log('\n--- Health Check ---', colors.cyan);
  const response = await axios.get(`${BASE_URL}/health`);
  log(`Status: ${response.status}`);
  log(`Response: ${JSON.stringify(response.data)}`);
  return response.status === 200;
}

async function testUserRegistration() {
  log('\n--- User Registration ---', colors.cyan);
  const userData = {
    name: 'QA Test User',
    email: `qa${Date.now()}@test.com`,
    password: 'test123456'
  };
  
  const response = await axios.post(`${BASE_URL}/users`, userData);
  log(`Status: ${response.status}`);
  log(`User created: ${response.data.email}`);
  return { success: response.status === 201, email: userData.email, password: userData.password };
}

async function testLogin(email, password) {
  log('\n--- User Login ---', colors.cyan);
  const response = await axios.post(`${BASE_URL}/sessions`, { email, password });
  log(`Status: ${response.status}`);
  log(`Token received: ${response.data.token.substring(0, 20)}...`);
  return { success: response.status === 200, token: response.data.token };
}

async function testCreateTask(token) {
  log('\n--- Create Task ---', colors.cyan);
  const taskData = {
    title: 'QA Test Task',
    description: 'Automated test task',
    status: 'PENDING'
  };
  
  const response = await axios.post(`${BASE_URL}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  log(`Status: ${response.status}`);
  log(`Task created: ${response.data.title}`);
  return { success: response.status === 201, taskId: response.data.id };
}

async function testListTasks(token) {
  log('\n--- List Tasks ---', colors.cyan);
  const response = await axios.get(`${BASE_URL}/tasks`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  log(`Status: ${response.status}`);
  log(`Tasks found: ${response.data.length}`);
  return response.status === 200;
}

async function testUpdateTask(token, taskId) {
  log('\n--- Update Task ---', colors.cyan);
  const response = await axios.put(`${BASE_URL}/tasks/${taskId}`, 
    { status: 'COMPLETED' },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  log(`Status: ${response.status}`);
  log(`Task updated to: ${response.data.status}`);
  return response.status === 200;
}

async function testFilterByStatus(token) {
  log('\n--- Filter Tasks by Status ---', colors.cyan);
  const response = await axios.get(`${BASE_URL}/tasks?status=COMPLETED`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  log(`Status: ${response.status}`);
  log(`Completed tasks: ${response.data.length}`);
  return response.status === 200;
}

async function testDeleteTask(token, taskId) {
  log('\n--- Delete Task ---', colors.cyan);
  const response = await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  log(`Status: ${response.status}`);
  log('Task deleted successfully');
  return response.status === 204;
}

async function testValidationError() {
  log('\n--- Validation Error Test ---', colors.cyan);
  try {
    await axios.post(`${BASE_URL}/users`, { name: 'Test' });
  } catch (error) {
    log(`Status: ${error.response.status}`);
    log(`Error: ${error.response.data.error}`);
    return error.response.status === 400;
  }
  return false;
}

async function testUnauthorizedAccess() {
  log('\n--- Unauthorized Access Test ---', colors.cyan);
  try {
    await axios.get(`${BASE_URL}/tasks`);
  } catch (error) {
    log(`Status: ${error.response.status}`);
    log(`Error: ${error.response.data.error}`);
    return error.response.status === 401;
  }
  return false;
}

async function runTests() {
  log('='.repeat(50), colors.yellow);
  log('Starting API QA Tests', colors.yellow);
  log('='.repeat(50), colors.yellow);

  const results = [];
  let token, taskId, userEmail, userPassword;

  try {
    results.push({ name: 'Health Check', passed: await testHealth() });
    
    const regResult = await testUserRegistration();
    results.push({ name: 'User Registration', passed: regResult.success });
    userEmail = regResult.email;
    userPassword = regResult.password;

    const loginResult = await testLogin(userEmail, userPassword);
    results.push({ name: 'User Login', passed: loginResult.success });
    token = loginResult.token;

    const createResult = await testCreateTask(token);
    results.push({ name: 'Create Task', passed: createResult.success });
    taskId = createResult.taskId;

    results.push({ name: 'List Tasks', passed: await testListTasks(token) });
    results.push({ name: 'Update Task', passed: await testUpdateTask(token, taskId) });
    results.push({ name: 'Filter Tasks', passed: await testFilterByStatus(token) });
    results.push({ name: 'Delete Task', passed: await testDeleteTask(token, taskId) });
    results.push({ name: 'Validation Error', passed: await testValidationError() });
    results.push({ name: 'Unauthorized Access', passed: await testUnauthorizedAccess() });

  } catch (error) {
    log(`\nTest failed with error: ${error.message}`, colors.red);
    if (error.response) {
      log(`Response: ${JSON.stringify(error.response.data)}`, colors.red);
    }
  }

  log('\n' + '='.repeat(50), colors.yellow);
  log('Test Results Summary', colors.yellow);
  log('='.repeat(50), colors.yellow);

  results.forEach(result => {
    const icon = result.passed ? '✓' : '✗';
    const color = result.passed ? colors.green : colors.red;
    log(`${icon} ${result.name}`, color);
  });

  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  log('\n' + '='.repeat(50), colors.yellow);
  log(`Total: ${passed}/${total} tests passed`, passed === total ? colors.green : colors.red);
  log('='.repeat(50), colors.yellow);

  process.exit(passed === total ? 0 : 1);
}

runTests();
