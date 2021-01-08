
function login(){
    const email = $("#email-login").val()
    const password = $("#password-login").val()
    $.ajax({
        url: 'http://localhost:3000/users/login',
        method: 'POST',
        timeout: 1000,
        data: {
            email,
            password
        } 
    })
    .done(response => {
        localStorage.setItem('access_token',response.access_token)
        localStorage.setItem('user_name',response.first_name)
        homePage()
    })
    .fail((xhr,textstatus) => {
        $("#error-login").append(`<p> ${xhr.responseJSON.message}</p>`)
        console.log(xhr.responseJSON.message, textstatus)
    })
    .always(_ => {
        $("#email-login").val("")
        $("#password-login").val("")
    })
}

function register(){
    const firstname = $("#firstname-register").val()
    const lastname = $("#lastname-register").val()
    const email = $("#email-register").val()
    const password = $("#password-register").val()
    console.log(firstname,lastname,email,password)
    $.ajax({
        url: 'http://localhost:3000/users/register',
        method: 'POST',
        data: {
            firstname,
            lastname,
            email,
            password
        } 
    })
    .done(response => {
        loginPage()
    })
    .fail((xhr,textstatus ) => {
        $("#error-register").append(`<p> ${xhr.responseJSON.message}</p>`)
        console.log(xhr.responseJSON.message, textstatus)
    })
    .always(_ => {
        $("#firstname-register").val("")
        $("#lastname-register").val("")
        $("#email-register").val("")
        $("#password-register").val("")
    })
}

function fetchData(){
    $("#list-todos").empty()
    $("#greeting").empty()
    $.ajax({
        url: "http://localhost:3000/todos",
        method: "GET",
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(response => {
        for(let i  = 0; i < response.length; i++){
            $("#list-todos").append(`<div class="shadow p-3 mb-5 bg-white rounded card mx-auto mt-5" style="width: 40rem;" >
            <div id="title-todo" class="flex mx-auto" style="margin-top: 10px; margin-bottom: 10px;">
            <h5 class="card-title">${i + 1}. ${response[i].title}</h5>
            </div>
            <div id="info-todo">
                <div class="card-body">
                    <p class="card-text">${response[i].description}</p>
                </div>
                <ul class="list-group list-group-flush">
                    <li class="mx-auto list-group-item"><b>status:</b> ${response[i].status}</li>
                    <li class="mx-auto list-group-item"><b>due date:</b> ${response[i].due_date.slice(0,10)}</li>
                </ul>
            </div>
            <div class="mx-auto card-body">
                <button onclick="formEditTodo(${response[i].id})" type="button" class="btn btn-primary btn-sm">&#128393; edit</button>
                <button id="myBtn" onclick="deleteTodo(${response[i].id})" type="button" class="btn btn-danger btn-sm">&#128465; delete</button>
                <button id="myBtn" onclick="updateStatusTodo(${response[i].id})" type="button" class="btn btn-success btn-sm">&#10003; done</button>
            </div>
            </div>
            `)
        }
        $("#greeting").append(`<h3>hello, ${localStorage.getItem('user_name')} </h3>`)
    })
    .fail(error => {
        console.log(error)
    })
}

function deleteTodo (id) {
    $.ajax({
        url: "http://localhost:3000/todos/" + id,
        method: "DELETE",
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(response => {
        fetchData()
    })
    .fail(error => {
        console.log(error)
    })
}

function updateStatusTodo (id) {
    $.ajax({
        url: "http://localhost:3000/todos/" + id,
        method: "PATCH",
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(response => {
        fetchData()
    })
    .fail(error => {
        console.log(error)
    })
}

function formEditTodo(id) {
    $.ajax({
        url: "http://localhost:3000/todos/" + id,
        method: "GET",
        headers: {
            access_token: localStorage.getItem('access_token')
        }
    })
    .done(response => {
        $("#editTodo").empty()
        $("#editTodo").append(`<div id="formContent">
        <div class="fadeIn first">
          <img src="https://to-do-cdn.microsoft.com/static-assets/c87265a87f887380a04cf21925a56539b29364b51ae53e089c3ee2b2180148c6/icons/logo.png" width="150" height="120" style="margin-top: 10px" class="d-inline-block align-top" alt="" loading="lazy">
        <H1>edit Todo</H1>
        </div>
        <form id="form-edit-todo">
          <input type="text" id="name-editTodo" class="fadeIn second" name="name-todo" placeholder="name" required value="${response.title}">
          <input type="text" id="description-editTodo" class="fadeIn second" name="description-todo" placeholder="description" required value="${response.description}">
          <input type="date" id="due-date-editTodo" class="fadeIn second" name="due-date-todo" placeholder="due date" required value="${response.due_date.slice(0,10)}">
          <input onclick=editTodo(${response.id}) type="submit" class="fadeIn fourth">
        </form>
        <div id="error-editTodo" style="color: red;">

        </div>
        <div id="formFooter">
          <a class="underlineHover" onclick=homeFromEdit()>back to home</a>
        </div>
      </div>`)
      editTodoPage()
    })
    .fail((xhr,textstatus ) => {
        for(let i = 0; i < xhr.responseJSON.message.length; i++) {
            $("#error-editTodo").append(`<p> ${xhr.responseJSON.message[i]}</p>`)
        }
        console.log(xhr.responseJSON.message, textstatus)
    })
}

function editTodo (id) {
    const title = $("#name-editTodo").val()
    const description = $("#description-editTodo").val()
    const due_date = $("#due-date-editTodo").val()
    $.ajax({
        url: "http://localhost:3000/todos/" + id,
        method: "PUT",
        headers: {
            access_token: localStorage.getItem('access_token')
        },
        data: {
            title: title,
            description: description,
            due_date: due_date
        } 
    })
    .done(response => {
        homePage()
    })
    .fail((xhr,textstatus ) => {
        formEditTodo()
        for(let i = 0; i < xhr.responseJSON.message.length; i++) {
            $("#error-editTodo").append(`<p> ${xhr.responseJSON.message[i]}</p>`)
        }
        console.log(xhr.responseJSON.message, textstatus)
    })
}

function addTodo(){
    const title = $("#name-addTodo").val()
    const description = $("#description-addTodo").val()
    const due_date = $("#due-date-addTodo").val()
    console.log(title,description,due_date)
    $.ajax({
        method: 'POST',
        url: 'http://localhost:3000/todos',
        headers: {
            access_token: localStorage.getItem('access_token')
        },
        data: {
            title: title,
            description: description,
            due_date: due_date
        }
    })
    .done(response => {
        console.log(response)
        homePage()
    })
    .fail((xhr,textstatus ) => {
        for(let i = 0; i < xhr.responseJSON.message.length; i++) {
            $("#error-addTodo").append(`<p> ${xhr.responseJSON.message[i]}</p>`)
        }
        console.log(xhr.responseJSON.message, textstatus)
    })
    .always(_ => {
        $("#list-todos").trigger("reset")
    })
}

function homeFromEdit() {
    homePage()
}

$(document).ready(function(){
    if(localStorage.getItem('access_token')){
        // formEditTodo()
        homePage()
    } else {
        loginPage()
    }
    $("#form-login").on("submit", function(e){
        e.preventDefault();
        login()
    });
    $("#to-register").click(function(e){
        e.preventDefault();
        registerPage()
    });
    $("#back-login").click(function(e){
        e.preventDefault();
        loginPage()
    });
    $("#form-register").on("submit", function(e){
        // e.preventDefault();
        register()
    });
    $("#logout-btn").click(function(e){
        e.preventDefault();
        localStorage.clear()
        loginPage()
    });
    $("#addTodo-btn").click(function(e){
        e.preventDefault();
        addTodoPage()
    });
    $("#form-add-todo").on("submit", function(e){
        e.preventDefault();
        addTodo()
    });
    $("body").on("submit","#form-add-todo", function(e){
        e.preventDefault();
        editTodo()
    });
    $("#backHome").click(function(e){
        homePage()
    });
    $('#editTodo').attr('id', 'editTodo');
});

function loginPage () {
    $("#login").show();
    $("#homePage").hide();
    $("#addTodo").hide();
    $("#register").hide();
    $("#editTodo").hide();
}
function homePage () {
    $("#login").hide();
    $("#homePage").show();
    $("#addTodo").hide();
    $("#register").hide();
    $("#editTodo").hide();
    fetchData()
}
function addTodoPage () {
    $("#login").hide();
    $("#homePage").hide();
    $("#addTodo").show();
    $("#register").hide();
    $("#editTodo").hide();
}
function registerPage () {
    $("#login").hide();
    $("#homePage").hide();
    $("#addTodo").hide();
    $("#register").show();
    $("#editTodo").hide();
}
function editTodoPage () {
    $("#login").hide();
    $("#homePage").hide();
    $("#addTodo").hide();
    $("#register").hide();
    $("#editTodo").show();
}