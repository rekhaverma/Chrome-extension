
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

const settingsMarkup = function(tableConfig) {
  return `
  <div class="userDetails">
    <h1 style="margin-bottom: 19px;">User Settings:</h1>
    <p class="fields">AppMemberId: <span>${tableConfig.appMemberId || 'N/A'}</span></p>
    <p class="fields">ClientMemberId: <span>${tableConfig.appClientId || 'N/A'}</span></p>
    <p class="fields">Email: <span>${tableConfig.email || 'N/A'}</span></p>
    <p class="fields">First Name:<span>${tableConfig.firstName || 'N/A'}</span></p>
    <p class="fields">Last Name: <span>${tableConfig.lastName || 'N/A'}</span></p>
    <p class="fields">Phone: <span>${tableConfig.phone || 'N/A'}</span></p>
    <div id="result-div"></div>
  </div>
  `
};
function checkForEmptyKey () {
  let onboardingData = JSON.parse(localStorage.getItem('onboardingData')) || {};
  let defaultJson = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    appMemberId: "",
    appClientId: ""
  };
  let emptyKeyFound;
  for (let property1 in defaultJson) {
    if(!onboardingData[property1] || !onboardingData.hasOwnProperty(property1)) {
      emptyKeyFound = true;
      break;
    }
  }
  return emptyKeyFound;
}
const formWizard = function() {
  return `
      <form id="regForm">
      <h1>Step 1:</h1>
      <!-- One "tab" for each step in the form: -->
      <div class="tab">
        <p>Please select first name:</p>
        <p><input placeholder="First name..." oninput="this.className = ''" name="fname" readonly></p>
      </div>
      <div class="tab">
        <p>Please select last name</p>
        <p><input placeholder="Last name..." oninput="this.className = ''" name="lname" readonly></p>
      </div>
      <div class="tab">
        <p>Please select Email</p>
        <p><input placeholder="Email..." oninput="this.className = ''" name="email" readonly></p>
      </div>
      <div class="tab">Mobile:
        <p>Please select mobile</p>
        <p><input placeholder="Mobile..." oninput="this.className = ''" name="mobile" readonly></p>
      </div>
      <div class="tab">
        <p>Please select AppMemberId</p>
        <p><input placeholder="AppMemberId..." oninput="this.className = ''" name="AppMemberId" readonly></p>
      </div>
      <div class="tab">
        <p>Please select ClientMemberId</p>
        <p><input placeholder="ClientMemberId..." oninput="this.className = ''" name="ClientMemberId" readonly></p>
      </div>
      <div style="overflow:auto;">
        <div style="float:right;">
          <button type="button" id="prevBtn" class="goToStep">Previous</button>
          <button type="button" id="nextBtn" class="goToStep">Next</button>
        </div>
      </div>
      <!-- Circles which indicates the steps of the form: -->
      <div style="text-align:center;margin-top:40px;">
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
        <span class="step"></span>
      </div>
    </form>
  `;
}

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == (x.length - 1)) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n)
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i, x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}

const closeScriptureLightbox = function() {
  var lb = document.getElementById('lightbox_background');
  lb.parentNode.removeChild( lb );
}
let clickedEl = null;
let currentTab = 0; // Current tab is set to be the first tab (0)

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
    memberObj.member['lastname'] = userInfo.last_name;
  }
  if(userInfo.email) {
    memberObj.member['email'] = userInfo.email;
  }
  if(userInfo.first_name) {
    memberObj.member['firstname'] = userInfo.first_name;
  }
  if(userInfo.appMemberId) {
    memberObj.member['appmemberid'] = userInfo.appMemberId;
  }
  if(userInfo.clientMemId) {
    memberObj.member['clientmemberid'] = userInfo.clientMemId;
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
function validateForm() {
  // This function deals with validation of the form fields
  var x, y, i, valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
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
        let settingsButton = document.createElement('button');
        settingsButton.id = "settings";
        var textNode = document.createTextNode("Settings");
        settingsButton.appendChild(textNode);
        lightbox.appendChild(settingsButton);
        // if onboarding done.
        // Check boarding json in local storage to determine if boarding page needs to show.
        // othewise show boarding page
        let emptyKeyFound = checkForEmptyKey();
        if(emptyKeyFound) {
          document.getElementById('light_box_table').innerHTML = formWizard();
          showTab(currentTab); 
          var deleteLink = document.querySelectorAll('.goToStep');
          for (var i = 0; i < deleteLink.length; i++) {
              deleteLink[i].addEventListener('click', function(event) {
                  console.log("qwerty----------->",event.target);
                  let n;
                  if(event.target.id === "nextBtn") {
                    n = 1;
                  } else {
                    n = -1;
                  }
                  // This function will figure out which tab to display
                  var x = document.getElementsByClassName("tab");
                  // Exit the function if any field in the current tab is invalid:
                  if (n == 1 && !validateForm()) return false;
                  // Hide the current tab:
                  x[currentTab].style.display = "none";
                  // Increase or decrease the current tab by 1:
                  currentTab = currentTab + n;
                  // if you have reached the end of the form...
                  if (currentTab >= x.length) {
                    // ... the form gets submitted:
                    document.getElementById("regForm").submit();
                    return false;
                  }
                  // Otherwise, display the correct tab:
                  showTab(currentTab);
              });
          }
        } else {
          // Show settings icon.
          document.getElementById('settings').onclick = function() {
            // document.getElementById('settings').style.display = "none";
            let onboardingData = JSON.parse(localStorage.getItem('onboardingData'));
            document.getElementById('light_box_table').innerHTML = settingsMarkup(onboardingData);
          }
        }
        sendResponse({farewell: "goodbye"});
    }
});

document.getElementById("members").onclick = function() {
  console.log("event.target",event.target);

  //right click
  let emptyKeyFound = checkForEmptyKey();
  if(emptyKeyFound) {
    // document.getElementById('light_box_table').innerHTML = formWizard();
    // showTab(currentTab);
    let currentTabScreen = document.getElementsByClassName("tab");
    let currentInput = currentTabScreen[currentTab].getElementsByTagName("input");
    console.log("currentInput",event.target.parentNode,event.target);
    if (event.target.tagName == 'TD') {
      let className = event.target.className || "";
      currentInput[0].setAttribute("value",className);
      let onboardingData = JSON.parse(localStorage.getItem('onboardingData')) || {};
      switch(currentTab) {
        case 0:
          // code block
          onboardingData.firstName = className;
          break;
        case 1:
          // code block
          onboardingData.lastName = className;
          break;
        case 2:
          // code block
          onboardingData.email = className;
          break;
        case 3:
          // code block
          onboardingData.phone = className;
          break;
        case 4:
          // code block
          onboardingData.appMemberId = className;
          break;
        case 5:
          // code block
          onboardingData.appClientId = className;
          break;
        default:
          // code block
      }
      console.log("currentTab",currentTab)
      console.log(onboardingData,'onboardingData')
      localStorage.setItem('onboardingData', JSON.stringify(onboardingData));
    }
  } else {
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
}