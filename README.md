# 📅 Agenda Capital — 2026

Projeto desenvolvido em **React.js + Vite** com foco em **visualização clara de agendas públicas**, utilizando **leitura direta de dados locais (planilha/JSON)**, sem necessidade de API ou backend.

Este projeto é uma reconstrução moderna da Agenda Capital, pensado para **2026**, priorizando simplicidade, desempenho e clareza da informação.

---

## 🎯 Objetivo do Projeto

- Exibir agendas de forma organizada e acessível
- Consumir dados locais (planilha convertida para JSON)
- Não depender de backend ou API
- Servir como projeto de portfólio Frontend
- Facilitar futuras expansões (mobile-first, filtros, UX)

---

## 🛠️ Tecnologias Utilizadas

- ⚛️ **React.js**
- ⚡ **Vite**
- 📄 **JSON local (simulando planilha)**
- 🎨 CSS puro (sem frameworks)
- 🚀 Deploy preparado para **Vercel**

---

## 📂 Estrutura do Projeto

```bash
src/
 ├─ components/
 │   ├─ AgendaCard.jsx      # Card de exibição da agenda
 │   └─ SkeletonCard.jsx   # Loading visual
 ├─ services/
 │   └─ agendaService.js   # Leitura dos dados locais
 ├─ data/
 │   └─ agenda.json        # Dados da agenda (planilha)
 ├─ App.jsx
 ├─ main.jsx
 └─ index.css

---

# Rode o projeto Localmente com:

# Clone o repositório
git clone https://github.com/JLopes2024/agenda-capital-cdd-2026.git

# Acesse a pasta
cd agenda-capital-cdd-2026

# Instale as dependências
npm install

# Rode o projeto
npm run dev
