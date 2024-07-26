// In this peoject Algorithmic Thinking is learned by building a dice game

// HTML Elements Assignment
const listOfAllDice = document.querySelectorAll('.die') // Get all dice elements & assign to listOfDice

// Get score inputs and score spans
const scoreInputs = document.querySelectorAll("#score-options input")
const scoreSpans = document.querySelectorAll("#score-options span")

// Get elements for current round and current round rolls
const currentRound = document.getElementById("current-round")
const currentRoundRolls = document.getElementById("current-round-rolls")

// Get elements for total score and score history
const totalScore = document.getElementById("total-score")
const scoreHistory = document.getElementById("score-history")

// Get buttons and rules container
const rollDiceBtn = document.getElementById("roll-dice-btn")
const keepScoreBtn = document.getElementById("keep-score-btn")
const rulesBtn = document.getElementById("rules-btn")
const rulesContainer = document.querySelector(".rules-container")


// State Variables Initialization
let isModalShowing = false // variable to track the state of the game rules

// Variable to track all dice values
let diceValuesArr = []

// Variables to keep track of current score, total score, number of rolls, and current round
let rolls = 0
let score = 0
let total = 0
let round = 1


// Function to roll dice
const rollDice = () => {
    diceValuesArr = [];
  
    for (let i = 0; i < 5; i++) {
      const randomDice = Math.floor(Math.random() * 6) + 1;
      diceValuesArr.push(randomDice);
    };
  
    listOfAllDice.forEach((dice, index) => {
      dice.textContent = diceValuesArr[index];
    });
};


// Function to update stats (rolls and round)
const updateStats = () => {
    currentRoundRolls.textContent = rolls
    currentRound.textContent = round
}


const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false
  scoreInputs[index].value = score
  scoreSpans[index].textContent = `, score = ${score}`;
}


// Function to update score
const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScore.textContent = score;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};


const getHighestDuplicates = (arr) => {
    const counts = {};
  
    for (const num of arr) {
      if (counts[num]) {
        counts[num]++;
      } else {
        counts[num] = 1;
      }
    }
  
    let highestCount = 0;
  
    for (const num of arr) {
      const count = counts[num];
      if (count >= 3 && count > highestCount) {
        highestCount = count;
      }
      if (count >= 4 && count > highestCount) {
        highestCount = count;
      }
    }
  
    const sumOfAllDice = arr.reduce((a, b) => a + b, 0);
  
    if (highestCount >= 4) {
      updateRadioOption(1, sumOfAllDice);
    }
  
    if (highestCount >= 3) {
      updateRadioOption(0, sumOfAllDice);
    }
  
    updateRadioOption(5, 0);
};


const detectFullHouse = (arr) => {
  const counts = {};

  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25);
  }

  updateRadioOption(5, 0);
};


const resetRadioOptions = () => {
  
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });
  
  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};


const resetGame = () => {

  diceValuesArr = [0, 0, 0, 0, 0];

  score = 0;
  round = 1;
  rolls = 0;

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScore.textContent = score;
  scoreHistory.innerHTML = "";

  currentRoundRolls.textContent = rolls;
  currentRound.textContent = round;

  resetRadioOptions();
};


const checkForStraights = (arr) => {
  const sortedArr = [...new Set(arr)].sort((a, b) => a - b);
  
  if (sortedArr.length === 5 && sortedArr[4] - sortedArr[0] === 4) {
    updateRadioOption(4, 40);
    updateRadioOption(3, 30); 
    return;
  }
  
  const smallStraightPatterns = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6]
  ];
  
  for (const pattern of smallStraightPatterns) {
    if (pattern.every(value => sortedArr.includes(value))) {
      updateRadioOption(3, 30);
      return;
    }
  }
  
  updateRadioOption(5, 0);
};


// When user rolls five random die #'s generate and display on screen
rollDiceBtn.addEventListener("click", ()=>{
  if(rolls === 3 ){
    alert("You have made three rolls this round. Please select a score.")
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr)
    checkForStraights(diceValuesArr)
  }
})

// Toggle Game Rules
rulesBtn.addEventListener("click",()=>{
  // 1st click sets to True, 2nd sets back to False, each click continues pattern
  isModalShowing = !isModalShowing;
    
  // depanding on state of isModalShowing a ternary is used to go back and forth between these changes
  rulesContainer.style.display = isModalShowing ? 'block' : 'none';
  rulesBtn.textContent = isModalShowing ? "Hide Rules" : "Show Rules";
})

keepScoreBtn.addEventListener("click", ()=>{
  let selectedValue;
  let achieved;
  
  for (const radioButton of scoreInputs){
    if(radioButton.checked){
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }


  if (selectedValue){

    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);
    
    if (round > 6) {

      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);
      }, 500);

    }

  } else{
    alert("Please select an option or roll the dice");
  }

})
