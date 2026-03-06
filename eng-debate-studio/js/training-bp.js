(function () {
  const PREP_SEC = 15 * 60;
  let prepRemaining = PREP_SEC;
  let prepTimerId = null;
  let drawnSlot = null;
  let bpTranscript = [];

  function show(el, visible) {
    if (!el) return;
    if (visible) el.classList.remove('hide');
    else el.classList.add('hide');
  }

  function renderSlots() {
    const grid = document.getElementById('bp-slots');
    if (!grid) return;
    grid.innerHTML = BP_SLOTS.map((s, i) =>
      '<div class="slot-card" data-idx="' + i + '"><div class="role">' + s.role + '</div><div class="team">' + s.team + '</div></div>'
    ).join('');
  }

  function drawSlot() {
    const idx = Math.floor(Math.random() * 8);
    drawnSlot = BP_SLOTS[idx];
    document.querySelectorAll('.slot-card').forEach((el, i) => {
      el.classList.toggle('drawn', i === idx);
    });
    const yourEl = document.getElementById('bp-your-slot');
    if (yourEl) {
      yourEl.innerHTML = '你的位置：<strong>' + drawnSlot.role + '</strong>（' + drawnSlot.team + '）';
      show(yourEl, true);
    }
    show(document.getElementById('training-bp-prep'), true);
    const motion = MOTIONS[Math.floor(Math.random() * MOTIONS.length)];
    document.getElementById('bp-motion-text').textContent = motion.text;
    prepRemaining = PREP_SEC;
    const timerEl = document.getElementById('bp-prep-timer');
    if (timerEl) timerEl.textContent = '15:00';
    if (prepTimerId) clearInterval(prepTimerId);
    prepTimerId = setInterval(function () {
      prepRemaining--;
      if (timerEl) {
        const m = Math.floor(prepRemaining / 60);
        const s = prepRemaining % 60;
        timerEl.textContent = m + ':' + (s < 10 ? '0' : '') + s;
      }
      if (prepRemaining <= 0) clearInterval(prepTimerId);
    }, 1000);
  }

  function startBPDebate() {
    if (prepTimerId) clearInterval(prepTimerId);
    show(document.getElementById('training-bp-prep'), false);
    show(document.getElementById('training-bp-debate'), true);
    bpTranscript = [];
    const curEl = document.getElementById('bp-current-speaker');
    if (curEl) curEl.textContent = '当前：' + BP_SLOTS[0].role + '（' + BP_SLOTS[0].team + '）— 接下来由 AI 模拟其余 7 人，轮到你时请点击麦克风发言。';
    const transEl = document.getElementById('bp-transcript');
    if (transEl) transEl.textContent = '（辩论记录将显示在此；接入 AI 后可按 BP 顺序生成 7 个角色的发言）';
  }

  document.getElementById('bp-solo')?.addEventListener('click', function () {
    show(document.getElementById('training-bp-draw'), true);
    renderSlots();
    document.getElementById('bp-your-slot').classList.add('hide');
  });

  document.getElementById('bp-invite')?.addEventListener('click', function () {
    alert('邀请模式：8 位真人各自登录后进入本页，每人抽签获得一个 slot，按 BP 顺序发言。实现时需后端房间与实时同步。');
  });

  document.getElementById('bp-draw-btn')?.addEventListener('click', drawSlot);
  document.getElementById('bp-start-debate')?.addEventListener('click', function () {
    if (window.EngDebate && window.EngDebate.recordDebateResult)
      window.EngDebate.recordDebateResult({ won: Math.random() > 0.5, score: 55 + Math.floor(Math.random() * 40) });
    startBPDebate();
  });

  const bpVoice = document.getElementById('bp-voice');
  if (bpVoice) {
    bpVoice.addEventListener('click', function () {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        const transEl = document.getElementById('bp-transcript');
        if (transEl) transEl.textContent = (transEl.textContent || '') + '\n[你] （请接入语音识别）';
        return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.lang = 'en-US';
      rec.continuous = false;
      rec.onresult = function (e) {
        const text = e.results[0][0].transcript;
        const who = drawnSlot ? drawnSlot.role : 'You';
        bpTranscript.push('[' + who + '] ' + text);
        const transEl = document.getElementById('bp-transcript');
        if (transEl) transEl.textContent = bpTranscript.join('\n\n');
      };
      rec.start();
    });
  }

  if (document.getElementById('page-training-bp')?.classList.contains('active')) {
    renderSlots();
  }
  window.addEventListener('hashchange', function () {
    if (document.getElementById('page-training-bp')?.classList.contains('active')) renderSlots();
  });
})();
