const http=require('http')
const SocketIO=require('socket.io')
const server=http.createServer()
const io = SocketIO(server)

exports.server=server
exports.io=io
