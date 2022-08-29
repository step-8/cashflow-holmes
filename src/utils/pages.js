const { generateRatTiles } = require('./commonLib.js');

const MAIN_MENU_PAGE = `<html>
<head>
  <title>Cash Flow</title>
  <script src="js/api.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/joinPopup.js"></script>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/mainMenu.css">
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>
<body>
  <div class="page">
    <div id="main-image"><img src="images/cashflow-image-big.png" alt="Cashflow" title="Cashflow"></div>
    <div class="menu flex-column interaction-box">
    <div class="user-info-wrapper large-font">
    <div class="username">__USERNAME__</div>
    <a href="/logout"><div class="logout fas fa-sign-out-alt"></div></a>
    </div>
    <div class="btn-wrapper large-font flex-column">
      <a href="/host"><div class="btn" id="host-btn">Host</div></a>
      <div class="btn" id="join-btn" onclick="createJoinPopup()">Join</div>
      <a href="/help"><div class="btn" id="how-to-play-btn">How To Play</div></a>
    </div>
    </div>
  </div>
</body>
</html>`;

const HOST_LOBBY = `<html>
<head>
  <title>Cash Flow</title>
  <link rel="stylesheet" href="css/lobby.css">
  <link rel="stylesheet" href="css/common.css">
  <script src="js/api.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/hostLobby.js"></script>
  <script src="js/drawLobby.js"></script>
</head>
<body>
  <div class="page">
    <div class="lobby">
    <div id="lobby-header">
      <div class="game-id" id="game-id">
        Game ID : __GAME_ID__
      </div>
      <div id="error-message" class="message"></div>
      </div>
      <div id="players" class="players">
      </div>
    </div>
    <div class="menu flex-column interaction-box">
    <div class="user-info-wrapper large-font">
    <div class="username">__USERNAME__</div>
      </div>
      <div class="btn-wrapper large-font flex-column">
        <div class="btn" id="start-btn" onclick="startGame(event)">Start</div>
        <a href="/cancel-game"><div class="btn" id="cancel-btn">Cancel</div></a>
      </div>
    </div>
  </div>
</body>
</html>`;

const GUEST_LOBBY = `<html>
<head>
  <title>Cash Flow</title>
  <script src="js/api.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/drawLobby.js"></script>
  <link rel="stylesheet" href="css/lobby.css">
  <link rel="stylesheet" href="css/common.css">
</head>
<body>
  <div class="page">
    <div class="lobby">
      <div id="lobby-header">
      <div class="game-id" id="game-id">
        Game ID : __GAME_ID__
      </div>
      <div class="message" id="message">Waiting for host to start the game...</div>
      </div>
      <div id="players" class="players">
      </div>
    </div>
    <div class="menu flex-column interaction-box">
    <div class="user-info-wrapper large-font">
    <div class="username">__USERNAME__</div>
      </div>
      <div class="btn-wrapper large-font flex-column">
        <div class="btn" id="leave-btn"><a href="/leave-lobby">Leave</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;

const PROFESSION_CARD = `<html>
<head>
  <title>Profession Card</title>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/professionCard.css">
  <script src="js/api.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/showProfession.js"></script>
</head>
<body>
  <div class="page-wrapper ">
    <div id="profession-card" class="profession-card">
      <header>
        <div id="profession-image" class="profession-image">
          <img src="images/lawyer.png" alt="Lawyer">
        </div>
        <div id="profession-details normal-font" class="profession-details">
          <h3>Your Profession is</h3>
          <h1 id="profession" class="profession"></h1>
          <div>Goal : Build your <strong>Passive Income</strong> to be greater than your <strong>Total
              Expenses</strong>.
          </div>
        </div>
      </header>
      <main>
      <div>
        <div id="income-statement" class="income-statement">
          <h4>INCOME STATEMENT</h4>
          <h2>1. Income</h2>
          <table>
            <tbody><tr><th>Salary : </th><td id="salary" class="salary"></td></tr></tbody>
          </table>
          <h2>2. Expenses</h2>
          <table>
            <tbody>
              <tr><th>Taxes : </th><td id="taxes"></td></tr>
              <tr><th>Home Mortgage Payment : </th><td id="home-mortgage-payment" ></td></tr>
              <tr><th>School Loan Payment : </th><td id="school-loan-payment" ></td></tr>
              <tr><th>Car Loan Payment : </th><td id="car-loan-payment" ></td></tr>
              <tr><th>Credit Card Payment : </th><td id="credit-card-payment" ></td></tr>
              <tr><th>Other Expenses : </th><td id="other-expenses" ></td></tr>
              <tr><th>Bank Loan Payment : </th><td id="bank-loan-payment" ></td></tr>
              <tr><th>Per Child Expense : </th><td id="per-child-expense" ></td></tr>
            </tbody>
          </table>
        </div>
        <div id="cashflow-block" class="cashflow-block">
          <div class="values" id="income"></div>
          <div class="symbol">+</div>
          <div class="values" id="passive-income">$0</div>
          <div id="total" class="total">
            <div class="symbol">=</div>
            <div class="values" id="total-income"></div>
          </div>
          <div class="symbol">-</div>
          <div class="values" id="total-expense"></div>
          <div id="cashflow" class="cashflow">
            <div class="symbol">=</div>
            <div class="values" id="monthly-cashflow" class="monthly-cashflow"></div>
          </div>
          <div>Monthly Cash Flow</div>
        </div>
      </div>
      <div id="balance-section" class="balance-section">
        <h4>BALANCE SHEET</h4>
        <div id="balance-sheet" class="balance-sheet">
          <div>
            <h2>3. Assets</h2>
            <table>
              <tbody><tr><th>Savings : </th><td id="savings"></td></tr></tbody>
            </table>
          </div>
          <div>
            <h2>4. Liabilities</h2>
            <table>
              <tbody>
                <tr><th>Home Mortgage : </th><td id="home-mortgage"></td></tr>
                <tr><th>School Loans : </th><td id="school-loans"></td></tr>
                <tr><th>Car Loans : </th><td id="car-loans"></td></tr>
                <tr><th>Credit Card Debt : </th><td id="credit-card-debt"></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </main>
    <div class="interaction-box flex-column other-players" id="other-players">
    <div class="close">
        <div class="close-btn"><a href="/game-board">Play</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;

const RAT_RACE_BOARD = `<html>
<head>
  <title>Cashflow</title>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/board-style.css">
  <link rel="stylesheet" href="css/otherPlayers.css">
  <link rel="stylesheet" href="css/profile.css">
  <script src="js/api.js"></script>
  <script src="js/models.js"></script>
  <script src="js/cardBuilder.js"></script>
  <script src="js/cardsLib.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/loan.js"></script>
  <script src="js/createExpansionWindows.js"></script>
  <script src="js/showLedger.js"></script>
  <script src="js/showMyProfile.js"></script>
  <script src="js/showOtherPlayers.js"></script>
  <script src="js/ratRaceBoard.js"></script>
  
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>
<body>
  <div class="page-wrapper flex-row">
  <div id="board-space">
  <div class="expansion-window-screen"></div> 
    <div id="board">
      <div class="game-area">
        <div class="card-deck shadow flex-column market" id="market">
          <img src="images/ratrace/market.png" alt="market">
          <div class="tile-name">Market</div> </div>
        <div class="card-deck shadow flex-column deal" id="small-deal">
          <img src="images/ratrace/deal.png" alt="deals">
            <div class="tile-name">Deal</div> </div>
        <div class="card-deck shadow flex-column deal" id="big-deal">
          <img src="images/ratrace/deal.png" alt="deals">
            <div class="tile-name">Deal</div></div>
        <div class="card-deck shadow flex-column doodad" id="doodad">
          <img src="images/ratrace/doodad.png" alt="doodad">
          <div class="tile-name">Doodad</div></div>
        <div id="players"></div>
        <div id="rat-tile-0">
        <div class="start">
        <img src="/images/ratrace/start.png" alt="start"></div></div>
        <div id="game-stats">
          <div class="heading normal-font">Status</div>
          <table>
            <tr><th>Cash flow :</th><td id="cashflow-amount"></td></tr>
            <tr><th>Cash :</th><td id="total-cash"></td></tr>
            <tr><th>Expenses :</th><td id="expenses"></td></tr>
            <tr><th>Passive Income :</th><td id="passive-income"></td></tr>
          </table>
        </div>
        <div class="interaction-space">
        <div id="interaction-screen"></div>
        <div id="main-card"></div>
        <div id="message-space"></div>
        </div>
        </div>
        ${generateRatTiles()}
        <div id="downsized-positions" class="flex-row">
        <div id="rat-tile-12-1" class="downsized">
        <div class="place-name">1</div>
        </div>
        <div id="rat-tile-12-2" class="downsized">
        <div class="place-name">2</div>
        </div>
        </div>
    </div>
    </div>
    <div id="game-panel" class="flex-column">
      <header class="flex-row">
        <h2 class="large-font"><a href="/">Cashflow</a></h2>
      </header>
      <nav id="game-nav">
        <ul>
          <li id="my-profile" onclick="expandWindow(event)">
              <span class="expands-indicator">«</span>
              My Profile
          </li>
          <li id="others-profile" onclick="expandWindow(event)">
            <span class="expands-indicator">«</span>
            Other Players
          </li>
          <li id="ledger" onclick="expandWindow(event)">
            <span class="expands-indicator">«</span>
            Ledger
          </li>
        </ul>
      </nav>
      <div id="loan-options">
        <div class="small-font" id="take-loan" onclick="drawLoan(event)">Take Loan</div>
        <div class="small-font" id="pay-loan">Pay Debt</div>
      </div>
      <div id="logs"></div>
      <div id="choose-dice"></div>
      <div id="dice-box" class="flex-row">
      <div class="dice"></div>
      </div>
      <div id="board-toggle">Fast Track</div>
      <div id="escape-rat-race"></div>
    </div>
  </div>
  </div>
</body>
</html>`;

const NOT_FOUND = `<html>
<head>
  <title>Not Found</title>
  <link rel="stylesheet" href="/css/common.css">
  <link rel="stylesheet" href="/css/auth.css">
</head>
<body>
  <div class="page-wrapper flex-row">
    <div id="main-image">
      <img src="/images/cashflow-image-big.png" alt="Cashflow" title="Cashflow">
    </div>
    <div class="interaction-box flex-column">
      <div class="not-found-wrapper flex-column">
        <div class="heading">404</div>
        <div class="heading">Page not found</div>
        <div class="home-button big-font"><a href="/">Home</a></div>
      </div>
    </div>
  </div>
</body>
</html>`;

module.exports = { MAIN_MENU_PAGE, HOST_LOBBY, GUEST_LOBBY, PROFESSION_CARD, RAT_RACE_BOARD, NOT_FOUND };
