//------search by text ----------------/
let search = document.querySelector("#search");
let template = document.querySelector("#template");

//Keyboard Search
search.addEventListener("keyup", (e) => {
  let searchText = e.target.value;
  SearchGitHubProfiles(searchText);
});

//-----search by Voice ----------/
let SearchByVoice = document.querySelector("#speechIcon");
SearchByVoice.addEventListener("click", (e) => {
  window.SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition = new SpeechRecognition();
  recognition.interimResults = true;

  recognition.addEventListener("result", (e) => {
    let transcript = [...e.results]
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("")
      .replace(/\s/g, "");

    search.value = transcript;
    let searchText = transcript;
    SearchGitHubProfiles(searchText);
  });

  recognition.start();
});

/*-----github api ------*/

function SearchGitHubProfiles(searchText) {
  //basic github auth
  let Client_Id = "53802c62b4fa978b2233";
  let Client_Secret = "9dd7423b6b984063a4c52a05b1a04c1e3c026a10";
  //base url is for users
  let BASE_URL = `https://api.github.com/users/${searchText}?client_id=${Client_Id}&client_secret=${Client_Secret}`;
  
 
  //repo url is for public repos
  let REPO_URL= `https://api.github.com/users/${searchText}/repos?client_id=${Client_Id}&client_secret=${Client_Secret}`;

 //git hub users start
  window
    .fetch(BASE_URL)
    .then((data) => {
      //ReadableStream
      data
        .json()
        .then((users) => {
          if (users.message === "Not Found") {
            template.innerHTML = `<h1 style="color:red">No Github Profile Found</h1>`;
          } else {
            let output = "";
            output += `
              <section id="ProfileBlock">
                <article>
                  <div class="leftBlock">
                     <figure>
                     <a href="${users.html_url}" target="_blank">
                      <img src="${users.avatar_url}" alt="${users.login}" />
                     </a>
                      </figure>
                     <h4><a href="${users.html_url}" target="_blank">${users.name}</a> </h4>
                     <h5>${users.login}</h5>
                     <h5>${users.bio}</h5>
                   
                     <h5>${users.company}</h5>
                     <h5>${users.location}</h5>
                  </div>
                  <div class="rightBlock">
                   <div id="usersRepo">
                   <span>Repositories : <span class="innerspan">${users.public_repos}</span></span>
                   <span>Public gists: <span class="innerspan">${users.public_gists}</span></span>
                   <span>Followers:<span class="innerspan"> ${users.followers}</span></span>
                   <span>Following:<span class="innerspan"> ${users.following}</span></span>
                   </div>
                   <div id="repoBlock"></div>
                  </div>
                </article>
              </section>
            `;
            template.innerHTML = output;
          }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));


    //git hub public repository statrs here
/*window.fetch(REPO_URL)
.then(data =>{
    data
     .json()
      .then(repos=>
         console.log(repos))
        .catch(err=> console.log(err));
}).catch(err=> console.log(err))*/

window.fetch(REPO_URL)
.then(data =>{
    data
     .json()
      .then(repos=>{
         let repos_output=[];
         
         //for of loop we need because we need to iterate an array
         for (let repo of repos){
            repos_output +=`
                 <main>
                  <h4 style="color:blue">${repo.name}</h4>
                  <p>${repo.description}</p>
                  <p>${repo.created_at}</p>
                  <p><a href="${repo.html_url}" target="_blank">go to ${repo.name}</a></p>
                 
                  </main>
             
            `;
            document.getElementById("repoBlock").innerHTML=repos_output;
        
        }
         })
        .catch(err=> console.log(err));
}).catch(err=> console.log(err))


//ends here git hub public repos

}
//ends here git hub users 


