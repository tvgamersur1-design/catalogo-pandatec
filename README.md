# Panda Tec - Catálogo

Tienda online de accesorios tecnológicos premium en Perú.

## 🚀 Despliegue en Render

### Pasos para subir tu página a Render:

#### 1. Preparación del repositorio
Asegúrate de que tu proyecto esté en un repositorio de GitHub:

```bash
# Si aún no has inicializado git:
git init
git add .
git commit -m "Initial commit"

# Crea un repositorio en GitHub y conecta tu proyecto:
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git push -u origin main
```

#### 2. Crear cuenta en Render
- Ve a [https://render.com](https://render.com)
- Regístrate con tu cuenta de GitHub
- Autoriza el acceso a tus repositorios

#### 3. Crear un nuevo Static Site
1. En el dashboard de Render, haz clic en **"New +"**
2. Selecciona **"Static Site"**
3. Conecta tu repositorio de GitHub
4. Configura los siguientes campos:

**Configuración básica:**
- **Name**: `panda-tec` (o el nombre que prefieras)
- **Branch**: `main` (o la rama que uses)
- **Root Directory**: (déjalo vacío si el index.html está en la raíz)
- **Build Command**: (déjalo vacío para sitios estáticos simples)
- **Publish Directory**: `.` (punto, indica la raíz del proyecto)

5. Haz clic en **"Create Static Site"**

#### 4. Espera el despliegue
- Render automáticamente desplegará tu sitio
- El proceso toma 1-2 minutos
- Recibirás una URL como: `https://panda-tec.onrender.com`

#### 5. Configurar dominio personalizado (Opcional)
Si tienes un dominio propio:
1. Ve a la configuración del sitio en Render
2. Sección **"Custom Domains"**
3. Agrega tu dominio
4. Configura los registros DNS según las instrucciones de Render

### ✅ Ventajas de Render para sitios estáticos:
- ✓ Hosting gratuito para sitios estáticos
- ✓ SSL/HTTPS automático
- ✓ Despliegues automáticos con cada push a GitHub
- ✓ CDN global incluido
- ✓ Sin límites de ancho de banda

### 🔄 Actualizar tu sitio
Cada vez que hagas cambios y los subas a GitHub, Render desplegará automáticamente:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### 🧪 Probar localmente
Para probar tu sitio localmente antes de subir:

```bash
# Python 3
python -m http.server 8000

# Luego abre: http://localhost:8000
```

### 📝 Notas importantes:
- Todas las rutas de archivos (CSS, JS, imágenes) deben ser relativas
- Los archivos deben tener nombres en minúsculas para evitar problemas
- Asegúrate de que el archivo `index.html` esté en la raíz del proyecto

### 🛠️ Tecnologías utilizadas:
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome
- Google Fonts

---

**¿Necesitas ayuda?** Contacta por WhatsApp: +51 902 515 226
