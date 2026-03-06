(function () {
  const TOTAL_SEC = 30 * 60;
  let remainingSec = TOTAL_SEC;
  let timerId = null;
  let transcriptLines = [];
  let mySide = null;

  function show(el, visible) {
    if (!el) return;
    if (visible) el.classList.remove('hide');
    else el.classList.add('hide');
  }

  function drawSide() {
    const sides = ['正方', '反方'];
    const i = Math.floor(Math.random() * 2);
    mySide = sides[i];
    const aiSide = sides[1 - i];
    document.getElementById('1v1-your-side').textContent = mySide;
    document.getElementById('1v1-ai-side').textContent = aiSide;
    show(document.getElementById('1v1-sides'), true);
    show(document.getElementById('training-1v1-motion'), true);
    const motion = MOTIONS[Math.floor(Math.random() * MOTIONS.length)];
    document.getElementById('1v1-motion-text').textContent = motion.text;
    show(document.getElementById('training-1v1-debate'), true);
    show(document.getElementById('training-1v1-result'), false);
    remainingSec = TOTAL_SEC;
    transcriptLines = [];
    updateTranscript();
    updateTimer();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(function () {
      remainingSec--;
      updateTimer();
      if (remainingSec <= 0) clearInterval(timerId);
    }, 1000);
  }

  function updateTimer() {
    const el = document.getElementById('1v1-timer');
    if (!el) return;
    const m = Math.floor(remainingSec / 60);
    const s = remainingSec % 60;
    el.textContent = m + ':' + (s < 10 ? '0' : '') + s;
    el.classList.remove('warning', 'danger');
    if (remainingSec <= 60) el.classList.add('danger');
    else if (remainingSec <= 5 * 60) el.classList.add('warning');
  }

  function updateTranscript() {
    const el = document.getElementById('1v1-transcript');
    if (el) el.textContent = transcriptLines.join('\n\n') || '（对话将显示在此）';
  }

  function addLine(who, text) {
    transcriptLines.push('[' + who + '] ' + text);
    updateTranscript();
  }

  function endDebate() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
    show(document.getElementById('training-1v1-debate'), false);
    show(document.getElementById('training-1v1-result'), true);
    const userWon = Math.random() > 0.5;
    const score = 60 + Math.floor(Math.random() * 35);
    if (window.EngDebate && window.EngDebate.recordDebateResult)
      window.EngDebate.recordDebateResult({ won: userWon, score: score });
    const verdictEl = document.getElementById('1v1-verdict');
    if (verdictEl) {
      verdictEl.innerHTML = '<p>（模拟）根据逻辑性、论证严谨性、反驳力度与结构，本场判定：<strong>' + (userWon ? '你方' : 'AI 方') + '</strong> 获胜。本场得分：' + score + '。接入真实 AI 后可输出详细评语与维度得分。</p>';
    }
  }

  function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addLine('你', '[语音不可用，请在此输入文字模拟]');
      addLine('AI', '（模拟）收到。请接入语音识别 API 后使用真实语音。');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = function (e) {
      const text = e.results[0][0].transcript;
      addLine('你', text);
      addLine('AI', '（模拟）AI 回应：针对 "' + text.slice(0, 30) + '..." 的反驳与论证。接入 LLM 后可生成真实回应。');
    };
    rec.onerror = function () {
      addLine('系统', '语音识别出错或未授权麦克风');
    };
    rec.start();
  }

  document.getElementById('1v1-draw')?.addEventListener('click', drawSide);
  document.getElementById('1v1-new-motion')?.addEventListener('click', function () {
    const motion = MOTIONS[Math.floor(Math.random() * MOTIONS.length)];
    document.getElementById('1v1-motion-text').textContent = motion.text;
  });
  document.getElementById('1v1-end')?.addEventListener('click', endDebate);
  document.getElementById('1v1-again')?.addEventListener('click', function () {
    show(document.getElementById('training-1v1-setup'), true);
    show(document.getElementById('training-1v1-result'), false);
    show(document.getElementById('1v1-sides'), false);
  });

  const voiceBtn = document.getElementById('1v1-voice');
  if (voiceBtn) {
    voiceBtn.addEventListener('click', function () {
      voiceBtn.classList.add('recording');
      startVoiceInput();
      setTimeout(function () {
        voiceBtn.classList.remove('recording');
      }, 500);
    });
  }
})();
