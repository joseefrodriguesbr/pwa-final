# Projeto Final da Disciplina

# Pós-Graduação em Desenvolvimento Mobile e Cloud Computing – Inatel
## DM122 - Desenvolvimento híbrido de aplicativos móveis

## Projeto Final da Disciplina
Implementação de uma aplicação PWA com Vanilla JS

### 👤 Autor: 
José Enderson Ferreira Rodrigues   
jose.rodrigues@pg.inatel.br, jose.e.f.rodrigues.br@gmail.com

## 📌 Implementação
Implementação de uma aplicação PWA com Vanilla JS para cadastro de agendamentos médicos

### Requisitos gerais:
✅ Desenvolvimento de uma Progressive Web App

✅ projeto a ser desenvolvido será uma Progressive Web App de tema livre que seja instalável no smartphone/desktop com sua execução totalmente offline após o processo de instalação através do "Service Worker", ou seja, independente de uma conexão com a internet.

✅ Controle de versão : O projeto avaliativo deverá ser desenvolvido com o auxílio de um controlador de versão desde o seu início. Para esta atividade foi utilizado o serviço GitHub.

✅ O projeto implantado em um provedor de hospedagem e acessível através do GitHub Pages: 
https://joseefrodriguesbr.github.io/pwa-final/ 

✅ HTML5 Cache API O projeto faz uso do Cache Storage para o armazenamento de arquivos estáticos.

✅ IndexedDB: Implementação de um CRUD responsável por cadastrar, recuperar, atualizar e deletar informações no banco de dados IndexedDB.


## 📌 Detalhamento da solução

#### 📂 Estrutura de pastas do projeto
```
📦 pwa-final
 ┗📂src
   ┣📂assets                         
   ┃ ┣📂icons                      # Ícones usados na aplicação              
   ┃ ┣📂images                     # Imagens usadas na aplicação
   ┃ ┗📂js                         # Scripts para suporte à tela    
   ┣📂css                          # Estilos para apresentação do html         		 
   ┗📂js
     ┣📜AgendamentoService.html    # Gerencia o CRUD (Create, Read, Update, Delete) dos registros de agendamento.
     ┣📜app.js                     # Orquestra a inicialização dos principais componentes da PWA.
     ┗📜HtmlService.js             # Gerencia a renderização da lista, a captura de dados do formulário e o tratamento de eventos do usuário (cliques em Editar/Excluir).  
   ┣📜index.html                   # Fornece o markup HTML de toda a interface do usuário.
   ┣📜manifest.json                # Fornece metadados essenciais para a experiência de instalação da PWA.
   ┗📜sw.js                        # Intercepta requisições de rede e gerencia o caching (armazenamento) dos recursos da aplicação (HTML, CSS, JS, imagens).          	 

```

## 🛠️ IDE
- **Visual Studio Code - versão 1.105.1**

## 💻 Linguagem
- **Javascript/Html/css**
