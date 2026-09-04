# 📱 Gerador de QR Code

Um aplicativo web simples, moderno e responsivo para geração e download de códigos QR a partir de textos ou URLs.

---

## 📌 Sumário

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar o Projeto](#-como-executar-o-projeto)
- [Como Funciona](#-como-funciona)
- [Licença](#-licença)

---

## 🌟 Visão Geral

O **Gerador de QR Code** é uma aplicação web leve desenvolvida em HTML, CSS e JavaScript puro (Vanilla JS). Ele permite que usuários convertam links, textos ou qualquer informação em um código QR escaneável de forma instantânea, oferecendo suporte para download direto da imagem gerada no formato PNG.

---

## ✨ Funcionalidades

- **Geração Instantânea:** Insira um texto ou URL e obtenha o QR Code correspondente de imediato.
- **Download do QR Code:** Baixe a imagem gerada em formato `.png` com nome de arquivo higienizado dinamicamente.
- **Design Clean e Responsivo:** Interface centralizada, limpa e adaptável a telas de computadores e dispositivos móveis.
- **Tratamento de Erros:** Sistema de fallback caso a transferência direta do arquivo via Blob seja bloqueada pelo navegador.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica do documento.
- **CSS3:** Estilização moderna, uso de Flexbox para centralização e layout dinâmico.
- **JavaScript (ES6+):** Manipulação do DOM, requisições assíncronas com `fetch` e criação de objetos Blob para download.
- **QR Server API:** API externa utilizada para a geração dinâmica dos QR Codes.

---

## 📁 Estrutura do Projeto

```text
.
├── index.html   # Estrutura e marcação principal da página
├── style.css    # Estilos CSS, layout responsivo e regras de exibição
└── script.js    # Lógica de integração com a API e fluxo de download