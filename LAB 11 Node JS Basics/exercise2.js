const http = require('http');
const fs = require('fs');

const PORT = 3001; // Using port 3001
const filename = 'sample.txt';

const server = http.createServer((req, res) => {
    // Serve HTML with a button when accessing the root URL
    if (req.method === 'GET' && req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<!DOCTYPE html>');
        res.write('<html><head><title>File Operations</title>');
        res.write('<style>');
        res.write('body { font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif; padding: 20px; }');
        res.write('button { padding: 10px 20px; font-size: 16px; cursor: pointer; background-color: #007BFF; color: white; border: none; border-radius: 4px; }');
        res.write('button:hover { background-color: #0056b3; }');
        res.write('#output { margin-top: 20px; padding: 15px; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }');
        res.write('</style>');
        res.write('</head><body>');
        res.write('<h2>Node.js File System Operations</h2>');
        res.write('<p>Click the button below to execute file creation, reading, appending, and deletion sequentially.</p>');
        res.write('<button id="opButton">Perform File Operations</button>');
        res.write('<div id="output">Results will appear here...</div>');
        
        // Client-side script to handle button click
        res.write('<script>');
        res.write('document.getElementById("opButton").addEventListener("click", () => {');
        res.write('  const outputDiv = document.getElementById("output");');
        res.write('  outputDiv.innerText = "Processing...";');
        res.write('  fetch("/operate")');
        res.write('    .then(response => response.text())');
        res.write('    .then(data => { outputDiv.innerText = data; })');
        res.write('    .catch(err => { outputDiv.innerText = "Error: " + err; });');
        res.write('});');
        res.write('</script>');
        
        res.write('</body></html>');
        res.end();
    } 
    // Handle the route to perform the actual file server operations
    else if (req.method === 'GET' && req.url === '/operate') {
        let logs = "--- Starting File System Operations ---\n\n";
        
        // 1. Create a new file using fs.writeFile() method
        fs.writeFile(filename, 'Hello, this is the initial content of the file.\n', (err) => {
            if (err) {
                logs += `[Error] Failed to create file: ${err.message}\n`;
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end(logs);
            }
            logs += `[Write]  ✅ File '${filename}' created successfully.\n`;

            // 2. Read the contents of a file using fs.readFile() method
            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    logs += `[Error] Failed to read file: ${err.message}\n`;
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    return res.end(logs);
                }
                logs += `[Read]   📖 Initial content of '${filename}':\n         "${data.trim()}"\n`;

                // 3. Append data to an existing file using fs.appendFile() method
                fs.appendFile(filename, 'This is the appended content.\n', (err) => {
                    if (err) {
                        logs += `[Error] Failed to append to file: ${err.message}\n`;
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        return res.end(logs);
                    }
                    logs += `[Append] ➕ Data appended to '${filename}' successfully.\n`;

                    // Read again to show appended content
                    fs.readFile(filename, 'utf8', (err, newData) => {
                        if (err) {
                            logs += `[Error] Failed to read file after append: ${err.message}\n`;
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            return res.end(logs);
                        }
                        
                        // Format the output specifically to distinguish lines
                        const formattedNewData = newData.trim().split('\n').map(line => `         "${line}"`).join('\n');
                        logs += `[Read]   📖 Content of '${filename}' after append:\n${formattedNewData}\n`;

                        // 4. Delete a file using fs.unlink() method
                        fs.unlink(filename, (err) => {
                            if (err) {
                                logs += `[Error] Failed to delete file: ${err.message}\n`;
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                return res.end(logs);
                            }
                            logs += `[Delete] 🗑️ File '${filename}' deleted successfully.\n\n`;
                            logs += "--- All Operations Completed Successfully ---";
                            
                            // Send Response
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            res.end(logs);
                        });
                    });
                });
            });
        });
    } 
    else {
        // Return 404 for any other roots
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server for Exercise 2 is running!`);
    console.log(`Listening on port ${PORT}...`);
    console.log(`Open http://localhost:${PORT} in your browser and click the button.`);
});
