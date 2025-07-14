// builder.js: Page Builder logic
document.addEventListener('DOMContentLoaded', () => {
  initBuilder();
});

function initBuilder() {
  const canvas = document.getElementById('canvas');
  // Enable drag-and-drop sorting on canvas
  Sortable.create(canvas, {
    group: 'page',
    animation: 150,
    ghostClass: 'sortable-ghost'
  });
}

// Templates for blocks
const templates = {
  text: `<div contenteditable="true" class="p-3">Editable Text</div>`,
  image: `<div class="p-3">
            <input type="text" class="form-control mb-2"
                   placeholder="Image URL" 
                   oninput="updateImage(this)">
            <img src="" class="img-fluid"/>
          </div>`,
  button: `<div class="p-3">
             <button class="btn btn-primary" contenteditable="true">
               Button
             </button>
           </div>`,
  row: `<div class="row row-block">
          <div class="col-md-6"><div class="dropzone"></div></div>
          <div class="col-md-6"><div class="dropzone"></div></div>
        </div>`
};

// Add a new block or row
function addBlock(type) {
  const canvas = document.getElementById('canvas');
  const wrapper = document.createElement('div');
  wrapper.className = type === 'row' ? 'canvas-row' : 'block';
  wrapper.innerHTML = `
    ${templates[type]}
    <button class="delete btn btn-sm btn-danger" onclick="this.parentElement.remove()">
      &times;
    </button>
  `;
  canvas.appendChild(wrapper);

  // If row, initialize nested dropzones
  if (type === 'row') {
    wrapper.querySelectorAll('.dropzone').forEach(zone =>
      Sortable.create(zone, { group: 'page', animation: 150, ghostClass: 'sortable-ghost' })
    );
  }
}

// Helper to update image preview
function updateImage(input) {
  input.nextElementSibling.src = input.value;
}

// Export canvas HTML
function exportHTML() {
  const canvas = document.getElementById('canvas').cloneNode(true);
  canvas.querySelectorAll('button.delete').forEach(b => b.remove());
  document.getElementById('html-output').textContent = canvas.innerHTML.trim();
}

// Export canvas JSON
function exportJSON() {
  const canvas = document.getElementById('canvas').cloneNode(true);
  canvas.querySelectorAll('button.delete').forEach(b => b.remove());
  const payload = { html: canvas.innerHTML.trim() };
  document.getElementById('json-output').textContent = JSON.stringify(payload, null, 2);
}

// Save layout to localStorage
function saveLayout() {
  const html = document.getElementById('canvas').innerHTML;
  localStorage.setItem('cms_page', html);
  alert('Page layout saved.');
}

// Load layout from localStorage
function loadLayout() {
  const saved = localStorage.getItem('cms_page');
  if (!saved) return alert('No saved layout.');
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = saved;
  // Re-init nested dropzones
  canvas.querySelectorAll('.dropzone').forEach(zone =>
    Sortable.create(zone, { group: 'page', animation: 150, ghostClass: 'sortable-ghost' })
  );
}
