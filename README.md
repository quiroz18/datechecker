# 💌 Will You Go Out With Me — versión con Supabase

Esta versión usa una base de datos real (Supabase, gratis) en vez de guardar todo en el enlace. Ventajas sobre la versión simple:

- **El enlace es cortísimo** (`?id=abc123`) en vez de uno largo lleno de texto.
- **Puedes ver la respuesta cuando quieras**, sin depender de que la otra persona te la comparta — tienes tu propio "enlace de seguimiento" que consultas cuando quieras.

## 📁 Estructura

```
├── index.html      → estructura de la página
├── style.css       → estilos
├── script.js       → lógica + conexión a Supabase (aquí pegas tus llaves)
├── assets/         → tus 5 gifs (mismos nombres que siempre)
└── README.md       → este archivo
```

## 1. Crea tu proyecto en Supabase (gratis)

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta / inicia sesión.
2. Crea un nuevo proyecto (elige cualquier nombre y contraseña, y una región cercana).
3. Espera a que termine de aprovisionarse (1-2 minutos).

## 2. Crea la tabla

Dentro de tu proyecto, ve a **SQL Editor** (menú lateral) → **New query**, pega esto y dale **Run**:

```sql
create table public.dates (
  id uuid primary key default gen_random_uuid(),
  sender_name text not null,
  recipient_name text not null,
  activities text not null,
  message text not null,
  closing text not null,
  chosen_activity text,
  chosen_date date,
  responded boolean default false,
  created_at timestamptz default now()
);

alter table public.dates enable row level security;

create policy "allow anon insert" on public.dates
  for insert to anon with check (true);

create policy "allow anon select" on public.dates
  for select to anon using (true);

create policy "allow anon update" on public.dates
  for update to anon using (true) with check (true);
```

> ⚠️ **Nota sobre seguridad:** estas políticas permiten que cualquiera con tu URL y llave pública pueda leer/escribir en esta tabla (no hay login de usuarios). Para una sorpresa personal como esta no es un problema real — nadie más va a saber que existe tu proyecto — pero no uses esta tabla para guardar información sensible.

## 3. Copia tu URL y llave pública

Ve a **Project Settings** (ícono de engranaje) → **API**. Copia:
- **Project URL**
- **anon public** key (la llave larga, NO la `service_role`)

## 4. Pégalas en `script.js`

Abre `script.js` con un editor de texto y busca estas dos líneas al principio:

```javascript
const SUPABASE_URL = "TU_SUPABASE_URL_AQUI";
const SUPABASE_ANON_KEY = "TU_SUPABASE_ANON_KEY_AQUI";
```

Reemplázalas con tus valores reales, por ejemplo:

```javascript
const SUPABASE_URL = "https://abcdefghijk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

Guarda el archivo.

## 5. Agrega tus 5 gifs

Igual que siempre, en la carpeta `assets/`, con estos nombres exactos:

| Nombre exacto | Dónde aparece |
|---|---|
| `no.gif` | Al esquivar el "No" |
| `yay.gif` | Pantalla "¡YAY!" |
| `maybe.gif` | Pantalla "Elige la fecha" |
| `tipo.gif` | Pantalla "¿Qué te gustaría hacer?" |
| `confirmacion.gif` | Pantalla "¡Es una cita!" |

## 6. Prueba localmente

Abre `index.html` con doble clic. Llena el formulario y dale "Generar enlace" — si todo está bien conectado, te va a dar **dos enlaces**:

1. **El que le envías a tu cita** (corto, tipo `...?id=abc123`).
2. **Tu enlace de seguimiento** (para ti, guárdalo aparte) — ábrelo cuando quieras para ver si ya respondió, y ahí también puedes agregar la cita a tu calendario.

Si sale un error de conexión, revisa que copiaste bien la URL y la llave, y que corriste el SQL del paso 2.

## 7. Publícalo (GitHub + Netlify)

Igual que la versión simple: sube todo (`index.html`, `style.css`, `script.js`, `assets/`) a un repo de GitHub, conéctalo en Netlify, y listo.

## ¿Cómo se ve el flujo completo?

1. Tú llenas el formulario → se crea una fila en tu base de datos → te da 2 enlaces.
2. Le mandas el primer enlace a tu cita. Ella responde (fecha + actividad) — eso actualiza esa misma fila en la base de datos.
3. Abres el panel de configuración (`index.html`, sin nada después del `?`) cuando quieras — arriba del todo aparece **"Tus invitaciones"**, con el estado de cada una: *"esperando respuesta..."* o *"¡dijo que sí! [actividad] el [fecha]"* con su propio botón para agregarla a tu calendario. Esto consulta tu base de datos directamente, así que funciona igual desde cualquier computadora o celular — no depende de nada guardado en ese navegador en particular.
4. El "enlace de seguimiento" (paso 2) sigue funcionando también, por si quieres revisar una invitación específica sin pasar por el panel completo.
