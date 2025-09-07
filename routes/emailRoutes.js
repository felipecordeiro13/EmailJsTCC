const express = require('express')
const router = express.Router()
const emailService = require('../services/emailService')
const fetch = require('node-fetch')
const config = require('../config')

// Armazenamento temporário dos códigos (em produção, use Redis ou banco)
const verificationCodes = new Map()

// Middleware para validar dados básicos
const validateEmailData = (req, res, next) => {
  const { email } = req.body
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'E-mail válido é obrigatório'
    })
  }
  
  next()
}

// POST /api/email/send-verification
// Enviar código de verificação
router.post('/send-verification', validateEmailData, async (req, res) => {
  try {
    const { email, userName } = req.body
    
    console.log(`📧 Solicitação de verificação para: ${email}`)
    
    const result = await emailService.sendVerificationCode(email, userName)
    
    if (result.success) {
      // Armazenar código temporariamente (5 minutos)
      verificationCodes.set(email, {
        code: result.code,
        timestamp: Date.now(),
        attempts: 0
      })
      
      // Limpar código após 5 minutos
      setTimeout(() => {
        verificationCodes.delete(email)
      }, 5 * 60 * 1000)
    }
    
    res.json({
      success: result.success,
      message: result.message
    })
  } catch (error) {
    console.error('Erro no endpoint send-verification:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// POST /api/email/verify-code
// Verificar código de verificação
router.post('/verify-code', validateEmailData, async (req, res) => {
  try {
    const { email, code } = req.body
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Código é obrigatório'
      })
    }
    
    const storedData = verificationCodes.get(email)
    
    if (!storedData) {
      return res.status(400).json({
        success: false,
        message: 'Código expirado ou não encontrado'
      })
    }
    
    // Verificar tentativas
    if (storedData.attempts >= 3) {
      verificationCodes.delete(email)
      return res.status(400).json({
        success: false,
        message: 'Muitas tentativas. Solicite um novo código.'
      })
    }
    
    // Verificar se expirou (5 minutos)
    const codeAge = Date.now() - storedData.timestamp
    if (codeAge > 5 * 60 * 1000) {
      verificationCodes.delete(email)
      return res.status(400).json({
        success: false,
        message: 'Código expirado'
      })
    }
    
    // Verificar código
    if (storedData.code === code.toString()) {
      verificationCodes.delete(email)
      res.json({
        success: true,
        message: 'E-mail verificado com sucesso!'
      })
    } else {
      storedData.attempts++
      res.status(400).json({
        success: false,
        message: `Código incorreto. Tentativas restantes: ${3 - storedData.attempts}`
      })
    }
  } catch (error) {
    console.error('Erro no endpoint verify-code:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// POST /api/email/send-password-reset
// Enviar e-mail de recuperação de senha
router.post('/send-password-reset', validateEmailData, async (req, res) => {
  try {
    const { email } = req.body
    
    console.log(`🔑 Solicitação de recuperação para: ${email}`)
    
    // Verificar se usuário existe no backend .NET
    try {
      const response = await fetch(`${config.dotnetApi.baseUrl}/Usuario/VerificarEmail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      
      if (!response.ok) {
        return res.status(400).json({
          success: false,
          message: 'E-mail não encontrado no sistema'
        })
      }
    } catch (apiError) {
      console.error('Erro ao verificar e-mail no backend:', apiError)
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar e-mail'
      })
    }
    
    // Gerar token de reset (em produção, use algo mais seguro)
    const resetToken = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    
    const result = await emailService.sendPasswordReset(email, resetToken)
    
    res.json(result)
  } catch (error) {
    console.error('Erro no endpoint send-password-reset:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// POST /api/email/send-invoice
// Enviar nota fiscal
router.post('/send-invoice', validateEmailData, async (req, res) => {
  try {
    const { email, invoiceData } = req.body
    
    if (!invoiceData || !invoiceData.number || !invoiceData.amount) {
      return res.status(400).json({
        success: false,
        message: 'Dados da nota fiscal são obrigatórios'
      })
    }
    
    console.log(`📄 Enviando NF ${invoiceData.number} para: ${email}`)
    
    const result = await emailService.sendInvoice(email, invoiceData)
    
    res.json(result)
  } catch (error) {
    console.error('Erro no endpoint send-invoice:', error)
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
})

// GET /api/email/health
// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EmailJS API funcionando!',
    timestamp: new Date().toISOString()
  })
})

module.exports = router

