import { quizzes } from "./Data.js";

const topicInputs = document.querySelectorAll(".Topic input");
const numberInputs = document.querySelectorAll(".Number input");
const timerInputs = document.querySelectorAll(".Timer input");

const selectionBox = document.querySelector(".Selection_Box");
const questionPaper = document.querySelector(".Question_Paper");
const scoreBoard = document.querySelector(".Score_Board");

const startButton = document.querySelector(".Selection_Box button");

let quizQuestions = [];
let timer = null;
let timeLeft = 0;

startButton.addEventListener("click", StartQuiz);



function topicKey(text){
return text
.replace(/[^a-zA-Z ]/g,"")
.split(" ")
.map((w,i)=> i===0 ? w : w[0].toUpperCase()+w.slice(1))
.join("");
}



function StartQuiz(){

let selectedTopics=[];

topicInputs.forEach(box=>{

if(box.checked){

let name = box.previousElementSibling.innerText.trim();
let key = topicKey(name);

if(quizzes[key]){
selectedTopics.push(key);
}

}

});


let totalQuestion=0;

numberInputs.forEach(r=>{
if(r.checked){
totalQuestion = Number(r.previousElementSibling.innerText);
}
});


let timerChoice=null;

timerInputs.forEach(r=>{
if(r.checked){
timerChoice = r.previousElementSibling.innerText;
}
});


if(selectedTopics.length===0 || totalQuestion===0 || timerChoice===null){
alert("Please select topics, question number and timer option");
return;
}


quizQuestions=[];

let topicCount = selectedTopics.length;

let perTopic = Math.floor(totalQuestion/topicCount);

let extra = totalQuestion % topicCount;



selectedTopics.forEach(topic=>{

let data=[...quizzes[topic]].sort(()=>Math.random()-0.5);

for(let i=0;i<perTopic;i++){

quizQuestions.push({
topic:topic,
data:data[i]
});

}

});



let allData=[];

selectedTopics.forEach(t=>{
allData = allData.concat(quizzes[t]);
});

allData = allData.sort(()=>Math.random()-0.5);

for(let i=0;i<extra;i++){

quizQuestions.push({
topic:"extra",
data:allData[i]
});

}


showQuestions(timerChoice);

}




function showQuestions(timerChoice){

selectionBox.style.display="none";
document.querySelector(".Welcome_Box").style.display="none";
document.querySelector(".about-section").style.display="none";

scoreBoard.innerHTML="";

let html="";

quizQuestions.forEach((q,index)=>{

let d=q.data;

html+=`

<div class="question">

<p>${index+1}. ${d[0]}</p>

<label>
<input type="radio" name="q${index}" value="1"> A) ${d[1]}
</label>

<label>
<input type="radio" name="q${index}" value="2"> B) ${d[2]}
</label>

<label>
<input type="radio" name="q${index}" value="3"> C) ${d[3]}
</label>

<label>
<input type="radio" name="q${index}" value="4"> D) ${d[4]}
</label>

</div>

`;

});


html+=`

<div class="btn">
<button id="backBtn">Back</button>
<button id="checkBtn">Check Answer</button>
</div>

`;

questionPaper.style.display="block";
questionPaper.innerHTML=html;


document.getElementById("backBtn").onclick = goBack;
document.getElementById("checkBtn").onclick = ()=>checkAnswer(timerChoice);


if(timerChoice==="Yes"){
startTimer();
}

}




function startTimer(){

timeLeft = quizQuestions.length * 10;

const timerBox = document.getElementById("timerBox");
timerBox.style.display="block";

timer = setInterval(()=>{

let min = Math.floor(timeLeft/60);
let sec = timeLeft % 60;

timerBox.innerHTML = `Time Left : ${min}:${sec<10?"0"+sec:sec}`;

timeLeft--;

if(timeLeft<=0){

clearInterval(timer);
checkAnswer("Yes");

}

},1000);

}


function goBack(){

clearInterval(timer);

questionPaper.innerHTML="";
scoreBoard.innerHTML="";

selectionBox.style.display="block";
document.querySelector(".Welcome_Box").style.display="flex";
document.querySelector(".about-section").style.display="flex";

document.getElementById("timerBox").style.display="none";
scoreBoard.style.display="none";
questionPaper.style.display="none";

}


function checkAnswer(timerChoice){

clearInterval(timer);

let correct = 0;
let wrong = 0;
let empty = 0;


// 🔴 Timer OFF হলে আগে check করবে সব প্রশ্ন answer দেওয়া হয়েছে কিনা

if(timerChoice === "No"){

let unanswered = false;

quizQuestions.forEach((q,index)=>{

let selected = document.querySelector(`input[name="q${index}"]:checked`);

if(!selected){
unanswered = true;
}

});

if(unanswered){
alert("Answer all questions first");
return;
}

}


// 🔹 এখন answer check করা শুরু হবে

quizQuestions.forEach((q,index)=>{

let options = document.querySelectorAll(`input[name="q${index}"]`);
let selected = document.querySelector(`input[name="q${index}"]:checked`);

let correctAns = Number(q.data[5]);

options.forEach((opt,i)=>{

let label = opt.closest("label");

if(i+1 === correctAns){
label.style.background="#12d42f";
}

});


if(!selected){
empty++;
return;
}


let ans = Number(selected.value);

if(ans === correctAns){

correct++;
selected.closest("label").style.background="#0caa00";

}
else{

wrong++;
selected.closest("label").style.background="#be0027";

}

});


// 🔹 সব radio button disable

document.querySelectorAll(".Question_Paper input[type='radio']").forEach(r=>{
r.disabled = true;
});


showScore(correct,wrong,empty);

}



function showScore(correct,wrong,empty){

let total = quizQuestions.length;

let review="";
let img="";

if(correct===0){
review="Your result is very low. It’s important to revise the lessons and start practicing from the basics.";
img="four.gif"
}
else if(correct<=total/4){
review="Your performance is below average. You should study the topics again and practice more.";
img="three.gif"
}
else if(correct<total/2){
review="Not bad, but there is room for improvement. Review the topics and try again.";
img="three.gif"
}
else if(correct===total/2){
review="Good work! You have a solid understanding, but a bit more practice will help you improve further.";
img="three.gif"
}
else if(correct>total/2 && correct<total){
review="Great job! You performed very well. Just a little more focus and you can reach perfection.";
img="two.gif"
}
else if(correct===total){
review="Outstanding! You answered all questions correctly. Your preparation and understanding are excellent.";
img="one.gif"
}


scoreBoard.style.display="block";

scoreBoard.innerHTML=`
<b onclick="document.querySelector('.Score_Board').style.display='none'">&times;</b>
<h2>You get ${correct} out of ${total}.</h2>
<img src="${img}" alt="result">
<p>${review}</p>
</br>
<p>Wrong : ${wrong}</p>
<p>Not Answered : ${empty}</p>
<a href="#top"><button id="retry">Go Home</button></a>
`;


document.getElementById("retry").onclick = goBack;

}