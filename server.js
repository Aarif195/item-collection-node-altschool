const fs = require("fs");
const http = require("http");


const PORT = 3000;
const DATA_FILE = './data.json';

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));


const server = http.createServer((req, res) => {

 const url = req.url;
  const method = req.method;

    if (url === '/items' && method === 'GET') {
    // READ all
    const data = readData();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  } 

})


server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
