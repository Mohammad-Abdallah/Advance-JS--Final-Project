const baseUrl = "https://tarmeezacademy.com/api/v1";

setupUI();
getAllUsers();


function toggleMenu() {
    let buttons = document.getElementById("idMenu");
    buttons.classList.toggle("openMenu");
}

function toggle_menu(postId) {
    let buttons = document.getElementById(`${postId}`);
    buttons.classList.toggle("menu");
}

function showAlert(customMessage, type = "success") {
    const alertPlaceholder = document.getElementById('success-alert');

    // Function to create the alert
    const alert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
        wrapper.setAttribute('role', 'alert');
        wrapper.innerHTML = `
            <div>${message}</div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

        alertPlaceholder.append(wrapper);

        // Automatically hide the alert after 2 seconds
        setTimeout(() => {
            // Bootstrap's built-in alert closing method
            const alertInstance = bootstrap.Alert.getOrCreateInstance(wrapper);
            alertInstance.close(); // Use the Bootstrap method to close (fade out) the alert
        }, 2000);
    };

    alert(customMessage, type);
}

function createNewPostClicked() {
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""

    const title = document.getElementById("post-title-input").value;
    const body = document.getElementById("post-body-input").value;
    const image = document.getElementById("post-image-input").files[0];

    let formData = new FormData()
    formData.append("title",title)
    formData.append("body",body)
    formData.append("image",image)

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "multipart/form-data",
         "authorization": `Bearer ${token}`
    }

    let url = ``        

    if(isCreate)
    {
        url = `${baseUrl}/posts`            

    }else {

        formData.append("_method", "put")
        url = `${baseUrl}/posts/${postId}`
    }

    axios.post(url, formData , {
        headers:headers
      })
      .then(function (response) {

        const modal = document.getElementById("create-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()  
        console.log(response);
        showAlert("New Post Has Been Created", "success");
        window.location = "index.html";
        getPosts()
      })
      .catch(function (error) {
        const message = error.response.data.message
        showAlert(message, "danger")
      });
}



function editPostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
    postModal.toggle()
}

function deletePostBtnClicked(postObject)
{
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)

    document.getElementById("delete-post-id-input").value = post.id
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-modal"), {})
    postModal.toggle()
}

function confirmPostDelete() {
    const token = localStorage.getItem("token")
    const postId = document.getElementById("delete-post-id-input").value
    const url = `${baseUrl}/posts/${postId}`
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }


    axios.delete(url, {
        headers: headers
    })
    .then((response) => {
        const modal = document.getElementById("delete-post-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("The Post Has Been Deleted Successfully", "success");
        window.location = "index.html"
        getPosts();
        

    }).catch((error) => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
}


function loginBtnClicked() {
    const username = document.getElementById("username-input").value
    const password = document.getElementById("password-input").value
    
    params = {
        "username" : username,
        "password" : password
    }

    axios.post(`${baseUrl}/login`, params )

      .then(function (response) {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(user));

        const modal = document.getElementById("login-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()  
        showAlert("Logged in successfully", "success")
        setupUI();
        


      })
      .catch(function (error) {
        const message = error.response.data.message
        showAlert(message, "danger")
      }).finally(() => {
        toggleMenu();
      });
}

function setupUI(){

    let token = localStorage.getItem("token");
    const loggedIn = document.getElementById("logged-in-div");
    const loggedOut = document.getElementById("logout-div");
    const addBtn = document.getElementById("add-btn");
    const logout = document.getElementById("logout-btn");
    const commentForm = document.getElementById("commentForm");

    const profileImage = document.getElementById("yourProfileImage");
    const username = document.getElementById("yourUsername");
    const name = document.getElementById("yourName");


    if(token !== null) {
        loggedIn.style.visibility = "hidden";
        loggedOut.style.visibility = "visible";
        logout.style.visibility = "visible";
        addBtn.style.visibility = "visible"
        const storedUserData = localStorage.getItem('user')
        const userData = JSON.parse(storedUserData)
        // commentForm.style.visibility = "visible"
        document.getElementById("nav-username").innerHTML = userData.name
        document.getElementById("nav-user-image").src = userData.profile_image;
        profileImage.src = userData.profile_image;
        username.innerHTML = userData.username;
        name.innerHTML = userData.name;
        
    } else {
        loggedIn.style.visibility = "visible";
        loggedOut.style.visibility = "hidden";
        logout.style.visibility = "hidden";
        addBtn.style.visibility = "hidden"
        // commentForm.style.visibility = "hidden"


    }

    
}


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("Logged out successfully")
    setupUI();
    toggleMenu();

}


function registerBtnClicked() {
    let image =document.getElementById("register-image-input").files[0];
    let name =document.getElementById("register-name-input").value;
    let username =document.getElementById("register-username-input").value;
    let password =document.getElementById("register-password-input").value;

    let formData = new FormData()
    formData.append("image",image);
    formData.append("name",name);
    formData.append("username",username);
    formData.append("password",password);

    axios.post(`${baseUrl}/register`, formData)
      .then(function (response) {
        const token = response.data.token;
        const user = response.data.user;

        localStorage.setItem("token",token)
        localStorage.setItem("user",JSON.stringify(user));

        const modal = document.getElementById("register-modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("New User Registered Successfully", "success")
        setupUI();
        
      })
      .catch(function (error) {
        const message = error.response.data.message
        showAlert(message, "danger");
      }).finally(() => {
        toggleMenu();
      });
}

function getAllUsers() {
    axios.get(`${baseUrl}/users`)
    .then(function (response) {
      let users = response.data.data
      document.getElementById("users").innerHTML = ""
      for (user of users) {
        let content = `
        <a  onclick="userProfileClicked(${user.id})">
            <div class="content">
                <img class="rounded-circle" src="${user.profile_image}" alt="">
                <div class="username">
                    <p>${user.username}</p>
                    <h6>${user.name}</h6>
                </div>
            </div>
        </a>
        `
        document.getElementById("users").innerHTML += content
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
}



function getPostId(postId) {
    window.location = `postDetailes.html?postId=${postId}`
}


function getCurrentPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('postId');
    return id
}







function getUserId(userId) {
    window.location = `profile.html?userId=${userId}`
}

function userProfileClicked(userId) {

    window.location = `profile.html?userId=${userId}`
}


function getCurrentUser() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('userId');
    return id
}


function CurrentUser()
{
    let user = null 
    const storageUser = localStorage.getItem("user")

    if(storageUser != null)
    {
        user = JSON.parse(storageUser)
    }
    
    return user
}


function myProfileClicked() {
    const storedUserData = localStorage.getItem('user')
    const userData = JSON.parse(storedUserData)
    window.location = `profile.html?userId=${userData.id}`
    console.log(userData.id)
}














function toggleLoader(show = true)
{
    if(show)
    {
        document.getElementById("loader").style.visibility = 'visible'
    }else {
        document.getElementById("loader").style.visibility = 'hidden'
    }
}
