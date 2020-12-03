const usernameField = document.querySelector('#usernameField');
const emailField = document.querySelector('#emailField');
const usernameFeed = document.querySelector('.usernameFeed');
const emailFeed = document.querySelector('.emailFeed');

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
                console.log('data', data.email_error)
                emailField.parentNode.classList.add('has-error');
                emailFeed.innerHTML=`<p>${data.email_error}</p>`;
                emailFeed.style.display="block";
            }
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
                usernameFeed.innerHTML=`<p>${data.username_error}</p>`

            }   
        });
    }
});

