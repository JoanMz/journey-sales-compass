# Configuración para Producción

## 🔧 Configuración Actual

### Desarrollo (Local)
- **Frontend:** `http://localhost:5173`
- **Proxy:** `/api` → `http://ec2-34-220-92-143.us-west-2.compute.amazonaws.com:3000`
- **Endpoints:** Usando `/api` (proxy local)

### Producción
- **Frontend:** HTTPS (cualquier dominio)
- **Backend:** `https://ec2-34-220-92-143.us-west-2.compute.amazonaws.com:3000`
- **Endpoints:** Usando URL directa (sin proxy)

## 🚀 Despliegue en Producción

### 1. Build de Producción
```bash
npm run build
```

### 2. Configuración del Servidor Web
El servidor web (nginx, Apache, etc.) debe:
- Servir los archivos estáticos desde `/dist`
- Configurar HTTPS con certificados válidos
- No necesitar proxy (las llamadas van directo al EC2)

### 3. Variables de Entorno
```bash
# En producción, estas variables se configuran automáticamente
NODE_ENV=production
VITE_MODE=production
```

## 🔒 Certificados HTTPS

### Para el Frontend (Tu dominio)
- Usar Let's Encrypt, Cloudflare, o tu proveedor de hosting
- Configurar SSL/TLS en el servidor web

### Para el Backend (EC2)
- El servidor EC2 ya está configurado para HTTP
- En producción, las llamadas van directo sin proxy
- No hay problemas de certificados porque no usamos proxy

## 📋 Verificación

### En Desarrollo
```bash
# Verificar que el proxy funciona
curl http://localhost:5173/api/transactions
```

### En Producción
```bash
# Verificar que va directo al EC2
curl https://tu-dominio.com/api/transactions
# Esto debería ir directo a: http://ec2-34-220-92-143.us-west-2.compute.amazonaws.com:3000/transactions
```

## 🎯 Flujo de Datos

### Desarrollo
```
Frontend (localhost:5173) 
    ↓
Proxy (/api/*) 
    ↓
Servidor EC2 (HTTP)
```

### Producción
```
Frontend (HTTPS) 
    ↓
Directo al EC2 (HTTP)
```

## ✅ Ventajas de esta Configuración

1. **Desarrollo:** Proxy evita problemas de CORS y certificados
2. **Producción:** Llamadas directas sin overhead del proxy
3. **Flexibilidad:** Configuración automática según el entorno
4. **Seguridad:** HTTPS en frontend, HTTP directo al backend

## 🔍 Logs de Depuración

En la consola del navegador verás:
```
🔧 Configuración de endpoints: {
  environment: "development" | "production",
  baseUrl: "/api" | "https://ec2-...",
  isDevelopment: true | false,
  isProduction: false | true
}
``` 