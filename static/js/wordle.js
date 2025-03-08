const gameBoard = document.getElementById("gameCanvas");
const ctx = gameBoard.getContext("2d");
const keyboardLetters = [
  "q",
  "w",
  "e",
  "r",
  "t",
  "y",
  "u",
  "i",
  "o",
  "p",
  "a",
  "s",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "z",
  "x",
  "c",
  "v",
  "b",
  "n",
  "m",
];

const colorPriority = {
  r: 0,
  y: 1,
  g: 2,
};

class Wordle {
  constructor() {
    this.loadStrings(
      "https://raw.githubusercontent.com/agarbutt268/Projects/main/p00_Wordle/words.csv",
    ).then((data) => {
      this.validWords = data.split(",");
    });

    this.loadStrings(
      "https://raw.githubusercontent.com/agarbutt268/Projects/main/p00_Wordle/words_reasonable.csv",
    ).then((data) => {
      this.solutionWords = data.split(",");
      this.solution =
        this.solutionWords[
          Math.floor(Math.random() * (this.solutionWords.length + 1))
        ];

      console.log(this.solution);
    });

    this.guessNum = 0;
    this.currentGuess = [];
    this.intensity = 0;
    this.keyColors = {};

    this.drawGrid();
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Modal elements
    this.modal = document.getElementById("gameModal");
    this.modalMessage = document.getElementById("modalMessage");
    this.playAgainButton = document.getElementById("playAgainButton");

    // Add event listener to the play again button
    this.playAgainButton.addEventListener("click", this.newGame.bind(this));

    // Add event listeners to the on-screen keyboard buttons
    keyboardLetters.forEach((letter) => {
      const button = document.getElementById(letter.toUpperCase());
      if (button) {
        button.addEventListener("click", () =>
          this.handleKeyDown({ key: letter }),
        );
      }
    });
  }

  async loadStrings(filename) {
    const contents = await fetch(filename);
    let data = await contents.text();

    return data;
  }

  // handles key presses and calls coresponding methods
  handleKeyDown(event) {
    let key = event.key;

    if (key >= "a" && key <= "z") {
      this.typeLetter(event.key);
    }
    if (key === "Enter") {
      this.enter();
    }
    if (key === "Backspace" || key === "Delete") {
      this.delete();
    }
  }

  // Types a letter
  typeLetter(key) {
    if (this.currentGuess.length < 5) {
      this.currentGuess.push(key);
      this.renderCurrentGuess();
    }
  }

  // Delete the last typed letter
  delete() {
    this.currentGuess.pop();
    this.renderCurrentGuess();
  }

  renderCurrentGuess() {
    // Clear the current row
    const tileY = this.guessNum * (gameBoard.height / 6) + 5;
    ctx.clearRect(0, tileY, gameBoard.width, gameBoard.height / 6 - 10);

    // Draw letters
    ctx.fillStyle = "rgb(0 0 0)";
    ctx.font = "48px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    this.currentGuess.forEach((letter, index) => {
      const tileX = index * (gameBoard.width / 5) + 5;
      const tileWidth = gameBoard.width / 5 - 10;
      const tileHeight = gameBoard.height / 6 - 10;

      // Draw the tile background
      ctx.fillStyle = `rgb(255, 255, 255)`;
      ctx.fillRect(tileX, tileY, tileWidth, tileHeight);

      // Draw the letter
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.fillText(
        letter.toUpperCase(),
        tileX + tileWidth / 2,
        tileY + tileHeight / 2 + 4, // Adjust as needed
      );
    });

    // Redraw grid lines
    for (let x = 0; x < gameBoard.width; x += gameBoard.width / 5) {
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 3;
      ctx.strokeRect(
        x,
        this.guessNum * (gameBoard.height / 6),
        gameBoard.width / 5,
        gameBoard.height / 6,
      );
    }
  }

  // submits current guess
  enter() {
    if (this.currentGuess.length >= 5) {
      if (this.validWord()) {
        let result = this.evaluateGuess();
        let guessLetters = this.currentGuess.slice(); // Copy current guess
        this.renderTiles(result, guessLetters); // Pass letters to renderTiles
        // Delay resetting and progressing to the next guess until after animation
        const totalAnimationTime = (result.length - 1) * 500 + 500;
        setTimeout(() => {
          this.guessNum++;
          this.currentGuess = [];
          if (result.every((a) => a == "g")) {
            this.showModal("Congratulations! You won!");
          } else if (this.guessNum >= 6) {
            this.showModal(
              `You lost! The word was ${this.solution.toUpperCase()}`,
            );
          }
        }, totalAnimationTime);
      } else {
        console.log("Not a valid word");
      }
    }
  }

  // verifies if the current guess is a valid word
  validWord() {
    let guess = this.currentGuess.join("");
    let isValidWord = this.validWords.includes(guess);

    return isValidWord;
  }

  /*
    compares current guess with target word and
    returns a color for each letter in an array

    r = grey (not in word)
    y = yellow (in word but incorrect position)
    g = green (in word and correct position)
  */
  evaluateGuess() {
    let result = Array(5).fill("r");
    let guessCopy = [...this.currentGuess];
    let solutionCopy = [...this.solution];

    // checks for letters in the correct location and sets them green
    guessCopy.forEach((letter, index) => {
      if (letter == solutionCopy[index]) {
        result[index] = "g";
        solutionCopy[index] = null;
        guessCopy[index] = null;
      }
    });

    // checks for letters that are in word but not in correct location
    guessCopy.map((letter, index) => {
      if (letter && solutionCopy.includes(letter)) {
        result[index] = "y";
        solutionCopy[solutionCopy.indexOf(letter)] = null;
      }
    });

    return result;
  }

  // Draws game grid
  drawGrid() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    for (let x = 0; x < gameBoard.width; x += gameBoard.width / 5) {
      for (let y = 0; y < gameBoard.height; y += gameBoard.height / 6) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, gameBoard.width / 5, gameBoard.height / 6);
      }
    }
  }

  /*
    Provided the array of tile colors, changes
    the tiles to their corresponding colors
  */
  renderTiles(array, letters) {
    const duration = 750; // Duration of each tile's animation
    array.forEach((color, index) => {
      const delay = index * 750; // Delay before each tile starts animating
      const letter = letters[index];
      this.animateTileColor(index, color, duration, delay, letter);
    });
  }

  animateTileColor(index, color, duration, delay, letter) {
    const startTime = Date.now() + delay;
    const tileX = index * (gameBoard.width / 5) + 5;
    const tileY = this.guessNum * (gameBoard.height / 6) + 5;
    const tileWidth = gameBoard.width / 5 - 10;
    const tileHeight = gameBoard.height / 6 - 10;

    const initialColor = [255, 255, 255]; // Starting from white
    let targetColor;

    switch (color) {
      case "g":
        targetColor = [0, 255, 0]; // Green
        break;
      case "y":
        targetColor = [255, 255, 0]; // Yellow
        break;
      case "r":
        targetColor = [125, 125, 125]; // Gray
        break;
      default:
        targetColor = [125, 125, 125];
        break;
    }

    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const t = Math.min(elapsedTime / duration, 1); // Normalized time between 0 and 1

      // Interpolate color
      const currentColor = initialColor.map((start, i) => {
        return Math.round(start + (targetColor[i] - start) * t);
      });

      // Clear the tile area
      ctx.clearRect(tileX, tileY, tileWidth, tileHeight);

      // Draw the tile with interpolated color
      ctx.fillStyle = `rgb(${currentColor[0]}, ${currentColor[1]}, ${currentColor[2]})`;
      ctx.fillRect(tileX, tileY, tileWidth, tileHeight);

      // Redraw the letter on top
      ctx.fillStyle = "rgb(0, 0, 0)";
      ctx.font = "48px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        letter.toUpperCase(),
        tileX + tileWidth / 2,
        tileY + tileHeight / 2 + 4, // Adjust as needed
      );

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        // Update the color of the key on the keyboard
        this.colorKey(letter, color);
      }
    };

    // Start animation after the specified delay
    setTimeout(() => {
      requestAnimationFrame(animate);
    }, delay);
  }

  // changes the color of the key on the keyboard
  colorKey(letter, color) {
    // if the key hasn't been colored or if new color has higher priority (e.g. g > y)
    if (
      !this.keyColors[letter] ||
      colorPriority[color] > colorPriority[this.keyColors[letter]]
    ) {
      console.log("color changed!");
      // store color in keyColors
      this.keyColors[letter] = color;
      const keyElement = document.getElementById(letter.toUpperCase());
      if (keyElement) {
        switch (color) {
          case "g":
            keyElement.style.backgroundColor = "rgb(0 255 0)";
            break;
          case "y":
            keyElement.style.backgroundColor = "rgb(255 255 0)";
            break;
          case "r":
            keyElement.style.backgroundColor = "rgb(125 125 125)";
            break;
          default:
            keyElement.style.backgroundColor = "rgb(125 125 125)";
            break;
        }
      }
    }
  }

  // shows the modal with a message
  showModal(message) {
    this.modalMessage.textContent = message;
    this.modal.classList.add("show"); // Add 'show' class to trigger fade-in
  }

  // starts a new game
  newGame() {
    this.modal.classList.remove("show"); // Remove 'show' class to hide modal
    this.drawGrid();
    this.solution =
      this.solutionWords[
        Math.floor(Math.random() * (this.solutionWords.length + 1))
      ];
    this.guessNum = 0;
    this.keyColors = {}; // Reset key colors for new game
    console.log(this.solution);

    // Reset keyboard colors
    keyboardLetters.forEach((letter) => {
      const keyElement = document.getElementById(letter.toUpperCase());
      if (keyElement) {
        keyElement.style.backgroundColor = "";
      }
    });
  }
}

// Instantiate the Wordle object when the page is loaded
window.addEventListener("load", () => {
  let wordle = new Wordle();
  console.log("game started!");
});
