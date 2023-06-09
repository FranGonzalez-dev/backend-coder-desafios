import express from 'express'
import handlebars from 'express-handlebars'
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';

import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/cart.router.js'
import sessionRouter from './routes/session.router.js'


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Motor de plantillas
app.engine('.hbs', handlebars.engine({extname: '.hbs'}))
app.set('views', './src/views')
app.set('view engine', '.hbs')

// Archivos estáticos
app.use(express.static('./src/public'))

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://admin:nVmcprqyKBizD14o@ecommerce.suvajub.mongodb.net",
        dbName: 'ecommerce'
    }),
    secret: 'supersecret',
    resave: true,
    saveUninitialized: true
}))


// Redirect a ruta de productos
app.get('/', (req, res) => {
    res.redirect('/sessions/login')
})

// Ruta de productos
app.use('/products', productsRouter)

// Ruta del carrito
app.use('/carts', cartsRouter)

// Ruta de sesiones
app.use('/sessions', sessionRouter)

const PORT = 8080

mongoose.set('strictQuery', false)

try {
    await mongoose.connect('mongodb+srv://admin:nVmcprqyKBizD14o@ecommerce.suvajub.mongodb.net/ecommerce')
    app.listen( PORT, () => console.log(`Server up on port ${ PORT }`));
} catch ( error ){
    console.log(`No se pudo conectar con la base de datos: \n${ error }`)
}