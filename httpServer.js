import http from "http";
import fs from "fs";
import path from "path";

let cart = [
    { id: 1, productName: "Mouse", price: 799, quantity: 2 },
    { id: 2, productName: "Keyboard", price: 999, quantity: 1 },
    { id: 3, productName: "Headphones", price: 1499, quantity: 1 }
];

const server = http.createServer((req, res) => {
    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url === "/") {
        res.setHeader("Content-Type", "text/html");
        return res.end("<h1>Welcome to Shopping Cart Application</h1>");
    }

    if (req.method === "GET" && req.url === "/cart") {
        return res.end(JSON.stringify(cart));
    }

    if (req.method === "GET" && req.url === "/about") {
        return res.end(JSON.stringify({ message: "Shopping Cart Management Application using Node.js" }));
    }

    if (req.method === "GET" && req.url === "/home") {
        const filePath = path.join(process.cwd(), "public", "index.html");
        return fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error reading HTML file");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }

    if (req.method === "POST" && req.url === "/add-to-cart") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            try {
                const product = JSON.parse(body);
                if (product.id == null || !product.productName ||
                    product.price == null || product.quantity == null) {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: "All required fields are necessary" }));
                }
                cart.push(product);
                res.writeHead(201);
                res.end(JSON.stringify({ message: "Product added successfully", product }));
            } catch {
                res.writeHead(400);
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: "Route not found" }));
});

server.listen(3000, () => {
    console.log("HTTP Server running at http://localhost:3000");
});
