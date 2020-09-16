/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var apiKey;
var sessionId;
var token;

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function initializeSession() {
  var session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // initialize the publisher
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  var publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
    }
  });
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = '46923354';
  sessionId = '1_MX40NjkyMzM1NH5-MTYwMDI5MzA2MzMxNH5GWDFVNk54dTR1WlFXMkUvclVYUVpmenB-fg';
  token = 'T1==cGFydG5lcl9pZD00NjkyMzM1NCZzaWc9MWZmY2RhYTNmM2U1YzhiNzIzMTcyOGZlNmU0N2ZmMjZmNmY1ODE2YTpzZXNzaW9uX2lkPTFfTVg0ME5qa3lNek0xTkg1LU1UWXdNREk1TXpBMk16TXhOSDVHV0RGVk5rNTRkVFIxV2xGWE1rVXZjbFZZVVZwbWVuQi1mZyZjcmVhdGVfdGltZT0xNjAwMjkzMTAwJm5vbmNlPTAuMDI2NzIyNTkxNjU3OTQ1NjYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTYwMDg5ODE4OCZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    initializeSession();
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
