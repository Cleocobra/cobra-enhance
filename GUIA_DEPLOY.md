# Guia de Deploy - Cobra Enhance 🐍

Você **NÃO** precisa contratar nada novo! Podemos usar seu servidor atual.
Como já existe um sistema rodando lá, configurei este novo projeto para rodar em uma "porta" diferente (3010), assim eles não brigam entre si.

## Opção 1: Usando seu Servidor Digital Ocean (Recomendado se quiser economizar)

### Passo 1: Preparar os arquivos
Você precisa enviar a pasta do projeto (lunar-perigee) para o seu servidor.
Você pode fazer isso arrastando a pasta via FileZilla (ou Cyberduck) se tiver acesso, ou usando `git clone` se colocar o código no GitHub.

### Passo 2: Rodar o projeto
Acesse seu servidor via terminal (SSH) e entre na pasta do projeto:

```bash
cd pasta-do-projeto
```

Execute o comando mágico (substituindo o token pelo seu):

```bash
# Define sua chave (só precisa fazer uma vez)
export REPLICATE_API_TOKEN=SEU_TOKEN_REPLICATE_AQUI

# Sobe o servidor na porta 3010
docker-compose up -d --build
```

**Pronto!**
O site estará acessível em: `http://SEU_IP_DO_SERVIDOR:3010`

---

## Opção 2: Vercel (Mais fácil e Grátis)

Se achar mexer no servidor complicado, a **Vercel** é feita para esse tipo de projeto (Next.js) e tem plano grátis.

1. Crie uma conta em vercel.com.
2. Instale o Vercel CLI no seu computador aqui no terminal: `npm i -g vercel`
3. Digite `vercel` e dê Enter.
4. Ele vai pedir para logar e configurar tudo automaticamente.
5. No final, vá no painel da Vercel (Settings > Environment Variables) e adicione a chave `REPLICATE_API_TOKEN`.

Essa opção gera um link `cobra-enhance.vercel.app` automático com HTTPS (cadeado de segurança).
