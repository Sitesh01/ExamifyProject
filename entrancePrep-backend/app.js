const express = require('express');
const app = express();
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const path = require('path');


const blogsRouter = require('./routes/blogsRoute');
const usersRouter = require('./routes/usersRoute');
const questionsRouter = require('./routes/questionsRoute');
const answersRouter = require('./routes/answersRoute');
const feedbacksRouter = require('./routes/feedbackRoute');
const commentsRouter = require('./routes/commentRoute');
const globalErrorHandler = require('./controller/errorController');
const AppError = require('./utils/appError');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views/email'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour window
    max: 100, // start blocking after 100 requests
    message: 'Too many requests from this IP, please try again after an hour!'
});

// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());



// Enable CORS - Cross Origin Resource Sharing
app.use(cors());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    res.status(200).render('welcome');
});

// 3) ROUTES
app.use('/api/v1/blogs', blogsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/questions', questionsRouter);
app.use('/api/v1/answers', answersRouter);
app.use('/api/v1/feedbacks', feedbacksRouter);
app.use('/api/v1/comments', commentsRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;