const MAIN_MENU_PAGE = `<html>

<head>
  <title>Cash Flow</title>
  <script src="js/commonLib.js"></script>
  <script src="js/joinPopup.js"></script>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/mainMenu.css">
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="page">
    <div id="main-image">
        <img src="images/cashflow-image-big.png" alt="Cashflow" title="Cashflow">
      </div>
    <div class="menu interaction-box">
    <a href="/logout">
        <div class="logout fas fa-sign-out-alt"></div>
      </a>
      <div class="btn-wrapper">
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
  <script src="js/hostLobby.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/drawLobby.js"></script>
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="page">
    <div class="lobby">
    <div id="lobby-header">
      <div class="game-id">
        Game Id :
      </div>
      <div id="error-message" class="message"></div>
      </div>
      <div id="players" class="players">
      </div>
    </div>
    <div class="menu  interaction-box">
      <div class="btn-wrapper">
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
  <script src="js/commonLib.js"></script>
  <script src="js/drawLobby.js"></script>
  <link rel="stylesheet" href="css/lobby.css">
  <link rel="stylesheet" href="css/common.css">
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="page">
    <div class="lobby">
      <div id="lobby-header">
      <div class="game-id">
        Game Id :
      </div>
      <div class="message" id="message">Waiting for host to start the game...</div>
      </div>
      <div id="players" class="players">
      </div>
    </div>
    <div class="menu  interaction-box">
      <div class="btn-wrapper">
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
  <script src="js/commonLib.js"></script>
  <script src="js/showProfession.js"></script>
</head>

<body>
  <div id="profession-card">

    <header>
      <div id="profession-image">
        <img src="images/lawyer.png" alt="Lawyer">
      </div>
      <div id="profession-details">
        <h3>Your Profession is</h3>
        <h1 id="profession"></h1>
        <div>Goal : Build your <strong>Passive Income</strong> to be greater than your <strong>Total Expenses</strong>.
        </div>
      </div>
    </header>

    <div>
      <div id="income-statement">
        <h4>INCOME STATEMENT</h4>

        <h2>1. Income</h2>
        <table>
          <tbody>
            <tr>
              <th>Salary : </th>
              <td id="salary"></td>
            </tr>
          </tbody>
        </table>

        <h2>2. Expenses</h2>
        <table>
          <tbody>
            <tr>
              <th>Taxes : </th>
              <td id="taxes"></td>
            </tr>
            <tr>
              <th>Home Mortgage Payment : </th>
              <td id="home-mortgage-payment"></td>
            </tr>
            <tr>
              <th>School Loan Payment : </th>
              <td id="school-loan-payment"></td>
            </tr>
            <tr>
              <th>Car Loan Payment : </th>
              <td id="car-loan-payment"></td>
            </tr>
            <tr>
              <th>Credit Card Payment : </th>
              <td id="credit-card-payment"></td>
            </tr>
            <tr>
              <th>Other Expenses : </th>
              <td id="other-expenses"></td>
            </tr>
            <tr>
              <th>Bank Loan Payment : </th>
              <td id="bank-loan-payment"></td>
            </tr>
            <tr>
              <th>Per Child Expense : </th>
              <td id="per-child-expense"></td>
            </tr>
          </tbody>
        </table>

      </div>

      <div id="cashflow-block">
        <div class="values" id="income"></div>
        <div class="symbol">+</div>
        <div class="values" id="passive-income">$0</div>
        <div id="total">
          <div class="symbol">=</div>
          <div class="values" id="total-income"></div>
        </div>
        <div class="symbol">-</div>
        <div class="values" id="total-expense"></div>
        <div id="cashflow">
          <div class="symbol">=</div>
          <div class="values" id="monthly-cashflow"></div>
        </div>
        <div>Monthly Cash Flow</div>
      </div>
    </div>

    <div id="balance-section">
      <h4>BALANCE SHEET</h4>
      <div id="balance-sheet">
        <div>
          <h2>3. Assets</h2>
          <table>
            <tbody>
              <tr>
                <th>Savings : </th>
                <td id="savings"></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <h2>4. Liabilities</h2>
          <table>
            <tbody>
              <tr>
                <th>Home Mortgage : </th>
                <td id="home-mortgage"></td>
              </tr>
              <tr>
                <th>School Loans : </th>
                <td id="school-loans"></td>
              </tr>
              <tr>
                <th>Car Loans : </th>
                <td id="car-loans"></td>
              </tr>
              <tr>
                <th>Credit Card Debt : </th>
                <td id="credit-card-debt"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
    <div class="close">
      <div class="close-btn"><a href="/game-board">Close</a></div>
    </div>
  </div>
</body>

</html>`;

const RAT_RACE_BOARD = `<html>

<head>
  <title>Cashflow</title>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/board-style.css">
  <script src="js/commonLib.js"></script>
  <script src="js/ratRaceBoard.js"></script>
</head>

<body>
  <div class="page-wrapper">
    <div id="board">
      <div class="game-area">
        <div class="card-deck" id="market">
          <img src="images/ratrace/market.gif" alt="market">
        </div>
        <div class="card-deck" id="small-deal">
          <img src="images/ratrace/deals.png" alt="deals">
        </div>
        <div class="card-deck" id="big-deal">
          <img src="images/ratrace/deals.png" alt="deals">
        </div>
        <div class="card-deck" id="doodad">
          <img src="images/ratrace/doodad.png" alt="doodad">
        </div>
        <div id="players"></div>
        <div id="initial-positions"></div>
        <div id="game-stats">
          <div class="heading">Status</div>
          <table>
            <tr>
              <th>Cash flow :</th>
              <td id="cashflow-amount"></td>
            </tr>
            <tr>
              <th>Cash :</th>
              <td id="total-cash"></td>
            </tr>
            <tr>
              <th>Expenses :</th>
              <td id="expenses"></td>
            </tr>
            <tr>
              <th>Passive Income :</th>
              <td id="passive-income"></td>
            </tr>
          </table>
        </div>
        <div class="interaction-space">
          <div id="interaction-screen"></div>
          <div id="main-card"></div>
          <div id="message-space"></div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-1">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile doodad" id="rat-tile-2">
        <img src="images/ratrace/doodad.png" alt="doodad">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-3">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile purples" id="rat-tile-4">
        <img src="images/ratrace/charity.svg" alt="charity">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-5">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile payday" id="rat-tile-6">
        <img src="images/ratrace/payday.png" alt="payday">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-7">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile market" id="rat-tile-8">
        <img src="images/ratrace/market.gif" alt="market">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-9">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile doodad" id="rat-tile-10">
        <img src="images/ratrace/doodad.png" alt="doodad">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-11">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile purples" id="rat-tile-12">
        <img src="images/ratrace/downsized.png" alt="downsized">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-13">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile payday" id="rat-tile-14">
        <img src="images/ratrace/payday.png" alt="payday">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-15">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile market" id="rat-tile-16">
        <img src="images/ratrace/market.gif" alt="market">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-17">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile doodad" id="rat-tile-18">
        <img src="images/ratrace/doodad.png" alt="doodad">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-19">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile purples" id="rat-tile-20">
        <img src="images/ratrace/child.png" alt="child">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-21">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile payday" id="rat-tile-22">
        <img src="images/ratrace/payday.png" alt="payday">
      </div>
      <div class="ratrace-tile deal" id="rat-tile-23">
        <img src="images/ratrace/deals.png" alt="deals">
      </div>
      <div class="ratrace-tile market" id="rat-tile-24">
        <img src="images/ratrace/market.gif" alt="market">
      </div>
    </div>
    <div id="game-panel">
      <header>
        <h2><a href="/">Cashflow</a></h2>
      </header>
      <nav id="game-nav">
        <ul>
          <li id="profile">
            <span class="expands-indicator">«</span>
            My profile
          </li>
          <li id="others-profile">
            <span class="expands-indicator">«</span>
            Other players
          </li>
          <li id="ledger">
            <span class="expands-indicator">«</span>
            Ledger
          </li>
        </ul>
      </nav>
      <div id="loan-options">
        <div id="take-loan">Take loan</div>
        <div id="pay-loan">Pay loan</div>
      </div>
      <div id="logs"></div>
      <div id="dice-box">
      <div class="dice"></div>
      </div>
      <div id="board-toggle"></div>
    </div>
  </div>
  </div>
</body>

</html>`;

module.exports = { MAIN_MENU_PAGE, HOST_LOBBY, GUEST_LOBBY, PROFESSION_CARD, RAT_RACE_BOARD };
