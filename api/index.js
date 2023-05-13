const express = require('express')
const WebSocket = require('ws').Server;
const app = express();
const port = process.env.PORT || 3001;
const uuid = require('uuid');

const patient = require('./patient');

let httpServer = app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});


const wapp = new WebSocket({ server: httpServer });

const clients = {};
var id = 100;
var doctorIsReady = false;
app.use(express.json())
app.use(function (_, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

// web socket starts
wapp.on('connection', (web_socket) => {
    const uid = uuid.v4();
    clients[uid] = web_socket;
    console.log(`Client ${uid} is connected!`);

    web_socket.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // console.log(`id: ${id}`);
        if (message.includes('get_token')) {
            if (!doctorIsReady) {
                web_socket.send(JSON.stringify({ 'status': doctorIsReady ,'token': 0 }));
                console.log(`send ${JSON.stringify({ 'status': doctorIsReady ,'token': 0 })}`);
            } else {
                const json = { 'status': doctorIsReady,'token': id };
                web_socket.send(JSON.stringify(json));
                console.log(`send ${JSON.stringify(json)}`);
            }
        }
    });

    // Handle WebSocket errors
    web_socket.on('error', (error) => {
        console.error('WebSocket error: %s', error);
    });

    // Handle WebSocket close events
    web_socket.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/get-patients', (req, res) => {
    patient.getPatient()
    .then(response => {
        res.status(200).send(response);
    })
    .then(error => {
        res.status(500).send(error);
    })
});

app.post('/add-patient', (req, res) => {
    const {name, phone} = req.body;
    if(name==='' || phone === 0) {
        res.status(500).send('No inputs');
        return;
    }
    patient.createPatient(req.body)
    .then(response => {
        res.status(200).send(response);
    })
    .then(error => {
        res.status(500).send(error);
    })
});

//receptionist updates the token
app.post('/update-token', (req, res) => {
    const body = req.body;
    console.log(`Number of connected clients: ${wapp.clients.size}`);
    if (doctorIsReady) {
        id = body.token;
        wapp.clients.forEach((client) => {
            // console.log(client.readyState);
            if (client.readyState === 1) {
                const json = { 'status': doctorIsReady, 'token': id };
                client.send(JSON.stringify(json));
                console.log(`send ${JSON.stringify(json)}`);
            } else {
                console.log('WebSocket of ${client} is not open');
            }
        })
        res.status(200).send(`Updated token successfully!`);
    } else {
        res.status(400).send(`Can't Update token since doctor is not ready!`);
    }
});

//receptionist updates the doctor ready status
app.post('/update-doctor', (req, res) => {
    const body = req.body;
    if (doctorIsReady !== body.status) {
        doctorIsReady = body.status;
        console.log(`Doctor status: ${doctorIsReady}`);
        wapp.clients.forEach((client) => {
            if (client.readyState === 1) {
                const json = { 'status': doctorIsReady, 'token': (doctorIsReady?id:0) };
                client.send(JSON.stringify(json));
                console.log(`send ${JSON.stringify(json)}`);
            } else {
                console.log('WebSocket of ${client} is not open');
            }
        });
        res.status(200).send(`Updated status successfully!`);
    } else {
        res.status(200).send(`Cant update status since they are already same!`);
    }
})

// web socket ends
