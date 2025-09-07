// Configurações da aplicação
module.exports = {
  // EmailJS
  emailjs: {
    serviceId: process.env.EMAILJS_SERVICE_ID || 'service_5qvt452',
    templates: {
      verification: process.env.EMAILJS_TEMPLATE_VERIFICATION || 'template_jcjponk',
      passwordReset: process.env.EMAILJS_TEMPLATE_PASSWORD_RESET || 'template_password_reset',
      invoice: process.env.EMAILJS_TEMPLATE_INVOICE || 'template_invoice'
    },
    publicKey: process.env.EMAILJS_PUBLIC_KEY || 'a-SQQ0G00_IwsliqU',
    privateKey: process.env.EMAILJS_PRIVATE_KEY || 'p_gtcWnOGn4v5A_6z4VM0'
  },

  // Servidor
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },

  // Backend .NET
  dotnetApi: {
    baseUrl: process.env.DOTNET_API_URL || 'https://localhost:7155/api'
  }
}

