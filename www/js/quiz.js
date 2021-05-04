class Quiz{
  constructor(questions){
    this.totalScore=0;
    this.index=0;
    this.questions=questions;
  }
  guess(answer){
    if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
      this.totalScore++;
    }
    this.index++;
  }
  getCurrentQuestion(){
    return this.questions[this.index];
  }
  hasEnded(){
    return this.index >= this.questions.length;
  }
}
class Question{
  constructor(text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
  }
  isCorrectAnswer(choice){
    return this.answer === choice;
  }
}
var start = 0;
var end = 0;
var flag = false;
class QuizUI{
  displayNext(){
    if (quiz.hasEnded()) {
      this.displaytotalScore();
    } else {
      this.displayQuestion();
      this.displayChoices();
      this.displayProgress();
    }
  }
  displayQuestion(){
    this.populateIdWithHTML("question", quiz.getCurrentQuestion().text);
  }
  displayChoices(){
    var choices = quiz.getCurrentQuestion().choices;
    start = performance.now();
    for (var i = 0; i < choices.length; i++) {
      this.populateIdWithHTML("choice" + i, choices[i]);
      this.guessHandler("guess" + i, choices[i]);
    }
  }
  displaytotalScore(){
    var gameOverHTML = "<h1>Game Over</h1>";
    gameOverHTML += "<h2> Your totalScore is: " + quiz.totalScore + "</h2>";
    this.populateIdWithHTML("quiz", gameOverHTML);
    alert("Your score is saving...");
    leaderboard(quiz.totalScore);
  }
  populateIdWithHTML(id,text){
    var element = document.getElementById(id);
    element.innerHTML = text;
  }
  guessHandler(id, guess){
    var button = document.getElementById(id);
    button.onclick = function () {
      quiz.guess(guess);
      end = performance.now();
      var measure = end - start;
      if (!flag && measure < 6000) {
        flag = true;
        unlocked();
      }
      console.log("It took " + measure + " ms.");
      quizUI.displayNext();
    };
  }
  displayProgress(){
    var currentQuestionNumber = quiz.index + 1;
    this.populateIdWithHTML(
      "progress",
      "Question " + currentQuestionNumber + " of " + quiz.questions.length
    );
  }
}

var questions = [
  new Question(
    "What does HTML stand for?",
    [
      "Hyper Trainer Marking Language",
      "Hyper Text Marketing Language",
      "Hyper Text Markup Language",
      "Huawei Text Markup Lover",
    ],
    "Hyper Text Markup Language"
  ),
  new Question(
    "What is the most popular smartphone in the world right now? 😝 ",
    [
      "Apple iPhone 12",
      "Samsung Galaxy S20",
      "Xiaomi Redmi Note 9 Pro",
      "HUAWEI P40 Pro",
    ],
    "HUAWEI P40 Pro"
  ),
  new Question(
    "Who is the creator of the JavaScript scripting language?",
    ["Brendan Eich", "Guido van Rossum", "John Ousterhout", "Sergey Brin"],
    "Brendan Eich"
  ),
  new Question(
    "1 kilobyte (kb) =",
    ["1,048 Bytes", "1,000 Bytes", "1,275 Bytes", "1,024 Bytes"],
    "1,024 Bytes"
  ),
  new Question(
    "Do you love to code?",
    ["No", "Yes", "Hell Yeah", "No"],
    "Hell Yeah"
  ),
  new Question(
    "What's the best programming language?",
    ["Javascript", "C#", "Java", "Python"],
    "Javascript"
  ),
  new Question(
    "Which famous computer scientist killed himself by eating a poison apple?",
    ["Alan Turing", "Donald Knuth", "Bjarne Stroustrup", "Robert Prim"],
    "Alan Turing"
  ),
  new Question(
    "What was Java called before it was Java?",
    [
      "Maple",
      "Snoo",
      "Oak",
      "There was no working name for Java before it was named Java.",
    ],
    "Oak"
  ),
];

//Create Quiz
var quiz = new Quiz(questions);
async function unlocked() {
  try {
    const achievementId =
      "12AC57E475BF84F25F8B89E92E7F5E4992635049ACF503787117D1FC50E1B44B";
    await HMSGameService.unlockAchievementImmediate(achievementId);
    alert("You are faster than speedy gonzales! You unlocked an achievement!");
  } catch (ex) {
    console.log(JSON.stringify(ex));
  }
}
async function leaderboard(score) {
  try {
    await HMSGameService.setRankingsSwitchStatus(1);
  } catch (ex) {
    alert("error" + JSON.stringify(ex));
  }
  try {
    const rankingId =
      "68091CA24C16FA48B76F12395FD9A7E671287441397CE436E34090F6654700BE";
    const value = await HMSGameService.submitScoreImmediate(rankingId, score);
    console.log("data-> " + JSON.stringify(value));
  } catch (ex) {
    alert("error" + JSON.stringify(ex));
  }
  try {
    const achievementId =
      "479419FF9805D88553920C841763CF1009ACD5C3E89AB148756CDB999ECE1500";
    await HMSGameService.unlockAchievementImmediate(achievementId);
    alert("Congratulations! You finished the game!");
  } catch (ex) {
    console.log(JSON.stringify(ex));
  }
  window.location = "leaderboard.html";
}
var quizUI= new QuizUI();
quizUI.displayNext();
