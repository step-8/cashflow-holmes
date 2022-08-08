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

module.exports = { MAIN_MENU_PAGE };
