const userref = firebase.database().ref("live_db/users");
ListUser();

function ListUser() {
  $("#user-list").html("");
  let count = 1;
  userref.on("child_added", data => {
    let user = data.val();

    populateUserList(user, count++);
  });
}

function populateUserList(user, count) {
  $("#user-list").append(`
  <tr>
  <td>${count}</td>
  <td>${user.firstName + " " + user.lastName}</td>
  <td>${user.institute}</td>
  <td>${user.city}</td>
  <td>${user.phone}</td>
</tr>
    `);
}
