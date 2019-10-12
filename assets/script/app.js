// let _coursename = $("#course_select").val();

$(document).ready(function() {
  //---------------------------------------------------------------------------------
  //    SIDE TOGGLE FUNCTION
  //---------------------------------------------------------------------------------
  $("#sidebarCollapse").on("click", function() {
    $("#sidebar").toggleClass("active");
    $("#content").toggleClass("active");
  });
  checkAuthState();
  populateUserName();

  $(".logoutbtn").on("click", function(e) {
    e.preventDefault();
    firebase
      .auth()
      .signOut()
      .then(
        function() {
          // Sign-out successful.
          console.log("sign out successful");
        },
        function(error) {
          // An error happened.
          console.log(error);
        }
      );
  });
  populateNavCourseSelectList();
  $("#nav_course_select").on("change", function() {
    G_courses_ID = $(this).val();
    // Populate the subject List
    populateNavSubjectSelectList();
  });
});

function checkAuthState() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var email = user.email;
      var uid = user.uid;
      // console.log(email, uid);
      // console.log(window.location.href);

      // ...
    } else {
      // User is signed out.
      console.log("user is log out");

      // if (window.location.href == "http://127.0.0.1:5501/") {
      //   // console.log(" in if here");
      //   window.location.href = "./assets/pages/login.html";
      // } else {
      // console.log(" in else here");
      window.location.href = "./login.html";
      // }
      // ...
    }
  });
}

function populateUserName() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      let email = user.email;
      getUserByEmail(email);
    } else {
      // No user is signed in.
    }
  });
}

function getUserByEmail(email) {
  let adminref = firebase.database().ref("admin-user");
  let result;
  adminref.on("value", data => {
    let users = data.val();
    for (let i in users) {
      let user = users[i];
      if (user.email == email) {
        result = user;
        $(".profile h4").html(`${result.name}`);
        break;
      }
    }
  });
  return result;
}

function populateNavCourseSelectList() {
  // $('select[name="current_course_select"]').html('');
  $("#nav_course_select").html(`
    <option selected disabled>Select Courses</option>
    `);
  $("#nav_subject_select").html(`
    <option selected disabled>Choose Course First</option>
    `);
  let ref = firebase.database().ref("portal_db/courses");
  ref.on("child_added", data => {
    let courses = data.val();
    // for (let k in courses) {
    //   let course = courses[k];
    $("#nav_course_select").append(`
            <option value="${courses.courseID}">${courses.coursename}</option>
            `);
    // }
  });
}

function populateNavSubjectSelectList() {
  $("#nav_subject_select").html(`
  <option selected disabled>Choose Subject</option>
  `);

  // let courseID = findCourseByName(_coursename);
  let subref = firebase
    .database()
    .ref("portal_db/courses")
    .child(G_courses_ID)
    .child("subjects");
  subref.on("child_added", data => {
    let subject = data.val();

    $("#nav_subject_select").append(
      `<option value="${subject.subjectID}">${subject.subjectname}</option>`
    );
  });
}
