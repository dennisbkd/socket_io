import express from 'express'
import logger from 'morgan'
import path from 'node:path'

import { Server } from 'socket.io'
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000

const app = express()
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    // aqui van los segundo o minutos de espera
  }
})

io.on('connection', (socket) => {
  console.log('a user has connected!')

  socket.on('disconnect', () => {
    console.log('an user has disconnected')
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })
})
const clientPath = path.join(process.cwd(), 'client')
app.use(express.static(clientPath))
app.use(logger('dev'))

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'))
})

server.listen(port, () => {
  console.log(`server running on port ${port}`)
})
