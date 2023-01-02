// elements.js
const elements = {
  // Text info
  dragonHealthText: document.querySelector("#dragon-health"),
  knightHealthText: document.querySelector("#knight-health"),

  // Buttons
  attackButton: document.querySelector("#attack-btn"),
  defendButton: document.querySelector("#defend-btn"),
  healButton: document.querySelector("#heal-btn"),

  // Containers
  gameLogContainer: document.querySelector("#game-log"),
  controlsContainer: document.querySelector("#controls"),
  combatLog: null,

  // Images
  dragonImage: document.querySelector("#dragon-image"),
  knightImage: document.querySelector("#knight-image"),
};

// constants.js
const roundType = {
  attack: "attack",
  defend: "defend",
  heal: "heal",
};

// state.js
// importuos elements.js
const state = {
  round: 0,
  dragonHealth: 200,
  knightHealth: 100,
  update() {
    elements.dragonHealthText.textContent = state.dragonHealth;
    elements.knightHealthText.textContent = state.knightHealth;
  },
  increaseRound() {
    state.round++;
  },
};

// utils.js
function generateNumberTo(max) {
  return Math.ceil(Math.random() * max);
}

// attack.js
function playerAttack() {
  const damage = generateNumberTo(10);
  state.dragonHealth -= damage;
  state.update();

  // čia yra mutuojamas log objektas, kuris referencina orginalų objektą
  // t.y. jei funkcijos kontekste pakeisim kažkokį objekto atributą, jis pasikeis ir orginaliame
  // instance
  //   log.playerText = `Knight attacks and deals ${damage} to the dragon.`;
  return damage;
}

// heal.js
function playerHeal() {
  const healing = generateNumberTo(30);
  const sum = state.knightHealth + healing;

  if (sum > 100) {
    state.knightHealth = 100;
  } else {
    state.knightHealth = sum;
  }

  state.update();

  return healing;
}

// dragon.js
function dragonAttack() {
  const damage = generateNumberTo(20);
  state.knightHealth -= damage;
  state.update();

  return damage;
}

// writeLog.js
function writeLogToHTML(roundLog) {
  if (!elements.combatLog) {
    setupCombatLog();
  }

  const liElement = document.createElement("li");
  const titleElement = document.createElement("span");
  const titleBoldElement = document.createElement("b");
  const playerInfoElement = document.createElement("span");
  const dragonInfoElement = document.createElement("span");

  titleElement.append(titleBoldElement);
  liElement.append(titleElement, playerInfoElement, dragonInfoElement);

  titleBoldElement.textContent = `Round ${state.round}`;
  playerInfoElement.textContent = roundLog.playerText;
  dragonInfoElement.textContent = roundLog.dragonText;

  elements.combatLog.append(liElement);
}

// writeLog.js
function setupCombatLog() {
  const heading = document.createElement("h2");
  heading.textContent = "Combat Log";
  elements.gameLogContainer.append(heading);

  elements.combatLog = document.createElement("ul");
  elements.combatLog.className = "combat-log";
  elements.gameLogContainer.append(elements.combatLog);
}

// endgame.js
function checkIfEndOfGame() {
  if (state.knightHealth <= 0) {
    // pašalinti riterio paveikslėlį
    elements.knightImage.remove();

    // pašalinti žaidimo kontrolę
    elements.controlsContainer.remove();
  } else if (state.dragonHealth <= 0) {
    // pašalinti drakono paveikslėlį
    elements.dragonImage.remove();

    // pašalinti žaidimo kontrolę
    elements.controlsContainer.remove();
  }
}

// playRound.js
function playRound(type) {
  state.increaseRound();

  const log = {
    playerText: null,
    dragonText: null,
  };

  switch (type) {
    case roundType.attack:
      const damage = playerAttack();
      log.playerText = `Knight attacks and deals ${damage} to the dragon.`;
      break;

    case roundType.defend:
      log.playerText = `Not implemented`;
      break;

    case roundType.heal:
      const healing = playerHeal();
      log.playerText = `Knight heals himself and receives ${healing} health.`;
      break;
  }
  // atlikti drakono ėjimą

  const damage = dragonAttack();
  log.dragonText = `Dragon attacks and deals ${damage} to the knight.`;

  writeLogToHTML(log);

  checkIfEndOfGame();
}

// palikti scripts.js
elements.attackButton.addEventListener("click", function () {
  playRound(roundType.attack);
});

elements.defendButton.addEventListener("click", function () {
  playRound(roundType.defend);
});

elements.healButton.addEventListener("click", function () {
  playRound(roundType.heal);
});
