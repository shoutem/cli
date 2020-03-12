// listen for Shoutem initialization complete
document.addEventListener('shoutemready', onShoutemReady, false);

// handler for Shoutem initialization finished
function onShoutemReady(event) {
  // config object containing builder extension configuration, can be accessed via event
  // or by shoutem.sandbox.config
  const config = event.detail.config;

  // Waiting for DOM to be ready to initialize shoutem.api and call app start function
  $(document).ready(function() {
    shoutem.api.init(config.context);
    onPageReady(config);

  });
};

// Put your settings page logic here, executes when sandbox and DOM are initalized
function onPageReady(config) {
  function errorHandler(err) {
    console.log('Something went wrong:', err);
  }

  function handleSubmit(e) {
    // prevent default action and bubbling
    e.preventDefault();
    e.stopPropagation();

    const company = $('#companyName').val();

    // updates extension settings by patching with current settings
    shoutem.api.extensions.updateSettings({ company })
      .catch(errorHandler);

    return false;
  }

  function initForm(settings) {
    if(!settings) {
      return;
    }

    $('#companyName').val(settings.company);
  }

  $('button[type="submit"]').click(handleSubmit);

  // shoutem.api returns promise with fetched settings
  shoutem.api.extensions.getSettings()
    .then(initForm, errorHandler);
}
