(function () {
  function render() {
    const q = (document.getElementById('tournament-search')?.value || '').toLowerCase().trim();
    const region = document.getElementById('tournament-region')?.value || '';

    let list = TOURNAMENTS.filter(t => {
      if (region && t.region !== region) return false;
      if (q && !t.name.toLowerCase().includes(q) && !t.region.toLowerCase().includes(q)) return false;
      return true;
    });

    const container = document.getElementById('tournaments-list');
    if (!container) return;
    container.innerHTML = list.length
      ? list.map(t => `
        <div class="list-item">
          <div>
            <div class="card-title">${EngDebate.escapeHtml(t.name)}</div>
            <div class="meta">${t.region} · 报名费: ${t.fee || '—'} · 门槛: ${t.requirement || '—'} ${t.ongoing ? '<span class="badge badge-success">进行中</span>' : ''}</div>
            ${t.link ? `<a href="${t.link}" target="_blank" rel="noopener" class="btn btn-ghost mt-1" style="font-size:0.85rem">查看 / 报名</a>` : ''}
          </div>
        </div>
      `).join('')
      : '<div class="empty-state"><div class="icon">🏆</div><p>暂无匹配赛事</p></div>';
  }

  function initFilters() {
    const regionSelect = document.getElementById('tournament-region');
    if (regionSelect) {
      getRegionsFromTournaments().forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        regionSelect.appendChild(opt);
      });
    }
  }

  document.getElementById('tournament-apply')?.addEventListener('click', render);

  if (document.getElementById('page-tournaments')) initFilters();
  window.addEventListener('page-show', function (e) {
    if (e.detail && e.detail.pageId === 'tournaments') render();
  });
  window.addEventListener('hashchange', function () {
    if (document.getElementById('page-tournaments')?.classList.contains('active')) render();
  });
})();
