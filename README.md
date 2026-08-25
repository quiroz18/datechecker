# 💌 Will You Go Out With Me

Página interactiva estilo pixel-art para pedirle una cita a alguien especial. Incluye una pantalla de configuración: la persona que arma la sorpresa llena un formulario (su nombre, el de su cita, y las actividades) y genera un enlace único para enviar — quien lo abre ve todo ya personalizado, sin ver el formulario.

## 📁 Estructura del proyecto

```
├── index.html      → estructura de la página
├── style.css       → todos los estilos
├── script.js       → toda la lógica e interacción
├── assets/         → tus 5 gifs (ver abajo)
└── README.md       → este archivo
```

## 🖼️ Antes de usarlo: agrega tus 5 gifs

Pon estos 5 archivos dentro de la carpeta `assets/`, con estos nombres **exactos**:

| Nombre exacto        | Dónde aparece                              |
|-----------------------|---------------------------------------------|
| `no.gif`              | Cuando esquivas el botón "No"               |
| `yay.gif`              | Pantalla "¡YAY!" (al decir que sí)          |
| `maybe.gif`           | Pantalla "Elige la fecha"                   |
| `tipo.gif`             | Pantalla "¿Qué te gustaría hacer?"          |
| `confirmacion.gif`   | Pantalla final "¡Es una cita!"              |

⚠️ En Windows, activa "File name extensions" (pestaña **View** en el Explorador) antes de renombrar, para evitar que queden guardados como `no.gif.gif`.

## 🚀 Cómo usarlo

1. **Abre `index.html`** (doble clic) para probarlo localmente primero.
2. Vas a ver un formulario: tu nombre, el nombre de tu cita, y una lista de actividades (puedes desmarcar las que no quieras o agregar las tuyas).
3. Al presionar **"GENERAR ENLACE 🔗"** obtienes un link único con todo codificado.
4. Ese link es el que le envías a la persona — al abrirlo, cae directo en la pregunta ya con su nombre, sin ver el formulario.

## ☁️ Cómo publicarlo (GitHub + Netlify)

1. Crea un repositorio nuevo en GitHub y sube **toda la carpeta** (`index.html`, `style.css`, `script.js`, y `assets/` con los 5 gifs dentro).
2. Entra a [netlify.com](https://netlify.com) → **"Add new site"** → **"Import an existing project"** → conecta tu repo de GitHub.
3. Build command: déjalo vacío. Publish directory: vacío o `.`
4. **"Deploy site"** — Netlify te da un link tipo `nombre-random.netlify.app` (puedes cambiarlo en *Site settings → Change site name*).
5. Abre ese link de Netlify, llena el formulario, genera tu enlace personalizado, ¡y envíalo!

## ✏️ Personalizar textos por defecto (opcional)

Si quieres cambiar el mensaje de la carta o la pregunta inicial que se usan de base, edita el bloque `CONFIG` al principio de `script.js` — está comentado y explicado ahí mismo.

## 🐛 Si algo no carga

- Confirma que los 5 gifs estén **dentro de la carpeta `assets/`**, con los nombres exactos de la tabla de arriba.
- Confirma que `index.html`, `style.css` y `script.js` estén los tres al mismo nivel (no dentro de subcarpetas).
- El botón "Copiar enlace" necesita una conexión segura (`https://`) para funcionar — en Netlify funciona automáticamente.
