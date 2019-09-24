// let _coursename = $("#course_select").val();
$(document).ready(function() {
  //---------------------------------------------------------------------------------
  //    SIDE TOGGLE FUNCTION
  //---------------------------------------------------------------------------------
  $("#sidebarCollapse").on("click", function() {
    $("#sidebar").toggleClass("active");
    $("#content").toggleClass("active");
  });

  // listCoursesSelectField();

  // $("#course_select").on("change", () => {
  //   handleCourseChange();
  //   // Change the GLobal Variable;s
  // });
});

// // handleCourseChange()
// function handleCourseChange() {
//   //add the function to handle the course change
//   let selected = $("#course_select").val();
//   if (selected != "Add Course") {
//     _coursename = selected;
//   }
// }
// function listCoursesSelectField() {
//   $("#course_select").html("");
//   let ref = firebase.database().ref("courses");
//   ref.on("value", function(snap) {
//     let courses = snap.val();
//     for (let key in courses) {
//       let course = courses[key];
//       populateCoursesSelectField(course);
//     }
//     $("#course_select").append(`
//     <option onclick="gotoCourse()">Add Course</option>
//       `);
//   });
// }
// function populateCoursesSelectField(course) {
//   $("#course_select").append(`
//       <option value="${course.coursename}">${course.coursename}</option>
//       `);
// }

// function gotoCourse() {
//   window.location.href = "../courses.html";
// }

//---------------------------------------------------------------------------------
//     VIDEO FUNCTION
//---------------------------------------------------------------------------------

// // Display Video List
// function displayVideoList() {
//   $("#video_list").html("");
//   let videos = data.subjects[0].topics[0].videos;
//   for (let i = 0; i < videos.length; i++) {
//     $("#video_list").append(`
//     <div class="card mt-2">
//     <div class="card-header">
//         <span id="video_subject_header" class="mr-2 font-weight-bold">${data.subjects[0].subjectname}</span>
//         |
//         <span id="video_chapter_header" class="ml-2">${data.subjects[0].topics[0].topicname}</span>
//     </div>
//     <div class="card-body">
//         <h4 class="card-title">${videos[i].videoname}</h4>
//         <p class="card-text">${videos[i].videoDescription}</p>
//         <a class="btn btn-danger" href="#" onclick="deleteVideo(${i})"><i class="fas fa-trash mr-2" ></i>Delete</a>
//         <a class="btn btn-warning" href="#" onclick="editVideo(${i})"><i
//                 class="fas fa-pencil-alt mr-2"></i>Edit</a>
//         <a class="btn btn-primary ml-auto" href="${videos[i].videoURL}"><i
//                 class="fas fa-play mr-2"></i>Watch Video</a>
//     </div>
// </div>
//     `);
//   }
// }

// //TO get the Subject Index in the Json
// function getSubjectIndex(name) {
//   let sub = data.subjects;
//   for (let i = 0; i < sub.length; i++) {
//     if (sub[i].subjectname == name) return i;
//   }
//   return -1;
// }
// //TO get the Subject Index in the Json
// function getTitleIndex(name, sid) {
//   let topics = data.subjects[sid].topics;
//   for (let i = 0; i < topics.length; i++) {
//     if (topics[i].topicname == name) return i;
//   }
//   return -1;
// }

// //edit the Video
// function editVideo(id) {
//   $("#videoModal").modal("show");
//   populateSelectField();
//   onSelectSubjectChange();
//   filltheModal(id);
// }

// // Update the Model to Edit the Details
// function filltheModal(id) {
//   let videos = data.subjects[0].topics[0].videos[id];
//   let subjectele = $('select[name="video_subject"]');
//   let chapterele = $('select[name="video_chapter"]');
//   let titleele = $('input[name="video_title"]');
//   let descele = $('textarea[name="video_desc"]');
//   let urlele = $('input[name="video_url"]');
//   subjectele.html(
//     `<option selected value="${data.subjects[0].subjectname}" >${data.subjects[0].subjectname}</option>`
//   );
//   $("#video_chapter").show();
//   chapterele.html(
//     `<option selected value="${data.subjects[0].topics[0].topicname}" >${data.subjects[0].topics[0].topicname}</option>`
//   );
//   titleele.val(videos.videoname);
//   descele.val(videos.videoDescription);
//   urlele.val(videos.videoURL);
// }

// // Delete the Video
// function deleteVideo(id) {
//   data.subjects[0].topics[0].videos = data.subjects[0].topics[0].videos.filter(
//     (v, i) => {
//       return i != id;
//     }
//   );
//   updateDatabase();
//   displayVideoList();
// }

// //TO Update the database
// function updateDatabase() {
//   localStorage.setItem("courses", JSON.stringify(data));
// }
