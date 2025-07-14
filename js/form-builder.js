// form-builder.js: initialize and manage formBuilder + formRender

let formBuilderInstance;

document.addEventListener('DOMContentLoaded', () => {
  initFormBuilder();
});

function initFormBuilder() {
  const options = {
    // 43 configurable options—only key ones shown here
    dataType: 'json',
    controlOrder: [
      'text',
      'number',
      'textarea',
      'select',
      'radio-group',
      'checkbox-group',
      'date',
      'file',
      'autocomplete',
      'button'
    ],
    showActionButtons: true,
    disabledActionButtons: [],
    // i18n: 31 languages supported by formBuilder
    // custom control: you can add via userFields
    // XML/JSON data: handled by getData('xml') or getData('json')
    // action methods: fbInstance.actions.[getData|setData|...]
  };

  formBuilderInstance = jQuery('#form-builder-container').formBuilder(options);
}

// Render the built form using formRender
function renderForm() {
  const formData = formBuilderInstance.actions.getData('json');
  jQuery('#form-render-container').formRender({ formData });
}

// Export JSON
function exportFormJSON() {
  const json = formBuilderInstance.actions.getData('json');
  document.getElementById('form-json-container').textContent =
    JSON.stringify(json, null, 2);
}

// Export HTML
function exportFormHTML() {
  const html = formBuilderInstance.actions.getData('html');
  document.getElementById('form-html-container').textContent = html;
}

// Save template to localStorage
function saveFormTemplate() {
  const json = formBuilderInstance.actions.getData('json');
  localStorage.setItem('cms_form_template', JSON.stringify(json));
  alert('Form template saved.');
}

// Load template from localStorage
function loadFormTemplate() {
  const saved = localStorage.getItem('cms_form_template');
  if (!saved) return alert('No saved template found.');
  // destroy previous instance
  jQuery('#form-builder-container').formBuilder('destroy');
  // reinitialize with saved data
  formBuilderInstance = jQuery('#form-builder-container').formBuilder({
    formData: JSON.parse(saved)
  });
  renderForm();
  alert('Form template loaded.');
}
