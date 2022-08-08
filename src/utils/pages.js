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
  <script src="https://kit.fontawesome.com/74138aff63.js" crossorigin="anonymous"></script>
</head>

<body>
  <div class="page">
    <div class="lobby">
      <div class="room-id">
        Room-Id : __room_id__
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

module.exports = { MAIN_MENU_PAGE, HOST_LOBBY };
