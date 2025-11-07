require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// ----- MongoDB -----
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/miinventario';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=> console.log('MongoDB conectado'))
    .catch(err => console.error('MongoDB error', err));

// ----- View engine (Handlebars) -----
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
    eq: (a, b) => a === b
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ----- Middlewares -----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ----- Session -----
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_dev',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 2 } // 2 horas
}));

// Hacer user accesible en vistas
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// ----- Rutas -----
app.use('/', authRoutes);
app.use('/products', productRoutes);

// Página principal redirige a login o productos
app.get('/', (req, res) => {
    if (req.session && req.session.user) return res.redirect('/products');
    return res.redirect('/login');
});

// ----- Socket.io: chat -----
io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);
    socket.on('chat:message', (payload) => {
    // payload: { user, text, time }
    io.emit('chat:message', payload);
    });
});

// ----- Iniciar servidor -----
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server escuchando en http://localhost:${PORT}`);
});