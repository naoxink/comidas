let data = [];

fetch('data.json')
  .then(res => res.json())
  .then(json => {
    data = json;
    update(data);
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
    const rClass = ratingClass(item.rating);
    div.className = `card ${rClass}`;

    div.innerHTML = `
      <h3>${item.restaurant}</h3>
      <strong>🍽️ ${item.dish}</strong>
      <div class="meta">
        <span class="rating ${rClass}">⭐ ${item.rating}/10</span>
        · 💶 ${formatPrice(item.cost)}
        · 🗓️ ${item.date}
      </div>
      <p>${item.comment}</p>
      <div class="tags">
        ${item.tags?.map(t => `#${t}`).join(' ')}
      </div>
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

const sortSelect = document.getElementById('sort');
sortSelect.addEventListener('change', update);

function update() {
  let items = [...data];

  if (sortSelect.value === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  } else {
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  render(items);
  renderStats(items);
  renderTop(items);
}

function renderStats(items) {
  const avg = (
    items.reduce((s, i) => s + i.rating, 0) / items.length
  ).toFixed(1);

  document.getElementById('stats').textContent =
    `⭐ Nota media: ${avg}`;
}

function avgPriceByRestaurant(items) {
  const map = {};
  items.forEach(i => {
    if (!map[i.restaurant]) map[i.restaurant] = [];
    map[i.restaurant].push(i.cost);
  });

  return Object.entries(map).map(([r, prices]) => ({
    restaurant: r,
    avg: (prices.reduce((a,b)=>a+b,0)/prices.length).toFixed(2)
  }));
}

function renderTop(items) {
  const top = [...items]
    .sort((a,b) => b.rating - a.rating)
    .slice(0,3);

  document.getElementById('top').innerHTML = `
    <h3>🏆 Top 3 platos</h3>
    <ol>
      ${top.map(i => `<li>${i.dish} (${i.restaurant})</li>`).join('')}
    </ol>
  `;
}
