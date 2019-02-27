
const markup = function(tableConfig) {
  return `
  <div class="userDetails">
    <h1 style="margin-bottom: 19px;">User Details:</h1>
    <p class="fields">AppMemberId: <span>${tableConfig.appMemberId || 'N/A'}</span></p>
    <p class="fields">ClientMemberId: <span>${tableConfig.clientMemId || 'N/A'}</span></p>
    <p class="fields">Email: <span>${tableConfig.email || 'N/A'}</span></p>
    <p class="fields">First Name:<span>${tableConfig.first_name || 'N/A'}</span></p>
    <p class="fields">Last Name: <span>${tableConfig.last_name || 'N/A'}</span></p>
    <p class="fields">Phone: <span>${tableConfig.phone || 'N/A'}</span></p>
    <div"><a id="send-details" class="send-button">Add Member</a></div>
    <div id="result-div"></div>
  </div>
  `
};

const closeScriptureLightbox = function() {
  var lb = document.getElementById('lightbox_background');
  lb.parentNode.removeChild( lb );
}
let clickedEl = null;

function doApiCall() {
  let userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log("111111111111",userInfo);
  // request payload
  let jsonBody = {};
  var http = new XMLHttpRequest();
  var url = 'https://qa2-ms-api.mpulsemobile.com/accounts/1095/members';
  let memberObj = {member: {}};
  if(userInfo.phone) {
    memberObj.member['mobilephone'] = userInfo.phone;
  }
  if(userInfo.last_name) {
    memberObj.member['last_name'] = userInfo.last_name;
  }
  if(userInfo.email) {
    memberObj.member['email'] = userInfo.email;
  }
  if(userInfo.first_name) {
    memberObj.member['first_name'] = userInfo.first_name;
  }
  if(userInfo.appMemberId) {
    memberObj.member['appMemberId'] = userInfo.appMemberId;
  }
  if(userInfo.clientMemId) {
    memberObj.member['clientMemId'] = userInfo.clientMemId;
  }
  jsonBody.body = memberObj;
  jsonBody.body.listid = "4607";
  http.open('POST', url, true);

  //Send the proper header information along with the request
  http.setRequestHeader('X-Ms-Format', 'json');
  http.setRequestHeader('X-Ms-Source', 'api');
  http.setRequestHeader('X-Ms-Audience-Update', 'upsert');
  http.setRequestHeader('X-Ms-Force-Subscribe-Member', 'true')
  http.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

  // Handle basic auth and set in headers
  let userCredentials = "sanjeev-appmail:egRu%WKLN9S8w7!2";
  let basicAuth = "Basic " + btoa(userCredentials);
  http.setRequestHeader ("Authorization", basicAuth);

  //Call a function when the state changes.
  http.onreadystatechange = function() {
    let element = document.getElementById("result-div");  
    if(http.readyState == 4 && http.status == 200) {
          console.log(http.responseText);
          element.innerText = "Successfully added";
      } else {
        element.innerText = "Something went wrong!!!";
      }
  }
  http.send(JSON.stringify(jsonBody));
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("111111111111",sender)
    let elementFound = document.getElementById('lightbox_extension');
    if ( request.action == "startLightbox" && !elementFound) {
        background = document.createElement('div');
        background.id = "lightbox_background";
        lightbox = document.createElement('div');
        lightbox.id = "lightbox_extension";
        document.body.appendChild(background);
        background.appendChild( lightbox );
        anchor = document.createElement('a');
        anchor.id = "close";
        anchor.innerHTML = '&times';
        anchor.onclick=closeScriptureLightbox;
        lightbox.appendChild(anchor);
        let table = document.createElement('div');
        table.id = "light_box_table";
        lightbox.appendChild(table);
        sendResponse({farewell: "goodbye"});
    }
  });

document.getElementById("members").onclick = function() {
  //right click
  clickedEl = event.target.parentNode;
  let elementId = clickedEl.id;
  let element = document.getElementById(`${elementId}`);
  let cells = element && element.cells;
  let tableConfig = {}
  for (let item of cells) {
    switch (item.getAttribute("class")) {
      case 'first_name':
        tableConfig['first_name'] = item.innerText;
        break;
      case 'last_name':
        tableConfig['last_name'] = item.innerText;
        break;
      case 'email':
        let email = item.getElementsByClassName("contact_info");
        tableConfig['email'] = email && email[0].title;
        break;
      case 'phone':
        tableConfig['phone'] = item.innerText;
        break;
      case 'clientMemId':
        tableConfig['clientMemId'] = item.innerText;
        break;
      case 'appMemberId':
        tableConfig['appMemberId'] = item.innerText;
    }
  }
  var target = event.target;
  if (target.tagName == 'TD' || target.tagName == 'TR') {    
    document.getElementById('light_box_table').innerHTML = markup(tableConfig);
    localStorage.setItem('userInfo', JSON.stringify(tableConfig));
    document.getElementById('send-details').onclick = function() {
      doApiCall();
    }
  }
}