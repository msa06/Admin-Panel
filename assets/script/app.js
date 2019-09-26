// let _coursename = $("#course_select").val();
$(document).ready(function() {
  //---------------------------------------------------------------------------------
  //    SIDE TOGGLE FUNCTION
  //---------------------------------------------------------------------------------
  $("#sidebarCollapse").on("click", function() {
    $("#sidebar").toggleClass("active");
    $("#content").toggleClass("active");
  });
});
