import { Routes, Route } from 'react-router-dom';

import Client from './components/Client';
import { useState } from 'react';
import Dashboard from './components/Dashboard';
const updateDocStatus = (status) => {
  fetch('http://localhost:3001/update-doctor', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: !status }),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Doctor status updated successfully');
      } else {
        console.log('Failed to update doctor status');
      }
    })
    .catch((error) => console.error(error));
}
const updateToken = (token, status, last) => {
  if (status && token < last) {
    fetch('http://localhost:3001/update-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token + 1 }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Token updated successfully');
        } else {
          console.log('Failed to update token');
        }
      })
      .catch((error) => console.error(error));
  }
};

function App() {
  const [state, setState] = useState({ token: 0, status: false });
  const onStateChange = (s) => {
    setState(s);
  }
  return (
    <>
      <Routes>
        <Route path='/patient-dashboard' element={<Dashboard state={state} onStateChange={onStateChange} updateToken={updateToken} updateDocStatus={updateDocStatus} />}/>
        <Route path='/current-token' element={<Client />}/>
      </Routes>
    </>
  );
}

export default App
