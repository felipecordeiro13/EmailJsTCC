const express = require('express')
const cors = require('cors')
require('dotenv').config()
const config = require('./config')
const emailRoutes = require('./routes/emailRoutes')

const app = express()

// Middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Log das requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  next()
})

// Rotas
app.use('/api/email', emailRoutes)

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: '🚀 EmailJS TCC API está funcionando!',
    version: '1.0.0',
    endpoints: {
      'POST /api/email/send-verification': 'Enviar código de verificação',
      'POST /api/email/verify-code': 'Verificar código',
      'POST /api/email/send-password-reset': 'Recuperar senha',
      'POST /api/email/send-invoice': 'Enviar nota fiscal',
      'GET /api/email/health': 'Health check'
    }
  })
})

// Middleware de erro
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err)
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  })
})

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint não encontrado'
  })
})

// Iniciar servidor
const PORT = config.server.port
app.listen(PORT, () => {
  console.log(`
🚀 EmailJS TCC API iniciada!
📡 Servidor rodando na porta: ${PORT}
🌐 URL: http://localhost:${PORT}
📧 EmailJS Service: ${config.emailjs.serviceId}
🎯 Backend .NET: ${config.dotnetApi.baseUrl}

📋 Endpoints disponíveis:
   GET  /                           - Informações da API
   POST /api/email/send-verification - Enviar código de verificação
   POST /api/email/verify-code      - Verificar código
   POST /api/email/send-password-reset - Recuperar senha
   POST /api/email/send-invoice     - Enviar nota fiscal
   GET  /api/email/health          - Health check
`)
})

module.exports = app
