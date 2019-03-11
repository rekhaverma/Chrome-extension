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

  export {default as Comp1} from './Comp1.jsx';