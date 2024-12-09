import clues from './clues.js';
// let clues = []; // Global variable to hold parsed clues

// // Function to parse CSV data
// function parseCSV(csvText) {
//     // Normalize line endings to '\n'
//     csvText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
//     const rows = csvText.split('\n').filter(row => row.trim() !== ''); // Filter out empty rows

//     const headers = rows.shift()?.split(','); // Extract the header row

//     if (!headers) {
//         console.error('CSV headers are undefined. Check your CSV file format.');
//         return [];
//     }

//     // Convert rows into objects using the headers
//     return rows.map((row, index) => {
//         const obj = {};
//         const values = row.split(',');

//         headers.forEach((header, i) => {
//             obj[header.trim()] = values[i]?.trim() || ''; // Assign values, default to an empty string if undefined
//         });

//         obj.id = index + 1; // Add a unique ID based on row number
//         return obj;
//     });
// }


// // Function to dynamically create and insert HTML
// async function populateClues() {
//     const clueContainer = document.getElementById('clue_container');

//     if (!clueContainer) {
//         console.error('Clue container not found!');
//         return;
//     }

//     try {
//         // Fetch the CSV file
//         const response = await fetch('clues.csv');
//         const csvText = await response.text();
//         clues = parseCSV(csvText); // Parse and store in the global variable

//         // Loop through clues and create the HTML structure for each
//         clues.forEach(({ id, clue, answer, address }) => {
//             // Create a <p> element for the clue text
//             const clueElement = document.createElement('p');
//             clueElement.textContent = `${id}: ${clue}`;

//             // Create an <input> element for user input
//             const inputElement = document.createElement('input');
//             inputElement.type = 'text';
//             inputElement.id = `clue${id}`;

//             // Pre-fill input if the answer is already correct
//             const storedAnswer = localStorage.getItem(`clue${id}`);
//             if (storedAnswer) {
//                 inputElement.value = storedAnswer;
//                 inputElement.disabled = true; // Prevent editing
//             }

//             // Create a <button> element
//             const buttonElement = document.createElement('button');
//             buttonElement.type = 'submit';
//             buttonElement.textContent = 'Check';
//             buttonElement.setAttribute('onclick', `submit(${id})`);

//             // Disable button if already answered correctly
//             if (storedAnswer) {
//                 buttonElement.disabled = true;
//             }

//             // Create a <span> element to display the result
//             const resultElement = document.createElement('span');
//             resultElement.id = `result${id}`;
//             resultElement.style.fontWeight = 'bold';

//             // Create a <p> element for the address (hidden initially)
//             const addressElement = document.createElement('p');
//             addressElement.id = `address${id}`;
//             addressElement.style.display = 'none'; // Hide by default

//             // Display "Correct!" if answer is already stored
//             if (storedAnswer) {
//                 resultElement.textContent = 'Correct!';
//                 resultElement.style.color = 'green';
//                 addressElement.textContent = ${address};
//             }

//             // Append all created elements to the clueContainer
//             clueContainer.appendChild(clueElement);
//             clueContainer.appendChild(inputElement);
//             clueContainer.appendChild(buttonElement);
//             clueContainer.appendChild(resultElement);
//             clueContainer.appendChild(addressElement);
//         });
//     } catch (error) {
//         console.error('Error loading questions:', error);
//     }
// }

// Function to dynamically create and insert HTML
function populateClues() {
    const clueContainer = document.getElementById('clue_container');

    if (!clueContainer) {
        console.error('Clue container not found!');
        return;
    }

    // Loop through clues and create the HTML structure for each
    for (const key in clues) {
        if (clues.hasOwnProperty(key)) {
            const clue = clues[key];

            // Create a <p> element for the clue text
            const clueElement = document.createElement('p');
            clueElement.textContent = `${key}: ${clue.clue}`;

            // Create an <input> element
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = `clue${key}`;

            // Pre-fill input if the answer is already correct
            const storedAnswer = localStorage.getItem(`clue${key}`);
            if (storedAnswer) {
                inputElement.value = storedAnswer;
                inputElement.disabled = true; // Prevent editing
            }

            // Create a <button> element
            const buttonElement = document.createElement('button');
            buttonElement.type = 'submit';
            buttonElement.textContent = 'Check';
            buttonElement.setAttribute('onclick', `submit(${key})`);

            // Disable button if already answered correctly
            if (storedAnswer) {
                buttonElement.disabled = true;
            }

            // Create a <span> element to display the result
            const resultElement = document.createElement('span');
            resultElement.id = `result${key}`;
            resultElement.style.fontWeight = 'bold';

            // Create a <p> element for the address (hidden initially)
            const addressElement = document.createElement('p');
            addressElement.id = `address${key}`;

            // Display "Correct!" if answer is already stored
            if (storedAnswer) {
                resultElement.textContent = 'Correct!';
                resultElement.style.color = 'green';
                addressElement.textContent = `Address: ${clue.address}`;
            } else {
                addressElement.style.display = 'none'; // Hide
            }


            // Append all created elements to the clueContainer
            clueContainer.appendChild(clueElement);
            clueContainer.appendChild(inputElement);
            clueContainer.appendChild(buttonElement);
            clueContainer.appendChild(resultElement);
            clueContainer.appendChild(addressElement);
        }
    }
}

// Call the function after the DOM has loaded
document.addEventListener('DOMContentLoaded', populateClues);

// Helper to calculate string similarity using a simpler approach
function similarity(s1, s2) {
    // If both strings are identical, return 1
    if (s1 === s2) return 1.0;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    // Compute edit distance using a dynamic programming approach
    const dp = Array.from({ length: shorter.length + 1 }, (_, i) => i);

    for (let i = 1; i <= longer.length; i++) {
        let prev = dp[0];
        dp[0] = i;

        for (let j = 1; j <= shorter.length; j++) {
            const temp = dp[j];
            dp[j] = longer[i - 1] === shorter[j - 1] ? prev : Math.min(dp[j - 1], dp[j], prev) + 1;
            prev = temp;
        }
    }

    const distance = dp[shorter.length];
    const maxLength = longer.length;
    
    // Return similarity score as a ratio (closer to 1 is more similar)
    return (maxLength - distance) / maxLength;
}

// Normalize the text (same as before)
function normalize(text) {
    const unimportantWords = ["a", "an", "the", "of"];
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .replace(/\s+/g, " ")   // Collapse multiple spaces
        .trim()                 // Remove trailing spaces
        .split(" ")
        .filter(word => !unimportantWords.includes(word)) // Remove unimportant words
        .join(" ");
}

// Example usage of the improved similarity function
window.submit = function (clueId) {
    const userAnswer = document.getElementById(`clue${clueId}`).value.trim();
    const correctAnswer = clues[clueId]?.answer;

    const normalizedUserAnswer = normalize(userAnswer);
    const normalizedCorrectAnswer = normalize(correctAnswer);

    // console.log("Normalized User Answer:", normalizedUserAnswer);
    // console.log("Normalized Correct Answer:", normalizedCorrectAnswer);

    const threshold = 0.8; // Adjust threshold for strictness
    const similarityScore = similarity(normalizedUserAnswer, normalizedCorrectAnswer);

    // console.log("Similarity Score:", similarityScore);

    const resultElement = document.getElementById(`result${clueId}`);
    if (similarityScore >= threshold) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";

        const inputElement = document.getElementById(`clue${clueId}`);
        inputElement.value = correctAnswer;
        inputElement.disabled = true;

        const buttonElement = inputElement.nextElementSibling;
        buttonElement.disabled = true;

        const addressElement = document.getElementById(`address${clueId}`);
        addressElement.textContent = "Address: " + clues[clueId]?.address;
        addressElement.style.display = 'block';

        localStorage.setItem(`clue${clueId}`, correctAnswer);
    } else {
        resultElement.textContent = "Nah!";
        resultElement.style.color = "red";
    }
};
