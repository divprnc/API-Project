const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/error');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path: './config/config.env'});

//Connect to database
connectDB();

//Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');

const app = express();
// JSON Body Parser
app.use(express.json());
app.use(cookieParser());

// Dev Logging Middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
// Basic Logger
app.use(logger);
// File upload
app.use(fileupload());
// Static folder
app.use(express.static(path.join(__dirname, 'public')));
//Sanitize data
app.use(mongoSanitize());
// Set security headers
app.use(helmet());
// Prevent XSS Attacks
app.use(xss());
// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 100
})
app.use(limiter);
// Prevent http param polution
app.use(hpp());
// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Error Handlers
app.use(errorHandler);
const PORT =  process.env.PORT || 5000
const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.blue.bold);
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})