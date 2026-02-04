# 🎉 Sitio Web de Boda - Heber & Kaitlyn

## 📋 Descripción

Sitio web elegante y responsivo para la boda de Heber & Kaitlyn con:
- Contador regresivo animado
- Galería de fotos tipo carrusel (swipe)
- Confirmación de asistencia con Firebase
- Diseño completamente responsive
- Formulario interactivo para invitados

---

## 🚀 Características

✨ **Diseño Moderno**
- Paleta de colores verde elegante
- Tipografía premium (Cormorant Garamond, Great Vibes, Poppins)
- Animaciones suaves y transiciones

📱 **Totalmente Responsive**
- Desktop (≥900px)
- Tablet (768px - 900px)
- Mobile (≤640px)
- Extra small (≤576px)

🔐 **Backend Firebase**
- Autenticación segura con códigos de invitación
- Base de datos en Firestore
- Confirmación de asistencia en tiempo real

♿ **Accesibilidad**
- Alt text descriptivo en imágenes
- Labels claros en formularios
- Focus states visibles
- Navegación por teclado

---

## 📁 Estructura del Proyecto

```
Wedding/
├── index.html                 # Página principal
├── styles.css                # Estilos principales
├── responsive-fixes.css       # Mejoras responsive
├── main.js                    # Lógica del formulario (Firebase)
├── countdown.js               # Contador regresivo
├── photoSwiper.js             # Galería de fotos
├── firebase-config.js         # Configuración de Firebase
├── admin.html                 # Panel administrador
├── admin.js                   # Lógica del admin
├── admin-firebase.js          # Firebase para admin
├── firestore.rules            # Reglas de seguridad
├── images/                    # Carpeta de imágenes
├── MEJORAS_REALIZADAS.md      # Detalle de cambios
└── README.md                  # Este archivo
```

---

## 🛠️ Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a Internet (para Firebase)
- Imágenes en carpeta `images/`

### Pasos para Usar

1. **Preparar imágenes**
   - Coloca tus imágenes en la carpeta `images/`
   - Asegúrate de que los nombres coincidan:
     - `ramo1.JPG` (imagen del héroe)
     - `rings.png` y `cheers.png` (íconos del itinerario)
     - `2016.jpg`, `2016_2.JPG`, etc. (galería)

2. **Configurar Firebase**
   - El archivo `firebase-config.js` ya está configurado
   - Si necesitas cambiar la base de datos, actualiza los valores

3. **Personalizar Información**
   
   **Datos de la Boda:**
   ```html
   <!-- En index.html, línea ~85 -->
   <div class="date-day mx-4">02</div>  <!-- Cambiar día -->
   <div class="date-label">Mayo</div>   <!-- Cambiar mes -->
   ```

   **Hora del Countdown:**
   ```javascript
   // En countdown.js, línea ~8
   const fallbackDate = "2026-05-02T15:30:00"; // Cambiar hora
   ```

   **Ubicación:**
   ```html
   <!-- En index.html, línea ~140 -->
   Campo Mosqueda, Mexicali, Baja California, México
   <!-- Cambiar ubicación -->
   ```

   **Itinerario:**
   ```html
   <!-- En index.html, línea ~96-108 -->
   <!-- Actualizar horas y lugares -->
   ```

   **Deadline de Confirmación:**
   ```html
   <!-- En index.html, línea ~180 -->
   15 de febrero 2025  <!-- Cambiar fecha -->
   ```

4. **Abrir en Navegador**
   - Abre `index.html` en tu navegador
   - ¡Listo!

---

## 🎨 Personalización de Estilos

### Paleta de Colores

Edita `:root` en `styles.css`:

```css
:root {
  --primary: #93BFC7;          /* Verde azulado principal */
  --primary-light: #ABE7B2;    /* Verde menta claro */
  --primary-dark: #75A6AE;     /* Verde azulado oscuro */
  --secondary: #CBF3BB;        /* Verde menta brillante */
  /* ... más colores ... */
}
```

### Tipografía

Cambiar fuentes en Google Fonts:
```html
<!-- En index.html, línea ~13-17 -->
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
```

### Espaciado

Ajustar padding y margins globales:
```css
/* En styles.css */
--section-spacing: clamp(3rem, 8vw, 5rem);
--radius: 10px;
--radius-lg: 16px;
```

---

## 🔧 Configuración de Firebase

### Estructura de Base de Datos

**Colección: `invitados`**

```json
{
  "codigo": "ABC123",
  "nombre": "Juan Pérez",
  "maxAcompanantes": 2,
  "estado": "confirmado",
  "acompanantes": 1,
  "fechaConfirmacion": "2025-02-15T10:30:00Z"
}
```

### Agregar Invitados

1. Ve a Firebase Console
2. Selecciona el proyecto `confirmacionesboda-e63a9`
3. Ve a Firestore Database
4. Crea documentos en la colección `invitados`
5. Llena los campos como se muestra arriba

---

## 📱 Pruebas de Responsividad

### Método 1: DevTools del Navegador
```
F12 → Ctrl+Shift+M → Seleccionar dispositivo
```

### Método 2: Diferentes Tamaños
- 🖥️ Desktop: 1920x1080
- 📱 Tablet: 768x1024
- 📱 Mobile: 375x667
- 📱 Small: 320x568

---

## 🐛 Solución de Problemas

### Contador no actualiza
- Verifica la hora en `countdown.js`
- Abre la consola (F12) y revisa errores
- Asegúrate de que la fecha sea futura

### Formulario no envía datos
- Verifica conexión a Internet
- Confirma que Firebase esté configurado
- Revisa la consola del navegador para errores
- Asegúrate de que el código de invitación existe en Firebase

### Imágenes no carga
- Verifica que los nombres sean exactos (case-sensitive)
- Confirma que están en la carpeta `images/`
- Abre la consola (F12) para ver errores

### Estilos no aplican
- Limpia el caché del navegador (Ctrl+Shift+Del)
- Verifica que `styles.css` y `responsive-fixes.css` existan
- Asegúrate de que los paths sean correctos

---

## 📊 Flujo de Usuario

```
1. Usuario visita el sitio
   ↓
2. Ve el countdown regresivo
   ↓
3. Ingresa código de invitación
   ↓
4. Sistema valida el código en Firebase
   ↓
5. Muestra nombre y opciones de asistencia
   ↓
6. Usuario confirma o rechaza asistencia
   ↓
7. Datos se guardan en Firebase
   ↓
8. Mensaje de confirmación
```

---

## 🔐 Seguridad

### Reglas de Firestore

Las reglas están en `firestore.rules` y limitan:
- Lectura: Solo búsquedas por código
- Escritura: Solo actualización del documento del usuario

---

## 📞 Contacto y Soporte

Para problemas o preguntas:
1. Revisa la consola del navegador (F12)
2. Verifica la estructura de datos en Firebase
3. Confirma que los archivos estén en el lugar correcto

---

## 📝 Notas Importantes

- La fecha del countdown es el **2 de mayo de 2026 a las 3:30 PM**
- Los códigos de invitación deben estar en Firebase
- Las imágenes deben ser optimizadas para web (máx 500KB)
- El sitio funciona mejor en navegadores modernos

---

## 🎉 ¡Listo para tu Gran Día!

El sitio está completamente funcional, responsive y listo para usar.

¡Que disfrutes tu boda! 💚
