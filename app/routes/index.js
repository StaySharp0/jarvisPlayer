const express = require('express');
const router  = express.Router();
let io;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// io.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });

module.exports = router;
// function (socket) {
//     io = socket;
// 	return router;
//}
