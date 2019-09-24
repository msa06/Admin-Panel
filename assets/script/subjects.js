let _coursename;

$(document).ready(function() {
  // Populate the Select Subject List
  populateCourseSelectList();
  //   Hide the Subject Row
  $(".subject-row").hide();
  $('select[name="current_course_select"]').on("change", function() {
    _coursename = $(this).val();
    $(".subject-row").show();
    listSubjectList();
  });

  //   Add Subject Button
  $("#subject-submit-btn").on("click", function(e) {
    addSubject();
    e.preventDefault();
  });

  //   Update Subject Button
  $("#subject-update-btn").on("click", function(e) {
    updateSubject();
    e.preventDefault();
  });
});

function populateCourseSelectList() {
  // $('select[name="current_course_select"]').html('');
  $('select[name="current_course_select"]').html(`
    <option selected disabled>Select Courses</option>
    `);
  let ref = firebase.database().ref("courses");
  ref.on("child_added", data => {
    let courses = data.val();
    // for (let k in courses) {
    //   let course = courses[k];
    $('select[name="current_course_select"]').append(`
            <option name="${courses.coursename}">${courses.coursename}</option>
            `);
    // }
  });
}

// Add Subject
function addSubject() {
  // get the data from form
  let subjectname = $('input[name="subject_name"]');
  let subject = {
    subjectname: subjectname.val()
  };
  let courseId = findCourseByName(_coursename);
  let subref = firebase
    .database()
    .ref("courses")
    .child(courseId)
    .child("subjects");

  subject.subjectID = subref.push().key;
  subref.child(subject.subjectID).set(subject);
  //   console.log("subject Added");
  subjectname.val("");
  listSubjectList();
}

// find COurse By name
function findCourseByName(name) {
  let id;
  let ref = firebase.database().ref("courses");
  ref.on("value", data => {
    let courses = data.val();
    for (let k in courses) {
      let course = courses[k];
      if (course.coursename == name) {
        id = course.courseID;
        break;
      }
    }
  });
  return id;
}

// Populate Subject List
function listSubjectList() {
  $("#courses-list").html("");
  let courseId = findCourseByName(_coursename);
  let subref = firebase
    .database()
    .ref("courses")
    .child(courseId)
    .child("subjects");
  let count = 1;
  subref.on("child_added", data => {
    let subject = data.val();
    populateSubjectList(subject, count++);
  });
}

function populateSubjectList(subject, count) {
  $("#courses-list").append(`
    <tr>
         <th scope="row">${count}</th>
            <td>
               ${subject.subjectname}
                  </td>
              <td><a class="btn btn-warning" href="#" onclick="editSubjects('${subject.subjectID}')" data-toggle="modal"
                                    data-target="#editSubjectModal"><i
                                                class="fas fa-pencil-alt"></i></a></td>
                                    <td> <a class="btn btn-danger" href="#" onclick="deleteSubjects('${subject.subjectID}')"><i
                                                class="fas fa-trash"></i></a></td>
                                </tr>
    `);
}

// Edit the Subject
function editSubjects(id) {
  let subjectname = $('input[name="edit_subject_name"]');
  let subjectID = $('input[name="edit_subject_id"]');
  console.log(subjectID);
  let courseID = findCourseByName(_coursename);
  let subref = firebase
    .database()
    .ref("courses")
    .child(courseID)
    .child("subjects");

  subref.on("value", data => {
    let subjects = data.val();

    for (let k in subjects) {
      let subject = subjects[k];

      if (subject.subjectID == id) {
        subjectname.val(`${subject.subjectname}`);
        subjectID.val(`${subject.subjectID}`);
        break;
      }
    }
  });
}

// Update Subject
function updateSubject() {
  let subjectname = $('input[name="edit_subject_name"]');
  let subjectID = $('input[name="edit_subject_id"]');
  let courseID = findCourseByName(_coursename);
  let subref = firebase
    .database()
    .ref("courses")
    .child(courseID)
    .child("subjects")
    .child(subjectID.val())
    .child("subjectname");
  subref.set(subjectname.val());
  listSubjectList();
}

// Delete Subject
function deleteSubjects(id) {
  let r = confirm(
    "Deleting a Subject will delete All the Data Associated With It"
  );
  if (r == true) {
    let f = confirm("Are you Sure");
    if (f == true) {
      let courseID = findCourseByName(_coursename);
      let subref = firebase
        .database()
        .ref("courses")
        .child(courseID)
        .child("subjects");
      subref.child(id).remove();
      listSubjectList();
    }
  }
}
