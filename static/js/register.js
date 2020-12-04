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
let username_error_exist = false;
let password_error_exist = false;
let passwordConfirm_error_exist = false;
let email_error_exist = false;
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
                email_error_exist = true;
            }else{
                email_error_exist = false;
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
                username_error_exist = true;                
            }else{
                username_error_exist = false;   
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
            password_error_exist = true;
            console.log('here passworde error',password_error_exist);
        }else{
            password_error_exist = false;
        }
        
        if(passwordConfirmField.value && passwordVal!=passwordConfirmField.value){
            passwordConfirmField.parentNode.classList.add('has-error');
            passwordConfirmFeed.style.display="block";
            passwordConfirmFeed.innerHTML ="<p>Passwords not match";
            passwordConfirm_error_exist = true;
        }else{
            passwordConfirm_error_exist = false;
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
        passwordConfirm_error_exist = true;
    }else{
        passwordConfirm_error_exist = false;
    }
    changeSubmitStatus();
});
function changeSubmitStatus(){
    console.log('here');
    console.log('email_error_exist',email_error_exist);
    console.log('username_error_exist',username_error_exist);
    console.log('password_error_exist',password_error_exist);
    console.log('passwordConfirm_error_exist',passwordConfirm_error_exist);
    let error_exist= email_error_exist || username_error_exist || password_error_exist || passwordConfirm_error_exist;
    if(error_exist){
        submitField.setAttribute('disabled', 'disabled');
    }else{
        submitField.removeAttribute('disabled');
    }
}
