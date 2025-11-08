const fs = require("fs");
const http = require("http");


const PORT = 3000;
const DATA_FILE = './data.json';
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]");
}

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));


const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;


    // GET ALL ITEM
    if (url === '/items' && method === 'GET') {
        // READ all
        const data = readData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

        // CREATE ITEM
    else if (url === '/items' && method === 'POST') {
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const newItem = JSON.parse(body);
                const data = fs.readFileSync(DATA_FILE, "utf8");
                const items = JSON.parse(data);

                newItem.id = items.length ? items[items.length - 1].id + 1 : 1;


                items.push(newItem);
                fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

                res.writeHead(201, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Article created successfully", article: newItem }));
            } catch (err) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Invalid JSON or request format" }));
            }
        });


    }


    // GET ITEM BY ID
    else if (url.startsWith('/items/') && method === 'GET') {

        const id = parseInt(req.url.split("/")[2]);

        const data = fs.readFileSync(DATA_FILE, "utf8");
        const items = JSON.parse(data);

        const article = items.find((a) => a.id === id);

        if (!article) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            return res.end(JSON.stringify({ message: "Article not found" }));
        }

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(article));

    }


})


server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
