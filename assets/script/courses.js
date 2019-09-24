const ref = firebase.database().ref("courses");
$(document).ready(function() {
  listCourses();
  // Add Course Btn Click
  $("#add-course-btn").on("click", e => {
    addCourse();
    e.preventDefault();
  });

  //   EDit Course Btn Click
  $("#edit-course-btn").on("click", e => {
    updateCourse();
    e.preventDefault();
  });
});

// ADD new Courses
function addCourse() {
  // get the data from form
  let coursename = $('input[name="course_title"]');

  let course = {
    coursename: coursename.val()
  };
  course.courseID = ref.push().key;
  //   console.log(course);
  ref.child(course.courseID).set(course);
  console.log("Added Course");
  coursename.val("");
  listCourses();
  listCoursesSelectField();
}

// List All the Courses
function listCourses() {
  $("#courses-list").html("");
  let count = 1;

  ref.on("child_added", data => {
    let course = data.val();
    // populate the data
    populateCourseList(course, count++);
  });
}

function populateCourseList(course, count) {
  $("#courses-list").append(`
    <tr>
                                    <th scope="row">${count}</th>
                                    <td>
                                        ${course.coursename}
                                    </td>
                                    <td><a class="btn btn-warning" href="#" onclick="editCourses('${course.courseID}')" data-toggle="modal"
                                    data-target="#editCourseModal"><i
                                                class="fas fa-pencil-alt"></i></a></td>
                                    <td> <a class="btn btn-danger" href="#" onclick="deleteCourses('${course.courseID}')"><i
                                                class="fas fa-trash"></i></a></td>
                                </tr>
  `);
}

// Edit Courses List
function editCourses(id) {
  let coursename = $('input[name="edit_course_title"]');
  let courseID = $('input[name="edit_course_id"]');
  ref.on("value", function(data) {
    let courses = data.val();
    for (let key in courses) {
      let course = courses[key];
      if (course.courseID == id) {
        coursename.val(`${course.coursename}`);
        courseID.val(`${course.courseID}`);
        break;
      }
    }
  });
}

// Function to update course
function updateCourse() {
  let coursename = $('input[name="edit_course_title"]');
  let courseID = $('input[name="edit_course_id"]');
  ref
    .child(courseID.val())
    .child("coursename")
    .set(coursename.val());
  listCourses();
}

// Delete the Courses
function deleteCourses(id) {
  let r = confirm(
    "Deleting a Courses will delete All the Data Associated With It"
  );
  if (r == true) {
    let f = confirm("Are you Sure");
    if (f == true) {
      ref.child(id).remove();
      listCourses();

      console.log("Course Removed");
    }
  }
}
