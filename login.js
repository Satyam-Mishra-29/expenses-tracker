let form = document.querySelector("form");
let username = document.querySelectorAll("input")[0];
let password = document.querySelectorAll("input")[1];


let eUser = document.querySelectorAll("span")[0];
let ePass = document.querySelectorAll("span")[1];
let eForm = document.querySelectorAll("span")[2];

let DataFromStorage = JSON.parse(localStorage.getItem("data"));
// console.log(DataFromStorage);

form.addEventListener("submit",(e)=>{
    eUser.innerHTML="";
    ePass.innerHTML="";
    eForm.innerHTML="";

// matching login details
let matchedData = DataFromStorage.find((e) => {
   if( (e.Phone_No == username.value && e.Password == password.value) ||
    (e.Email == username.value && e.Password == password.value)){
    return e;
   }
});

    if(username.value=="" && password.value==""){
        eUser.innerHTML ="*Enter Email Or Mobile Number";
        ePass.innerHTML ="*Enter the Password";
        e.preventDefault();
    }
    else if (username.value==""){
        eUser.innerHTML ="*Enter Email Or Mobile Number";
        e.preventDefault();
    }
    else if(password.value==""){
        ePass.innerHTML ="*Enter the Password";
        e.preventDefault();
    }
    else if(matchedData){
        alert("Welcome to the page");
        localStorage.setItem("OneUser",JSON.stringify(matchedData));
    }
    else{
        eForm.innerHTML ="Match not found";
        e.preventDefault();
    }
});


let h3 = document.querySelector("h3");
h3.addEventListener("click",()=>{
    if(h3.innerHTML=="show"){
        password.type = "text";
        h3.innerHTML = "hide";
    }
    else{
        h3.innerHTML = "show";
        password.type ="password";
    }
})

let SignUpNav = document.querySelector(".SignUp");
SignUpNav.addEventListener("click",(e)=>{
    window.location.href="./index.html";
})