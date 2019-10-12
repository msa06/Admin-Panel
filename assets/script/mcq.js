//---------------------------------------------------------------------------------
//    Global Variable
//---------------------------------------------------------------------------------
let _courseID;
let _subjectID;
let _topicID;

$(document).ready(function() {
  // Populate the Select Subject List
  populateCourseSelectList();

  //   Hide the Subject Row
  $(".mcq-row").hide();

  //---------------------------------------------------------------------------------
  //    Event Change on the Course Selector
  //---------------------------------------------------------------------------------
  $('select[name="current_course_select"]').on("change", function() {
    _courseID = $(this).val();
    // Populate the subject List
    populateSubjectSelectList();
  });

  ///---------------------------------------------------------------------------------
  //    Event Change on the Subject Selector
  //---------------------------------------------------------------------------------
  $('select[name="current_subject_select"]').on("change", function() {
    _subjectID = $(this).val();
    populateChapterSelectList();
  });

  //---------------------------------------------------------------------------------
  //    Event Change on the Chapter Selector
  //---------------------------------------------------------------------------------
  $('select[name="current_chapter_select"]').on("change", function() {
    _topicID = $(this).val();
    // Show the Table
    $(".mcq-row").show();
    listMCQList();
  });

  // Add MCQ Button Click
  $("#addmcqebtn").on("click", function(e) {
    clearInputs();
    $("#multiple-answer").hide();
    $('input:radio[name="answerchoice"]').on("change", function() {
      var radioValue = $('input:radio[name="answerchoice"]:checked').val();

      if (radioValue == "single") {
        $("#single-answer").show();
        $("#multiple-answer").hide();
      } else {
        $("#single-answer").hide();
        $("#multiple-answer").show();
      }
    });
    e.preventDefault();
  });

  let answerchoice = $('input:radio[name="edit_answerchoice"]');
  $("#edit_single-answer").show();
  $("#edit_multiple-answer").hide();
  answerchoice.on("change", function() {
    var radioValue = $('input:radio[name="edit_answerchoice"]:checked').val();
    if (radioValue == "single") {
      $("#edit_single-answer").show();
      $("#edit_multiple-answer").hide();
    } else {
      $("#edit_single-answer").hide();
      $("#edit_multiple-answer").show();
    }
  });

  //   Add MCQ Button
  $("#mcq-submit-btn").on("click", function(e) {
    addMCQ();
    e.preventDefault();
  });

  //   Update MCQ Button
  $("#mcq-update-btn").on("click", function(e) {
    updateMCQ();
    e.preventDefault();
  });
});

//---------------------------------------------------------------------------------
//    Fetch the data from firebase and Populate the Courses Selector
//---------------------------------------------------------------------------------
function populateCourseSelectList() {
  // $('select[name="current_course_select"]').html('');
  $('select[name="current_course_select"]').html(`
    <option selected disabled>Select Courses</option>
    `);
  let ref = firebase.database().ref("portal_db/courses");
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

//---------------------------------------------------------------------------------
//    Fetch the data from firebase and Populate the Subject Selector
//---------------------------------------------------------------------------------
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
    .ref("portal_db/courses")
    .child(_courseID)
    .child("subjects");
  subref.on("child_added", data => {
    let subject = data.val();

    $('select[name="current_subject_select"]').append(
      `<option value="${subject.subjectID}">${subject.subjectname}</option>`
    );
  });
}

//---------------------------------------------------------------------------------
//    Fetch the data from firebase and Populate the Subject Selector
//---------------------------------------------------------------------------------
function populateChapterSelectList() {
  $('select[name="current_chapter_select"]').html(`
  <option selected disabled>Choose Chapter</option>
  `);
  let topicref = firebase
    .database()
    .ref("portal_db/courses")
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

//---------------------------------------------------------------------------------
//    Add MCQ to the Firebase
//---------------------------------------------------------------------------------
function addMCQ() {
  let mcq = getInputValue();
  let mcqref = firebase
    .database()
    .ref("portal_db/courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("mcqs");
  mcq.mcqUID = mcqref.push().key;
  mcqref.child(mcq.mcqUID).set(mcq);
  console.log("added", mcq);
  listMCQList();
}

//---------------------------------------------------------------------------------
//    List All MCQ on Firebase
//---------------------------------------------------------------------------------
function listMCQList() {
  $("#mcq-list").html("");
  let mcqref = firebase
    .database()
    .ref("portal_db/courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("mcqs");
  let qno = 1;
  mcqref.on("child_added", data => {
    let mcq = data.val();
    displayMCQ(mcq, qno++);
  });
}

//---------------------------------------------------------------------------------
//    Display One MCQ
//---------------------------------------------------------------------------------
function displayMCQ(mcq, qno) {
  $("#mcq-list").append(`
  <div class="card">
                                <div class="card-header">

                                    <a href="#collapse${qno}" data-parent="#mcq-list" data-toggle="collapse">
                                        <span id="qno">${qno}</span><span class="mr-2">.</span>
                                        ${mcq.mcquestion}
                                    </a>
                                </div>
                                <div id="collapse${qno}" class="collapse">
                                    <div class="card-body">
                                        <ul class="list-group">
                                            <li class="list-group-item">(A) : ${
                                              mcq.mcqOptions[0]
                                            }</li>
                                            <li class="list-group-item">(B) : ${
                                              mcq.mcqOptions[1]
                                            }</li>
                                            <li class="list-group-item">(C) : ${
                                              mcq.mcqOptions[2]
                                            }</li>
                                            <li class="list-group-item">(D) : ${
                                              mcq.mcqOptions[3]
                                            }</li>
                                            <li class="list-group-item">Correct: ${getAnswer(
                                              mcq
                                            )} </li>
                                            <li class="list-group-item">Solution: ${
                                              mcq.mcqSolution
                                            }</li>
                                        </ul>
                                    </div>
                                    <div class="card-footer">
                                        <div class="text-right">
                                            <a href="#" class="btn btn-danger" onclick="deleteMCQ('${
                                              mcq.mcqUID
                                            }')"><i class="fas fa-trash mr-2"></i>
                                                Delete</a>
                                            <a href="#" class="btn btn-warning" data-toggle="modal"
                                            data-target="#editMCQModal" onclick="editMCQ('${
                                              mcq.mcqUID
                                            }')"> <i
                                                    class="fas fa-pencil-alt mr-2"></i>Edit</a>
                                        </div>

                                    </div>
                                </div>
                                
                            </div>
  `);
}

// get Answer by array
function getAnswer(mcq) {
  let answer = "";
  for (let i in mcq.mcqAnswer) {
    let val = mcq.mcqAnswer[i];
    if (i === undefined) continue;
    if (val == true) {
      if (mcq.isMcqSingleCorrect == true) {
        answer = mcq.mcqOptions[i];
        break;
      } else {
        answer += mcq.mcqOptions[i] + ", ";
      }
    }
  }
  return answer;
}

//---------------------------------------------------------------------------------
//    Find the Selected MCQ using id and update the Form Fields
//---------------------------------------------------------------------------------
function editMCQ(id) {
  // Get the database Ref
  let mcqref = firebase
    .database()
    .ref("portal_db/courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("mcqs");

  mcqref.on("value", data => {
    let mcqs = data.val();
    for (let k in mcqs) {
      let mcq = mcqs[k];
      if (mcq.mcqUID == id) {
        setEditModal(mcq);
      }
    }
  });
}

function setEditModal(mcq) {
  let question = $('textarea[name="edit_mcq_question"]');
  let optionA = $('input[name="edit_optionA"]');
  let optionB = $('input[name="edit_optionB"]');
  let optionC = $('input[name="edit_optionC"]');
  let optionD = $('input[name="edit_optionD"]');
  let mcqid = $("#mcqid");
  let solution = $('textarea[name="edit_mcq_solution"]');

  mcqid.val(`${mcq.mcqUID}`);
  question.val(`${mcq.mcquestion}`);
  optionA.val(`${mcq.mcqOptions[0]}`);
  optionB.val(`${mcq.mcqOptions[1]}`);
  optionC.val(`${mcq.mcqOptions[2]}`);
  optionD.val(`${mcq.mcqOptions[3]}`);
  solution.val(`${mcq.mcqSolution}`);

  if (mcq.isMcqSingleCorrect == true) {
    $("#edit_single-answer").show();
    $("#edit_multiple-answer").hide();
    $('input:radio[name="edit_answerchoice"][value = "single"]').prop(
      "checked",
      true
    );
    for (let k in mcq.mcqAnswer) {
      let val = mcq.mcqAnswer[k];
      if (val == true) {
        $(`input:radio[name="single-answer"][value = "${k}"]`).prop(
          "checked",
          true
        );
      }
    }
  } else {
    $("#edit_single-answer").hide();
    $("#edit_multiple-answer").show();
    $('input:radio[name="edit_answerchoice"][value = "multiple"]').prop(
      "checked",
      true
    );
    for (let k in mcq.mcqAnswer) {
      let val = mcq.mcqAnswer[k];
      if (val == true) {
        $(`input:checkbox[name='multiple-answer'][value = "${k}"]`).prop(
          "checked",
          true
        );
      }
    }
  }
}

//---------------------------------------------------------------------------------
//    Update the MCQ details on Firebase
//---------------------------------------------------------------------------------
function updateMCQ() {
  let mcq = getEditInput();
  console.log(mcq);
  let mcqref = firebase
    .database()
    .ref("portal_db/courses")
    .child(_courseID)
    .child("subjects")
    .child(_subjectID)
    .child("topics")
    .child(_topicID)
    .child("mcqs")
    .child(mcq.mcqUID)
    .set(mcq);
  listMCQList();
}

function getEditInput() {
  let question = $('textarea[name="edit_mcq_question"]');
  let optionA = $('input[name="edit_optionA"]');
  let optionB = $('input[name="edit_optionB"]');
  let optionC = $('input[name="edit_optionC"]');
  let optionD = $('input[name="edit_optionD"]');
  let solution = $('textarea[name="edit_mcq_solution"]');
  let mcqid = $("#mcqid");

  $("#edit_single-answer").show();
  let singleradio = $('input:radio[name="edit_single-answer"]:checked');
  let singleval = singleradio.val();
  let falsy = [false, false, false, false];
  let singlesolution = falsy;
  singlesolution[singleval] = !singlesolution[singleval];
  let multipletick = [];
  $.each($("input:checkbox[name='edit_multiple-answer']:checked"), function() {
    multipletick.push($(this).val());
  });

  let multiplesolution = falsy;
  for (let i in multipletick) {
    let index = multipletick[i];
    multiplesolution[index] = !multiplesolution[index];
  }

  var radioValue = $('input:radio[name="edit_answerchoice"]:checked').val();
  var isSingle = radioValue == "single" ? true : false;
  var answers = radioValue == "single" ? singlesolution : multiplesolution;
  let mcq = {
    mcquestion: question.val(),
    mcqOptions: [optionA.val(), optionB.val(), optionC.val(), optionD.val()],
    mcqSolution: solution.val(),
    isMcqSingleCorrect: isSingle,
    mcqAnswer: answers,
    mcqUID: mcqid.val()
  };
  question.val("");
  optionA.val("");
  optionB.val("");
  optionC.val("");
  optionD.val("");
  solution.val("");
  mcqid.val("");
  singleradio.prop("checked", false);
  return mcq;
}

//---------------------------------------------------------------------------------
//    Delete the MCQ using id and update the table
//---------------------------------------------------------------------------------
function deleteMCQ(id) {
  let f = confirm("Are you Sure");
  if (f == true) {
    firebase
      .database()
      .ref("portal_db/courses")
      .child(_courseID)
      .child("subjects")
      .child(_subjectID)
      .child("topics")
      .child(_topicID)
      .child("mcqs")
      .child(id)
      .remove();
    listMCQList();
  }
}

// Clear Input
function clearInputs() {
  let question = $('textarea[name="mcq_question"]');
  let optionA = $('input[name="optionA"]');
  let optionB = $('input[name="optionB"]');
  let optionC = $('input[name="optionC"]');
  let optionD = $('input[name="optionD"]');
  let solution = $('textarea[name="mcq_solution"]');
  $('input:radio[name="answerchoice"][value = "single"]').prop("checked", true);
  let answerchoice = $('input:radio[name="answerchoice"]');

  $("#single-answer").show();
  let singleradio = $('input:radio[name="single-answer"]');
  singleradio.prop("checked", false);
  let multiplcheck = $('input:checkbox[name="multiple-answer"]');
  multiplcheck.prop("checked", false);
  question.val("");
  optionA.val("");
  optionB.val("");
  optionC.val("");
  optionD.val("");
  solution.val("");
}

// get Value from Inputs
function getInputValue() {
  let question = $('textarea[name="mcq_question"]');
  let optionA = $('input[name="optionA"]');
  let optionB = $('input[name="optionB"]');
  let optionC = $('input[name="optionC"]');
  let optionD = $('input[name="optionD"]');
  let solution = $('textarea[name="mcq_solution"]');

  let answerchoice = $('input:radio[name="answerchoice"]');

  $("#single-answer").show();
  let singleradio = $('input:radio[name="single-answer"]:checked');
  let singleval = singleradio.val();
  let falsy = [false, false, false, false];
  let singlesolution = falsy;
  singlesolution[singleval] = !singlesolution[singleval];
  // console.log(singlesolution);
  let multipletick = [];
  $.each($("input:checkbox[name='multiple-answer']:checked"), function() {
    multipletick.push($(this).val());
  });

  let multiplesolution = falsy;
  for (let i in multipletick) {
    let index = multipletick[i];
    multiplesolution[index] = !multiplesolution[index];
  }
  console.log(multiplesolution);

  var radioValue = $('input:radio[name="answerchoice"]:checked').val();
  var isSingle = radioValue == "single" ? true : false;
  var answers = radioValue == "single" ? singlesolution : multiplesolution;
  let mcq = {
    mcquestion: question.val(),
    mcqOptions: [optionA.val(), optionB.val(), optionC.val(), optionD.val()],
    mcqSolution: solution.val(),
    isMcqSingleCorrect: isSingle,
    mcqAnswer: answers
  };
  return mcq;
}
