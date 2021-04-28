let cur_user_email;

if (Notification.permission === 'default' || Notification.permission === 'undefined') {
    Notification.requestPermission(function(permission) {
    });
  }

function initApp() {


    var showEmail = document.getElementById('showemail')
    var btnLogOut = document.getElementById('btnlogout');
    var txtEmail = document.getElementById('friendemail');
    var btnAddFriends = document.getElementById('btnaddfriends')
    var userEmail = document.getElementById('user');



    firebase.auth().onAuthStateChanged(function (user) {
        //if user is signed in
        if (user) {
            cur_user_email = user.email;
            firebase.database().ref('users/' + user.uid).set({
                email: user.email
            });
            showEmail = user.email;
            //show user email on the right top
            userEmail.innerHTML = user.email;
            //Logout
            btnLogOut.addEventListener('click', function () {
                firebase.auth().signOut().then(function () {
                    if (Notification && Notification.permission === "granted"){
                        var notify_note = {
                            body: "Successfully Logout From J's ChatRoom"
                        }       
                        var notification = new Notification('GoodBye~', notify_note)
                    }
                    alert("Logout Successfully");
                    window.location.href = "index.html";
                })
                    .catch(function (error) {
                        alert("Failed to Logout");
                    })
            })
            //Show userlist
            var usersRef = firebase.database().ref('users');
            var first_count = 0;
            var second_count = 0;
            var user_list = [];
            var str_before = "<li><a href='#' class='list-group-item list-group-item-action' onclick = 'chat(this.id)' id ='";
            var str_mid = "'>"
            var str_after = "</a></li>";

            usersRef.once('value')
                .then(function (snapshot) {
                    user_list = [];
                    first_count = 0;
                    second_count = 0;

                    snapshot.forEach(function (childSnapshot) {
                        var childKey = childSnapshot.key;
                        var childData = childSnapshot.val();
                        if (childData.email != user.email)
                            user_list[user_list.length] = str_before + childData.email + str_mid + childData.email + str_after;
                        first_count += 1;
                    })
                    document.getElementById('members').innerHTML = user_list.join('');

                    usersRef.child('users/').on('child_added', function(data){
                        second_count += 1;
                        if (second_count > first_count){
                            var childData = data.val();
                            user_list[user_list.length] = str_before + childData.email + str_mid + childData.email + str_after;
                            document.getElementById('members').innerHTML = user_list.join('');
                        }
                    })

                })
                .catch(function (error) {
                    console.log(error);
                })


            var messages = document.getElementById('message');
            messages.scrollTop = messages.scrollHeight;


        }
        else {
            window.location = "index.html";
        }

    })






}

let selected_id;

function chat(id) {

    selected_id = id;

    var btnSend = document.getElementById('btnsend');
    message_txt = document.getElementById('text');

    var chatWith = document.getElementById('chat');
    chatWith.innerText = id;


    var cur_user_name = "";
    var user_name = "";

    //cur_user_name = cur_user_email;
    for (var i = 0; i < cur_user_email.length; i++) {
        if (cur_user_email[i] === '@' || cur_user_email[i] === '.')
            continue;
        else
            cur_user_name += cur_user_email[i];
    }

    for (var i = 0; i < selected_id.length; i++) {
        if (selected_id[i] === '@' || selected_id[i] === '.')
            continue;
        else
            user_name += id[i];
    }

    var userId = new Array(2);
    userId[0] = cur_user_name;
    userId[1] = user_name;
    userId.sort();


    var message_ref = userId[0] + "_" + userId[1];

    var total_messages = [];

    //for sender
    var str_before_username = "<div id = 'm2'><p class = 'name'>";
    var str_after_username = "</p>";
    var str_before_content = "<p class = 'message'>";
    var str_before_time = "<small class='text-muted'>";
    var str_after_time = "&nbsp&nbsp</small>"
    var str_after_content = "</p></div>";
    //for friend
    var str_before_username2 = "<div id = 'm1'><p class = 'name'>";
    var str_after_username2 = "</p>";
    var str_before_time2 = "<small class='text-muted'>&nbsp&nbsp";
    var str_after_time2 = "</small>"
    var str_before_content2 = "<p class = 'message'>";
    var str_after_content2 = "</p></div>";

    firebase.database().ref('messages/' + message_ref).on('value', function (snapshot) {
        total_messages = [];
        snapshot.forEach(function (childSnapshot) {

            

            var value = childSnapshot.val();
            var new_string = value.message.replace(/&/g, "&amp");
            var new_string = value.message.replace(/</g, "&lt");
            
            if (value.message_sender === cur_user_email)
                total_messages.push(str_before_username + value.message_sender + str_after_username + str_before_content + str_before_time + value.time + str_after_time + new_string + str_after_content);
            else
                total_messages.push(str_before_username2 + value.message_sender + str_after_username2 + str_before_content2 + new_string + str_before_time2 + value.time + str_after_time2 + str_after_content2);
        })


        document.getElementById("m").innerHTML = total_messages.join('');
        var messages = document.getElementById('message');
        messages.scrollTop = messages.scrollHeight;
    })



    btnSend.addEventListener('click', function () {

        var chatWith2 = document.getElementById('chat');
        var reciever = chatWith2.innerText;

        var cur_user_name2 = "";
        var user_name2 = "";

        for (var i = 0; i < cur_user_email.length; i++) {
            if (cur_user_email[i] === '@' || cur_user_email[i] === '.')
                continue;
            else
                cur_user_name2 += cur_user_email[i];
        }

        for (var i = 0; i < reciever.length; i++) {
            if (reciever[i] === '@' || reciever[i] === '.')
                continue;
            else
                user_name2 += reciever[i];
        }

        var userId2 = new Array(2);
        userId2[0] = cur_user_name2;
        userId2[1] = user_name2;
        userId2.sort();


        var message_ref2 = userId2[0] + "_" + userId2[1];

        var datatime = getCurrentTime();

        if (message_txt.value != "") {
            var message = message_txt.value;
            //message = message.replace(/</g, ">");
            firebase.database().ref('messages/' + message_ref2).push({
                message_sender: cur_user_email,
                message: message,
                time: datatime
            })
        }
        var messages = document.getElementById('message');
        messages.scrollTop = messages.scrollHeight;
        message_txt.value = "";
    })

}




function search() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    ul = document.getElementById("members");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = ""
        }
        else {
            li[i].style.display = "none";
        }
    }
}

function getCurrentTime() {
    var currentime = new Date();
    var year = currentime.getFullYear();
    var month = (currentime.getMonth() + 1);
    var date = currentime.getDate();
    var hours;
    var minutes;
    if (currentime.getHours() < 10) {
        hours = "0" + currentime.getHours();
    }
    else {
        hours = currentime.getHours();
    }

    if (currentime.getMinutes() < 10) {
        minutes = "0" + currentime.getMinutes();
    }
    else {
        minutes = currentime.getMinutes();
    }
    var datatime =
        year + "/" +
        month + "/" +
        date + " " +
        hours + ":" +
        minutes

    return datatime;
}

window.onload = function () {
    initApp()
}