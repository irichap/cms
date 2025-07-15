// form-builder-enhanced.js

let formeo;

document.addEventListener('DOMContentLoaded', () => {
  // Theme toggle
  document.getElementById('theme-toggle')
    .addEventListener('click', () => {
      document.body.classList.toggle('dark');
      document.getElementById('theme-toggle').textContent =
        document.body.classList.contains('dark') ? '☀️' : '🌙';
    });

  // Initialize Formeo
  formeo = new Formeo({
    element: document.getElementById('formeo-editor'),
    sidebar: {
      container: '#formeo-sidebar'
    },
    editPanel: false,    // hide default edit panel
    // you can customize control order, language, userFields, etc.
  });

  // Preview button
  document.getElementById('preview-btn').onclick = () => {
    const json = formeo.formData;
    const html = FormeoUtils.render(html => html, json);
    document.getElementById('formeo-preview').innerHTML = html;
  };

  // Export JSON
  document.getElementById('export-json-btn').onclick = () => {
    const json = JSON.stringify(formeo.formData, null, 2);
    document.getElementById('output-json').textContent = json;
  };

  // Export HTML
  document.getElementById('export-html-btn').onclick = () => {
    const html = FormeoUtils.render(html => html, formeo.formData);
    document.getElementById('output-html').textContent = html;
  };

  // Import JSON
  document.getElementById('import-json-btn').onclick = async () => {
    const data = prompt('Paste JSON here');
    try {
      formeo.formData = JSON.parse(data);
      formeo.render();
      alert('Imported successfully');
    } catch {
      alert('Invalid JSON');
    }
  };

  // Download HTML as file
  document.getElementById('download-html-btn').onclick = () => {
    const html   = FormeoUtils.render(html => html, formeo.formData);
    const blob   = new Blob([html], { type: 'text/html' });
    const url    = URL.createObjectURL(blob);
    const a      = document.createElement('a');
    a.href       = url;
    a.download   = 'form.html';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };
});
