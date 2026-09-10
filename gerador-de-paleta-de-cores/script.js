const palette = document.getElementById("palette");
const generateBtn = document.getElementById("generateBtn");

// Generate a random HEX color
function createColor() {
  return "#" + Math.floor(
    Math.random() * 16777215
  ).toString(16).padStart(6, "0");
}

// Create five colors
let colors = Array.from({ length: 5 }, () => ({
  hex: createColor(),
  locked: false
}));

// Render the palette
function renderPalette() {
  palette.innerHTML = "";

  colors.forEach((color, index) => {
    const colorCard = document.createElement("div");
    colorCard.className = "color-card";

    colorCard.innerHTML = `
      <div
        class="color-preview"
        style="background-color: ${color.hex};"
      >
        <button class="lock-btn" title="Lock color">
          ${color.locked ? "🔒" : "🔓"}
        </button>
      </div>

      <div class="color-info">
        <p class="hex-code">
          ${color.hex.toUpperCase()}
        </p>

        <button class="copy-btn">
          Copy HEX
        </button>
      </div>
    `;

    // Lock / unlock color
    const lockBtn = colorCard.querySelector(".lock-btn");

    lockBtn.addEventListener("click", () => {
      colors[index].locked = !colors[index].locked;
      renderPalette();
    });

    // Copy HEX value
    const copyBtn = colorCard.querySelector(".copy-btn");

    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(color.hex);

        copyBtn.textContent = "Copied!";

        setTimeout(() => {
          copyBtn.textContent = "Copy HEX";
        }, 1000);

      } catch (error) {
        console.error("Failed to copy color:", error);
      }
    });

    palette.appendChild(colorCard);
  });
}

// Generate a new palette
// Locked colors stay unchanged
generateBtn.addEventListener("click", () => {
  colors = colors.map(color => {
    if (color.locked) {
      return color;
    }

    return {
      hex: createColor(),
      locked: false
    };
  });

  renderPalette();
});

// Display initial palette
renderPalette();