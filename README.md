# Encurtador de URL

Este projeto foi desenvolvido por **Daniel Reis** e **Andressa Lopes** como parte da disciplina de **Desenvolvimento Web**, ministrada pelo professor **Ciniro Nametala**. O objetivo do projeto é criar um encurtador de URL utilizando uma stack moderna, com React no frontend e um backend dedicado para gerenciar as URLs.

## Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes requisitos instalados em sua máquina:

-   **Node.js**: O projeto utiliza Node.js para rodar tanto o frontend quanto o backend. Se você ainda não tem o Node.js instalado, siga os passos abaixo:

    ### Instalando o Node.js

    1. **Windows/Mac**:

        - Acesse o site oficial do [Node.js](https://nodejs.org/).
        - Baixe a versão LTS (recomendada para a maioria dos usuários).
        - Siga as instruções do instalador.

    2. **Linux**:

        - Abra o terminal e execute os seguintes comandos:
            ```bash
            sudo apt update
            sudo apt install nodejs npm
            ```

    3. **Verificando a instalação**:
        - Após a instalação, verifique se o Node.js e o npm (Node Package Manager) foram instalados corretamente:
            ```bash
            node -v
            npm -v
            ```
        - Isso deve retornar as versões instaladas do Node.js e npm.

## Instalando e Rodando o Projeto

### 1. Clonando o Repositório

Primeiro, clone o repositório do frontend do projeto para sua máquina:

```bash
git clone https://github.com/doninhafac/frontend_urlshortener
cd frontend_urlshortener
```

### 2. Instalando Dependências

Navegue até a pasta do frontend e instale as dependências necessárias:

```bash
cd frontend
npm install
```

### 3. Rodando o Backend

Antes de rodar o frontend, certifique-se de que o backend está rodando. O backend é essencial para que o encurtador de URL funcione corretamente.

Clone o repositório do backend:

```bash
git clone https://github.com/doninhafac/backend_urlshortener
cd backend_urlshortener
```

Para as instruções corretas de instalação e execução do backend, consulte o README no repositório do backend.

### 4. Rodando o Frontend

Com o backend rodando, volte para a pasta do frontend e inicie o servidor de desenvolvimento:

```bash
cd ../frontend
npm run dev
```

O frontend deve estar rodando em http://localhost:5137. Abra esse endereço no seu navegador para acessar a aplicação.

## Estrutura do Projeto

-   **backend/**: Contém o código do servidor backend, responsável por gerenciar as URLs encurtadas.
-   **frontend/**: Contém o código do frontend, desenvolvido com React e Vite.

## Contribuindo

Se você deseja contribuir com o projeto, sinta-se à vontade para abrir uma issue ou enviar um pull request. Todas as contribuições são bem-vindas!

**Nota**: Certifique-se de que o backend está rodando antes de iniciar o frontend. Sem o backend, o encurtador de URL não funcionará corretamente.

Feito com ❤️ por Daniel Reis e Andressa Lopes.
