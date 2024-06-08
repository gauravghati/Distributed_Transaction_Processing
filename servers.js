const mysql = require("mysql2");
const WebSocket = require('ws');
const ws_server = new WebSocket.Server({ port: 8081 });
require('dotenv').config() 

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD,
    database: 'cs223p_server1'
});

conn.connect((err) => {
    console.log('Connected to the Server 1 database');
});

const server_report = new WebSocket('ws://localhost:8084');

async function run() {
    ws_server.on('connection', (ws) => {
        ws.on('message', async (code) => {
            console.log(`Server 1 received message => ${code}`);
            var args = code.toString().split(';');

            if(args[0] == 'T1') {
                console.log("T1 started on server 1!");
                var sql = "INSERT INTO DOCTOR (first_name, specialization) VALUES('" + args[1] + "', '" + args[2] + "');";
                await conn.promise().query(sql);
                console.log("T1 completed on server 1");

            } else if(args[0] == 'T2') {
                console.log("T2 started on server 1!")

                var sql = "SELECT PATIENT_ID FROM PATIENT WHERE FIRST_NAME='" + args[1] + "'";    
                var result = await conn.promise().query(sql);

                var p_id = result[0][0]['PATIENT_ID'];

                console.log("[T2: Read Patient] Patient ID: " + p_id);
        
                sql = "SELECT DOCTOR_ID FROM DOCTOR WHERE FIRST_NAME='"+ args[2] + "'";
                result = await conn.promise().query(sql);
        
                var d_id = result[0][0]['DOCTOR_ID']

                console.log("[T2: Read Doctor] Doctor ID: " + d_id);
        
                sql = "INSERT INTO APPOINTMENT (patient_id, doctor_id, appointment_date, appointment_time)" +
                    " VALUES(" + p_id + ", " + d_id + ", '2024-06-05', '10:00:00');"
                await conn.promise().query(sql);

                console.log("T2 completed on server 1");

            } else if(args[0] == 'T3') {
                console.log("T3 started on server 1!")
                var sql = "SELECT PATIENT_ID FROM PATIENT WHERE FIRST_NAME='" + args[1] + "'";    
                var result = await conn.promise().query(sql);

                
                var p_id = result[0][0]['PATIENT_ID'];

                console.log("[T3: Read Patient] Patient ID: " + p_id);

                var param = "T3;" + p_id;

                console.log("[T3] Sending Request to Report Server");

                server_report.send(param);
                console.log("T3 completed on server 1");

            } else if(args[0] == 'T4') {
                console.log("T4 started on server 1!")
                var sql = "SELECT PATIENT_ID FROM PATIENT WHERE FIRST_NAME='" + args[1] + "'";
                var result = await conn.promise().query(sql);
                var p_id = result[0][0]['PATIENT_ID'];
                var a_id = 1;
                var param = "T4;" + p_id + ";" + a_id;

                console.log("[T4] Sending Request to Report Server");

                server_report.send(param);

                console.log("[T4: Read Patient] Patient ID: " + p_id);

                console.log("T4 completed on server 1");

            } else if(args[0] == 'T6') {
                console.log("T6 started on server 1!")
                var sql = "SELECT PATIENT_ID FROM PATIENT WHERE FIRST_NAME='" + args[1] + "'";
                var result = await conn.promise().query(sql);
        
                var p_id = result[0][0]['PATIENT_ID'];
                var a_id = 1;
                var param = "T6;" + p_id + ";" + a_id;
                
                console.log("[T6: Read Patient] Patient ID: " + d_id);

                console.log("[T6] Sending Request to Report Server");

                server_report.send(param);
                console.log("T6 completed on server 1");

            } else if(args[0] == 'T7') {
                console.log("T7 started on server 1!")
                var sql = "INSERT INTO PATIENT(FIRST_NAME, AGE) VALUES('" + args[1] + "', 25);";
                await conn.promise().query(sql);
                console.log("T7 completed on server 1");
            }
        });
        
        ws.on('close', () => {
            console.log('Server 1: Client has disconnected');
        });
    });

    console.log('WebSocket server 1 is running on ws://localhost:8081'); 
}

run();



