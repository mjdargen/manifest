const star = `           <span style="color:gold;">*</span>`;
const treeOriginal = `
          /_\\
         /_\\_\\
        /_/_/_\\
        /_\\_\\_\\
       /_/_/_/_\\
       /_\\_\\_\\_\\
      /_/_/_/_/_\\
      /_\\_\\_\\_\\_\\
     /_/_/_/_/_/_\\
     /_\\_\\_\\_\\_\\_\\
    /_/_/_/_/_/_/_\\
    /_\\_\\_\\_\\_\\_\\_\\
   /_/_/_/_/_/_/_/_\\
   /_\\_\\_\\_\\_\\_\\_\\_\\
  /_/_/_/_/_/_/_/_/_\\
         [...]
`;

const treeContainer = document.getElementById("tree");

function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

function animateTree() {
  const lines = treeOriginal.split("\n");
  const animatedTree = lines.map((line) => {
    return line
      .split("") // Convert to characters
      .map((char) => {
        if (char === "_") {
          return Math.random() < 0.25 // 25% chance to replace
            ? `<span style="color:${getRandomColor()};">*</span>` // Ornament
            : "_";
        }
        return char;
      })
      .join(""); // Reassemble the line
  });

  treeContainer.innerHTML = star + animatedTree.join("\n"); // Join lines with newlines
}

document.addEventListener('DOMContentLoaded', () => {
    animateTree(); // Call the function immediately
    setInterval(animateTree, 1000); // Continue updating every second
  });
  