document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
  console.log("Running cordova-" + cordova.platformId + "@" + cordova.version);
  document.getElementById("signIn").addEventListener("click", signIn);
  document.getElementById("start").addEventListener("click", function () {
    window.location = "quizPage.html";
  });
}
async function signIn() {
  HMSGameService.signIn(
    (res) => {
      console.log("sign in success" + JSON.stringify(res));
    },
    (err) => {
      console.info("sign in failed ");
      alert("fail::" + JSON.stringify(err));
    }
  );
}
