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
const { title } = require('process');
const { Socket } = require('net');

const app = express();
const server = http.createServer(app);

// ----- MongoDB -----
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/miinventario';
mongoose.connect(MONGO_URI, {
    useNewurlParser: true,
    useUnifiedTopology: true
})
    .then(()=> console.log('MongoDB conectado'))
    .catch(err => console.error('MongoDB error', err.message));

    // ----- Middlewares -----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ----- Session -----
const sessionSecret = process.env.SESSION_SECRET || 'cambiar_esta_clave';
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 dia
}));

// ----- View engine (Handlebars) -----
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
    helpers: {
        ifEquals: function (arg1, arg2, options){
            return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
            }
        },
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', "hbs");
app.set('views', path.join(__dirname, "views"));

//archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Exponer usuario
app.use((req,res, next) => {
    res.locals.user = req.session ? req.session.user : null;
    next();
});


// ----- Rutas -----
app.use('/', authRoutes);
app.use('/products', productRoutes);

app.get('/', (req, res) => {
    if (req.session && req.session.user) {
        return res.redirect('/products');
    } else {
        return res.redirect('/login');
    }
});
// ----- Socket.io -----
const io = new Server(server);
io.on('connection', (socket) => {
    console.log('Socket conectado:', socket.id);
    socket.on('char:message', (payload) => {
        io.emit('chat:message', payload);
    });
});

// ----- Iniciar servidor -----
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server escuchando en http://localhost:${PORT}`);
});

