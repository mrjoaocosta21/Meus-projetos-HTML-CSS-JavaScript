const boxes = document.querySelectorAll(".box");
const restartBtn = document.getElementById("restart");
const msg = document.getElementById("msg");

let turn = true; // true = X, false = O
let count = 0; // Contador de jogadas para identificar empate

const winnerPattern = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];  

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (turn) {
      box.innerText = "X";
      box.style.backgroundColor = "#7fffd4";
      turn = false;
    } else {
      box.innerText = "O";
      box.style.backgroundColor = "#ff83f1";
      turn = true;
    }
    box.disabled = true;
    count++; // Incrementa o contador a cada clique

    const isWinner = checkWinner();

    // Se chegar a 9 jogadas e não houver vencedor, declara empate
    if (count === 9 && !isWinner) {
      gameDraw();
    }
  });
});

const gameDraw = () => {
  msg.innerHTML = `O jogo empatou! 🤝`;
  disableBoxes();
};

const disableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = true;
  });
};

const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
    box.style.backgroundColor = "#ffffff";
  });
};

const checkWinner = () => {
  for (let pattern of winnerPattern) {
    let posval1 = boxes[pattern[0]].innerText;
    let posval2 = boxes[pattern[1]].innerText;
    let posval3 = boxes[pattern[2]].innerText;

    if (posval1 !== "" && posval2 !== "" && posval3 !== "") {
      if (posval1 === posval2 && posval2 === posval3) {
        msg.innerHTML = `Congratulations! <span style="color:red;">${posval1}</span> Player wins!`;
        disableBoxes();
        return true; // Retorna true informando que houve vencedor
      }
    }
  }
  return false; // Retorna false se ninguém venceu nesta rodada
};

const resetGame = () => {
  turn = true;
  count = 0; // Reseta a contagem de jogadas
  enableBoxes();
  msg.innerText = "Vamos jogar o jogo";
};

restartBtn.addEventListener("click", resetGame);