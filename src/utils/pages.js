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
    <div id="main-image">
        <img src="images/cashflow-image-big.png" alt="Cashflow" title="Cashflow">
      </div>
    <div class="menu interaction-box">
    <div class="user-info-wrapper">
    <div class="username">__USERNAME__</div>
    <a href="/logout">
        <div class="logout fas fa-sign-out-alt"></div>
      </a>
      </div>
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
        Game Id : __GAME_ID__
      </div>
      <div id="error-message" class="message"></div>
      </div>
      <div id="players" class="players">
      </div>
    </div>
    <div class="menu  interaction-box">
    <div class="user-info-wrapper">
    <div class="username">__USERNAME__</div>
      </div>
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
        Game Id : __GAME_ID__
      </div>
      <div class="message" id="message">Waiting for host to start the game...</div>
      </div>
      <div id="players" class="players">
      </div>
    </div>
    <div class="menu  interaction-box">
    <div class="user-info-wrapper">
    <div class="username">__USERNAME__</div>
      </div>
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
  <script src="js/api.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/showProfession.js"></script>
</head>

<body>
  <div class="page-wrapper">
    <div id="profession-card" class="profession-card">
      <header>
        <div id="profession-image" class="profession-image">
          <img src="images/lawyer.png" alt="Lawyer">
        </div>
        <div id="profession-details" class="profession-details">
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
            <tbody>
              <tr>
                <th>Salary : </th>
                <td id="salary" class="salary"></td>
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
                <td id="home-mortgage-payment" ></td>
              </tr>
              <tr>
                <th>School Loan Payment : </th>
                <td id="school-loan-payment" ></td>
              </tr>
              <tr>
                <th>Car Loan Payment : </th>
                <td id="car-loan-payment" ></td>
              </tr>
              <tr>
                <th>Credit Card Payment : </th>
                <td id="credit-card-payment" ></td>
              </tr>
              <tr>
                <th>Other Expenses : </th>
                <td id="other-expenses" ></td>
              </tr>
              <tr>
                <th>Bank Loan Payment : </th>
                <td id="bank-loan-payment" ></td>
              </tr>
              <tr>
                <th>Per Child Expense : </th>
                <td id="per-child-expense" ></td>
              </tr>
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
      
    </div>
    </main>
    <div class="interaction-box other-players" id="other-players">
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
  <link rel="stylesheet" href="css/profile.css">
  <script src="js/api.js"></script>
  <script src="js/commonLib.js"></script>
  <script src="js/showLedger.js"></script>
  <script src="js/ratRaceBoard.js"></script>
  <script src="js/showMyProfile.js"></script>
</head>

<body>
  <div class="page-wrapper">
  <div id="board-space">
  <div class="expansion-window-screen"></div> 
    <div id="board">
      <div class="game-area">
        <div class="card-deck" id="market">
          <img src="images/ratrace/market.gif" alt="market">
          <div class="tile-name">Market</div>
        </div>
        <div class="card-deck" id="small-deal">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
        <div class="card-deck" id="big-deal">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
        <div class="card-deck" id="doodad">
          <img src="images/ratrace/doodad.png" alt="doodad">
          <div class="tile-name">Doodad</div>
        </div>
        <div id="players"></div>
        <div id="rat-tile-0">
        <div class="start">Start</div>
        </div>
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
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile doodad" id="rat-tile-2">
        <div class="tile-info">
          <img src="images/ratrace/doodad.png" alt="doodad">
          <div class="tile-name">Doodad</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-3">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile purples" id="rat-tile-4">
        <div class="tile-info">
          <img src="images/ratrace/charity.svg" alt="charity">
          <div class="tile-name">Charity</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-5">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile payday" id="rat-tile-6">
        <div class="tile-info">
          <img src="images/ratrace/payday.png" alt="payday">
          <div class="tile-name">Pay Day</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-7">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile market" id="rat-tile-8">
        <div class="tile-info">
          <img src="images/ratrace/market.gif" alt="market">
          <div class="tile-name">Market</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-9">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile doodad" id="rat-tile-10">
        <div class="tile-info">
          <img src="images/ratrace/doodad.png" alt="doodad">
          <div class="tile-name">Doodad</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-11">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile purples" id="rat-tile-12">
        <div class="tile-info">
          <img src="images/ratrace/downsized.png" alt="downsized">
          <div class="tile-name">Downsized</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-13">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile payday" id="rat-tile-14">
        <div class="tile-info">
          <img src="images/ratrace/payday.png" alt="payday">
          <div class="tile-name">Pay Day</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-15">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile market" id="rat-tile-16">
        <div class="tile-info">
          <img src="images/ratrace/market.gif" alt="market">
          <div class="tile-name">Market</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-17">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile doodad" id="rat-tile-18">
        <div class="tile-info">
          <img src="images/ratrace/doodad.png" alt="doodad">
          <div class="tile-name">Doodad</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-19">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile purples" id="rat-tile-20">
        <div class="tile-info">
          <img src="images/ratrace/child.png" alt="child">
          <div class="tile-name">Child</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-21">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile payday" id="rat-tile-22">
        <div class="tile-info">
          <img src="images/ratrace/payday.png" alt="payday">
          <div class="tile-name">Pay Day</div>
        </div>
      </div>
      <div class="ratrace-tile deal" id="rat-tile-23">
        <div class="tile-info">
          <img src="images/ratrace/deals.png" alt="deals">
            <div class="tile-name">Deal</div>
        </div>
      </div>
      <div class="ratrace-tile market" id="rat-tile-24">
        <div class="tile-info">
          <img src="images/ratrace/market.gif" alt="market">
          <div class="tile-name">Market</div>
        </div>
      </div>
    </div>
    </div>
    <div id="expansion-window"></div>
    <div id="game-panel">
      <header>
        <h2><a href="/">Cashflow</a></h2>
      </header>
      <nav id="game-nav">
        <ul>
          <li id="my-profile" onclick="showMyProfile()">
              <span class="expands-indicator">«</span>
              My profile
          </li>
          <li id="others-profile">
            <span class="expands-indicator">«</span>
            Other players
          </li>
          <li id="ledger" onclick="showMyLedger()">
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

const NOT_FOUND = `<html>

<head>
  <title>Not Found</title>
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/auth.css">
</head>

<body>
  <div class="page-wrapper">
    <div id="main-image">
      <img src="images/cashflow-image-big.png" alt="Cashflow" title="Cashflow">
    </div>
    <div class="interaction-box">
      <div class="not-found-wrapper">
        <div class="heading">404</div>
        <div class="heading">Page not found</div>
        <div class="home-button"><a href="/">Home</a></div>
      </div>
    </div>
  </div>
</body>

</html>`;

module.exports = { MAIN_MENU_PAGE, HOST_LOBBY, GUEST_LOBBY, PROFESSION_CARD, RAT_RACE_BOARD, NOT_FOUND };
