$(document).ready(function() {
  checkAuthState();
  $(".loginbtn").on("click", function(e) {
    handleLogIn();
    // checkAuthState();
    e.preventDefault();
  });
});
function handleLogIn() {
  let email = $("#email").val();
  let password = $("#password").val();

  if (email.length < 4) {
    alert("Please enter an email address.");
    return;
  }
  if (password.length < 4) {
    alert("Please enter a password.");
    return;
  }
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      console.log("successful login");
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode === "auth/wrong-password") {
        alert("Wrong password.");
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
  email = "";
  password = "";
  //
  // [END authwithemail]
}

function checkAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var email = user.email;
      var uid = user.uid;
      console.log(email, uid);
      console.log(window.location.href);
      window.location.href = "./dashboard.html";
      // ...
    } else {
      // User is signed out.
      console.log("user is log out");
      // ...
    }
  });
}
