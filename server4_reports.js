const mysql = require("mysql2");
const WebSocket = require('ws');
const ws_server = new WebSocket.Server({ port: 8084 });
require('dotenv').config();

const server_billing = new WebSocket('ws://localhost:8083');

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'cs223p_report'
});

conn.connect((err) => {
    console.log('Connected to Report database.');
});

async function run() {
    ws_server.on('connection', (ws) => {
        ws.on('message', async (code) => {
            console.log(`Server Report received message => ${code}`);
            var args = code.toString().split(';');

            if(args[0] == 'T3') {
                console.log("T3 starts executing on Report Server");
                
                var sql = "UPDATE MEDICAL_RECORD SET NOTES='Recovered' WHERE PATIENT_ID=" + args[1];
                await conn.promise().query(sql);
                prams = 'T3;' + args[1] + ';' + args[2];

                console.log("[T3] Sending Request to Billing Server");

                server_billing.send(param);
                console.log("T3 Completed on Report Server");

            } else if(args[0] == 'T4') {
                console.log("T4 starts executing on Report Server");
                sql = "INSERT INTO MEDICAL_RECORD(patient_id, appointment_id, diagnosis, medication, notes) "+
                        "VALUES ("+ "1234" +", 1, 'Covid-19', 'Covid-Vaccine', 'Consilt after one week of medication');";
                await conn.promise().query(sql);
                console.log("T4 Completed on Report Server");

            } else if(args[0] == 'T6') {
                console.log("T6 starts executing on Report Server");
                sql = "INSERT INTO MEDICAL_RECORD(patient_id, appointment_id, diagnosis, medication, notes) "+
                        "VALUES ("+ "1234" +", 1, 'Tuberculosis', 'vaccine', 'Consult after one week of medication');";
                await conn.promise().query(sql);
                console.log("T6 Completed on Report Server");

            } else if(args[0] == 'T5') {
                console.log("T5 starts executing on Report Server");
                sql = "SELECT * from MEDICAL_RECORD WHERE diagnosis='TB';"
                var result = await conn.promise().query(sql);
                console.log("[T5: Read Record] ::" + result);
                console.log("T5 Completed on Report Server");
            }
        });
        
        ws.on('close', () => {
            console.log('Server Report: Client has disconnected');
        });
    });

    console.log('WebSocket server Report is running on ws://localhost:8084'); 
}

run();