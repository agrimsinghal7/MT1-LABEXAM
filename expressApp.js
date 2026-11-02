import express from "express";

const app = express();
app.use(express.json());

let cart = [
    { id: 1, productName: "Wireless Mouse", price: 799, quantity: 2, category: "Electronics" },
    { id: 2, productName: "Keyboard", price: 999, quantity: 1, category: "Electronics" },
    { id: 3, productName: "Notebook", price: 100, quantity: 5, category: "Stationery" }
];

app.get("/cart", (req, res) => {
    res.json(cart);
});

app.get("/cart/:id", (req, res) => {
    const product = cart.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ ...product, totalPrice: product.price * product.quantity });
});

app.post("/cart", (req, res) => {
    const { id, productName, price, quantity, category } = req.body;

    if (id == null || !productName || price == null || quantity == null) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    if (cart.some(p => p.id === Number(id))) {
        return res.status(400).json({ error: "Product ID already exists" });
    }

    const product = { id: Number(id), productName, price: Number(price), quantity: Number(quantity), category: category || "General" };
    cart.push(product);
    res.status(201).json({ message: "Product added successfully", product });
});

app.put("/cart/:id", (req, res) => {
    const product = cart.find(p => p.id === Number(req.params.id));
    if (!product) return res.status(404).json({ error: "Product not found" });

    Object.assign(product, req.body);
    res.json({ message: "Product updated successfully", product });
});

app.delete("/cart/:id", (req, res) => {
    const index = cart.findIndex(p => p.id === Number(req.params.id));
    if (index === -1) return res.status(404).json({ error: "Product not found" });

    const deleted = cart.splice(index, 1);
    res.json({ message: "Product deleted successfully", product: deleted[0] });
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});
