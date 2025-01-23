let plane = document.getElementById('plane');
let walletAmount = document.getElementById('walletAmount');
let betAmountInput = document.getElementById('betAmount');
let multiplierDisplay = document.getElementById('multiplier');
let resultDisplay = document.getElementById('result');
let historyList = document.getElementById('history-list');
let activityList = document.getElementById('activity-list');

let currentHeight = 0; // Plane's current height
const maxHeight = 250; // Maximum height within the box
const minHeight = 0; // Minimum height (ground level)
let isFlying = false; // Is the plane flying?
let flightInterval; // Interval for the flight animation
let currentMultiplier = 1.00; // Current multiplier
let betHistory = []; // Store history of bets
let currentBetAmount; // Store current bet amount

// Sample user activity data
const users = [
   { name: "Rohan", multiplierWon : "3x", coinsLost : null },
   { name : "Sam", multiplierWon : null, coinsLost : "23" },
   { name : "Don", multiplierWon : "4x", coinsLost : null },
   { name : "Alice", multiplierWon : null, coinsLost : "15" },
   { name : "Bob", multiplierWon : "2x", coinsLost : null },
   { name : "Charlie", multiplierWon : null, coinsLost : "30" },
   { name : "Eve", multiplierWon : "5x", coinsLost : null },
   { name : "Mallory", multiplierWon : null, coinsLost : "12" },
   { name : "Trent", multiplierWon : "6x", coinsLost : null },
   { name : "Oscar", multiplierWon : null, coinsLost : "9" }
];

document.getElementById('placeBet').addEventListener('click', () => {
   let betAmount = parseInt(betAmountInput.value);
   
   if (betAmount > 0 && betAmount <= parseInt(walletAmount.textContent)) {
       walletAmount.textContent = parseInt(walletAmount.textContent) - betAmount; // Deduct from wallet
       currentBetAmount = betAmount; // Store current bet amount
       startFlight();
       
       betAmountInput.value = ''; // Clear input after placing a bet
   } else {
       alert("Invalid bet amount!");
   }
});

document.getElementById('cashOut').addEventListener('click', () => {
   if (isFlying) {
       cashOut();
   } else {
       alert("You need to place a bet first!");
   }
});

// Autofill previous amount when focusing on input
betAmountInput.addEventListener('focus', () => {
    if (currentBetAmount) {
        betAmountInput.value = currentBetAmount; // Autofill with last bet amount
    }
});

function startFlight() {
   isFlying = true;
   currentHeight = minHeight; 
   currentMultiplier = 1.00; 
   plane.style.bottom = `${currentHeight}px`;
   
   multiplierDisplay.textContent = currentMultiplier.toFixed(2);

   flightInterval = setInterval(() => {
       currentHeight += 5; // Increase height
       
       if (currentHeight >= maxHeight) { // Stop at the top of viewport
           clearInterval(flightInterval);
           isFlying = false; // Flight ends
           resultDisplay.textContent = "The plane has crashed! You lost your bet.";
           addHistory("Crashed", -currentBetAmount);
           return;
       }

       plane.style.bottom = `${currentHeight}px`;
       currentMultiplier += 0.05; 
       multiplierDisplay.textContent = currentMultiplier.toFixed(2);
       
       if (Math.random() < 0.01) { // Randomly simulate a crash
           clearInterval(flightInterval);
           isFlying = false; 
           resultDisplay.textContent = "The plane has crashed! You lost your bet.";
           addHistory("Crashed", -currentBetAmount);
       }
       
   }, 100); // Update every 100ms
}

function cashOut() {
   clearInterval(flightInterval);
   
   let cashOutAmount = Math.round(currentBetAmount * currentMultiplier); // Calculate cash out amount
   
   walletAmount.textContent = parseInt(walletAmount.textContent) + cashOutAmount; // Update wallet with cash out amount
   resultDisplay.textContent = `You cashed out at ${currentMultiplier.toFixed(2)}x! You won ${cashOutAmount} coins!`;
   
   addHistory("Cashed Out", cashOutAmount);
   
   resetGame();
   
   setTimeout(() => resetPlane(), 3000); // Reset plane position after delay
}

function resetGame() {
   isFlying = false; 
}

function resetPlane() {
   currentHeight = minHeight;
   plane.style.bottom = `${currentHeight}px`; // Reset position to bottom
}

function addHistory(action, amount) {
   const entry = document.createElement("div");
   entry.textContent = `${action}: ${amount} coins`;
   
   if (betHistory.length >= 5) { // Limit to last five entries
       betHistory.shift(); // Remove oldest entry
   }
   
   betHistory.push(entry); // Add new entry to history
   
   historyList.innerHTML = ""; // Clear history list and re-add all entries
   betHistory.forEach(item => historyList.appendChild(item));
}

// Function to update user activity every minute
function updateUserActivity() {
    activityList.innerHTML = ""; // Clear existing activity list
    
    users.forEach(user => {
        const listItem = document.createElement("li");
        
        if (user.multiplierWon) {
            listItem.className = 'activity-win'; // Add class for win styling
            listItem.textContent = `${user.name} won ${user.multiplierWon}`;
        } else if (user.coinsLost) {
            listItem.className = 'activity-loss'; // Add class for loss styling
            listItem.textContent = `${user.name} lost ${user.coinsLost} coins`;
        }
        
        activityList.appendChild(listItem);
    });
}

// Initial call to populate user activity on load
updateUserActivity();

// Set interval to update user activity every minute (60000 milliseconds)
setInterval(updateUserActivity, 60000);
