// ============================================================
  // ✏️  VALORES POR DEFECTO — se usan si nadie configura nada
  // ============================================================
  const DEFAULT_ACTIVITIES = [
    "Cena romántica", "Noche de película", "Café y caminata",
    "Picnic", "Mini golf", "Sorpréndeme"
  ];
  const DEFAULT_MESSAGE = "sé que las palabras nunca me alcanzan del todo, pero quiero intentarlo: contigo hasta los días normales se sienten especiales. Gracias por decir que sí.";
  const DEFAULT_CLOSING = "Te quiero";
  const FIELD_SEP = "*"; // separador entre campos dentro de ?d=...

  // ============================================================
  // Lee el enlace: si trae ?d=sender~~recipient~~acts~~msg~~closing
  // viene ya configurado (así lo abre la persona invitada). Si no
  // trae nada, es quien está armando la sorpresa y ve el formulario.
  // ============================================================
  const urlParams = new URLSearchParams(location.search);
  const packedData = urlParams.get('d');
  const parts = packedData ? packedData.split(FIELD_SEP) : null;
  const isConfigured = !!(parts && parts[0] && parts[1]);

  const CONFIG = {
    recipientName: isConfigured ? parts[1] : "Dania",
    senderName: isConfigured ? parts[0] : "Ricardo",
    question: "¿quieres salir conmigo?",
    letterMessage: (isConfigured && parts[3]) ? parts[3] : DEFAULT_MESSAGE,
    closing: (isConfigured && parts[4]) ? parts[4] : DEFAULT_CLOSING,
    activities: (isConfigured && parts[2]
      ? parts[2].split('|')
      : DEFAULT_ACTIVITIES
    ).map(label => ({ label: label.toUpperCase(), value: label.toLowerCase() }))
  };
  // ============================================================
  // 🚫 No es necesario editar nada debajo de esta línea
  // ============================================================

  document.title = isConfigured ? (CONFIG.recipientName + " 💗") : "Configura tu sorpresa 💌";
  document.getElementById('nameInTitle').textContent = CONFIG.recipientName;
  document.getElementById('questionText').textContent = CONFIG.question;
  document.getElementById('nameInLetter').textContent = CONFIG.recipientName;
  document.getElementById('senderInSignature').textContent = CONFIG.senderName;

  const activityGrid = document.getElementById('activityGrid');
  CONFIG.activities.forEach(act => {
    const btn = document.createElement('button');
    btn.className = 'activity-btn';
    btn.dataset.act = act.value;
    btn.textContent = act.label;
    activityGrid.appendChild(btn);
  });

  // floating background pixels
  for(let i=0;i<18;i++){
    const d=document.createElement('div');
    d.className='bgdot';
    d.style.left=Math.random()*100+'vw';
    d.style.animationDelay=(Math.random()*9)+'s';
    d.style.animationDuration=(7+Math.random()*6)+'s';
    document.body.appendChild(d);
  }

  const cat = document.getElementById('cat');
  const catImg = document.getElementById('catImg');
  const noBtn = document.getElementById('noBtn');
  const yesBtn = document.getElementById('yesBtn');
  const btnRow = document.getElementById('btnRow');
  const teaseText = document.getElementById('teaseText');

  const teases = [
    "¿Segura?",
    "Mejor di que sí",
    "Bebé, por favor 🥺",
    "No hagas esto",
    "Corazón roto </3",
    "Vamos... di que sí 💗"
  ];
  let dodgeCount = 0;

  function dodge(e){
    e.preventDefault();
    dodgeCount++;
    catImg.src = "assets/no.gif";

    teaseText.textContent = teases[Math.min(dodgeCount-1, teases.length-1)];

    // yes button inflates a little each time, no button shrinks, both capped
    const growScale = Math.min(1 + dodgeCount * 0.12, 2.2);
    yesBtn.style.transform = `scale(${growScale})`;
    const shrinkScale = Math.max(1 - dodgeCount * 0.12, 0.35);
    noBtn.style.transform = `scale(${shrinkScale})`;

    if(dodgeCount >= 3){ cat.classList.add('pleading'); }
  }

  noBtn.addEventListener('click', dodge);
  noBtn.addEventListener('touchstart', dodge, {passive:false});

  function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  yesBtn.addEventListener('click', ()=>{
    showScreen('yay');
  });

  document.getElementById('toActivity').addEventListener('click', ()=>{
    showScreen('datePick');
  });

  let chosenActivity = null;
  let chosenDateStr = "pronto";
  const lockInBtn = document.getElementById('lockIn');
  document.querySelectorAll('.activity-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.activity-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      chosenActivity = btn.dataset.act;
      lockInBtn.disabled = false;
    });
  });

  document.getElementById('confirmDate').addEventListener('click', ()=>{
    const val = document.getElementById('dateInput').value;
    if(val){
      const d = new Date(val + 'T00:00:00');
      chosenDateStr = d.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
    }
    showScreen('activity');
  });

  lockInBtn.addEventListener('click', ()=>{
    if(!chosenActivity) return;
    const actText = chosenActivity;
    document.getElementById('letterBody').innerHTML =
      `${CONFIG.recipientName}, ${CONFIG.letterMessage}<br><br>` +
      `No puedo esperar a nuestro plan de <b>${actText}</b> el <b>${chosenDateStr}</b>. ${CONFIG.closing}. <span class="heart">♥</span>`;
    document.getElementById('dateSummary').innerHTML =
      `FECHA: ${chosenDateStr}<br>ACTIVIDAD: ${actText.toUpperCase()}`;
    showScreen('itsADate');
  });

  document.getElementById('toNotify').addEventListener('click', ()=>{
    showScreen('notify');
  });

  document.getElementById('openMessage').addEventListener('click', ()=>{
    showScreen('letter');
  });

  // ============================================================
  // PANTALLA DE CONFIGURACIÓN (solo para quien arma la sorpresa)
  // ============================================================
  let customActs = [];
  let checkedActs = new Set(DEFAULT_ACTIVITIES); // todas marcadas al inicio

  function renderSetupChecks(){
    const wrap = document.getElementById('setupChecks');
    wrap.innerHTML = '';
    DEFAULT_ACTIVITIES.concat(customActs).forEach((label) => {
      const item = document.createElement('label');
      item.className = 'setup-check-item';
      const isChecked = checkedActs.has(label);
      item.innerHTML = `<input type="checkbox" value="${label}" ${isChecked ? 'checked' : ''}> ${label}`;
      const checkbox = item.querySelector('input');
      checkbox.addEventListener('change', ()=>{
        if(checkbox.checked){ checkedActs.add(label); }
        else{ checkedActs.delete(label); }
      });
      wrap.appendChild(item);
    });
  }

  document.getElementById('setupAddAct').addEventListener('click', ()=>{
    const input = document.getElementById('setupCustomAct');
    const val = input.value.trim();
    if(val){
      customActs.push(val);
      checkedActs.add(val);
      input.value = '';
      renderSetupChecks();
    }
  });

  document.getElementById('clearAllActs').addEventListener('click', ()=>{
    checkedActs.clear();
    renderSetupChecks();
  });

  document.getElementById('generateLink').addEventListener('click', ()=>{
    const sender = document.getElementById('setupSender').value.trim();
    const recipient = document.getElementById('setupRecipient').value.trim();
    const checked = Array.from(document.querySelectorAll('#setupChecks input:checked')).map(c => c.value);
    const message = document.getElementById('setupMessage').value.trim() || DEFAULT_MESSAGE;
    const closing = document.getElementById('setupClosing').value.trim() || DEFAULT_CLOSING;

    if(!sender || !recipient || checked.length === 0){
      alert('Completa tu nombre, el de tu cita, y elige al menos una actividad.');
      return;
    }

    const base = location.href.split('?')[0];
    const packed = [sender, recipient, checked.join('|'), message, closing].join(FIELD_SEP);
    const url = new URL(base);
    url.searchParams.set('d', packed);

    const linkInput = document.getElementById('generatedLink');
    linkInput.value = url.toString();
    document.getElementById('linkResult').style.display = 'block';
  });

  document.getElementById('copyLink').addEventListener('click', ()=>{
    const linkInput = document.getElementById('generatedLink');
    linkInput.select();
    navigator.clipboard.writeText(linkInput.value).then(()=>{
      const btn = document.getElementById('copyLink');
      const original = btn.textContent;
      btn.textContent = '¡Copiado!';
      setTimeout(()=>{ btn.textContent = original; }, 1500);
    });
  });

  // ============================================================
  // Decide qué pantalla mostrar al abrir la página
  // ============================================================
  if(isConfigured){
    showScreen('ask');
  } else {
    document.getElementById('setupMessage').value = DEFAULT_MESSAGE;
    document.getElementById('setupClosing').value = DEFAULT_CLOSING;
    renderSetupChecks();
    showScreen('setup');
  }
