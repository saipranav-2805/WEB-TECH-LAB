// Import the events module using the require() function
const EventEmitter = require('events');

// Create an event emitter object using EventEmitter instance
const myEmitter = new EventEmitter();

// ==========================================
// Register event listeners using the on() method
// ==========================================

// Handle multiple listeners for a single event using multiple event subscriptions
// Listener 1 for 'userLogin' event
myEmitter.on('userLogin', (username, role) => {
    // Execute callback functions when events are triggered
    // Display event responses in the console using console logging
    console.log(`[Security Module] Login detected for user: ${username} (Role: ${role})`);
});

// Listener 2 for the same 'userLogin' event
myEmitter.on('userLogin', (username, role) => {
    console.log(`[Audit Module] Recording login timestamp for user: ${username}`);
});

// Listener for 'fileUpload' demonstrating asynchronous behavior
myEmitter.on('fileUpload', (fileName) => {
    console.log(`[Upload Module] Started uploading process for: ${fileName}...`);
    
    // Demonstrate asynchronous behavior using event-driven architecture
    // setTimeout simulates a time-consuming async operation like a real file upload
    setTimeout(() => {
        console.log(`[Upload Module] ✅ Successfully finished uploading ${fileName}.`);
        
        // Emitting another event inside an async callback
        myEmitter.emit('uploadComplete', fileName);
    }, 2000);
});

// Listener for 'uploadComplete'
myEmitter.on('uploadComplete', (fileName) => {
    console.log(`[Notification Module] Sending email notification: Your file ${fileName} is successfully uploaded.`);
});


// ==========================================
// Trigger custom events using the emit() method
// ==========================================

console.log('--- System Started ---');

// Define custom events using the emit() method
// Pass data through events using arguments in emit()
console.log('-> Triggering "userLogin" event...');
myEmitter.emit('userLogin', 'alice_admin', 'Administrator');

console.log('\n-> Triggering "fileUpload" event...');
myEmitter.emit('fileUpload', 'annual_report_2023.pdf');

console.log('\n--- Synchronous Code Execution Completed ---');
console.log('--- Waiting for asynchronous events to finish...\n');
// Note: The script will not immediately exit here because the setTimeout inside the 'fileUpload' listener keeps the event loop active.
