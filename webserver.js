const fs = require("fs");
const http = require("http");
const path = require("path");

const PORT = 4000;

const server = http.createServer((req, res) => {
  let filePath = `.${req.url}`;
  if (req.url === "/" || req.url === "/index.html") {
    filePath = "./index.html";
  }

  const ext = path.extname(filePath);

  if (ext === ".html") {
    fs.readFile(filePath, (err, content) => {
      if (err) {
        fs.readFile("./404.html", (error, notFound) => {
          res.writeHead(404, { "Content-Type": "text/html" });
          res.end(notFound);
        });
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 - Page Not Found</h1>");
  }
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
