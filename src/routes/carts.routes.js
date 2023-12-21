const { Router } = require("express");
const router = Router();
const CartManager = require("../managers/cart-manager");
const Carrito = new CartManager();
const ProductManager = require("../managers/product-manager.js");
const ProductService = new ProductManager();

router.post("/", (req, res) => {
  Carrito.createCart().then((result) => res.send(result));
});
router.delete("/:cid", (req, res) => {
  let param = req.params.id;
  if (isNaN(param)) return res.status(400).send({ error: "No es un numero" });
  let id = parseInt(param);
  Carrito.deleteById(id).then((result) => res.send(result));
});
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cartId = req.params.cid;
    let productId = req.params.pid;

    // Verificar si el carrito existe
    const cart = await Carrito.getCartById(cartId);
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    // Verificar si el producto existe
    const product = await ProductService.getProductById(productId);
    if (product.error) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    // Verificar si el producto ya está en el carrito
    const existingProduct = cart.products.find((p) => p.id === productId);

    if (existingProduct) {
      // Si el producto ya existe, incrementar la cantidad
      existingProduct.quantity += 1;
    } else {
      // Si el producto no existe, agregarlo al carrito con cantidad 1
      cart.products.push({ id: productId, quantity: 1 });
    }

    // Actualizar el carrito
    await Carrito.updateCart(cartId, cart);

    res.send({
      success: true,
      message: "Producto agregado al carrito exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

router.get("/:cid", async (req, res) => {
  let param = req.params.cid;
  if (isNaN(param)) return res.status(400).send({ error: "No es un numero" });
  let id = parseInt(param);
  let cart = await Carrito.getById(id);
  let productsId = cart.products;
  let cartProducts = [];
  await Promise.all(
    productsId.map(async (products) => {
      let newProduct = await ProductService.getProductById(products);
      if (newProduct != null) cartProducts.push(newProduct);
    })
  );
  res.send(cartProducts);
});
router.delete("/:cid/products/:pid", (req, res) => {
  let cartIdParam = req.params.cid;
  let prodIdParam = req.params.pid;
  if (isNaN(cartIdParam || prodIdParam))
    return res.status(400).send({ error: "No es un numero" });
  let cartId = parseInt(cartIdParam);
  let prodId = parseInt(prodIdParam);
  Carrito.deleteItem(cartId, prodId).then((result) => res.send(result));
});
module.exports = router;

