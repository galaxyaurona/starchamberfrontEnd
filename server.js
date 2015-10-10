var express = require('express');
var app = express();
var logger = require('morgan');
var compression = require('compression')

app.use(logger('dev'));


// New call to compress content
app.use(compression());

app.use(express.static(__dirname + '/dist'));

app.listen(process.env.PORT || 9000);
