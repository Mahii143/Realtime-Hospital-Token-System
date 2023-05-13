import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';


const wsurl = 'ws://localhost:3001';

const Client = () => {
    const [currToken, setCurrToken] = useState('null');

    const handleMessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Handle Message',data);
        setCurrToken(data.token);
    };

    const { sendMessage , readyState } = useWebSocket(wsurl, {
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

    return (
        <div class='token-client'>
            <div className='token-heading'>Current Token</div>
            <div className='token-number'><strong>{currToken===0?'Doctor is not available':'T - '+currToken}</strong></div>
        </div>
    )
}

export default Client