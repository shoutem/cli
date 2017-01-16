// listen for sandbox initialization complete
document.addEventListener('sandboxready', onSandboxReady, false);

// handler for sandbox initialization finished
function onSandboxReady(event) {
  // config object containing buidler extension configuration, can be accessed via event
  // or by shoutem.sandbox.config
  const config = event.detail;

  // Waiting for DOM to be ready to initialize shoutem.api and call app start function
  $(document).ready(function() {
    shoutem.api.init(config);
    appReady(config);
  });
}

// Put your settings page logic here, executes when sandbox and DOm are initalized
function appReady(config) {
}
