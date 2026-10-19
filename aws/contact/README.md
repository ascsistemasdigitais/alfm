# Formulário de contato na AWS

O navegador envia os campos para `POST /api/contact`. A função Lambda envia a mensagem pelo Amazon SES; os destinatários ficam somente nas variáveis de ambiente da função.

## Lambda

- Runtime: Node.js 22.x
- Handler: `handler.handler`
- Variáveis de ambiente:
  - `ALLOWED_ORIGIN`: origem exata do site publicado, por exemplo `https://www.seudominio.com.br`
  - `CONTACT_FROM_EMAIL`: identidade de remetente verificada no Amazon SES
  - `CONTACT_RECIPIENTS`: endereços que receberão as mensagens, separados por vírgula
- Permissão IAM da role da função: `ses:SendEmail` para a identidade de remetente configurada.

Instale a dependência dentro desta pasta (`npm install`) e publique `handler.mjs`, `package.json` e `node_modules` no pacote da função.

## API Gateway e CloudFront

Crie uma rota `POST /api/contact` e uma rota `OPTIONS /api/contact` integradas à função. Se o API Gateway usar um domínio separado, configure o CORS para permitir apenas o domínio do site. Para usar a URL relativa já definida no `script.js`, configure no CloudFront o comportamento `/api/*` para encaminhar ao API Gateway; alternativamente, altere `CONTACT_API_URL` em `script.js` para a URL HTTPS pública da API. Não inclua destinatários nem credenciais no JavaScript.

No Amazon SES, verifique o domínio/remetente e solicite acesso de produção se a conta ainda estiver em sandbox. Configure também limites ou proteção contra abuso antes de publicar o endpoint.
