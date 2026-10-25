const API = '/api';

const demoCategories = [
  { _id: 'design', name: 'Design', description: 'The things we make and why they matter', symbol: '⌁' },
  { _id: 'technology', name: 'Technology', description: 'Tools, systems, and new horizons', symbol: '◌' },
  { _id: 'culture', name: 'Culture', description: 'The stories shaping our shared world', symbol: '✳' },
  { _id: 'work', name: 'Work & Life', description: 'Finding better ways to spend our days', symbol: '↗' },
  { _id: 'everyday', name: 'Everyday', description: 'Small observations with a long echo', symbol: '◒' }
];

const demoBlogs = [
  {
    _id: 'demo-1', title: 'The quiet power of leaving space', category: { name: 'Work & Life' }, author: { name: 'Mara Choi' }, date: '2026-08-18', likes: 842, views: 3260, commentCount: 24, sentiment: 'positive', tags: ['attention', 'work', 'rest'],
    aiSummary: 'A case for resisting the urge to fill every spare inch of a day—and letting the unplanned parts become useful again.',
    content: 'For a long time, I treated an empty hour like a mistake. I would tidy it with a call, a podcast, another tab. The day looked impressive, but it never felt entirely mine.\n\nSpace has a strange reputation. We call it downtime, as if it only begins once the important work has stopped. But space is often where the important work changes shape. It is where a thought that was too shy to speak finally introduces itself.\n\nLately I have been trying to leave one square on the calendar blank. Not as a reward. As material. It has made me a little less efficient and a lot more awake.'
  },
  {
    _id: 'demo-2', title: 'Designing for the feeling after', category: { name: 'Design' }, author: { name: 'Ishan Verma' }, date: '2026-08-16', likes: 619, views: 2410, commentCount: 17, sentiment: 'positive', tags: ['design', 'memory', 'craft'],
    aiSummary: 'The most memorable designs do not stop at a completed task; they leave a feeling that quietly follows people home.',
    content: 'Every interface has an aftertaste. Sometimes it is relief. Sometimes it is doubt. Occasionally, it is a small, almost physical sense of delight.\n\nWe are trained to measure the moment of completion: the click, the conversion, the time-to-task. Those things matter. But they do not tell us whether a person feels more capable after using the thing we made.\n\nThe feeling after is harder to chart, yet it is the part that earns trust. Design it with the same care you give the first screen.'
  },
  {
    _id: 'demo-3', title: 'A field guide to beautiful friction', category: { name: 'Technology' }, author: { name: 'Nora Bell' }, date: '2026-08-14', likes: 493, views: 1988, commentCount: 31, sentiment: 'neutral', tags: ['technology', 'attention', 'habits'],
    aiSummary: 'Convenience is not always kindness: a few considered pauses can help technology respect human attention.',
    content: 'We have spent decades polishing away friction. Faster checkouts, infinite scroll, the answer before the question is even finished. Some of this is generous. Some of it quietly removes our chance to choose.\n\nBeautiful friction is the kind that restores agency. A confirmation before a message becomes permanent. A pause before the next episode. A map that invites you to look around, instead of directing your gaze.\n\nThe question is not whether something can be instant. It is whether instant is what the moment asks for.'
  },
  {
    _id: 'demo-4', title: 'The joy of becoming a beginner again', category: { name: 'Everyday' }, author: { name: 'Tala Brooks' }, date: '2026-08-11', likes: 772, views: 2986, commentCount: 12, sentiment: 'positive', tags: ['learning', 'curiosity', 'beginnings'],
    aiSummary: 'Starting something unfamiliar can reintroduce us to attention, patience, and the pleasure of not knowing yet.',
    content: 'I signed up for a pottery class because I wanted to make a bowl. Instead, I got a new relationship with failure.\n\nMy first attempts collapsed before they were anything. They taught me that competence can become a room with very low ceilings. Being new at something lets in weather.\n\nThere is relief in having nothing to prove. You can ask obvious questions. You can make lopsided things. You can notice the world with the fresh concentration of someone who has not decided what they are supposed to see.'
  },
  {
    _id: 'demo-5', title: 'What our cities say when we slow down', category: { name: 'Culture' }, author: { name: 'Eli Laurent' }, date: '2026-08-07', likes: 386, views: 1752, commentCount: 9, sentiment: 'neutral', tags: ['cities', 'culture', 'walking'],
    aiSummary: 'Walking without a destination reveals a city not as infrastructure, but as a collection of human invitations.',
    content: 'A city changes its voice at walking speed. The shopfronts become sentences. A bench becomes a thesis on who is welcome to rest. A shortcut becomes a tiny act of local knowledge.\n\nWe often talk about cities in systems: transit, density, costs. But their emotional architecture matters too. Does a street offer shade? Is there somewhere to pause without buying anything? Can a child make a detour safely?\n\nTo slow down in a city is to remember that all those systems eventually arrive in someone’s body.'
  },
  {
    _id: 'demo-6', title: 'Notes from a less optimised life', category: { name: 'Work & Life' }, author: { name: 'Camille Stone' }, date: '2026-08-03', likes: 1087, views: 4130, commentCount: 42, sentiment: 'positive', tags: ['balance', 'work', 'life'],
    aiSummary: 'A gentle argument for designing a life around what nourishes us, not only around what can be measured.',
    content: 'The spreadsheet does not know that the best part of Tuesday was a conversation that went on ten minutes too long. It cannot record how much a walk rearranged a difficult thought.\n\nOptimisation is a terrific servant and a terrible storyteller. It reduces everything to a race toward a clean finish line. A life, luckily, is more like a garden path: it only makes sense once you notice where it lets you wander.\n\nI still use lists. I simply try not to let them decide what counts.'
  }
];

const state = {
  blogs: [], categories: [], usingDemo: false, visibleCount: 6, filter: 'all', search: '', authMode: 'login', currentStory: null,
  user: JSON.parse(localStorage.getItem('luminaUser') || 'null'), token: localStorage.getItem('luminaToken') || ''
};

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const cleanText = (value = '') => String(value).replace(/\s+/g, ' ').trim();
const getCategoryName = blog => typeof blog.category === 'object' ? blog.category?.name || 'Uncategorised' : blog.category || 'Uncategorised';
const initials = name => cleanText(name).split(' ').slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'L';
const formatNumber = number => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(number || 0);
const formatDate = date => new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
const readTime = content => `${Math.max(1, Math.ceil(cleanText(content).split(' ').length / 220))} min read`;
const isDemo = blog => String(blog?._id || '').startsWith('demo-');

async function request(path, options = {}) {
  const headers = { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Something went wrong. Please try again.');
  return payload;
}

function toast(message, type = '') {
  const element = $('#toast');
  element.textContent = message;
  element.className = `toast show ${type}`;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { element.className = 'toast'; }, 3400);
}

function openModal(id) {
  $$('.modal').forEach(modal => modal.hidden = true);
  const modal = $(`#${id}`);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => $('input, textarea', modal)?.focus(), 70);
}

function closeModals() {
  $$('.modal').forEach(modal => modal.hidden = true);
  document.body.style.overflow = '';
}

function setUser(user, token) {
  state.user = user;
  state.token = token;
  if (user && token) {
    localStorage.setItem('luminaUser', JSON.stringify(user));
    localStorage.setItem('luminaToken', token);
  } else {
    localStorage.removeItem('luminaUser');
    localStorage.removeItem('luminaToken');
  }
  renderAccount();
}

function renderAccount() {
  const avatar = $('.avatar-button');
  if (state.user) {
    avatar.innerHTML = `<span>${escapeHTML(initials(state.user.name))}</span>`;
    avatar.setAttribute('aria-label', `Signed in as ${state.user.name}`);
    avatar.dataset.action = 'account';
  } else {
    avatar.innerHTML = '<span>?</span>';
    avatar.setAttribute('aria-label', 'Sign in');
    avatar.dataset.action = 'open-auth';
  }
}

function renderCategories() {
  const categories = state.categories.length ? state.categories : demoCategories;
  $('#topic-list').innerHTML = categories.map((category, index) => `
    <button class="topic-card" type="button" data-category="${escapeHTML(category._id)}" data-category-name="${escapeHTML(category.name)}">
      <span class="topic-symbol">${escapeHTML(category.symbol || ['⌁', '◌', '✳', '↗', '◒'][index % 5])}</span>
      <span class="topic-shape"></span>
      <h3>${escapeHTML(category.name)}</h3>
      <small>${escapeHTML(category.description || 'Explore stories')} →</small>
    </button>`).join('');
  const select = $('#story-category');
  select.innerHTML = '<option value="">No category</option>' + state.categories.map(category => `<option value="${escapeHTML(category._id)}">${escapeHTML(category.name)}</option>`).join('');
}

function storyCard(blog, index) {
  const colors = ['#e8d0b9', '#d7e7ae', '#b8d9e5', '#e7ce9f', '#d6c6e9', '#f3c6b6'];
  const authorColors = ['#e0b579', '#b4d0a6', '#98cada', '#d5b573', '#bca6db', '#e4927e'];
  const excerpt = cleanText(blog.aiSummary || blog.content || 'A small, thoughtful story from the Lumina community.');
  return `<article class="story-card" data-story-id="${escapeHTML(blog._id)}" tabindex="0" role="button" aria-label="Read ${escapeHTML(blog.title)}">
    <div class="story-visual style-${index % 6}" style="--card-bg:${colors[index % colors.length]};"><span class="story-index">0${(index % 9) + 1}</span></div>
    <div class="story-content"><div class="story-kicker"><span>${escapeHTML(getCategoryName(blog))}</span><span>·</span><span class="sentiment">${escapeHTML(blog.sentiment || 'thoughtful')}</span></div>
    <h3>${escapeHTML(blog.title)}</h3><p class="excerpt">${escapeHTML(excerpt)}</p>
    <div class="story-byline"><span><i class="author-dot" style="--author-bg:${authorColors[index % authorColors.length]}">${escapeHTML(initials(blog.author?.name || 'Lumina'))}</i>${escapeHTML(blog.author?.name || 'Lumina editor')}<b>·</b>${readTime(blog.content || excerpt)}</span><span class="story-stats"><span>♡ ${formatNumber(blog.likes)}</span><span>◌ ${formatNumber(blog.views)}</span></span></div></div>
  </article>`;
}

function filteredBlogs() {
  let blogs = [...state.blogs];
  if (state.search) {
    const needle = state.search.toLowerCase();
    blogs = blogs.filter(blog => [blog.title, blog.content, blog.aiSummary, getCategoryName(blog), blog.author?.name, ...(blog.tags || [])].join(' ').toLowerCase().includes(needle));
  }
  if (state.filter === 'popular') blogs.sort((a, b) => (b.likes || 0) - (a.likes || 0));
  if (state.filter === 'recent') blogs.sort((a, b) => new Date(b.date) - new Date(a.date));
  return blogs;
}

function renderStories() {
  const grid = $('#story-grid');
  const blogs = filteredBlogs();
  if (!blogs.length) {
    grid.innerHTML = `<div class="loading-state">No stories found for “${escapeHTML(state.search)}”. Try another thought.</div>`;
    return;
  }
  grid.innerHTML = blogs.slice(0, state.visibleCount).map(storyCard).join('');
  $('[data-action="load-more"]').parentElement.hidden = blogs.length <= state.visibleCount;
}

function renderRecommendations(blogs) {
  const holder = $('#recommendations');
  if (!blogs?.length) {
    holder.innerHTML = '<div class="recommendation-placeholder">Your reading constellation<br />is waiting to form. <span>✦</span></div>';
    return;
  }
  holder.innerHTML = blogs.slice(0, 3).map(blog => `<article class="rec-card" data-story-id="${escapeHTML(blog._id)}"><small>${escapeHTML(getCategoryName(blog))} · ${readTime(blog.content || blog.aiSummary)}</small><h3>${escapeHTML(blog.title)}</h3></article>`).join('');
}

async function loadRecommendations() {
  if (!state.token) return renderRecommendations();
  try {
    renderRecommendations(await request('/recommendations'));
  } catch (error) {
    renderRecommendations();
  }
}

async function loadContent() {
  try {
    const [blogs, categories] = await Promise.all([request('/blogs'), request('/categories')]);
    state.usingDemo = blogs.length === 0;
    state.blogs = state.usingDemo ? demoBlogs : blogs;
    state.categories = categories;
  } catch (error) {
    state.usingDemo = true;
    state.blogs = demoBlogs;
    state.categories = [];
    toast('Showing the Lumina sample collection while the API wakes up.', 'error');
  }
  renderCategories();
  renderStories();
  loadRecommendations();
}

function setAuthMode(mode) {
  state.authMode = mode;
  const registering = mode === 'register';
  $('.name-field').hidden = !registering;
  $('#auth-kicker').textContent = registering ? 'MAKE YOUR CORNER' : 'WELCOME IN';
  $('#auth-title').innerHTML = registering ? 'Bring your<br /><em>point of view.</em>' : 'Find your next<br /><em>favourite idea.</em>';
  $('#auth-subtitle').textContent = registering ? 'Start a thoughtful reading life, then add your own voice when the moment is right.' : 'Sign in to save stories, join conversations, and make your feed yours.';
  $('#auth-submit').innerHTML = registering ? 'Create my account <span>→</span>' : 'Sign in <span>→</span>';
  $('#auth-switch-copy').innerHTML = registering ? 'Already have an account? <button type="button" data-action="toggle-auth">Sign in</button>' : 'New around here? <button type="button" data-action="toggle-auth">Create an account</button>';
  $('#auth-message').textContent = '';
}

async function submitAuth(event) {
  event.preventDefault();
  const button = $('#auth-submit');
  const message = $('#auth-message');
  message.textContent = '';
  const email = $('#auth-email').value.trim();
  const password = $('#auth-password').value;
  button.disabled = true;
  try {
    if (state.authMode === 'register') {
      const name = $('#auth-name').value.trim();
      if (!name) throw new Error('Please tell us what to call you.');
      await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
      setAuthMode('login');
      $('#auth-email').value = email;
      $('#auth-password').value = '';
      message.className = 'form-message success';
      message.textContent = 'Your account is ready. Sign in to continue.';
    } else {
      const result = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setUser(result.user, result.token);
      closeModals();
      toast(`Welcome back, ${result.user.name.split(' ')[0]}. Your feed is ready.`);
      loadRecommendations();
    }
  } catch (error) {
    message.className = 'form-message';
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

function accountAction() {
  if (!state.user) return openModal('auth-modal');
  if (confirm(`Signed in as ${state.user.name}. Would you like to sign out?`)) {
    setUser(null, '');
    renderRecommendations();
    toast('You have signed out. See you when the next idea finds you.');
  }
}

function openEditor() {
  if (!state.token) { toast('Sign in to publish your own story.'); openModal('auth-modal'); return; }
  $('#editor-message').textContent = '';
  openModal('editor-modal');
}

async function submitStory(event) {
  event.preventDefault();
  const button = $('#editor-form .submit-button');
  const message = $('#editor-message');
  const title = $('#story-title').value.trim();
  const content = $('#story-content').value.trim();
  button.disabled = true;
  message.textContent = '';
  try {
    const result = await request('/blogs', { method: 'POST', body: JSON.stringify({ title, content, category: $('#story-category').value || undefined }) });
    state.usingDemo = false;
    state.blogs = [result.blog, ...state.blogs.filter(isDemo)];
    closeModals();
    $('#editor-form').reset();
    $('#word-count').textContent = '0 words';
    renderStories();
    toast('Your story is live. The AI added its reading notes.');
  } catch (error) {
    message.textContent = error.message;
  } finally {
    button.disabled = false;
  }
}

function findStory(id) {
  return state.blogs.find(blog => String(blog._id) === String(id));
}

function detailVisual(index) {
  return `<div class="story-visual detail-visual style-${index % 6}" style="--card-bg:${['#e8d0b9', '#d7e7ae', '#b8d9e5', '#e7ce9f', '#d6c6e9', '#f3c6b6'][index % 6]}"></div>`;
}

function detailMarkup(blog, comments = []) {
  const index = Math.max(0, state.blogs.findIndex(item => String(item._id) === String(blog._id)));
  const content = escapeHTML(blog.content || '').split(/\n{2,}/).map(paragraph => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`).join('');
  const commentMarkup = comments.length ? comments.map(comment => `<div class="comment"><strong>${escapeHTML(comment.user?.name || 'Lumina reader')} <small>· ${formatDate(comment.createdAt || new Date())}</small></strong><p>${escapeHTML(comment.content)}</p></div>`).join('') : '<p class="empty-comments">No notes yet. Be the first to leave a thoughtful one.</p>';
  return `${detailVisual(index)}<div class="detail-body"><span class="detail-category">${escapeHTML(getCategoryName(blog)).toUpperCase()}</span><h1 id="story-title-modal">${escapeHTML(blog.title)}</h1><div class="detail-meta"><i class="author-dot">${escapeHTML(initials(blog.author?.name || 'Lumina'))}</i><strong>${escapeHTML(blog.author?.name || 'Lumina editor')}</strong><span>·</span><span>${formatDate(blog.date)}</span><span>·</span><span>${readTime(blog.content || blog.aiSummary)}</span></div>${blog.aiSummary ? `<aside class="summary-box">${escapeHTML(blog.aiSummary)}</aside>` : ''}<div class="article-copy">${content}</div><div class="article-tags">${(blog.tags || []).map(tag => `<span>#${escapeHTML(tag)}</span>`).join('')}</div><div class="detail-actions"><button class="like-button" type="button" data-action="like-story" data-story-id="${escapeHTML(blog._id)}">♡ Appreciate <b>${formatNumber(blog.likes)}</b></button><span>◌ ${formatNumber(blog.views)} views &nbsp; · &nbsp; ◇ ${formatNumber(blog.commentCount)} notes</span></div><section class="comments-section"><h3>In the margins</h3>${state.token ? `<form class="comment-form" id="comment-form"><input name="content" required maxlength="1000" placeholder="Add a thoughtful note…" /><button type="submit">Post</button></form>` : '<p class="empty-comments">Sign in to join this conversation.</p>'}<div id="comments-list">${commentMarkup}</div></section></div>`;
}

async function openStory(id) {
  const localStory = findStory(id);
  state.currentStory = localStory;
  $('#story-detail').innerHTML = '<div class="story-error">Opening this thought…</div>';
  openModal('story-modal');
  try {
    if (isDemo(localStory)) {
      $('#story-detail').innerHTML = detailMarkup(localStory, []);
      return;
    }
    const blog = await request(`/blogs/${id}${state.user?.id ? `?userId=${encodeURIComponent(state.user.id)}` : ''}`);
    state.currentStory = blog;
    const comments = await request(`/comments/${id}`).catch(() => []);
    $('#story-detail').innerHTML = detailMarkup(blog, comments);
  } catch (error) {
    $('#story-detail').innerHTML = `<div class="story-error">We could not open this story right now.<br /><small>${escapeHTML(error.message)}</small></div>`;
  }
}

async function likeStory(id) {
  const blog = state.currentStory;
  if (!state.token) { toast('Sign in to appreciate a story.'); openModal('auth-modal'); return; }
  if (isDemo(blog)) { blog.likes += 1; $('#story-detail').innerHTML = detailMarkup(blog, []); toast('A little appreciation goes a long way.'); return; }
  try {
    const response = await request(`/blogs/${id}/like`, { method: 'POST' });
    blog.likes = response.likes;
    const original = findStory(id);
    if (original) original.likes = response.likes;
    $('#story-detail').innerHTML = detailMarkup(blog, await request(`/comments/${id}`).catch(() => []));
    renderStories();
  } catch (error) { toast(error.message, 'error'); }
}

async function submitComment(event) {
  if (event.target.id !== 'comment-form') return;
  event.preventDefault();
  const input = $('input', event.target);
  const button = $('button', event.target);
  button.disabled = true;
  try {
    if (isDemo(state.currentStory)) throw new Error('Sign in with the live API to add a comment.');
    await request(`/comments/${state.currentStory._id}`, { method: 'POST', body: JSON.stringify({ content: input.value.trim() }) });
    state.currentStory.commentCount = (state.currentStory.commentCount || 0) + 1;
    const comments = await request(`/comments/${state.currentStory._id}`);
    $('#story-detail').innerHTML = detailMarkup(state.currentStory, comments);
    renderStories();
    toast('Your note has been added.');
  } catch (error) { toast(error.message, 'error'); } finally { button.disabled = false; }
}

document.addEventListener('click', event => {
  const actionElement = event.target.closest('[data-action]');
  const storyElement = event.target.closest('[data-story-id]');
  const categoryElement = event.target.closest('[data-category]');
  if (categoryElement) {
    const categoryName = categoryElement.dataset.categoryName;
    state.search = categoryName;
    $('#search-input').value = categoryName;
    renderStories();
    $('#latest').scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  if (storyElement && !actionElement) { openStory(storyElement.dataset.storyId); return; }
  if (!actionElement) return;
  const action = actionElement.dataset.action;
  if (action === 'toggle-search') { const panel = $('#search-panel'); panel.hidden = !panel.hidden; if (!panel.hidden) $('#search-input').focus(); }
  if (action === 'open-auth') { setAuthMode('login'); openModal('auth-modal'); }
  if (action === 'open-editor') openEditor();
  if (action === 'close-modal') closeModals();
  if (action === 'toggle-auth') setAuthMode(state.authMode === 'login' ? 'register' : 'login');
  if (action === 'account') accountAction();
  if (action === 'scroll-topics') $('#topic-list').scrollBy({ left: 360, behavior: 'smooth' });
  if (action === 'load-more') { state.visibleCount += 3; renderStories(); }
  if (action === 'like-story') likeStory(actionElement.dataset.storyId);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeModals(); $('#search-panel').hidden = true; }
  if (event.key === 'Enter' && event.target.closest('.story-card')) openStory(event.target.closest('.story-card').dataset.storyId);
});

$('#search-input').addEventListener('input', event => { state.search = event.target.value.trim(); state.visibleCount = 6; renderStories(); });
$$('.filter-button').forEach(button => button.addEventListener('click', () => { $$('.filter-button').forEach(item => item.classList.remove('active')); button.classList.add('active'); state.filter = button.dataset.filter; renderStories(); }));
$('#auth-form').addEventListener('submit', submitAuth);
$('#editor-form').addEventListener('submit', submitStory);
$('#story-content').addEventListener('input', event => { $('#word-count').textContent = `${cleanText(event.target.value).split(' ').filter(Boolean).length} words`; });
$('#story-detail').addEventListener('submit', submitComment);
$('#newsletter-form').addEventListener('submit', event => { event.preventDefault(); event.target.reset(); toast('You’re on the list. Your first good idea is on its way.'); });

renderAccount();
loadContent();
