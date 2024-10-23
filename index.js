
getPosts();

function getPosts() {
  toggleLoader(true);
    axios.get(`${baseUrl}/posts?limit=20`)
  .then(function (response) {
    let posts = response.data.data
    document.getElementById("card").innerHTML = ""

    

    for (post of posts) {

                // show or hide (edit) button
                let user = CurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editBtnContent = ``
                let icon = ``

      if (isMyPost) { 

        icon = `
          <div><i class="fa-solid fa-ellipsis" style="font-size: 20px; color:  rgb(245, 245, 245); cursor: pointer;" onclick="toggle_menu(${post.id})"></i></div>  
        `

        editBtnContent = 
                    `
                    <div class="buttons" id="${post.id}" >
                        <button class="edit" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                        <button class="delete" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                    </div>
                    `
      }

      let content = `
        <div id="post">
          <!-- POST -->
          <div id="card" class="card" style="background-color: black; border-bottom: 1px solid #424242; margin-bottom: 30px;">
              <div class="card-header" style="position: relative;">
                  <div style="display: flex; align-items: flex-end; justify-content: space-between;">
                      <div>
                          <span onclick = "getUserId(${post.author.id})" style = "cursor: pointer;">
                            <img class="rounded-circle border border-2" src="${Object.keys(post.author.profile_image).length === 0  ? "./images/male.jpg" : post.author.profile_image}" alt="" style="width: 40px; height: 40px">
                            <b style="color: rgb(245, 245, 245);">${post.author.name}</b>
                          </span>
                          <span style="font-size: 40px; font-weight: bold;"> .</span>
                          <span style="color: #424242; font-size: 13px;" class="mt-1">
                                ${post.created_at}
                          </span>
                      </div>
                      ${icon}
                  </div>
                  ${editBtnContent}
              </div>
              <div id="card-body" class="card-body" onclick = "getPostId(${post.id})" style = "cursor: pointer;">
                  <img style="width: 100%; height: 65%;" src="${Object.keys(post.image).length === 0  ? "./images/no image.jpg" : post.image}" alt="">

                  <h5 style="padding: 10px 0 0;color: rgb(245, 245, 245);">
                      ${post.title} 
                  </h5>

                  <p style="color: rgb(245, 245, 245);">
                      ${post.body}
                  </p>

                  <hr>

                  <div style="color: rgb(245, 245, 245); font-size: 14px;">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                          <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                      </svg>

                      <span>
                          ${post.comments_count}
                      </span>
                  </div>
                <form id="commentForm" style="width: 100%; margin-top: 10px; display: flex; align-items: center;">
                    <div  id="commentField"  style="width: 100%; margin-right: 5px;">
                        <input type="text"  id="input-comment" placeholder="Add a comment..." style="background-color: black; color:rgb(245, 245, 245); border: none; outline: none;">
                    </div>
                    <div  style="display: inline-block; width: 29% ">
                        <button id="btn"  type="button" onclick="newComment(${post.id})" style="background-color: black; color: rgba(59, 59, 219, 0.312); border: none;">Post</button>
                    </div>
                </form>
              </div>
        </div>
      `

        document.getElementById("card").innerHTML += content
        setupUI();
    }

  })
  .catch(function (error) {
    // handle error
    console.log(error);
  }).finally( () => {
    toggleLoader(false);
  }) ;
}






