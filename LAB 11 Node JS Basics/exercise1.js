const http = require('http');

const PORT = 3000;

// Define a server using the createServer() method
// Handle incoming client requests using request-response callback function
const server = http.createServer((req, res) => {
    // Set appropriate response headers using response.setHeader()
    res.setHeader('Content-Type', 'text/html');

    // Send a response to the client using the response object methods (write, end)
    res.write('<html><head><title>Node.js Web Server</title></head>');
    res.write('<body>');
    res.write('<h1>Hello from Node.js!</h1>');
    res.write('<p>This is a simple web server created using the built-in HTTP module.</p>');
    res.write('</body></html>');
    
    // End the response
    res.end();
});

// Run the server on a specific port using the listen() method
server.listen(PORT, () => {
    // Display server status in the console using console logging in Node.js
    console.log(`Server is up and running!`);
    console.log(`Listening on port ${PORT}...`);
    console.log(`Access the server at http://localhost:${PORT}`);
});
