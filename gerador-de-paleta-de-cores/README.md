# Color Palette Generator 🎨

Uma aplicação web leve, moderna e interativa para geração, travamento e cópia de paletas de cores hexadecimais em tempo real.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## 🚀 Funcionalidades

- **Geração Aleatória de Cores Hexadecimais:** Cria paletas harmônicas de 5 cores no formato HEX de 24 bits (`0x000000` a `0xFFFFFF`).
- **Bloqueio de Cores (Lock/Unlock):** Permite fixar cores favoritas enquanto novas combinações são geradas para as restantes.
- **Cópia Instantânea:** Copia o código HEX diretamente para a área de transferência com um único clique e feedback visual dinâmico.
- **Design Responsivo & Acessível:** Layout otimizado com Grid/Flexbox para desktop, tablet e dispositivos móveis, incluindo suporte a leitores de tela (`aria-label`).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica e acessível.
- **CSS3:** Estilização moderna utilizando CSS Variables (`:root`), Flexbox, CSS Grid e Media Queries.
- **JavaScript (ES6+):** Manipulação reativa de DOM, Event Delegation e Clipboard API assíncrona.

---

## ⚡ Otimizações Implementadas (Code Review)

Nesta versão refatorada, foram aplicadas melhorias arquiteturais de nível profissional:

1. **Correção Matemática na Geração de Cores:**
   - Ajuste do limite multiplicador de `16777215` para `16777216` (`16^6` cores possíveis no espaço RGB de 24 bits), garantindo que cores como o branco absoluto (`#FFFFFF`) possam ser geradas corretamente.
2. **Arquitetura Event Delegation:**
   - Substituição de múltiplos *listeners* individuais em cada card por um **único listener centralizado** no container `#palette`. Isso reduz o consumo de memória e melhora a performance de renderização.
3. **Acessibilidade (a11y):**
   - Adicionados atributos `aria-label` dinâmicos aos botões de ação para suporte a leitores de tela e navegação por teclado.
4. **Design Tokens com CSS Variables:**
   - Centralização da paleta de cores e temas na regra `:root` do CSS, facilitando a manutenção e a criação futura de novos temas (como Dark/Light mode).

---

## 📂 Estrutura do Projeto

```text
├── index.html   # Estrutura semântica da aplicação
├── style.css    # Estilização com variáveis e breakpoints responsivos
├── script.js    # Lógica de estado, renderização e eventos
└── README.md    # Documentação do projeto
```

---

## 💻 Como Executar

1. Clone ou baixe este repositório.
2. Abra o arquivo `index.html` em qualquer navegador web moderno.
3. Não é necessária a instalação de dependências ou servidores backend.

---

## 📝 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir!