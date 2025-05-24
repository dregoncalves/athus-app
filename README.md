# Sistema Athus Front-End

Sistema web acessível voltado para comunidades, conectando prestadores de serviços com usuários em busca de soluções do dia a dia.

## Visão Geral

**Athus** é uma plataforma desenvolvida com foco em acessibilidade e inclusão comunitária. Seu objetivo principal é facilitar a conexão entre prestadores de serviços — como encanadores, eletricistas e borracheiros — e moradores que precisam desses serviços. Com uma interface simples e moderna, o sistema permite que prestadores divulguem seus serviços e usuários encontrem rapidamente quem possa ajudá-los.

O sistema é desenvolvido como um monolito, centralizando toda a lógica de negócio e interface em uma única aplicação mobile.

---

## Stack Técnica

### Backend

- **Linguagem:** Java
- **Framework:** Spring Boot
- **Banco de Dados:** MariaDB

> ⚠️ O backend está em outra branch e possui sua própria documentação.

### Frontend

- **Framework:** React Native (v0.79.1)
- **Versão do React:** 19.0.0
- **Gerenciador de navegação:** React Navigation
- **Expo:** v53.0.0 (com suporte ao Expo Router)
- **UI e Ícones:** 
  - @expo/vector-icons
  - @expo-google-fonts/poppins
  - lucide-react-native
- **Gerenciamento de Estado:** AsyncStorage
- **Chamadas de API:** Axios
- **Notificações Toast:** react-native-toast-message
- **Outras libs:** expo-camera, expo-linear-gradient, react-native-webview, react-native-svg

---

## Funcionalidades

- **Autenticação de Usuário**
  - Login e cadastro com email e senha
  - Persistência de sessão com tokens

- **Cadastro de Serviços**
  - Prestadores podem cadastrar seus serviços (ex: encanador, eletricista)

- **Busca por Serviços**
  - Usuários podem procurar prestadores por categoria ou nome do serviço

- **Avaliações**
  - Sistema de avaliação de prestadores

- **Design Moderno**
  - Interface visual acessível e responsiva

- **Fluxo de Aprovação**
  - Serviços cadastrados passarão por processo de aprovação (ainda não implementado)

- **Dashboard Administrativo**
  - Painel web em React está planejado para gestão administrativa (ainda não implementado)

---

## Estrutura do Projeto
```bash
athus-app/
├── app/ # Estrutura de rotas (Expo Router)
│ ├── (tabs)/ # Telas da tab bar principal
│ ├── auth/ # Telas de autenticação
│ ├── provider/ # Telas de provedores de serviço
│ ├── +layout.tsx
│ ├── +not-found.tsx
│ └── index.tsx
├── assets/
│ └── images/
├── components/ # Componentes de UI reutilizáveis
├── constants/
│ └── colors.ts
├── context/
│ ├── AuthContext.tsx
│ └── ThemeContext.tsx
├── data/
│ └── mockData.ts
├── hooks/
│ ├── useAuth.ts
│ ├── useFrameworkReady.ts
│ └── usePublicRoute.ts
├── services/
│ ├── api.ts
│ ├── auth.ts
│ └── user.ts
├── types/
│ └── env.d.ts
├── .prettierrc
├── app.json
├── tsconfig.json
```

---

## Começando

### Pré-requisitos

- Node.js 16+
- Expo CLI
- Git

### Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/athus-app.git
cd athus-app
```

2. Instale as dependências:
```bash
npm install
```
3. Inicie o projeto com Expo:
```bash
npm run dev
```
