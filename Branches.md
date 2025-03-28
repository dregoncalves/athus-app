# Guia de Branches para o Projeto

## 🔹 Estrutura de Branches
Para manter o repositório organizado e facilitar o trabalho em equipe, seguiremos este fluxo de branches:

### 🌟 1. Branches Principais
- **`main`** → Contém apenas código estável e pronto para produção.
- **`develop`** → Onde o código em desenvolvimento é consolidado antes de ser enviado para `main`.

### 🔧 2. Branches de Desenvolvimento
Cada nova funcionalidade ou correção deve ser desenvolvida em uma branch separada. Isso evita conflitos e mantém o código limpo.

- **`feature/nome-da-feature`** → Para desenvolver novas funcionalidades.
  - Exemplo: `feature/tela-de-login`
- **`fix/nome-do-bug`** → Para corrigir bugs identificados no `develop`.
  - Exemplo: `fix/corrige-botao-login`
- **`hotfix/nome-do-fix`** → Para correções urgentes direto no `main`.
  - Exemplo: `hotfix/corrige-pagamento`

## 🔹 Fluxo de Trabalho
### 1️⃣ Criar uma nova branch para sua tarefa
```bash
git checkout develop  # Ir para a branch develop
git pull origin develop  # Atualizar o código mais recente
git checkout -b feature/nome-da-feature  # Criar a nova branch
```

### 2️⃣ Desenvolver e enviar o código para o repositório
```bash
git add .  # Adicionar arquivos modificados
git commit -m "feat: adiciona funcionalidade X"
git push origin feature/nome-da-feature  # Enviar para o GitHub
```

### 3️⃣ Criar um Pull Request (PR) para `develop`
- No GitHub, abra um **Pull Request (PR)** para mesclar sua branch no `develop`.
- Alguém do time revisa o código antes da aprovação.

### 4️⃣ Mesclar no `develop` e testar
```bash
git checkout develop
git merge feature/nome-da-feature
git push origin develop
```
- Após a mesclagem, **apague a branch** para evitar acúmulo:
```bash
git branch -d feature/nome-da-feature  # Apaga localmente
git push origin --delete feature/nome-da-feature  # Apaga do GitHub
```

### 5️⃣ Quando `develop` estiver estável, mesclar no `main`
```bash
git checkout main
git merge develop
git push origin main
```

## 🔹 Boas Práticas
✅ Sempre atualize sua branch antes de começar uma nova funcionalidade (`git pull`).
✅ Use nomes de branch descritivos (`feature/tela-de-cadastro`).
✅ Escreva mensagens de commit claras (`feat: adiciona botão de login`).
✅ Nunca faça alterações direto no `main` ou `develop`.
✅ Sempre revise Pull Requests antes de aprovar.

