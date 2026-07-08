/* Status do Mastodon | rcapitao.com */
/* Uso: insira o marcador  { status mastodon usuario@instancia }  onde quiser que o status apareça. */
(() => {
  // Handle padrão (usado quando o marcador não traz um). Deixe vazio para exigir handle no marcador.
  const DEFAULT_HANDLE = '';

  // Encontrar marcadores { status mastodon ... } e renderizar SOMENTE onde eles existem
  const RE = /\{\s*status\s+mastodon\s*([^}]*)\}/i;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: n => {
      // Ignora marcadores dentro de blocos de código (ex.: exemplos no guia de estilo)
      if (n.parentElement && n.parentElement.closest('pre, code, script, textarea')) return NodeFilter.FILTER_REJECT;
      return RE.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });

  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    const m = node.nodeValue.match(RE);
    if (!m) return;
    const handle = (m[1] || '').trim() || DEFAULT_HANDLE;

    const root = document.createElement('div');
    root.className = 'latest-status';
    root.setAttribute('hidden', '');
    if (handle) root.setAttribute('data-handle', handle);

    // Substitui o marcador pelo container, preservando o texto ao redor
    const after = node.splitText(m.index);
    after.nodeValue = after.nodeValue.slice(m[0].length);
    node.parentNode.insertBefore(root, after);

    // Renderiza apenas este container, criado a partir do marcador
    render(root);
  });

  async function render(root) {
    // data-handle no formato "usuario@instancia" ou "@usuario@instancia"
    const handle = (root.getAttribute('data-handle') || '').replace(/^@/, '');
    if (!handle) return;

    const [usuario, host] = handle.split('@');
    if (!usuario || !host) return;
    const base = `https://${host}/api/v1`;

    try {
      // Resolver o handle para um ID de conta
      const lookup = await fetch(`${base}/accounts/lookup?acct=${encodeURIComponent(usuario)}`);
      if (!lookup.ok) return;
      const account = await lookup.json();
      if (!account?.id) return;

      // Buscar os status (sem respostas, sem republicações)
      const res = await fetch(`${base}/accounts/${account.id}/statuses?limit=5&exclude_replies=true&exclude_reblogs=true`);
      if (!res.ok) return;
      const statuses = await res.json();
      const post = statuses.find(s => !s.reblog);
      if (!post) return;

      const esc = s => String(s ?? '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

      const safeUrl = url => {
        try {
          const u = new URL(url);
          return ['http:', 'https:'].includes(u.protocol) ? u.href : '#';
        } catch { return '#'; }
      };

      // Sanitiza o HTML do conteúdo: mantém apenas tags/atributos seguros
      const sanitizeHtml = html => {
        const tpl = document.createElement('template');
        tpl.innerHTML = html;
        const allowedTags = new Set(['P','BR','A','SPAN','EM','STRONG','B','I','UL','OL','LI','BLOCKQUOTE','CODE','PRE']);
        const walk = node => {
          [...node.childNodes].forEach(child => {
            if (child.nodeType === 1) {
              if (!allowedTags.has(child.tagName)) {
                child.replaceWith(document.createTextNode(child.textContent));
                return;
              }
              if (child.tagName === 'A') {
                const href = safeUrl(child.getAttribute('href') || '');
                [...child.attributes].forEach(a => child.removeAttribute(a.name));
                child.setAttribute('href', href);
                child.setAttribute('target', '_blank');
                child.setAttribute('rel', 'noopener noreferrer nofollow');
              } else {
                [...child.attributes].forEach(a => child.removeAttribute(a.name));
              }
              walk(child);
            } else if (child.nodeType !== 3) {
              child.remove();
            }
          });
        };
        walk(tpl.content);
        return tpl.innerHTML;
      };

      const textHtml = sanitizeHtml(post.content || '');

      const mins = Math.floor(Math.max(0, (Date.now() - new Date(post.created_at)) / 60000));
      const atras = (n, u, plural) => n + ' ' + (n === 1 ? u : (plural || u + 's')) + ' atrás';
      const quando = mins < 1 ? 'agora mesmo'
        : mins < 60 ? atras(mins, 'minuto')
        : mins < 1440 ? atras(Math.floor(mins / 60), 'hora')
        : mins < 43200 ? atras(Math.floor(mins / 1440), 'dia')
        : mins < 525600 ? atras(Math.floor(mins / 43200), 'mês', 'meses')
        : atras(Math.floor(mins / 525600), 'ano');

      // Imagens (media_attachments do tipo image)
      const images = (post.media_attachments || [])
        .filter(m => m.type === 'image')
        .map(m => ({
          thumb: m.preview_url || m.url,
          full: m.url || m.preview_url,
          alt: m.description || ''
        }));

      // Card (pré-visualização de link)
      let cardHTML = '';
      const card = post.card;
      if (card && card.url && !images.length) {
        cardHTML =
          `<a class="latest-status-card" href="${esc(safeUrl(card.url))}" target="_blank" rel="noopener noreferrer">` +
          (card.image ? `<img class="latest-status-card-thumb" src="${esc(card.image)}" alt="" loading="lazy" decoding="async">` : '') +
          `<div class="latest-status-card-text">` +
          `<span class="latest-status-card-title">${esc(card.title)}</span>` +
          (card.description ? `<span class="latest-status-card-desc">${esc(card.description)}</span>` : '') +
          `</div></a>`;
      }

      const single = images.length === 1;

      const imgButtons = images.map((img, i) =>
        `<button class="latest-status-img-btn" data-index="${i}" aria-label="Ver imagem ${i + 1}">` +
        `<img src="${esc(img.thumb)}" alt="${esc(img.alt)}" loading="lazy" decoding="async">` +
        `</button>`
      ).join('');

      const imagesHTML = images.length
        ? `<div class="latest-status-images${single ? ' latest-status-images--single' : ''}">${imgButtons}</div>`
        : '';

      root.innerHTML =
        `<div class="latest-status-body${single ? ' latest-status-body--has-thumb' : ''}">` +
        (single ? imagesHTML : '') +
        `<div class="latest-status-text">${textHtml}</div>` +
        `</div>` +
        (!single && images.length ? imagesHTML : '') +
        (cardHTML ? cardHTML : '') +
        `<div class="latest-status-meta"><span class="latest-status-time">${quando}</span></div>`;

      root.removeAttribute('hidden');

      if (!images.length) return;

      // Lightbox (galeria)
      const lb = document.createElement('div');
      lb.className = 'latest-status-lightbox';
      lb.innerHTML =
        `<button class="latest-status-lb-nav latest-status-lb-prev" aria-label="Imagem anterior">&#8249;</button>` +
        `<figure class="latest-status-lb-figure">` +
        `<img class="latest-status-lb-img" src="" alt="">` +
        `<figcaption class="latest-status-lb-caption"></figcaption>` +
        `</figure>` +
        `<button class="latest-status-lb-nav latest-status-lb-next" aria-label="Próxima imagem">&#8250;</button>`;
      document.body.appendChild(lb);

      const lbImg = lb.querySelector('.latest-status-lb-img');
      const lbCaption = lb.querySelector('.latest-status-lb-caption');
      const prevBtn = lb.querySelector('.latest-status-lb-prev');
      const nextBtn = lb.querySelector('.latest-status-lb-next');
      let current = 0;

      const show = i => {
        current = (i + images.length) % images.length;
        lbImg.src = images[current].full;
        lbImg.alt = images[current].alt;
        lbCaption.textContent = images[current].alt;
        lbCaption.hidden = !images[current].alt;
        prevBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
        nextBtn.style.visibility = images.length > 1 ? 'visible' : 'hidden';
      };

      const openLb = i => {
        show(i);
        lb.classList.add('open');
        document.addEventListener('keydown', onKey);
      };

      const closeLb = () => {
        lb.classList.remove('open');
        lbImg.src = '';
        document.removeEventListener('keydown', onKey);
      };

      const onKey = e => {
        if (e.key === 'Escape') closeLb();
        else if (e.key === 'ArrowRight') show(current + 1);
        else if (e.key === 'ArrowLeft') show(current - 1);
      };

      lb.addEventListener('click', closeLb);
      lbImg.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });
      prevBtn.addEventListener('click', e => { e.stopPropagation(); show(current - 1); });
      nextBtn.addEventListener('click', e => { e.stopPropagation(); show(current + 1); });

      root.querySelectorAll('.latest-status-img-btn').forEach(btn => {
        btn.addEventListener('click', () => openLb(+btn.dataset.index));
      });

    } catch {}
  }
})();
