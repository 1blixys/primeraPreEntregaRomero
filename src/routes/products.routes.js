const { Router } = require("express");
const ProductManager = require("../managers/product-manager");
let admin = require("../managers/AdminManagers.js");

const router = Router();
const products = new ProductManager();

//Creacion de endpoints

router.get("/", (req, res) => {
  products.getProducts().then((productos) => res.send(productos));
});

router.get(":limit", (req, res) => {
  const limit = req.params.limit;
  products.getProducts().then((prod) => {
    res.send(prod.slice(0, limit));
  });
});

router.get("/:pid", (req, res) => {
  let param = req.params.pid;
  if (isNaN(param)) return res.status(400).send({ error: "No es un numero" });
  let id = parseInt(param);
  products.getProductById(id).then((productId) => res.send(productId));
});

router.post("/", (req, res) => {
  if (admin) {
    let product = req.body;
    products.addProduct(product.title,product.description,product.price,product.thumbnail,product.code,product.stock).then((newProduct) => res.send(newProduct));
  } else {
    res.send({ status: "error", description: "Error" });
  }
});

router.put("/:pid", (req, res) => {
  if (admin) {
    let param = req.params.pid;
    if (isNaN(param)) return res.status(400).send({ error: "No es un numero" });
    let id = parseInt(param);
    let product = req.body;
    products
      .updateProduct(id,product)
      .then((productoEditado) => res.send(productoEditado));
  } else {
    res.send({ status: "error", description: "Error" });
  }
});

router.delete("/:pid", (req, res) => {
  if (admin) {
    let param = req.params.pid;
    if (isNaN(param)) return res.status(400).send({ error: "No es un numero" });
    let id = parseInt(param);
    products
      .deleteProduct(id)
      .then((productoEliminado) => res.send(productoEliminado));
  } else {
    res.send({ status: "error", description: "Error" });
  }
});

module.exports = router;
