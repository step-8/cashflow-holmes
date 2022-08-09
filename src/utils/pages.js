const MAIN_MENU_PAGE = `<html>

<head>
  <title>Cash Flow</title>
  <script src="js/commonLib.js"></script>
  <script src="js/joinPopup.js"></script>
  <link rel="stylesheet" href="css/mainMenu.css">
  <link rel="stylesheet" href="css/common.css">
</head>

<body>
  <div class="page">
    <div id="main-image">
        <img src="images/cashflow-image-big.png" alt="Cashflow" title="Cashflow">
      </div>
    <div class="menu interaction-box">
      <div class="btn-wrapper">
        <div class="btn" id="host-btn"><a href="/host">Host</a></div>
        <div class="btn" id="join-btn" onclick="createJoinPopup()">Join</div>
        <div class="btn" id="how-to-play-btn"><a href="/help">How To Play</a></div>
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
  <script src="js/commonLib.js"></script>
  <script src="js/drawLobby.js"></script>
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="page">
    <div class="lobby">
      <div class="room-id">
        Room-Id : 
      </div>
      <div class="players">
        <div id="player-1" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-2" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-3" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-4" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-5" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-6" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
      </div>
    </div>
    <div class="menu  interaction-box">
      <div class="btn-wrapper">
        <div class="btn" id="start-btn">Start</div>
        <div class="btn" id="cancel-btn">Cancel</div>
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
      <div class="room-id">
        Room-Id :
      </div>
      <div class="players">
        <div id="player-1" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-2" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-3" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-4" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-5" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
        <div id="player-6" class="player">
          <div class="profile-color grey">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="player-name"></div>
        </div>
      </div>
    </div>
    <div class="menu  interaction-box">
      <div class="btn-wrapper">
        <div class="btn" id="leave-btn">Leave</div>
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
</head>

<body>
  <div id="profession-card">

    <header>
      <div id="profession-image">
        <img src="images/lawyer.png" alt="Lawyer">
      </div>
      <div id="profession-details">
        <h3>Your Profession is</h3>
        <h1 id="profession">LAWYER</h1>
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
              <td id="salary">$7500</td>
            </tr>
          </tbody>
        </table>

        <h2>2. Expenses</h2>
        <table>
          <tbody>
            <tr>
              <th>Taxes : </th>
              <td id="taxes">$1800</td>
            </tr>
            <tr>
              <th>Home Mortgage Payment : </th>
              <td id="home-mortgage-payment">$1100</td>
            </tr>
            <tr>
              <th>School Loan Payment : </th>
              <td id="school-loan-payment">$300</td>
            </tr>
            <tr>
              <th>Car Loan Payment : </th>
              <td id="car-loan-payment">$200</td>
            </tr>
            <tr>
              <th>Credit Card Payment : </th>
              <td id="credit-card-payment">$200</td>
            </tr>
            <tr>
              <th>Other Expenses : </th>
              <td id="other-expenses">$1500</td>
            </tr>
            <tr>
              <th>Bank Loan Payment : </th>
              <td id="bank-loan-payment">$0</td>
            </tr>
            <tr>
              <th>Per Child Expense : </th>
              <td id="per-child-expense">$400</td>
            </tr>
          </tbody>
        </table>

      </div>

      <div id="cashflow-block">
        <div class="values" id="income">$7500</div>
        <div class="symbol">+</div>
        <div class="values" id="passive-income">$0</div>
        <div id="total">
          <div class="symbol">=</div>
          <div class="values" id="total-income">$7500</div>
        </div>
        <div class="symbol">-</div>
        <div class="values" id="total-expense">$5100</div>
        <div id="cashflow">
          <div class="symbol">=</div>
          <div class="values" id="monthly-cashflow">$2400</div>
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
                <td id="savings">$2000</td>
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
                <td id="home-mortgage">$115000</td>
              </tr>
              <tr>
                <th>School Loans : </th>
                <td id="school-loans">$78000</td>
              </tr>
              <tr>
                <th>Car Loans : </th>
                <td id="car-loans">$11000</td>
              </tr>
              <tr>
                <th>Credit Card Debt : </th>
                <td id="credit-card-debt">$7000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

  </div>
</body>

</html>`;

module.exports = { MAIN_MENU_PAGE, HOST_LOBBY, GUEST_LOBBY, PROFESSION_CARD };
