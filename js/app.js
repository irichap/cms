// app.js: nav activation + posts CRUD + view + CKEditor
document.addEventListener('DOMContentLoaded', () => {
  activateNav();
  handleIndex();
  handleView();
  handlePostForm();
});

function activateNav() {
  const path = location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
}

// INDEX: List posts
function handleIndex() {
  const container = document.getElementById('posts-list');
  if (!container) return;
  const posts = JSON.parse(localStorage.getItem('cms_posts') || '[]');
  if (!posts.length) {
    container.innerHTML = '<p>No posts yet. <a href="post.html">Create one</a>.</p>';
    return;
  }
  posts.forEach((p, i) => {
    const title   = escapeHTML(p.title);
    const clean   = stripTags(p.content);
    const excerpt = clean.slice(0,150) + '...';
    const date    = new Date(p.date).toLocaleString();
    const card    = document.createElement('div');
    card.className = 'card mb-3';
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <h6 class="card-subtitle mb-2">${date}</h6>
        <p class="card-text">${excerpt}</p>
        <a href="view.html?id=${i}" class="btn btn-primary">Read More</a>
      </div>`;
    container.appendChild(card);
  });
}

// VIEW: Show a single post
function handleView() {
  const titleEl   = document.getElementById('post-title');
  const dateEl    = document.getElementById('post-date');
  const contentEl = document.getElementById('post-content');
  if (!contentEl) return;
  const params = new URLSearchParams(location.search);
  const idx    = params.get('id');
  const posts  = JSON.parse(localStorage.getItem('cms_posts') || '[]');
  if (idx === null || !posts[idx]) {
    contentEl.innerHTML = '<p>Post not found.</p>';
    return;
  }
  const p = posts[idx];
  titleEl.innerText   = escapeHTML(p.title);
  dateEl.innerText    = new Date(p.date).toLocaleString();
  contentEl.innerHTML = sanitizeHTML(p.content);
}

// POST: Create/Edit
function handlePostForm() {
  const form      = document.getElementById('post-form');
  const titleInput= document.getElementById('post-title');
  if (!form) return;
  // Load CKEditor
  if (window.CKEDITOR) CKEDITOR.replace('editor');
  const posts = JSON.parse(localStorage.getItem('cms_posts') || '[]');
  const params = new URLSearchParams(location.search);
  const idx    = params.get('id');
  if (idx !== null && posts[idx]) {
    document.getElementById('form-title').innerText = 'Edit Post';
    titleInput.value = posts[idx].title;
    CKEDITOR.instances.editor.setData(posts[idx].content);
  }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const title   = escapeHTML(titleInput.value.trim());
    const content = sanitizeHTML(CKEDITOR.instances.editor.getData());
    const record  = { title, content, date: new Date().toISOString() };
    if (idx !== null && posts[idx]) posts[idx] = record;
    else posts.push(record);
    localStorage.setItem('cms_posts', JSON.stringify(posts));
    window.location.href = 'index.html';
  });
}

// Utilities
function escapeHTML(str) {
  return str.replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function stripTags(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = sanitizeHTML(html);
  return tmp.textContent || '';
}
function sanitizeHTML(html) {
  return html.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
}
