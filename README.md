# 📧 EmailJS TCC API

API Node.js para gerenciar envio de e-mails usando EmailJS de forma segura.

## 🚀 Como rodar

```bash
# Instalar dependências
pnpm install

# Rodar em desenvolvimento
pnpm dev

# Rodar em produção
pnpm start
```

## 🔧 Configuração

Edite o arquivo `config.js` com suas credenciais do EmailJS:

```javascript
emailjs: {
  serviceId: 'service_5qvt452',
  templates: {
    verification: 'template_jcjponk',
    passwordReset: 'template_password_reset',
    invoice: 'template_invoice'
  },
  publicKey: 'a-SQQ0G00_IwsliqU'
}
```

## 📡 Endpoints

### POST `/api/email/send-verification`
Enviar código de verificação

```json
{
  "email": "usuario@email.com",
  "userName": "Nome do Usuário"
}
```

### POST `/api/email/verify-code`
Verificar código de verificação

```json
{
  "email": "usuario@email.com",
  "code": "123456"
}
```

### POST `/api/email/send-password-reset`
Enviar e-mail de recuperação de senha

```json
{
  "email": "usuario@email.com"
}
```

### POST `/api/email/send-invoice`
Enviar nota fiscal

```json
{
  "email": "cliente@email.com",
  "invoiceData": {
    "customerName": "Nome do Cliente",
    "number": "NF-001",
    "amount": "R$ 100,00",
    "date": "07/01/2025",
    "description": "Serviços prestados"
  }
}
```

## 🔒 Segurança

- ✅ Chaves EmailJS protegidas no backend
- ✅ Validação de dados
- ✅ Rate limiting nos códigos de verificação
- ✅ Integração com backend .NET para validações

## 🏗️ Arquitetura

```
Frontend Vue.js → Node.js API → EmailJS
                      ↓
                Backend .NET → MariaDB
```

