let _courseID;
let _subjectID;

$(document).ready(function() {
  // Populate the Select Subject List
  populateCourseSelectList();
  //   Hide the Subject Row
  $(".chapter-row").hide();
  $('select[name="current_course_select"]').on("change", function() {
    _courseID = $(this).val();
    // Populate the subject List
    populateSubjectSelectList();
  });

  // When we change Subject
  $('select[name="current_subject_select"]').on("change", function() {
    _subjectID = $(this).val();
    // Show the Table
    $(".chapter-row").show();
    listChapterList();
  });

  //   Add Chapter Button
  $("#chapter-submit-btn").on("click", function(e) {
    addChapter();
    e.preventDefault();
  });

  //   Update Chapter Button
  $("#chapter-update-btn").on("click", function(e) {
    updateChapter();
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
            <option value="${courses.courseID}">${courses.coursename}</option>
            `);
    // }
  });
}

function populateSubjectSelectList() {
  $('select[name="current_subject_select"]').html(`
  <option selected disabled>Choose Subject</option>
  `);
  // let courseID = findCourseByName(_coursename);
  let subref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects");
  subref.on("child_added", data => {
    let subject = data.val();
    $('select[name="current_subject_select"]').append(
      `<option value="${subject.subjectID}">${subject.subjectname}</option>`
    );
  });
}

// Add Subject
function addChapter() {
  // get the data from form
  let chaptername = $('input[name="chapter_name"]');
  let topic = {
    topicname: chaptername.val()
  };
  let chapref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics");

  topic.topicID = chapref.push().key;
  chapref.child(topic.topicID).set(topic);
  //   console.log("subject Added");
  chaptername.val("");
  listChapterList();
}

// Populate Chapter List
function listChapterList() {
  $("#chapter-list").html("");
  let chapref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics");
  let count = 1;
  chapref.on("child_added", data => {
    let topic = data.val();
    $("#chapter-list").append(`
    <tr>
         <th scope="row">${count}</th>
            <td>
               ${topic.topicname}
                  </td>
              <td><a class="btn btn-warning" href="#" onclick="editChapter('${topic.topicID}')" data-toggle="modal"
                                    data-target="#editChapterModal"><i
                                                class="fas fa-pencil-alt"></i></a></td>
                                    <td> <a class="btn btn-danger" href="#" onclick="deleteChapter('${topic.topicID}')"><i
                                                class="fas fa-trash"></i></a></td>
                                </tr>
    `);
    count++;
  });
}

function editChapter(id) {
  let chaptername = $('input[name="edit_chapter_name"]');
  let chapterid = $('input[name="edit_chapter_id"]');

  let chapref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics");
  chapref.on("value", data => {
    let topics = data.val();

    for (let k in topics) {
      let topic = topics[k];
      if (topic.topicID == id) {
        // console.log(topic.topicID, topic.topicname);
        chaptername.val(`${topic.topicname}`);
        chapterid.val(`${topic.topicID}`);
        break;
      }
    }
  });
}

function updateChapter() {
  let chaptername = $('input[name="edit_chapter_name"]');
  let chapterid = $('input[name="edit_chapter_id"]');

  let chapref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(chapterid.val())
    .child("topicname")
    .set(chaptername.val());

  listChapterList();
  chaptername.val("");
  chapterid.val("");
}

// Delete Chapter
function deleteChapter(id) {
  let r = confirm(
    "Deleting a Chapter will delete All the Data Associated With It"
  );
  if (r == true) {
    let f = confirm("Are you Sure");
    if (f == true) {
      let chapref = firebase
        .database()
        .ref("courses")
        .child(_courseID)
        .child("subjects")
        .child(_subjectID)
        .child("topics");
      chapref.child(id).remove();
      listChapterList();
    }
  }
}
