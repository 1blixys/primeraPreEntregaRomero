const express = require('express');
const cartsRoutes = require('../src/routes/carts.routes');
const productsRoutes = require('../src/routes/products.routes');


const PORT = 8080; //No esta
const app = express();

//Middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/carts', cartsRoutes);

app.get('*', function (req, res) {
    res.send({status: "error", description: `ruta ${req.url} no encontrada`})
});

// Server
app.listen(PORT, ()=>{
    console.log(`Servidor express puerto ${PORT}`);
})