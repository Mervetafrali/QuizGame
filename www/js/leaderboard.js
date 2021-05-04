document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  getScores();
}
async function getScores() {
  try {
    const rankingId =
      "68091CA24C16FA48B76F12395FD9A7E671287441397CE436E34090F6654700BE";
    const timeDimension = 2;
    const maxResults = 20;
    const isRealTime = true;
    const value = await HMSGameService.loadTopScore(
      rankingId,
      timeDimension,
      maxResults,
      isRealTime
    );
    console.log("loadTopScore-> success, " + JSON.stringify(value));
    loadTableData(value.data.scores);
  } catch (ex) {
    alert("error" + JSON.stringify(ex));
  }
}
function loadTableData(items) {
  const table = document.getElementById("leaderboard");
  items.forEach((item) => {
    let row = table.insertRow();
    let name = row.insertCell(0);
    name.innerHTML = item.player.nickName;
    let scores = row.insertCell(1);
    scores.innerHTML = item.rawScore;
  });
}
//loadTableData();
