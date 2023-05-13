import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import TableBody from './TableBody.jsx';
import Text from './Text';
const wsurl = 'ws://localhost:3001';

const newPatient = async (state) => {
    await fetch('http://localhost:3001/add-patient', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state),
    });
}

const Dashboard = ({ state, onStateChange, updateToken, updateDocStatus }) => {
    const [data, setData] = useState({
        name: '',
        phone: 0
    });
    const handleChange = (event) => {
        setData({ ...data, [event.target.id]: event.target.id === 'phone' ? parseInt(event.target.value) : event.target.value });
    }
    const handleSubmit = async () => {
        // setData({['event.target.id']:event.value});
        await newPatient(data);
        console.log(data);
        window.location.reload(false);
    }

    const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Handle Message', data);
        // setCurrToken(data.token);
        onStateChange({ ...data });
        // console.log(state.token);
    };

    const { sendMessage, readyState } = useWebSocket(wsurl, {
        onOpen: () => {
            console.log('WebSocket connection established.');
        },
        onMessage: handleMessage,
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true
    });

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendMessage('get_token');
        }
    }, [sendMessage, readyState]);

    const [lastToken, setLastToken] = useState(0);

    return (
        <main>
            <h1 className='title'>Dashboard for doctor's clinic</h1>
            <div className="table-wrapper">
                <div className="table">
                    <div className="table-heading">

                        <div className="row heading">
                            <div className="sno">S.no</div>
                            <div className="name">Name</div>
                            <div className="phone">Phone</div>
                            <div className="token">Token</div>
                        </div>
                    </div>
                    <div className="table-body">
                        <TableBody token={state.token} setLastToken={setLastToken} />
                    </div>
                </div>
            </div>
            
            <div>
                <button onClick={() => updateToken(state.token, state.status, lastToken)}>Next Token</button>
                <button onClick={() => updateDocStatus(state.status)}> Doctor <Text data={state.status ? ' Available' : ' Not Available'} /> </button>
            </div>

            <div className='form'>
                <input type="text" name="name" id='name' onChange={handleChange} placeholder='patient name' />
                <input type="number" name="phone" id='phone' onChange={handleChange} placeholder='phone number' />
                <button onClick={handleSubmit}>Generate Token</button>
            </div>
        </main>
    );

}

export default Dashboard