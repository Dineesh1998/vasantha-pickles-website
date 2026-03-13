fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'test', email: 'test@test.com', password: 'password123' })
}).then(r => r.json()).then(console.log).catch(console.error);
