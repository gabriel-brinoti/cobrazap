# CobraZap

MVP online para controle de cobranças e envio de mensagens prontas pelo WhatsApp.

## Stack

- React + Vite
- Supabase Auth + Database
- CSS puro responsivo

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Edite o `.env` com os dados do Supabase.

## Banco de dados

No Supabase, abra SQL Editor e rode o arquivo:

```txt
supabase/schema.sql
```

Depois crie seu usuário em Authentication > Users ou pela tela de login com cadastro manual, se liberar signup.

## Deploy

Pode subir na Vercel ou Netlify.

## Importante

Este MVP não envia mensagem automática pela API oficial. Ele abre o WhatsApp com a mensagem pronta usando link `wa.me`.
