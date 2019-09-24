let _courseID;
let _subjectID;
let _topicID;

$(document).ready(function() {
  // Populate the Select Subject List
  populateCourseSelectList();
  //   Hide the Subject Row
  $(".ebook-row").hide();
  $('select[name="current_course_select"]').on("change", function() {
    _courseID = $(this).val();
    // Populate the subject List
    populateSubjectSelectList();
  });

  // When we change Subject
  $('select[name="current_subject_select"]').on("change", function() {
    _subjectID = $(this).val();

    populateChapterSelectList();
  });

  $('select[name="current_chapter_select"]').on("change", function() {
    _topicID = $(this).val();
    // Show the Table
    $(".ebook-row").show();
    listEbookList();
    // listVideoList();
  });

  //   Add Video Button
  $("#ebook-submit-btn").on("click", function(e) {
    addEbook();
    e.preventDefault();
  });

  //   Update Chapter Button
  $("#ebook-update-btn").on("click", function(e) {
    updateEbook();
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
  $('select[name="current_chapter_select"]').html(`
  <option selected disabled>Choose Chapter</option>
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

function populateChapterSelectList() {
  $('select[name="current_chapter_select"]').html(`
  <option selected disabled>Choose Chapter</option>
  `);
  let topicref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics");

  topicref.on("child_added", data => {
    let topic = data.val();

    $('select[name="current_chapter_select"]').append(
      `<option value="${topic.topicID}">${topic.topicname}</option>`
    );
  });
}

function addEbook() {
  let ebookname = $('input[name="ebook_name"]');
  let ebook_desc = $('input[name="ebook_desc"]');
  let ebook_url = $('input[name="ebook_url"]');

  let ebook = {
    ebookname: ebookname.val(),
    ebookDescription: ebook_desc.val(),
    ebookURL: ebook_url.val()
  };
  let ebookref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("ebooks");

  ebook.ebookUID = ebookref.push().key;
  ebookref.child(ebook.ebookUID).set(ebook);
  ebookname.val("");
  ebook_desc.val("");
  ebook_url.val("");
}

function listEbookList() {
  $("#ebook-list").html("");
  let ebookref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("ebooks");
  let count = 1;
  ebookref.on("child_added", data => {
    let ebook = data.val();

    $("#ebook-list").append(`
      <tr>
                                        <td scope="row">${count}</th>
                                        <td>
                                            ${ebook.ebookname}
                                        </td>
                                        <td>${ebook.ebookDescription}</td>
                                        <td><a class="btn btn-primary" href="${ebook.ebookURL}"><i class="fas fa-play"></i></a></td>
                                        <td><a class="btn btn-warning" href="#"
                                                onclick="editEbook('${ebook.ebookUID}')" data-toggle="modal"
                                                data-target="#editEbookModal"><i class="fas fa-pencil-alt"></i></a>
                                        </td>
                                        <td> <a class="btn btn-danger" href="#"
                                                onclick="deleteEbook('${ebook.ebookUID}')"><i
                                                    class="fas fa-trash"></i></a></td>
                                    </tr>

      `);
    count++;
  });
}

function editEbook(id) {
  let ebookname = $('input[name="edit_ebook_name"]');
  let ebookdesc = $('input[name="edit_ebook_desc"]');
  let ebookurl = $('input[name="edit_ebook_url"]');
  let ebookid = $('input[name="edit_ebook_id"]');

  let ebookref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("ebooks");

  ebookref.on("value", data => {
    let ebooks = data.val();
    for (let k in ebooks) {
      let ebook = ebooks[k];
      if (ebook.ebookUID == id) {
        ebookname.val(`${ebook.ebookname}`);
        ebookdesc.val(`${ebook.ebookDescription}`);
        ebookurl.val(`${ebook.ebookURL}`);
        ebookid.val(`${ebook.ebookUID}`);
        break;
      }
    }
  });
}

function updateEbook() {
  let ebookname = $('input[name="edit_ebook_name"]');
  let ebookdesc = $('input[name="edit_ebook_desc"]');
  let ebookurl = $('input[name="edit_ebook_url"]');
  let ebookid = $('input[name="edit_ebook_id"]');

  let ebook = {
    ebookname: ebookname.val(),
    ebookDescription: ebookdesc.val(),
    ebookURL: ebookurl.val(),
    ebookUID: ebookid.val()
  };

  let ebookref = firebase
    .database()
    .ref("courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("ebooks")
    .child(ebook.ebookUID)
    .set(ebook);

  listEbookList();

  ebookname.val("");
  ebookdesc.val("");
  ebookurl.val("");
  ebookid.val("");
}

function deleteEbook(id) {
  let f = confirm("Are you Sure");
  if (f == true) {
    let ebookref = firebase
      .database()
      .ref("courses")
      .child(_courseID)
      .child("subjects")
      .child(_subjectID)
      .child("topics")
      .child(_topicID)
      .child("ebooks")
      .child(id)
      .remove();
    listEbookList();
  }
}