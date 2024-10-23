
getUserPosts();
userInformation();

function userInformation() {
    
    let id = getCurrentUser();
    axios.get(`${baseUrl}/users/${id}`)
  .then(function (response) {
    let user = response.data.data

    let userImage = document.getElementById("userImage")

    if (user.profile_image == null || Object.keys(user.profile_image).length === 0) {
        userImage.src = "./images/male.jpg"
    } else {
        userImage.src = user.profile_image;
    }

    document.getElementById("username").innerHTML = user.username;
    document.getElementById("comments_count").innerHTML = user.comments_count;
    document.getElementById("posts_count").innerHTML = user.posts_count;
    document.getElementById("name").innerHTML = user.name;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}



function getUserPosts () {
    let id = getCurrentUser();
    toggleLoader(true)

    axios.get(`${baseUrl}/users/${id}/posts`)
  .then(function (response) {
    let posts = response.data.data
    if (posts.length > 0) {
        document.getElementById("userPosts").innerHTML = ""
    for (post of posts) {
        const content = `
            <div class="profile-posts">
                <div class="post-grid" id="userPosts">
                    <img onclick = "getPostId(${post.id})" style="width:400%; cursor: pointer;" src="${Object.keys(post.image).length === 0  ? "./images/no image.jpg" : post.image}" alt="Post 1">
                </div>
            </div>    
        `
        document.getElementById("userPosts").innerHTML += content;
    }
    } else {
        document.getElementById("userPosts").innerHTML = ""
        const content = `
        <div class="noPosts" style="display: flex; justify-content: center; align-items: center; margin-top: 20%;">
                <h1 style="font-size: 70px; font-family: monospace;">NO POSTS!</h1>
        </div>
        `
        document.getElementById("profile-posts").innerHTML += content;
        
    }
    
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    toggleLoader(false);
  });
}







