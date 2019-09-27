const userref = firebase.database().ref("live_db/users");
$(document).ready(function() {
  ListUser();
});

function ListUser() {
  $("#user-list").html("");
  let count = 1;
  userref.on("value", data => {
    let users = data.val();
    for (let k in users) {
      let user = users[k];
      $("#user-list").append(`
      <tr>
      <td>${count}</td>
      <td>${user.firstName + " " + user.lastName}</td>
      <td>${user.institute}</td>
      <td>${user.city}</td>
      <td>${user.phone}</td>
    </tr>
        `);
      count++;
    }
    $("#usertable").DataTable({
      scrollY: 400
    });
  });
}
