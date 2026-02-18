let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let darkMode = localStorage.getItem("darkMode");
let alreadyCelebrated = false;

if(darkMode==="on"){
document.body.classList.add("dark");
}

function save(){
localStorage.setItem("tasks",JSON.stringify(tasks));
localStorage.setItem("darkMode",document.body.classList.contains("dark")?"on":"off");
}

function addTask(){
const text=document.getElementById("taskInput").value.trim();
const due=document.getElementById("dueDate").value;
const priority=document.getElementById("priority").value;
if(!text) return;

tasks.push({ text, due, priority, completed:false });
document.getElementById("taskInput").value="";
alreadyCelebrated=false;
render();
}

function render(){
document.getElementById("activeList").innerHTML="";
document.getElementById("completedList").innerHTML="";

let completedCount=0;

tasks.forEach((task,index)=>{
const div=document.createElement("div");
div.className="task "+task.priority;
if(task.completed){div.classList.add("completed");completedCount++;}

const span=document.createElement("span");
span.innerHTML=`${task.text}${task.due?("<br><small>Due: "+task.due+"</small>"):""}`;

div.onclick=function(){
task.completed=!task.completed;
render();
};

const del=document.createElement("button");
del.textContent="×";
del.className="delete-btn";
del.onclick=function(e){
e.stopPropagation();
tasks.splice(index,1);
alreadyCelebrated=false;
render();
};

div.appendChild(span);
div.appendChild(del);

if(task.completed){
document.getElementById("completedList").appendChild(div);
}else{
document.getElementById("activeList").appendChild(div);
}

});

document.getElementById("taskCount").textContent=tasks.length+" tasks";
document.getElementById("progressBar").style.width=
tasks.length? (completedCount/tasks.length)*100+"%":"0%";

/* 🎉 TRIGGER CELEBRATION */
if(tasks.length>0 && completedCount===tasks.length && !alreadyCelebrated){
celebrate();
alreadyCelebrated=true;
}

save();
}

function celebrate(){
const box=document.getElementById("celebration");
box.classList.add("show");

const emojis=["🎉","✨","🥳","🎊","💜","🔥"];

for(let i=0;i<30;i++){
let emoji=document.createElement("div");
emoji.className="emoji";
emoji.textContent=emojis[Math.floor(Math.random()*emojis.length)];
emoji.style.left=Math.random()*100+"vw";
emoji.style.animationDuration=(Math.random()*2+2)+"s";
document.body.appendChild(emoji);
setTimeout(()=>emoji.remove(),3000);
}

setTimeout(()=>{
box.classList.remove("show");
},3000);
}

function toggleDarkMode(){
document.body.classList.toggle("dark");
save();
}

document.getElementById("taskInput").addEventListener("keypress",function(e){
if(e.key==="Enter") addTask();
});

document.getElementById("searchInput").addEventListener("input",function(){
const value=this.value.toLowerCase();
document.querySelectorAll(".task").forEach(task=>{
task.style.display=task.innerText.toLowerCase().includes(value)?"flex":"none";
});
});

render();