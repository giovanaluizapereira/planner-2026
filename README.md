
# Planner 2026 - Survival Edition

Este é um aplicativo premium de planejamento baseado na estética "Don't Starve", que utiliza IA para analisar sua Roda da Vida.

## 🚀 Como configurar

### 1. Supabase
- Crie um projeto no [Supabase](https://supabase.com).
- Execute o script SQL contido no arquivo `schema.sql` (ou no prompt da IA) no SQL Editor.
- Obtenha sua `SUPABASE_URL` e `SUPABASE_ANON_KEY` no painel de configurações de API.

### 2. Google Gemini API
- Obtenha uma chave de API no [Google AI Studio](https://aistudio.google.com/).

### 3. Vercel (Deploy)
- Conecte seu repositório GitHub ao Vercel.
- Adicione as seguintes Variáveis de Ambiente (Environment Variables):
  - `API_KEY`: Sua chave do Gemini.
  - `SUPABASE_URL`: URL do seu projeto Supabase.
  - `SUPABASE_ANON_KEY`: Chave anônima do Supabase.

## 🛠 Tecnologias
- React + TypeScript
- Tailwind CSS
- Lucide React (Ícones)
- Google Gemini API (Visão Computacional)
- Supabase (Banco de Dados em Tempo Real)
