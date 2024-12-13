import clues from './clues.js';


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

            
            // Get the current file name to scope localStorage keys
            const currentPage = window.location.pathname.split('/').pop();

            // Create a <p> element for the clue text
            const clueElement = document.createElement('p');
            clueElement.textContent = `${key}: ${clue.clue}`;

            // Create an <input> element
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.id = `clue${key}`;

            // Pre-fill input if the answer is already correct
            const storedAnswer = localStorage.getItem(`${currentPage}_clue${key}`);
            if (storedAnswer) {
                inputElement.value = storedAnswer;
                inputElement.disabled = true; // Prevent editing
            }
            // Add event listener for "Enter" key press on the input field
            inputElement.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    clueSubmission(key);  // Call the submit function on Enter
                }
            });            

            // Create a <button> element
            const buttonElement = document.createElement('button');
            buttonElement.type = 'submit';
            buttonElement.textContent = 'Check';
            buttonElement.setAttribute('onclick', `submit(${key})`);

            // Attach onclick event for the button
            buttonElement.onclick = function() {
                clueSubmission(key);  // Pass the clue key to submit
            };

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
            clueContainer.appendChild(addressElement);
            clueContainer.appendChild(inputElement);
            clueContainer.appendChild(buttonElement);
            clueContainer.appendChild(resultElement);
            clueContainer.appendChild(document.createElement('hr'));
        }
    }
}

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
function clueSubmission (clueId) {
    const currentPage = window.location.pathname.split('/').pop();

    const userAnswer = document.getElementById(`clue${clueId}`).value.trim();
    const correctAnswer = clues[clueId]?.answer;

    const normalizedUserAnswer = normalize(userAnswer);
    const normalizedCorrectAnswer = normalize(correctAnswer);

    // console.log("Normalized User Answer:", normalizedUserAnswer);
    // console.log("Normalized Correct Answer:", normalizedCorrectAnswer);

    const threshold = 0.85; // Adjust threshold for strictness
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

        // Store the correct answer with a key scoped to the current page
        localStorage.setItem(`${currentPage}_clue${clueId}`, correctAnswer);
    } else {
        resultElement.textContent = "Nah!";
        resultElement.style.color = "red";
    }
};


// Define the target date and time
const targetDate = new Date('2024-12-14T17:30:00-05:00'); // 5:30 PM EDT
// Get the current date and time
const now = new Date();
// Get the current file name from the URL
const currentPage = window.location.pathname.split('/').pop();
// Check if the current time is after the target date and time
if (currentPage === 'construction.html' || now > targetDate) {
    // Call the function after the DOM has loaded
    document.addEventListener('DOMContentLoaded', populateClues);
}