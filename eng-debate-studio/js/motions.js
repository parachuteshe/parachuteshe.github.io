(function () {
  function render() {
    const year = document.getElementById('motion-year')?.value || '';
    const region = document.getElementById('motion-region')?.value || '';
    const q = (document.getElementById('motion-search')?.value || '').toLowerCase().trim();

    let list = MOTIONS.filter(m => {
      if (year && m.year !== parseInt(year, 10)) return false;
      if (region && m.region !== region) return false;
      if (q && !m.text.toLowerCase().includes(q)) return false;
      return true;
    });

    const container = document.getElementById('motions-list');
    if (!container) return;
    container.innerHTML = list.length
      ? list.map(m => `
        <div class="list-item">
          <div>
            <div class="card-title">${EngDebate.escapeHtml(m.text)}</div>
            <div class="meta">${m.year} · ${m.region} · ${m.source || ''}</div>
          </div>
        </div>
      `).join('')
      : '<div class="empty-state"><div class="icon">📋</div><p>暂无匹配辩题</p></div>';
  }

  function initFilters() {
    const yearSelect = document.getElementById('motion-year');
    const regionSelect = document.getElementById('motion-region');
    if (yearSelect) {
      getMotionYears().forEach(y => {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
      });
    }
    if (regionSelect) {
      getRegionsFromMotions().forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        regionSelect.appendChild(opt);
      });
    }
  }

  document.getElementById('motion-apply')?.addEventListener('click', render);
  document.getElementById('motion-search')?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') render();
  });

  if (document.getElementById('page-motions')) initFilters();
  window.addEventListener('page-show', function (e) {
    if (e.detail && e.detail.pageId === 'motions') render();
  });
  window.addEventListener('hashchange', function () {
    if (document.getElementById('page-motions')?.classList.contains('active')) render();
  });
})();
