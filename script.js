const tween = KUTE.fromTo(
  '#blob1',
  { path: '#blob1'}, 
  { path: '#blob2'},
  { repeat: 999, duration: 3000, yoyo: true }
);
tween.start();

// Image input element
const imageInput = document.getElementById("image-input");
let downloadLink = null;

// Event listener for image input change
imageInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  // Check if a file is selected
  if (file) {
    const reader = new FileReader();

    // Read the file as an image
    reader.readAsDataURL(file);

    // When the image is loaded
    reader.onload = function (event) {
      const image = new Image();
      image.src = event.target.result;

      // Wait for the image to load
      image.onload = function () {
        // Create a temporary canvas
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;

        // Draw the image on the canvas
        ctx.drawImage(image, 0, 0);

        // Get the pixel data
        const imageData = ctx.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const data = imageData.data;

        // Convert the pixel data to ASCII art
        let asciiArt = "";
        const characters = [
          "@",
          "#",
          "S",
          "%",
          "?",
          "*",
          "+",
          ";",
          ":",
          ",",
          ".",
        ];
        const asciiWidth = Math.floor(canvas.width / 10);
        const asciiHeight = Math.floor(canvas.height / 20);

        for (let y = 0; y < asciiHeight; y++) {
          for (let x = 0; x < asciiWidth; x++) {
            const sourceX = Math.floor((x / asciiWidth) * canvas.width);
            const sourceY = Math.floor((y / asciiHeight) * canvas.height);
            const index = (sourceY * canvas.width + sourceX) * 4;
            const red = data[index];
            const green = data[index + 1];
            const blue = data[index + 2];
            const intensity = (red + green + blue) / 3;
            const characterIndex = Math.floor(
              (intensity / 255) * (characters.length - 1)
            );
            const character = characters[characterIndex];
            asciiArt += character.repeat(2); // Repeat the character to increase density
          }
          asciiArt += "\n";
        }

        // Create a temporary element to display the ASCII art (not shown on the webpage)
        const asciiElement = document.createElement("pre");
        asciiElement.textContent = asciiArt;

        // Convert the ASCII element to a data URL and download it
        const asciiDataUrl =
          "data:text/plain;charset=utf-8," + encodeURIComponent(asciiArt);

        // Remove the previous download link
        if (downloadLink) {
          URL.revokeObjectURL(downloadLink.href);
          document.body.removeChild(downloadLink);
        }

        // Create a new download link
        downloadLink = document.createElement("a");
        downloadLink.href = asciiDataUrl;
        downloadLink.download = "ascii_art.txt";
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Clean up temporary elements
        document.body.removeChild(asciiElement);
      };
    };
  }
});

function clearInput() {
  var getValue = document.getElementById("image-input");
  if (getValue.value !== "") {
    getValue.value = "";
  }
}
