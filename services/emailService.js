const emailjs = require('@emailjs/nodejs')
const config = require('../config')

class EmailService {
  constructor() {
    // Não precisamos mais do init(), vamos passar as chaves diretamente
    console.log('🔑 EmailService inicializado')
    console.log('📧 Service ID:', config.emailjs.serviceId)
    console.log('🔓 Public Key:', config.emailjs.publicKey)
    console.log('🔐 Private Key:', config.emailjs.privateKey ? 'Configurada' : 'FALTANDO!')
  }

  // Gerar código de verificação
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // Enviar código de verificação
  async sendVerificationCode(email, userName = 'Usuário') {
    try {
      const code = this.generateVerificationCode()
      
      const templateParams = {
        user_name: userName,
        user_email: email,
        verification_code: code,
        app_name: 'Sistema TCC'
      }

      console.log(`📧 Enviando código de verificação para: ${email}`)
      console.log('🔍 Debug - Service ID:', config.emailjs.serviceId)
      console.log('🔍 Debug - Template ID:', config.emailjs.templates.verification)
      console.log('🔍 Debug - Public Key:', config.emailjs.publicKey)
      console.log('🔍 Debug - Private Key:', config.emailjs.privateKey)
      
      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templates.verification,
        templateParams,
        {
          publicKey: config.emailjs.publicKey,
          privateKey: config.emailjs.privateKey,
        }
      )

      console.log('✅ E-mail de verificação enviado com sucesso!')
      
      return {
        success: true,
        code: code, // Retornamos o código para validação posterior
        message: 'Código de verificação enviado com sucesso!'
      }
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail de verificação:', error)
      return {
        success: false,
        message: 'Erro ao enviar e-mail. Tente novamente.'
      }
    }
  }

  // Enviar e-mail de recuperação de senha
  async sendPasswordReset(email, resetToken, userName = 'Usuário') {
    try {
      // Gerar link de reset (você pode personalizar a URL)
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
      
      const templateParams = {
        user_name: userName,
        user_email: email,
        reset_link: resetLink,
        app_name: 'Sistema TCC'
      }

      console.log(`🔑 Enviando link de recuperação para: ${email}`)
      
      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templates.passwordReset,
        templateParams,
        config.emailjs.publicKey,
        config.emailjs.privateKey
      )

      console.log('✅ E-mail de recuperação enviado com sucesso!')
      
      return {
        success: true,
        message: 'Link de recuperação enviado para seu e-mail!'
      }
    } catch (error) {
      console.error('❌ Erro ao enviar e-mail de recuperação:', error)
      return {
        success: false,
        message: 'Erro ao enviar e-mail de recuperação. Tente novamente.'
      }
    }
  }

  // Enviar nota fiscal
  async sendInvoice(email, invoiceData) {
    try {
      const templateParams = {
        user_name: invoiceData.customerName || 'Cliente',
        user_email: email,
        invoice_number: invoiceData.number,
        invoice_amount: invoiceData.amount,
        invoice_date: invoiceData.date,
        service_description: invoiceData.description || 'Serviços prestados',
        app_name: 'Sistema TCC'
      }

      console.log(`📄 Enviando nota fiscal para: ${email}`)
      
      const response = await emailjs.send(
        config.emailjs.serviceId,
        config.emailjs.templates.invoice,
        templateParams,
        config.emailjs.publicKey,
        config.emailjs.privateKey
      )

      console.log('✅ Nota fiscal enviada com sucesso!')
      
      return {
        success: true,
        message: 'Nota fiscal enviada por e-mail com sucesso!'
      }
    } catch (error) {
      console.error('❌ Erro ao enviar nota fiscal:', error)
      return {
        success: false,
        message: 'Erro ao enviar nota fiscal. Tente novamente.'
      }
    }
  }
}

module.exports = new EmailService()

