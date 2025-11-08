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

    // UPDATE ITEMS
    else if (url.startsWith('/items/') && method === 'PUT') {

        const id = parseInt(req.url.split("/")[2]);
        let body = "";

        req.on("data", (chunk) => {
            body += chunk;
        });

        req.on("end", () => {
            const updatedData = JSON.parse(body);

            const data = fs.readFileSync(DATA_FILE, "utf8");
            const items = JSON.parse(data);

            const index = items.findIndex((article) => article.id === id);

            if (index === -1) {
                res.writeHead(404, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ message: "Article not found" }));
                return;
            }

            const updatedArticle = { ...items[index], ...updatedData };
            items[index] = updatedArticle;

            fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedArticle));
        });

    }

    // DELETE ITEM
    else if (url.startsWith('/items/') && method === 'DELETE') {
        const id = parseInt(req.url.split("/").pop());
        const data = fs.readFileSync(DATA_FILE, "utf8");
        let items = JSON.parse(data);

        const index = items.findIndex((a) => a.id === id);
        if (index === -1) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Article not found" }));
        }

        const deleted = items.splice(index, 1);

        fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));

        res.writeHead(204, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Article deleted", deleted }));


    }

})


server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
