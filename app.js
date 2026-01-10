let data = [];

fetch('data.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    render(data);
  });

const list = document.getElementById('list');
const search = document.getElementById('search');

search.addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filtered = data.filter(item =>
    item.restaurant.toLowerCase().includes(q) ||
    item.dish.toLowerCase().includes(q) ||
    item.comment.toLowerCase().includes(q)
  );
  render(filtered);
});

function ratingClass(rating) {
  if (rating >= 8) return 'high';
  if (rating >= 5) return 'mid';
  return 'low';
}

function formatPrice(cost) {
  return `${cost.toFixed(2)} €`;
}

function render(items) {
  list.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';

    const rClass = ratingClass(item.rating);

    div.innerHTML = `
      <h3>${item.restaurant}</h3>
      <strong>🍽️ ${item.dish}</strong>
      <div class="meta">
        <span class="rating ${rClass}">⭐ ${item.rating}/10</span>
        · 💶 ${formatPrice(item.cost)}
        · 🗓️ ${item.date}
      </div>
      <p class="comment">${item.comment}</p>
    `;
    list.appendChild(div);
  });
}

const btn = document.getElementById('themeToggle');
const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
  document.body.classList.add('dark');
  btn.textContent = '☀️';
}

btn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  btn.textContent = isDark ? '☀️' : '🌙';
});

