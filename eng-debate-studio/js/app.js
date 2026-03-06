(function () {
  const STORAGE_USER = 'eng_debate_user';
  const STORAGE_PROFILE = 'eng_debate_profile';
  const STORAGE_USERS = 'eng_debate_users';

  function getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USERS) || '[]');
    } catch {
      return [];
    }
  }

  function getHash() {
    const h = window.location.hash.slice(1) || '/';
    return h.split('?')[0];
  }

  function getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_USER) || 'null');
    } catch {
      return null;
    }
  }

  function getAllProfiles() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_PROFILE) || '{}');
    } catch {
      return {};
    }
  }

  function getProfile() {
    const user = getCurrentUser();
    const key = user && (user.username || user.email);
    const all = getAllProfiles();
    if (typeof all.profiles === 'object' && key && all.profiles[key]) return all.profiles[key];
    if (key && typeof all.profiles === 'object') return {};
    if (!key && (all.totalDebates != null || all.experience != null)) return all;
    return {};
  }

  function setProfile(profile) {
    const user = getCurrentUser();
    const key = user && (user.username || user.email);
    const all = getAllProfiles();
    if (!all.profiles) {
      all.profiles = {};
      if (key && (all.experience != null || all.totalDebates != null))
        all.profiles[key] = { ...all };
    }
    if (key) all.profiles[key] = { ...(all.profiles[key] || {}), ...profile };
    else Object.assign(all, profile);
    localStorage.setItem(STORAGE_PROFILE, JSON.stringify(all));
  }

  function getDebateStats() {
    const p = getProfile();
    const total = p.totalDebates || 0;
    const wins = p.wins || 0;
    const totalScore = p.totalScore != null ? p.totalScore : 0;
    const avg = total > 0 ? Math.round(totalScore / total) : 0;
    const rate = total > 0 ? Math.round((wins / total) * 100) : 0;
    let skill = '新手';
    if (total >= 50) skill = '专家';
    else if (total >= 20) skill = '熟练';
    else if (total >= 5) skill = '进阶';
    return { totalDebates: total, winRate: rate, averageScore: avg, skillLevel: skill };
  }

  function recordDebateResult(opts) {
    const profile = getProfile();
    profile.totalDebates = (profile.totalDebates || 0) + 1;
    if (opts.won) profile.wins = (profile.wins || 0) + 1;
    if (opts.score != null) profile.totalScore = (profile.totalScore || 0) + opts.score;
    setProfile(profile);
  }

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');

    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-page') === pageId || (pageId === 'home' && a.getAttribute('href') === '#/'));
    });

    if (pageId === 'profile') renderProfile();
    if (pageId === 'home') updateHomePreviews();
    updateNavAvatar();
    try {
      window.dispatchEvent(new CustomEvent('page-show', { detail: { pageId } }));
    } catch (_) {}
  }

  function updateNavAvatar() {
    const wrap = document.getElementById('nav-avatar');
    const dropdown = document.getElementById('nav-avatar-dropdown');
    const link = document.getElementById('nav-avatar-link');
    if (!wrap) return;
    const user = getCurrentUser();
    const profile = getProfile();
    const avatarHtml = profile.avatar
      ? '<img src="' + escapeHtml(profile.avatar) + '" alt="">'
      : '<svg class="nav-avatar-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    wrap.innerHTML = avatarHtml;
    if (dropdown) dropdown.classList.add('hide');
    if (link) {
      link.removeAttribute('href');
      link.setAttribute('href', '#/profile');
    }
  }

  function updateHomePreviews() {
    const motionsEl = document.getElementById('home-motions-preview');
    if (motionsEl && typeof MOTIONS !== 'undefined') {
      const list = MOTIONS.slice(0, 4);
      motionsEl.innerHTML = list.length
        ? list.map(m => '<a href="#/motions" class="home-preview-item card">' + '<span class="home-preview-meta">' + m.year + ' · ' + escapeHtml(m.region) + '</span>' + '<span class="home-preview-title">' + escapeHtml(m.text) + '</span></a>').join('')
        : '<p class="text-muted">暂无辩题</p>';
    }
    const tournamentsEl = document.getElementById('home-tournaments-preview');
    if (tournamentsEl && typeof TOURNAMENTS !== 'undefined') {
      const list = TOURNAMENTS.slice(0, 3);
      tournamentsEl.innerHTML = list.length
        ? list.map(t => '<a href="#/tournaments" class="home-preview-item card">' + '<span class="home-preview-title">' + escapeHtml(t.name) + '</span>' + '<span class="home-preview-meta">' + escapeHtml(t.region) + (t.ongoing ? ' · <span class="badge badge-success">进行中</span>' : '') + '</span></a>').join('')
        : '<p class="text-muted">暂无赛事</p>';
    }
    const speechesEl = document.getElementById('home-speeches-preview');
    if (speechesEl) {
      try {
        const speeches = JSON.parse(localStorage.getItem('eng_debate_speeches') || '[]');
        let list = speeches.slice(0, 3).map(function (s) { return { title: s.title, meta: s.source || '', url: '#/speeches' }; });
        if (list.length === 0 && typeof FEATURED_TRANSCRIPTS !== 'undefined')
          list = FEATURED_TRANSCRIPTS.slice(0, 3).map(function (t) { return { title: t.title, meta: t.event || 'Debating404', url: '#/speeches' }; });
        speechesEl.innerHTML = list.length
          ? list.map(function (item) { return '<a href="' + item.url + '" class="home-preview-item card"><span class="home-preview-title">' + escapeHtml(item.title) + '</span><span class="home-preview-meta">' + escapeHtml(item.meta) + '</span></a>'; }).join('')
          : '<p class="text-muted">暂无辩稿</p>';
      } catch (_) {
        speechesEl.innerHTML = '<p class="text-muted">暂无辩稿</p>';
      }
    }
  }

  function renderProfile() {
    const user = getCurrentUser();
    const guest = document.getElementById('profile-guest');
    const content = document.getElementById('profile-content');
    if (!user) {
      if (guest) guest.classList.remove('hide');
      if (content) content.classList.add('hide');
      return;
    }
    if (guest) guest.classList.add('hide');
    if (content) content.classList.remove('hide');

    const profile = getProfile();
    const nameEl = document.getElementById('profile-name');
    const avatarEl = document.getElementById('profile-avatar');
    const bioEl = document.getElementById('profile-bio');
    if (nameEl) nameEl.textContent = user.username || user.email || '辩手';
    if (avatarEl) {
      avatarEl.innerHTML = profile.avatar
        ? '<img src="' + escapeHtml(profile.avatar) + '" alt="">'
        : '<svg class="profile-avatar-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>';
    }
    if (bioEl) bioEl.textContent = profile.bio || '辩论经验、徽章与好友';

    const expTextEl = document.getElementById('profile-experience-text');
    const expView = document.getElementById('profile-exp-view');
    const expEdit = document.getElementById('profile-exp-edit');
    if (expTextEl) expTextEl.textContent = profile.experience || '暂无，点击编辑填写';
    if (expTextEl && !(profile.experience || '').trim()) expTextEl.classList.add('text-muted');
    else if (expTextEl) expTextEl.classList.remove('text-muted');
    if (expView) expView.classList.remove('hide');
    if (expEdit) expEdit.classList.add('hide');
    const expTextarea = document.getElementById('profile-experience');
    if (expTextarea) expTextarea.value = profile.experience || '';

    const certsEl = document.getElementById('profile-certificates');
    if (certsEl) {
      certsEl.innerHTML = (profile.certificates || []).map(c => `<span class="badge">${escapeHtml(c)}</span>`).join(' ') || '<span class="text-muted">暂无</span>';
    }
    const certsView = document.getElementById('profile-certs-view');
    const certsEdit = document.getElementById('profile-certs-edit');
    if (certsView) certsView.classList.remove('hide');
    if (certsEdit) certsEdit.classList.add('hide');
    renderCertificatesEdit();

    const friendsEl = document.getElementById('profile-friends');
    if (friendsEl) {
      friendsEl.innerHTML = (profile.friends || []).map(f => `<span class="badge badge-success">${escapeHtml(f)}</span>`).join(' ') || '<span class="text-muted">暂无</span>';
    }
    const friendsView = document.getElementById('profile-friends-view');
    const friendsEdit = document.getElementById('profile-friends-edit');
    if (friendsView) friendsView.classList.remove('hide');
    if (friendsEdit) friendsEdit.classList.add('hide');
    renderFriendsEdit();

    const favEl = document.getElementById('profile-favorites');
    if (favEl) {
      const favIds = profile.favoriteSpeeches || [];
      const speeches = JSON.parse(localStorage.getItem('eng_debate_speeches') || '[]');
      const userFavs = speeches.filter(s => favIds.includes(s.id));
      const featuredFavs = (typeof FEATURED_TRANSCRIPTS !== 'undefined' ? FEATURED_TRANSCRIPTS : []).filter(function (t) { return favIds.includes(t.id); });
      const list = featuredFavs.map(function (t) { return { title: t.title, link: t.link }; }).concat(userFavs.map(function (s) { return { title: s.title, link: null }; }));
      favEl.innerHTML = list.length ? list.map(function (s) {
        return '<div class="list-item" onclick="location.hash=\'#/speeches\'"><span>' + escapeHtml(s.title) + '</span>' + (s.link ? '<a href="' + escapeHtml(s.link) + '" target="_blank" rel="noopener" class="btn btn-ghost" onclick="event.stopPropagation()">阅读</a>' : '') + '</div>';
      }).join('') : '<span class="text-muted">暂无收藏</span>';
    }

    const stats = getDebateStats();
    if (el('profile-stat-count')) el('profile-stat-count').textContent = stats.totalDebates;
    if (el('profile-stat-rate')) el('profile-stat-rate').textContent = stats.winRate + '%';
    if (el('profile-stat-score')) el('profile-stat-score').textContent = stats.averageScore;
    if (el('profile-stat-skill')) el('profile-stat-skill').textContent = stats.skillLevel;
  }

  function el(id) {
    return document.getElementById(id);
  }

  function escapeHtml(s) {
    const div = document.createElement('div');
    div.textContent = s;
    return div.innerHTML;
  }

  // Login form
  document.getElementById('form-login')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    if (!username) return;
    const users = getUsers();
    const user = users.find(u => (u.username && u.username.toLowerCase() === username.toLowerCase()) || (u.email && u.email.toLowerCase() === username.toLowerCase()));
    if (!user || user.password !== password) {
      alert('用户名/邮箱或密码错误，请重试或先注册。');
      return;
    }
    localStorage.setItem(STORAGE_USER, JSON.stringify({ username: user.username, email: user.email }));
    showPage('profile');
    window.location.hash = '#/profile';
  });

  // Register form
  document.getElementById('form-register')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const password2 = document.getElementById('register-password2').value;
    if (password !== password2) {
      alert('两次输入的密码不一致。');
      return;
    }
    if (password.length < 6) {
      alert('密码至少 6 位。');
      return;
    }
    const users = getUsers();
    if (users.some(u => u.username && u.username.toLowerCase() === username.toLowerCase())) {
      alert('该用户名已被使用。');
      return;
    }
    if (email && users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
      alert('该邮箱已被注册。');
      return;
    }
    users.push({ username, email: email || null, password });
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_USER, JSON.stringify({ username, email: email || null }));
    showPage('profile');
    window.location.hash = '#/profile';
  });

  function renderCertificatesEdit() {
    const el = document.getElementById('profile-certificates-edit');
    if (!el) return;
    const profile = getProfile();
    el.innerHTML = (profile.certificates || []).map(c => `<span class="badge">${escapeHtml(c)}</span>`).join(' ') || '<span class="text-muted">暂无</span>';
  }

  function renderFriendsEdit() {
    const el = document.getElementById('profile-friends-edit');
    if (!el) return;
    const profile = getProfile();
    el.innerHTML = (profile.friends || []).map(f => `<span class="badge badge-success">${escapeHtml(f)}</span>`).join(' ') || '<span class="text-muted">暂无</span>';
  }

  document.getElementById('profile-edit-exp')?.addEventListener('click', function () {
    document.getElementById('profile-exp-view')?.classList.add('hide');
    document.getElementById('profile-exp-edit')?.classList.remove('hide');
    const ta = document.getElementById('profile-experience');
    if (ta) ta.value = getProfile().experience || '';
  });

  document.getElementById('profile-save-exp')?.addEventListener('click', function () {
    const profile = getProfile();
    profile.experience = document.getElementById('profile-experience')?.value || '';
    setProfile(profile);
    document.getElementById('profile-exp-edit')?.classList.add('hide');
    document.getElementById('profile-exp-view')?.classList.remove('hide');
    const expTextEl = document.getElementById('profile-experience-text');
    if (expTextEl) {
      expTextEl.textContent = profile.experience || '暂无，点击编辑填写';
      expTextEl.classList.toggle('text-muted', !(profile.experience || '').trim());
    }
  });

  document.getElementById('profile-edit-certs')?.addEventListener('click', function () {
    document.getElementById('profile-certs-view')?.classList.add('hide');
    document.getElementById('profile-certs-edit')?.classList.remove('hide');
    renderCertificatesEdit();
  });

  document.getElementById('profile-save-certs')?.addEventListener('click', function () {
    document.getElementById('profile-certs-edit')?.classList.add('hide');
    document.getElementById('profile-certs-view')?.classList.remove('hide');
    renderProfile();
  });

  document.getElementById('profile-add-cert')?.addEventListener('click', function () {
    const name = document.getElementById('add-cert-name')?.value?.trim();
    if (!name) return;
    const profile = getProfile();
    profile.certificates = profile.certificates || [];
    profile.certificates.push(name);
    setProfile(profile);
    document.getElementById('add-cert-name').value = '';
    renderCertificatesEdit();
  });

  document.getElementById('profile-edit-friends')?.addEventListener('click', function () {
    document.getElementById('profile-friends-view')?.classList.add('hide');
    document.getElementById('profile-friends-edit')?.classList.remove('hide');
    renderFriendsEdit();
  });

  document.getElementById('profile-save-friends')?.addEventListener('click', function () {
    document.getElementById('profile-friends-edit')?.classList.add('hide');
    document.getElementById('profile-friends-view')?.classList.remove('hide');
    renderProfile();
  });

  document.getElementById('profile-add-friend')?.addEventListener('click', function () {
    const name = document.getElementById('add-friend-name')?.value?.trim();
    if (!name) return;
    const profile = getProfile();
    profile.friends = profile.friends || [];
    profile.friends.push(name);
    setProfile(profile);
    document.getElementById('add-friend-name').value = '';
    renderFriendsEdit();
  });

  document.getElementById('profile-logout')?.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_USER);
    window.location.hash = '#/';
    showPage('home');
  });

  document.getElementById('nav-logout-btn')?.addEventListener('click', function () {
    localStorage.removeItem(STORAGE_USER);
    document.getElementById('nav-avatar-dropdown')?.classList.add('hide');
    window.location.hash = '#/';
    showPage('home');
  });

  document.getElementById('nav-avatar-link')?.addEventListener('click', function (e) {
    if (getCurrentUser()) {
      e.preventDefault();
      const dd = document.getElementById('nav-avatar-dropdown');
      if (dd) dd.classList.toggle('hide');
    }
  });

  document.addEventListener('click', function (e) {
    const wrap = document.querySelector('.nav-user-wrap');
    const dd = document.getElementById('nav-avatar-dropdown');
    if (dd && !dd.classList.contains('hide') && wrap && !wrap.contains(e.target))
      dd.classList.add('hide');
  });

  document.getElementById('profile-edit-avatar')?.addEventListener('click', function () {
    document.getElementById('profile-avatar-file')?.click();
  });

  document.getElementById('profile-avatar-file')?.addEventListener('change', function (e) {
    const file = e.target.files && e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function () {
      const dataUrl = reader.result;
      setProfile({ avatar: dataUrl });
      const avatarEl = document.getElementById('profile-avatar');
      if (avatarEl) avatarEl.innerHTML = '<img src="' + escapeHtml(dataUrl) + '" alt="">';
      updateNavAvatar();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  });

  // Router
  function route() {
    let hash = getHash();
    const parts = hash.split('/').filter(Boolean);
    if (parts[0] === 'login') {
      window.location.hash = '#/profile';
      return;
    }
    if (parts[0] === 'training' && parts[1] === '1v1') {
      showPage('training-1v1');
      return;
    }
    if (parts[0] === 'training' && parts[1] === 'bp') {
      showPage('training-bp');
      return;
    }
    const pageId = parts[0] || 'home';
    showPage(pageId === 'home' ? 'home' : pageId);
  }

  window.addEventListener('hashchange', route);
  window.addEventListener('load', route);

  // Mobile nav toggle
  document.querySelector('.nav-toggle')?.addEventListener('click', function () {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => document.querySelector('.nav-links')?.classList.remove('open'));
  });

  document.addEventListener('click', function (e) {
    const t = e.target.closest('[data-scroll-to]');
    if (t) {
      e.preventDefault();
      const id = t.getAttribute('data-scroll-to');
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  window.EngDebate = {
    getCurrentUser,
    getProfile,
    setProfile,
    getDebateStats,
    recordDebateResult,
    showPage,
    renderProfile,
    escapeHtml,
  };
})();
