const express = require('express');
//? use morgan for logging requests.
var morgan = require('morgan')
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'config.env' });
const databaseConfig = require('./config/database');
const categoryRoutes = require('./routes/categoryRoutes');
const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log('Development mode is on');
}

app.use(bodyParser.json());





databaseConfig();


app.use('/api/V1/category', categoryRoutes);




const PORT = process.env.PORT || 8000;


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

