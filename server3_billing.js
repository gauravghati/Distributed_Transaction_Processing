const mysql = require("mysql2");
const WebSocket = require('ws');
const ws_server = new WebSocket.Server({ port: 8083 });
require('dotenv').config();

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'cs223p_billing'
});

conn.connect((err) => {
    console.log('Connected to the Billing Database');
});

async function run() {
    ws_server.on('connection', (ws) => {
        ws.on('message', async (code) => {
            console.log(`Server Report received message => ${code}`);
            var args = code.toString().split(';');

            if(args[0] == 'T3') {
                console.log('T3 started executing on Billing server');
                var sql = "INSERT INTO BILLING(patient_id, appointment_id, total_amount, credit_card_details, payment_date) "
                    + " VALUES(5001, 2501, 100, 1234, '2024-06-05');";
                await conn.promise().query(sql);
                console.log('T3 Completed on Billing Server');
            }
        });
        
        ws.on('close', () => {
            console.log('Server Billing: Client has disconnected');
        });
    });

    console.log('WebSocket Server Billing is running on ws://localhost:8083'); 
}

run();