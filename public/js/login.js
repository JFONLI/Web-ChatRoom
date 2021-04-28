if (Notification.permission === 'default' || Notification.permission === 'undefined') {
    Notification.requestPermission(function(permission) {
    });
  }

function initApp() {

    
    var txtEmail = document.getElementById('email');
    var txtPassword = document.getElementById('password');
    var btnSignin = document.getElementById('btnsignin');
    var btnGoogle = document.getElementById('btngoogle');
    var btnSignup = document.getElementById('btnsignup');

    btnSignin.addEventListener('click', function () {
        var email = txtEmail.value;
        var password = txtPassword.value;
        console.log(email);
        console.log(password);

        firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
            create_alert("success","Welcome back!");
            if (Notification && Notification.permission === "granted"){
                var notify_note = {
                    body: "Successfully Login To J's ChatRoom"
                }       
                var notification = new Notification('Welcome~', notify_note)
            }
            alert("Login Successfully");
        }, function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            create_alert("error", errorMessage);
        })
        
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                window.location = "lobby.html"
            }
        })
        
    });


    btnSignup.addEventListener('click', function () {
        var email = txtEmail.value;
        var password = txtPassword.value;

        firebase.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
            alert("Create Success");
            create_alert("success","Success!");
            window.location = "index.html"
            
        }, function (error) {
            var errorCode = error.code;
            var errorMessage = error.message;
            create_alert("error", errorMessage);
        })

    });

    btnGoogle.addEventListener('click', function() {
        /// TODO 3: Add google login button event
        ///         1. Use popup function to login google
        ///         2. Back to index.html when login success
        ///         3. Show error message by "create_alert()"
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function(result) {
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = result.credential.accessToken;
            // The signed-in user info.
            var user = result.user;
        
            // ...
            }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            create_alert("failed", errorMessage);
            });
        
        firebase.auth().onAuthStateChanged(function(user){
            if (user){
                window.location = "lobby.html"
            }
        })
        

    });

    




}


// Custom alert
function create_alert(type, message) {
    var alertarea = document.getElementById('custom-alert');
    if (type == "success") {
        str_html = "<div class='alert alert-success alert-dismissible fade show' role='alert'><strong>Success! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    } else if (type == "error") {
        str_html = "<div class='alert alert-danger alert-dismissible fade show' role='alert'><strong>Error! </strong>" + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></div>";
        alertarea.innerHTML = str_html;
    }
}



window.onload = function () {
    initApp();
};
