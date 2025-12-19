# 8K Enhance

Uma aplicação web moderna para **Upscale de Imagens com IA**, permitindo exportar em resoluções **2K, 4K e 8K**.
Focada em uma interface premium, minimalista e fácil de usar.

## 🚀 Funcionalidades

- **Upload Drag & Drop**: Suporte a JPG, PNG e WebP.
- **Múltiplas Resoluções**: Escolha entre 2K (QHD), 4K (UHD) e 8K (Ultra).
- **Opções Avançadas**: Controle de nitidez, redução de ruído e textura.
- **Preview Interativo**: Comparação "Antes e Depois" com slider.
- **Processamento no Backend**: Validação de arquivos e redimensionamento inteligente.

## 🛠️ Como Rodar Localmente

1. **Clone e Instale**
   ```bash
   git clone <repo>
   cd 8k-enhance
   npm install
   ```

2. **Inicie o Servidor**
   ```bash
   npm run dev
   ```
   Acesse: [http://localhost:3000](http://localhost:3000)

## ☁️ Configuração de IA (Upscaling Real)

Por padrão, este projeto roda em **Modo de Demonstração**, usando o algoritmo **Lanczos3 (High Quality)** via `sharp` para simular o upscale e permitir testes imediatos da interface.

Para usar um modelo de **Deep Learning (Real-ESRGAN, Stable Diffusion Upscale)**:
1. Edite `src/app/api/upscale/route.ts`.
2. Substitua o bloco "MOCK / FALLBACK" por uma chamada à API de sua preferência (ex: Replicate, DeepAI, Stability).
3. Adicione sua chave em `.env.local`:
   ```bash
   AI_API_KEY=sua_chave_aqui
   ```

## 📦 Deploy com Docker

1. **Build e Run**
   ```bash
   docker-compose up --build
   ```
2. A aplicação rodará na porta `3000`.

## 🔒 Limites e Segurança

- **Tamanho Máximo**: 25MB por arquivo.
- **Tipos Permitidos**: Imagens (raster) apenas. SVGs são bloqueados.
- **Sanitização**: Metadados são removidos durante o processamento (via Sharp) para privacidade.

---
Desenvolvido com **Next.js 14**, **React**, **TypeScript** e **CSS Modules**.
