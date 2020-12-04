'use strict'
const usernameField = document.querySelector('#usernameField');
const emailField = document.querySelector('#emailField');
const usernameFeed = document.querySelector('.usernameFeed');
const emailFeed = document.querySelector('.emailFeed');
const passwordField = document.querySelector('#passwordField');
const passwordConfirmField = document.querySelector('#passwordConfirmField')
const passwordFeed = document.querySelector('.passwordFeed');
const passwordConfirmFeed = document.querySelector('.passwordConfirmFeed');
const submitField = document.querySelector('.submit-btn');
let error_exist = false;
emailField.addEventListener('keyup', (e)=>{
    const emailVal = e.target.value;
    emailField.parentNode.classList.remove('has-error');
    emailFeed.innerHTML="";
    emailFeed.style.display="none";

    if(emailVal.length > 0) {
        fetch('/auth/validate-email/',{
            body:JSON.stringify({email:emailVal}),
            method:"POST",
        })
        .then(res=>res.json())
        .then(data=>{
            if(data.email_error){
                emailField.parentNode.classList.add('has-error');
                emailFeed.innerHTML=`<p>${data.email_error}</p>`;
                emailFeed.style.display="block";
                error_exist = true;
            }
            changeSubmitStatus();
        });
    }
    
});

usernameField.addEventListener('keyup',(e)=>{
    const usernameVal = e.target.value;
    usernameField.parentNode.classList.remove('has-error');
    usernameFeed.innerHTML="";
    usernameFeed.style.display ="none";

    if(usernameVal.length > 0 ){
        fetch('/auth/validate-username/',{
            body:JSON.stringify({username:usernameVal}),
            method:"POST",
        })
        .then((res)=>res.json())
        .then(data=>{
            
            if (data.username_error) {
                console.log('data', data);
                usernameField.parentNode.classList.add('has-error');
                usernameFeed.style.display ="block";
                usernameFeed.innerHTML=`<p>${data.username_error}</p>`;
                error_exist = true;                
            }
            changeSubmitStatus();
            
        });
    }

    
});

passwordField.addEventListener('keyup',(e)=>{
    const passwordVal = e.target.value;
    passwordField.parentNode.classList.remove('has-error');
    passwordFeed.style.display = "none";
    passwordFeed.innerHTML ="";
    passwordConfirmField.parentNode.classList.remove('has-error');
    passwordConfirmFeed.style.display="none";
    passwordConfirmFeed.innerHTML ="";

    if(passwordVal.length>0){
        if(passwordVal.length<8){
            passwordField.parentNode.classList.add('has-error');
            passwordFeed.style.display="block";
            passwordFeed.innerHTML ="<p>Password must conatain 8 characters or more";
            error_exist = true;
        }
        
        if(passwordConfirmField.value && passwordVal!=passwordConfirmField.value){
            passwordConfirmField.parentNode.classList.add('has-error');
            passwordConfirmFeed.style.display="block";
            passwordConfirmFeed.innerHTML ="<p>Passwords not match";
            error_exist = true;
        }
        
    }
    changeSubmitStatus()
});

passwordConfirmField.addEventListener('keyup', (e)=>{
    const passwordVal = e.target.value;
    //Init
    passwordConfirmField.parentNode.classList.remove('has-error');
    passwordConfirmFeed.style.display = "none";
    passwordConfirmFeed.innerHTML = ""
    //
    if(passwordVal.length>0 && passwordField.value != passwordVal){
        passwordConfirmField.parentNode.classList.add('has-error');
        passwordConfirmFeed.style.display = "block";
        passwordConfirmFeed.innerHTML = "<p>Passwords not match</p>";
        error_exist = true;
    }
    changeSubmitStatus();
});
function changeSubmitStatus(){
    console.log('here');
    console.log(error_exist);
    if(error_exist){
        submitField.setAttribute('disabled', 'disabled');
        error_exist = false;
    }else{
        submitField.removeAttribute('disabled');
    }
}
