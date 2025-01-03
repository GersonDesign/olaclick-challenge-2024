
require('dotenv').config();
const createError     = require('http-errors');
const express         = require('express');
const path            = require('path');
const cookieParser    = require('cookie-parser');
const logger          = require('morgan');
const routes          = require('./routes');
const cors            = require('cors');
const app             = express();
const listURLSEnable  = ['http://localhost:3000', 'http://localhost:4006', 'https://dashboard-69tn.onrender.com'];
const mongoose        = require('mongoose');


mongoose.connect(process.env.URLDB)
        .then(() => console.log("API funcionando"))
        .catch((err) => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.disabled('x-powered-by');
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(cors({
  origin: function(origin, cb){
    if(listURLSEnable.indexOf(origin) !== -1){
      cb(null, true)
    }else{
      cb(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const port = process.env.PORT || 3000;
app.set('port', port);

app.listen(port, () => {
  console.log(` server running on port ${port}`)
})