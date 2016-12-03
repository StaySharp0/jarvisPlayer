"use strict";

const express 		= require('express');
const path 			= require('path');
const logger 		= require('morgan');
const cookieParser 	= require('cookie-parser');
const bodyParser 	= require('body-parser');
// Middle-ware
const compression 	= require('compression');
const minify 		= require('express-minify');

const app = express();

app.use(compression());
app.use(minify());

// view engine setup
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/app/views'));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

const routeIndex 	= require('./app/routes');

app.use('/', routeIndex);

module.exports = app;