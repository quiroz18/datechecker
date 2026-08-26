// ============================================================
// ✏️  EDITA ESTA SECCIÓN — pega aquí tus datos de Supabase
// (Project Settings → API → Project URL / anon public key)
// ============================================================
const SUPABASE_URL = "https://pblkowtqhtcmhbmqbgib.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TNJl-Ly0Kep_NUiuyUbMBw_yB9tAVM_";
// ============================================================

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DEFAULT_ACTIVITIES = [
  "Cena romántica", "Noche de película", "Café y caminata",
  "Picnic", "Mini golf", "Sorpréndeme"
];
const DEFAULT_MESSAGE = "sé que las palabras nunca me alcanzan del todo, pero quiero intentarlo: contigo hasta los días normales se sienten especiales. Gracias por decir que sí.";
const DEFAULT_CLOSING = "Te quiero";

let CONFIG = {
  recipientName: "Dania",
  senderName: "Ricardo",
  question: "¿quieres salir conmigo?",
  letterMessage: DEFAULT_MESSAGE,
  closing: DEFAULT_CLOSING,
  activities: DEFAULT_ACTIVITIES.map(label => ({ label: label.toUpperCase(), value: label.toLowerCase() }))
};

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function applyConfigToDOM(){
  document.title = CONFIG.recipientName + " 💗";
  document.getElementById('nameInTitle').textContent = CONFIG.recipientName;
  document.getElementById('questionText').textContent = CONFIG.question;
  document.getElementById('nameInLetter').textContent = CONFIG.recipientName;
  document.getElementById('senderInSignature').textContent = CONFIG.senderName;

  const activityGrid = document.getElementById('activityGrid');
  activityGrid.innerHTML = '';
  CONFIG.activities.forEach(act => {
    const btn = document.createElement('button');
    btn.className = 'activity-btn';
    btn.dataset.act = act.value;
    btn.textContent = act.label;
    activityGrid.appendChild(btn);
  });
}

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

  const growScale = Math.min(1 + dodgeCount * 0.12, 2.2);
  yesBtn.style.transform = `scale(${growScale})`;
  const shrinkScale = Math.max(1 - dodgeCount * 0.12, 0.35);
  noBtn.style.transform = `scale(${shrinkScale})`;

  if(dodgeCount >= 3){ cat.classList.add('pleading'); }
}

noBtn.addEventListener('click', dodge);
noBtn.addEventListener('touchstart', dodge, {passive:false});

yesBtn.addEventListener('click', ()=>{
  showScreen('yay');
});

document.getElementById('toActivity').addEventListener('click', ()=>{
  showScreen('datePick');
});

let chosenActivity = null;
let chosenDateStr = "pronto";
let chosenDateISO = "";
const lockInBtn = document.getElementById('lockIn');
function wireActivityButtons(){
  document.querySelectorAll('.activity-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.activity-btn').forEach(b=>b.classList.remove('selected'));
      btn.classList.add('selected');
      chosenActivity = btn.dataset.act;
      lockInBtn.disabled = false;
    });
  });
}

document.getElementById('confirmDate').addEventListener('click', ()=>{
  const val = document.getElementById('dateInput').value;
  if(val){
    chosenDateISO = val;
    const d = new Date(val + 'T00:00:00');
    chosenDateStr = d.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
  }
  showScreen('activity');
});

let currentRowId = null;

lockInBtn.addEventListener('click', ()=>{
  if(!chosenActivity) return;
  const actText = chosenActivity;
  document.getElementById('letterBody').innerHTML =
    `${CONFIG.recipientName}, ${CONFIG.letterMessage}<br><br>` +
    `No puedo esperar a nuestro plan de <b>${actText}</b> el <b>${chosenDateStr}</b>. ${CONFIG.closing}. <span class="heart">♥</span>`;
  document.getElementById('dateSummary').innerHTML =
    `FECHA: ${chosenDateStr}<br>ACTIVIDAD: ${actText.toUpperCase()}`;
  showScreen('itsADate');

  // Guarda la respuesta en Supabase para que quien organizó la vea
  if(currentRowId){
    sb.from('dates').update({
      chosen_activity: actText,
      chosen_date: chosenDateISO,
      responded: true
    }).eq('id', currentRowId).then(()=>{}).catch(()=>{});
  }
});

document.getElementById('toNotify').addEventListener('click', ()=>{
  showScreen('notify');
});

// ============================================================
// Calendario (.ics) — funciona con Google Calendar, Apple
// Calendar, Outlook, etc. sin depender de ningún servicio externo.
// ============================================================
function pad(n){ return String(n).padStart(2,'0'); }
function icsTimestamp(){
  const d = new Date();
  return d.getUTCFullYear() + pad(d.getUTCMonth()+1) + pad(d.getUTCDate()) + 'T' +
         pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
}
function escapeICS(str){
  return String(str).replace(/[,;]/g, '\\$&').replace(/\n/g, '\\n');
}
function buildICS(title, description, isoDate){
  const dateCompact = (isoDate || '').replace(/-/g, '');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WillYouGoOutWithMe//ES',
    'BEGIN:VEVENT',
    'UID:' + Date.now() + '@willyougooutwithme',
    'DTSTAMP:' + icsTimestamp(),
    'DTSTART;VALUE=DATE:' + dateCompact,
    'SUMMARY:' + escapeICS(title),
    'DESCRIPTION:' + escapeICS(description),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}
function downloadICS(icsContent, filename){
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('addToCalendar').addEventListener('click', ()=>{
  const title = `${chosenActivity} con ${CONFIG.senderName}`;
  const desc = `¡Es una cita! ${chosenActivity} — organizado por ${CONFIG.senderName}.`;
  downloadICS(buildICS(title, desc, chosenDateISO), 'nuestra-cita.ics');
});

document.getElementById('openMessage').addEventListener('click', ()=>{
  showScreen('letter');
});

// ============================================================
// PANTALLA DE CONFIGURACIÓN (solo para quien arma la sorpresa)
// ============================================================
let customActs = [];
let checkedActs = new Set(DEFAULT_ACTIVITIES);

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

// ============================================================
// "Tus invitaciones" — consulta directo en Supabase todas las
// filas de tu tabla (es tu propio proyecto, así que todas son
// tuyas). Funciona desde cualquier dispositivo o navegador,
// sin depender de nada guardado localmente.
// ============================================================
async function renderMyInvites(){
  const section = document.getElementById('myInvitesSection');
  const list = document.getElementById('myInvitesList');

  section.style.display = 'block';
  list.innerHTML = '<div class="sub">Cargando...</div>';

  const { data: rows, error } = await sb.from('dates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  if(error || !rows || rows.length === 0){
    section.style.display = 'none';
    return;
  }

  list.innerHTML = '';
  rows.forEach((data, i) => {
    const item = document.createElement('div');
    item.className = data.responded ? 'invite-item' : 'invite-item pending';

    const textSpan = document.createElement('span');
    if(data.responded){
      let dateStr = data.chosen_date || '';
      if(data.chosen_date){
        const d = new Date(data.chosen_date + 'T00:00:00');
        dateStr = d.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
      }
      textSpan.innerHTML = `<b>${data.recipient_name}</b>: ¡dijo que sí! ${data.chosen_activity} el ${dateStr}`;
    } else {
      textSpan.textContent = `${data.recipient_name}: esperando respuesta...`;
    }
    item.appendChild(textSpan);

    if(data.responded){
      const calBtn = document.createElement('button');
      calBtn.className = 'mini-cal-btn';
      calBtn.type = 'button';
      calBtn.textContent = '📅';
      calBtn.dataset.idx = i;
      item.appendChild(calBtn);
    }

    const delBtn = document.createElement('button');
    delBtn.className = 'mini-del-btn';
    delBtn.type = 'button';
    delBtn.title = `Borrar la invitación de ${data.recipient_name}`;
    delBtn.textContent = '🗑️';
    delBtn.dataset.id = data.id;
    delBtn.dataset.name = data.recipient_name;
    item.appendChild(delBtn);

    list.appendChild(item);
  });

  list.querySelectorAll('.mini-cal-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const data = rows[btn.dataset.idx];
      const title = `${data.chosen_activity} con ${data.recipient_name}`;
      const desc = `¡Es una cita! ${data.chosen_activity} — confirmado con ${data.recipient_name}.`;
      downloadICS(buildICS(title, desc, data.chosen_date), 'nuestra-cita.ics');
    });
  });

  list.querySelectorAll('.mini-del-btn').forEach(btn=>{
    btn.addEventListener('click', async ()=>{
      const ok = confirm(`¿Borrar la invitación de ${btn.dataset.name}? Esto no se puede deshacer.`);
      if(!ok) return;
      btn.disabled = true;
      const { error } = await sb.from('dates').delete().eq('id', btn.dataset.id);
      if(error){
        alert('No se pudo borrar. Intenta de nuevo.');
        btn.disabled = false;
        return;
      }
      renderMyInvites();
    });
  });
}

document.getElementById('refreshInvites').addEventListener('click', renderMyInvites);

document.getElementById('generateLink').addEventListener('click', async ()=>{
  const sender = document.getElementById('setupSender').value.trim();
  const recipient = document.getElementById('setupRecipient').value.trim();
  const checked = Array.from(document.querySelectorAll('#setupChecks input:checked')).map(c => c.value);
  const message = document.getElementById('setupMessage').value.trim() || DEFAULT_MESSAGE;
  const closing = document.getElementById('setupClosing').value.trim() || DEFAULT_CLOSING;
  const errorEl = document.getElementById('setupError');
  errorEl.textContent = '';

  if(!sender || !recipient || checked.length === 0){
    alert('Completa tu nombre, el de tu cita, y elige al menos una actividad.');
    return;
  }

  const genBtn = document.getElementById('generateLink');
  genBtn.disabled = true;
  genBtn.textContent = 'GENERANDO...';

  const { data, error } = await sb.from('dates').insert({
    sender_name: sender,
    recipient_name: recipient,
    activities: checked.join('|'),
    message: message,
    closing: closing
  }).select().single();

  genBtn.disabled = false;
  genBtn.textContent = 'GENERAR ENLACE 🔗';

  if(error || !data){
    errorEl.textContent = 'No se pudo conectar con la base de datos. Revisa que SUPABASE_URL y SUPABASE_ANON_KEY estén bien puestos en script.js, y que la tabla "dates" exista (ver README).';
    return;
  }

  const base = location.href.split('?')[0];
  const sendUrl = new URL(base);
  sendUrl.searchParams.set('id', data.id);

  const trackUrl = new URL(base);
  trackUrl.searchParams.set('id', data.id);
  trackUrl.searchParams.set('track', '1');

  document.getElementById('generatedLink').value = sendUrl.toString();
  document.getElementById('trackingLink').value = trackUrl.toString();
  document.getElementById('linkResult').style.display = 'block';

  renderMyInvites();
});

function wireCopyButton(btnId, inputId){
  document.getElementById(btnId).addEventListener('click', ()=>{
    const input = document.getElementById(inputId);
    input.select();
    navigator.clipboard.writeText(input.value).then(()=>{
      const btn = document.getElementById(btnId);
      const original = btn.textContent;
      btn.textContent = '¡Copiado!';
      setTimeout(()=>{ btn.textContent = original; }, 1500);
    });
  });
}
wireCopyButton('copyLink', 'generatedLink');
wireCopyButton('copyTrackingLink', 'trackingLink');

// ============================================================
// Arranque: decide qué pantalla mostrar según la URL
// ============================================================
async function boot(){
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const isTracking = params.get('track') === '1';

  if(!id){
    // Nadie ha configurado nada todavía: mostrar el formulario
    document.getElementById('setupMessage').value = DEFAULT_MESSAGE;
    document.getElementById('setupClosing').value = DEFAULT_CLOSING;
    renderSetupChecks();
    renderMyInvites();
    showScreen('setup');
    return;
  }

  const { data, error } = await sb.from('dates').select('*').eq('id', id).single();

  if(error || !data){
    document.getElementById('setupMessage').value = DEFAULT_MESSAGE;
    document.getElementById('setupClosing').value = DEFAULT_CLOSING;
    renderSetupChecks();
    renderMyInvites();
    showScreen('setup');
    document.getElementById('setupError').textContent = 'Ese enlace no es válido o ya no existe.';
    return;
  }

  if(isTracking){
    renderTrackingScreen(data);
    document.getElementById('refreshTracking').addEventListener('click', async ()=>{
      const { data: fresh } = await sb.from('dates').select('*').eq('id', id).single();
      if(fresh){ renderTrackingScreen(fresh); }
    });
    showScreen('tracking');
    return;
  }

  // Flujo normal para quien recibe la invitación
  currentRowId = data.id;
  CONFIG = {
    recipientName: data.recipient_name,
    senderName: data.sender_name,
    question: "¿quieres salir conmigo?",
    letterMessage: data.message || DEFAULT_MESSAGE,
    closing: data.closing || DEFAULT_CLOSING,
    activities: (data.activities || '').split('|').filter(Boolean)
      .map(label => ({ label: label.toUpperCase(), value: label.toLowerCase() }))
  };
  applyConfigToDOM();
  wireActivityButtons();
  showScreen('ask');
}

function renderTrackingScreen(data){
  const calBtn = document.getElementById('addToCalendarSender');
  if(data.responded){
    let dateStr = "pronto";
    if(data.chosen_date){
      const d = new Date(data.chosen_date + 'T00:00:00');
      dateStr = d.toLocaleDateString('es-ES', { day:'numeric', month:'long', year:'numeric' });
    }
    document.getElementById('trackingHeading').textContent = `¡${data.recipient_name} dijo que sí! 💕`;
    document.getElementById('trackingDetails').innerHTML = `${(data.chosen_activity||'').toUpperCase()}<br>${dateStr}`;
    calBtn.style.display = 'block';
    calBtn.onclick = ()=>{
      const title = `${data.chosen_activity} con ${data.recipient_name}`;
      const desc = `¡Es una cita! ${data.chosen_activity} — confirmado con ${data.recipient_name}.`;
      downloadICS(buildICS(title, desc, data.chosen_date), 'nuestra-cita.ics');
    };
  } else {
    document.getElementById('trackingHeading').textContent = `Esperando respuesta de ${data.recipient_name}...`;
    document.getElementById('trackingDetails').innerHTML = 'Todavía no ha contestado. Vuelve a intentarlo más tarde.';
    calBtn.style.display = 'none';
  }
}

boot();
