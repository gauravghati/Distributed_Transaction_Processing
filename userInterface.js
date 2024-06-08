const WebSocket = require('ws');

async function run() {
    const servers = new WebSocket('ws://localhost:8081');
    const server_report = new WebSocket('ws://localhost:8084');
    const server_billing = new WebSocket('ws://localhost:8083');

    const sendMessage = (ws, server, message) => {
        ws.on('open', () => {
            ws.send(message);
            console.log(`Message sent to ${server}: ${message}`);
        });
    };

    // T1: Adding a doctor, Name: John, Specialization: Neurology
    sendMessage(servers, 'Geo-Server', 'T1;John;Neurology');

    // T7: Adding a Patient, Name: Sam
    sendMessage(servers, 'Geo-Server', 'T7;Sam');

    // T2: Scheduling an Appointment, Patient: Sam, Doctor: John
    sendMessage(servers, 'Geo-Server', 'T2;Sam;John');

    // T4: Adding a medical report after the appointment, Patient: Sam
    sendMessage(servers, 'Geo-Server', 'T4;Sam');

    // T3: Discharging a Patient: Sam
    sendMessage(servers, 'Geo-Server', 'T3;Sam');

    // T6: Get a patient's past medical records
    sendMessage(servers, 'Geo-Server', 'T6;Sam');

    // T5: Query all medical reports for a specific Disease
    sendMessage(server_report, 'Server - Medical report', 'T5;Tuberculosis');
}

run();