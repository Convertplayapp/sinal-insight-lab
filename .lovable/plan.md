
# Corrigir Payload ASAAS e Validacao de CPF

## Problema
A API do ASAAS exige o campo `cpfCnpj` como obrigatorio para criar clientes. Alem disso, o CPF precisa ser validado antes do envio. Atualmente, o CPF so e coletado na tela inicial mas nao e enviado corretamente em todos os fluxos, e falta mascara de formatacao no campo.

## Mudancas Planejadas

### 1. CheckoutModal.tsx - Frontend

**Adicionar mascara de CPF**: Formatar automaticamente o campo CPF para `000.000.000-00` enquanto o usuario digita.

**Adicionar campos obrigatorios para ambos os metodos**: Mover os campos Telefone e CEP para a etapa `info` (primeira tela), pois o ASAAS exige esses dados para criar o cliente, tanto para PIX quanto para Cartao.

**Validacao visual de CPF**: Mostrar indicador de erro inline abaixo do campo CPF quando o valor for invalido (apos o usuario comecar a digitar), usando a funcao `isValidCpf` ja existente.

**Garantir envio completo do payload**: Incluir `phone` e `postalCode` no `customerData` enviado para o fluxo PIX (atualmente so e enviado no fluxo de cartao).

### 2. Edge Function (asaas-payment/index.ts) - Backend

**Tornar `cpfCnpj` obrigatorio**: Validar no servidor que `cpfCnpj` esta presente no `customerData` antes de chamar a API do ASAAS. Retornar erro claro se estiver ausente.

**Sempre incluir `cpfCnpj` no payload do cliente**: Alterar `buildCustomerPayload` para tratar `cpfCnpj` como campo obrigatorio (nao condicional).

**Adicionar `phone` ao payload do cliente**: Garantir que telefone tambem seja enviado quando disponivel.

---

## Detalhes Tecnicos

### Campos enviados ao ASAAS (Customer)
| Campo | Obrigatorio | Origem |
|-------|------------|--------|
| name | Sim | Formulario |
| email | Sim | Formulario |
| cpfCnpj | Sim | Formulario (validado) |
| phone | Recomendado | Formulario |
| postalCode | Recomendado | Formulario |

### Funcao de mascara CPF (nova)
```text
Entrada: 12345678900
Saida:   123.456.789-00
```

### Validacao CPF (ja existente, sera reutilizada)
- Remove caracteres nao numericos
- Verifica 11 digitos
- Rejeita sequencias repetidas (111.111.111-11)
- Calcula digitos verificadores

### Fluxo corrigido
```text
Tela Info: Nome + Email + CPF (com mascara) + Telefone + CEP
           -> Validacao CPF inline
           -> Se PIX: envia customerData completo, gera QR
           -> Se Cartao: avanca para dados do cartao

Tela Cartao: Nome no cartao + Numero + Validade + CVV
             -> Envia customerData + creditCard + creditCardHolderInfo
```

### Alteracoes no edge function
- `buildCustomerPayload`: campo `cpfCnpj` deixa de ser condicional
- Validacao server-side: rejeitar requests sem `cpfCnpj` com mensagem "CPF/CNPJ e obrigatorio"
