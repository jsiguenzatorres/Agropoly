# 📱 Plan de trabajo — Versión Móvil AGROPOLY BFA

> Plan ejecutivo para construir la versión móvil del juego (Android + iOS) **una vez completada la afinación de la versión web**.
> Estrategia: **PWA primero** (gratis, rápida) → **Capacitor wrapper** (presencia en App Store / Play Store).

---

## 0. Pre-requisitos (antes de arrancar)

Validar que la versión web esté estable. Bloquean el inicio del plan móvil:

- [ ] **0.1** Versión web desplegada en producción (URL pública HTTPS) — requerido para PWA install
- [ ] **0.2** `ADMIN_PASSWORD` cambiado en producción (no usar default `agropoly-bfa-2026`)
- [ ] **0.3** Contenido de Historias del Campo validado por BFA (`pendingReview: false` en las 6 mascotas)
- [ ] **0.4** Bug list de la versión web en cero o triaged
- [ ] **0.5** Decisión BFA: ¿queremos solo PWA, o también stores oficiales?
- [ ] **0.6** Si stores: confirmar **presupuesto Apple Developer ($99/año)** y **Google Play ($25 una sola vez)**
- [ ] **0.7** Si iOS: asegurar acceso a **Mac físico o servicio cloud build** (EAS Build / Codemagic ~$30/mes)

**Duración fase 0**: 1 semana (depende de coordinación con BFA, no de código).

---

## Fase 1 — PWA pulida y promocionada

**Objetivo**: que cualquier usuario con iPhone o Android pueda instalar AGROPOLY en su pantalla de inicio en 3 toques, sin tienda.

**Duración estimada**: 2-3 días de dev.

### 1.1 Auditoría PWA actual

- [ ] **1.1.1** Correr Lighthouse PWA audit en el sitio publicado, target ≥ 90/100
- [ ] **1.1.2** Verificar manifest.webmanifest expuesto correctamente, con todos los iconos (192, 512, maskable)
- [ ] **1.1.3** Confirmar service worker registrado y cacheo offline funcional para shell + assets críticos
- [ ] **1.1.4** Validar PWA install prompt en Chrome Android (debe aparecer automáticamente)
- [ ] **1.1.5** Validar instalación manual en Safari iOS (Compartir → Agregar a pantalla inicio)

### 1.2 Banner de instalación

- [ ] **1.2.1** Componente `<InstallPromptBanner />` que detecte `beforeinstallprompt` event (Android)
- [ ] **1.2.2** Modal/toast con instrucciones para iOS (Safari no dispara el evento — hay que enseñar manualmente)
- [ ] **1.2.3** Persistir "no mostrar de nuevo" en localStorage por 30 días si el usuario descarta
- [ ] **1.2.4** Trigger inteligente: mostrar después de la primera partida completada, no al inicio (no molestar)
- [ ] **1.2.5** Tracking en analytics: `pwa_install_prompted`, `pwa_install_accepted`, `pwa_install_dismissed`

### 1.3 Optimizaciones bundle para 3G/4G

- [ ] **1.3.1** Análisis bundle con `vite-bundle-visualizer`, identificar top 10 dependencias por tamaño
- [ ] **1.3.2** Lazy-load Three.js / Rapier en route `/game` (ya parcial — completar)
- [ ] **1.3.3** Lazy-load Recharts solo en `/dashboard`
- [ ] **1.3.4** Lazy-load GSAP solo en `StoryIntro` mount
- [ ] **1.3.5** Comprimir `logo-bfa.png` y `widget-bfa.png` con `oxipng` (mantener calidad visual)
- [ ] **1.3.6** Verificar gzip/brotli compression habilitado en el hosting estático
- [ ] **1.3.7** Target: first-paint < 2s en 4G, interactive < 5s

### 1.4 Touch UX

- [ ] **1.4.1** Auditoría touch targets — todos los botones ≥ 44×44px (Apple HIG) o 48×48px (Material)
- [ ] **1.4.2** Eliminar hover-only interactions, reemplazar por tap variants
- [ ] **1.4.3** Gestures pinch-to-zoom en el tablero 3D (opcional pero deseable)
- [ ] **1.4.4** Test exhaustivo de scroll en `/dashboard`, `/historias`, `/admin/historias` en mobile
- [ ] **1.4.5** Confirmar que el keyboard mobile no rompe layout en formularios (`InstallSteps`, login admin, lobby name input)

### 1.5 Performance 3D mobile

- [ ] **1.5.1** Detectar device tier (`navigator.hardwareConcurrency`, GPU info) y bajar calidad automáticamente:
  - Low tier (≤4 cores): desactivar Bloom, SMAA, partículas ambientales
  - Mid tier: mantener postproc pero limitar `dpr` a 1.5
  - High tier: full quality
- [ ] **1.5.2** Reducir cantidad de partículas en `AmbientParticles` para mobile
- [ ] **1.5.3** Probar Rapier dice en device real low-end — si lag, fallback a animación CSS 2D
- [ ] **1.5.4** Target: ≥ 30 fps sostenido en Pixel 6a / iPhone SE 2020

### 1.6 Testing en devices reales

- [ ] **1.6.1** iPhone — al menos 1 modelo reciente (iPhone 13+) y 1 viejo (iPhone SE / 11)
- [ ] **1.6.2** Android — al menos 1 gama alta (Samsung S21+, Pixel 7+), 1 gama media (Moto G), 1 gama baja
- [ ] **1.6.3** Tablet — iPad y Android tablet (layout responsive en landscape)
- [ ] **1.6.4** Validar funcionalidad: dados Rapier, narración Web Speech, multijugador Colyseus, instalación PWA
- [ ] **1.6.5** Reportar issues device-specific en GitHub issues

### 1.7 Entregable Fase 1

- ✅ PWA instalable con prompt elegante en Android, instrucciones claras en iOS
- ✅ Bundle web ≤ 500 KB gzipped en first load
- ✅ ≥ 30 fps en dispositivos media-baja
- ✅ Testing OK en al menos 6 devices físicos
- ✅ Documentación de install en `INSTALL.md` (sección "Instalación mobile")

**Después de Fase 1, BFA ya puede usar el juego en talleres rurales sin nada más.**

---

## Fase 2 — Wrapper Capacitor (Android)

**Objetivo**: tener APK distribuible en Play Store.
**Por qué Android primero**: Centroamérica es ~85% Android, build desde Windows, sin Mac required.

**Duración estimada**: 2 días de dev + 5-7 días de review Google Play.

### 2.1 Setup Capacitor

- [ ] **2.1.1** Instalar Capacitor en `apps/web`: `pnpm add @capacitor/core @capacitor/cli @capacitor/android`
- [ ] **2.1.2** `npx cap init "AGROPOLY BFA" "sv.gob.bfa.agropoly"`
- [ ] **2.1.3** Configurar `capacitor.config.ts` con:
  - `webDir: 'dist'` (output Vite)
  - `server.androidScheme: 'https'`
  - `backgroundColor: '#0D2B14'` (BFA dark)
- [ ] **2.1.4** `npx cap add android` — genera `android/` directory
- [ ] **2.1.5** Build de prueba: `pnpm build && npx cap sync android && npx cap open android`

### 2.2 Configuración Android Studio

- [ ] **2.2.1** Instalar Android Studio + SDK 34+ + JDK 17+
- [ ] **2.2.2** Configurar `android/app/build.gradle` con:
  - `applicationId "sv.gob.bfa.agropoly"`
  - `versionCode 1`, `versionName "1.0.0"`
  - `minSdkVersion 26` (Android 8.0 — cubre 95% de devices activos en 2026)
  - `targetSdkVersion 34`
- [ ] **2.2.3** Generar keystore de firma (`agropoly-release.keystore`) — **guardar password en bóveda BFA**
- [ ] **2.2.4** Configurar `signingConfigs` en gradle para release builds
- [ ] **2.2.5** Build de release: `cd android && ./gradlew bundleRelease` → `app-release.aab`

### 2.3 Assets nativos Android

- [ ] **2.3.1** Iconos adaptativos (foreground + background) generados desde `widget-bfa.png` — usar [icon-kitchen.netlify.app](https://icon-kitchen.netlify.app)
  - `mipmap-hdpi`, `mipmap-xhdpi`, `mipmap-xxhdpi`, `mipmap-xxxhdpi`, `mipmap-xxxxhdpi`
- [ ] **2.3.2** Splash screen con logo BFA — usar [capacitor-splash-generator](https://github.com/ionic-team/capacitor-assets)
- [ ] **2.3.3** Status bar con color BFA verde oscuro `#0D2B14`
- [ ] **2.3.4** Configurar `android/app/src/main/AndroidManifest.xml`:
  - Orientación: `portrait` (locked) o `unspecified`
  - Permisos mínimos: solo `INTERNET` (Colyseus + API)
  - **Sin permisos sensibles** (no cámara, no ubicación, no contactos)

### 2.4 Plugins Capacitor necesarios

- [ ] **2.4.1** `@capacitor/splash-screen` — control del splash duration
- [ ] **2.4.2** `@capacitor/status-bar` — color y estilo de status bar
- [ ] **2.4.3** `@capacitor/keyboard` — manejo del teclado virtual (resize layout)
- [ ] **2.4.4** `@capacitor/network` — detectar offline para mostrar UI apropiado
- [ ] **2.4.5** `@capacitor/share` — botón "Compartí AGROPOLY" en el splash (viral mechanic)
- [ ] **2.4.6** `@capacitor/app` — detectar back button Android para navegar correctamente
- [ ] **2.4.7** Opcional: `@capacitor/preferences` — usar en lugar de localStorage (más confiable nativo)

### 2.5 Testing en device físico Android

- [ ] **2.5.1** Habilitar USB debugging en device de prueba
- [ ] **2.5.2** Instalar APK debug: `npx cap run android`
- [ ] **2.5.3** Smoke tests:
  - Splash → splash → menú principal
  - Iniciar partida → Story Intro completo
  - Lanzar dados → física Rapier OK → token mueve
  - Comprar propiedad → balance baja → billete arriba
  - Cerrar app → reabrir → estado conservado (PWA cache)
  - Modo offline parcial (sin internet) → mensaje claro
- [ ] **2.5.4** Performance profiling con Android Studio Profiler:
  - FPS sostenido durante partida ≥ 30
  - Memory < 250 MB
  - APK size < 50 MB

### 2.6 Cuenta Google Play + publicación

- [ ] **2.6.1** Crear cuenta Google Play Developer ($25 único, una sola vez)
- [ ] **2.6.2** Crear app en Play Console
  - Nombre: "AGROPOLY BFA"
  - Categoría: Educación + Juegos / Casual
  - Descripción corta (80 chars): "Aprendé educación financiera con el juego BFA"
  - Descripción larga (4000 chars): copy aprobado por marketing BFA
  - Tags: educativo, BFA, El Salvador, agropecuario, financiero
- [ ] **2.6.3** Assets store listing:
  - Icono 512×512
  - Feature graphic 1024×500
  - Screenshots phone (mínimo 2, recomendado 8) — capturar partida, intro, dashboard, historias
  - Screenshots tablet (opcional)
  - Video promocional 30s (opcional, alta conversión)
- [ ] **2.6.4** Content rating: completar cuestionario IARC (apto todo público)
- [ ] **2.6.5** Privacy policy URL (legal BFA debe redactar y publicar)
- [ ] **2.6.6** Target audience: 9-19 años + adultos
- [ ] **2.6.7** Subir `app-release.aab` a internal testing track
- [ ] **2.6.8** Smoke test del internal release con cuenta tester
- [ ] **2.6.9** Promover a closed testing → production
- [ ] **2.6.10** **Review Google Play**: 1-7 días típicamente

### 2.7 Entregable Fase 2

- ✅ APK Android distribuible vía Google Play
- ✅ Aprobada y publicada en Play Store con listing institucional BFA
- ✅ Versión instalada en al menos 3 devices Android internos BFA
- ✅ Plan de updates (siguiente release) con `versionCode` incremental

---

## Fase 3 — Build iOS (App Store)

**Objetivo**: distribución en App Store de Apple.
**Duración estimada**: 3 días dev + 7-14 días review Apple.
**Pre-requisito**: Mac físico **O** cuenta EAS Build / Codemagic.

### 3.1 Setup iOS

- [ ] **3.1.1** Instalar Xcode 15+ en Mac (o configurar EAS Build cloud)
- [ ] **3.1.2** `pnpm add @capacitor/ios` y `npx cap add ios`
- [ ] **3.1.3** Inscripción Apple Developer Program ($99/año, cuenta BFA institucional)
- [ ] **3.1.4** Generar certificados: Development + Distribution + Push (si se usaran)
- [ ] **3.1.5** Crear App ID `sv.gob.bfa.agropoly` en Apple Developer Portal
- [ ] **3.1.6** Provisioning profiles: Development + App Store

### 3.2 Configuración Xcode

- [ ] **3.2.1** Abrir `ios/App/App.xcworkspace`
- [ ] **3.2.2** Bundle identifier: `sv.gob.bfa.agropoly`
- [ ] **3.2.3** Display name: "AGROPOLY BFA"
- [ ] **3.2.4** Version: 1.0.0, Build: 1
- [ ] **3.2.5** Deployment target: iOS 14.0 (cubre 95% de iPhones activos en 2026)
- [ ] **3.2.6** Capabilities mínimas — solo "Background Modes: Audio" si se quiere música en segundo plano
- [ ] **3.2.7** Signing con cuenta Developer BFA

### 3.3 Assets nativos iOS

- [ ] **3.3.1** AppIcon set (todos los tamaños: 20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt marketing) generados desde `widget-bfa.png`
- [ ] **3.3.2** Launch screen storyboard con logo BFA centrado sobre fondo `#0D2B14`
- [ ] **3.3.3** Confirmar Info.plist con:
  - `NSAppTransportSecurity` permitiendo el dominio del server (HTTPS)
  - `UIRequiresFullScreen` = true para fullscreen game
  - `UISupportedInterfaceOrientations` = solo portrait (o ambas si layout lo soporta)

### 3.4 Testing en iPhone físico

- [ ] **3.4.1** Conectar iPhone con cable, trust developer cert
- [ ] **3.4.2** Run en device desde Xcode (NO simulador — el simulador no testea Rapier física fielmente)
- [ ] **3.4.3** Mismo smoke test que Fase 2.5
- [ ] **3.4.4** Validar Web Speech en Safari iOS — voces en español disponibles
- [ ] **3.4.5** TestFlight: subir build → invitar testers BFA → recolectar feedback

### 3.5 App Store Connect

- [ ] **3.5.1** Crear app en App Store Connect
- [ ] **3.5.2** Listing en español: nombre, subtítulo (30 chars), descripción (4000 chars), keywords (100 chars)
- [ ] **3.5.3** Screenshots **obligatorios**: iPhone 6.7" (1290×2796) + iPhone 6.5" (1242×2688) + iPad Pro 12.9" (2048×2732)
- [ ] **3.5.4** App preview video (opcional, alta conversión)
- [ ] **3.5.5** Privacy nutrition label: declarar qué datos colectamos (analytics, sessions) — ser **muy preciso**
- [ ] **3.5.6** Age rating: 4+ probable
- [ ] **3.5.7** Categoría: Educación primaria, Juegos secundaria
- [ ] **3.5.8** Submit for review

### 3.6 Apple Review — preparación para rechazos comunes

- [ ] **3.6.1** Tener listo **demo account** si se requiere login (no aplica si admin es solo para BFA interno — explicarlo en review notes)
- [ ] **3.6.2** Explicar en review notes que el `/admin/historias` es para uso interno BFA, no función end-user
- [ ] **3.6.3** Anticipar guideline 4.2 (mínima funcionalidad) — destacar contenido educativo único, no "solo wrapper de web"
- [ ] **3.6.4** Anticipar guideline 2.5.1 (APIs privadas) — Capacitor no usa, OK
- [ ] **3.6.5** Si rechazan, responder en máx 24h con fix o explicación

### 3.7 Entregable Fase 3

- ✅ App publicada en App Store con presencia institucional BFA
- ✅ Instalada en iPhones internos BFA
- ✅ TestFlight activo para nuevas versiones

---

## Fase 4 — Optimizaciones post-lanzamiento

**Cuando ambas stores publiquen, agregar features que requieren versión nativa.**

**Duración**: continuo, en sprints separados según prioridad.

### 4.1 Notificaciones push (opcional)

- [ ] **4.1.1** `@capacitor/push-notifications` + Firebase Cloud Messaging (Android) + APNs (iOS)
- [ ] **4.1.2** Backend endpoint para registrar device tokens
- [ ] **4.1.3** Triggers: "¡Vení a jugar el torneo del sábado!", "Tu logro está cerca", "Nueva historia disponible"
- [ ] **4.1.4** Permisos opt-in respetuosos, no spam

### 4.2 Compartir resultado de partida

- [ ] **4.2.1** Al ganar, botón "Compartí tu victoria" usando `@capacitor/share`
- [ ] **4.2.2** Genera imagen del resultado (canvas API) con logo BFA + stats
- [ ] **4.2.3** Comparte por WhatsApp, Telegram, social

### 4.3 Modo offline mejorado

- [ ] **4.3.1** Modo solo offline-first (partidas con AI sin server)
- [ ] **4.3.2** Sync de resultados cuando vuelva la conexión
- [ ] **4.3.3** Cache de Historias del Campo descargado en primer launch

### 4.4 Analytics nativo

- [ ] **4.4.1** Firebase Analytics o Plausible para tracking de uso (con consentimiento GDPR-style)
- [ ] **4.4.2** Eventos: instalación, primera partida, retención D1/D7/D30, capítulos de historia vistos
- [ ] **4.4.3** Dashboard BFA con métricas mensuales

### 4.5 Soporte offline de PWA

- [ ] **4.5.1** Mejorar service worker para cachear más assets críticos
- [ ] **4.5.2** Mostrar UI clara cuando no hay conexión (en lugar de error genérico)
- [ ] **4.5.3** Cola de actions para sincronizar al volver online (analytics)

---

## Riesgos identificados y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Apple rechaza por "mínima funcionalidad" (guideline 4.2) | Media | Alto | Destacar contenido educativo BFA único en review notes, mostrar que NO es solo wrapper web |
| Performance 3D pobre en gama baja Android | Media | Medio | Detección de device tier en Fase 1.5, fallback a calidad reducida |
| Web Speech sin voces español en algún device | Alta | Bajo | VoiceSettingsButton ya muestra guía install; en mobile fallback a TTS nativo via plugin `@capacitor-community/text-to-speech` |
| Build iOS bloquea proyecto por falta de Mac | Alta si BFA no tiene Mac | Alto | Contratar EAS Build (~$30/mes) o servicio Codemagic; alternativa: solo Android primera versión |
| Costos Apple Developer no aprobados por BFA | Media | Medio | Comenzar con PWA + Play Store; sumar iOS cuando haya budget |
| Política de privacidad incompleta bloquea publicación | Media | Alto | Coordinar **antes** con legal BFA — privacy policy URL pública requerida |
| Cambios de versión web rompen versión móvil | Baja-media | Medio | Pipeline CI/CD que corre tests E2E mobile antes de release |

---

## Cronograma indicativo

```
Semana 1     Pre-requisitos (validar versión web, decisiones BFA)
Semana 2-3   Fase 1: PWA polish + testing devices reales
Semana 4-5   Fase 2: Capacitor Android + Play Store submission
Semana 6     Espera review Google + fix de feedback
Semana 7-8   Fase 3: iOS Capacitor + Xcode + App Store submission
Semana 9-10  Espera review Apple + fix de feedback
Semana 11+   Fase 4: features mobile-only según prioridad
```

**Total hasta tener app en ambas tiendas**: ~10 semanas (2.5 meses) con 1 dev parcial + coordinación BFA.

---

## Estimación de esfuerzo

| Fase | Dev hours | Coordinación BFA hours |
|------|-----------|------------------------|
| Fase 0 (pre-requisitos) | 4 | 16 |
| Fase 1 (PWA) | 24 | 4 |
| Fase 2 (Android) | 16 | 8 (Play Console + assets) |
| Fase 3 (iOS) | 24 | 12 (Apple Dev + assets + privacy) |
| Fase 4 (post) | continuo | continuo |
| **Total inicial** | **~68h dev** | **~40h BFA** |

---

## Costos recurrentes

| Item | Costo | Frecuencia |
|------|-------|------------|
| Apple Developer Program | $99 USD | Anual |
| Google Play Developer | $25 USD | Único |
| EAS Build / Codemagic (si no hay Mac) | $30 USD/mes | Mensual mientras se usa |
| Hosting server backend (Railway/Fly) | $5-20 USD/mes | Mensual |
| Hosting estático web (Vercel free tier) | $0 | — |
| Sentry error tracking (free tier) | $0 hasta 5k errors/mes | — |
| **Total año 1 mínimo** | **~$150 USD** | — |
| **Total año 1 con cloud build iOS** | **~$510 USD** | — |

---

## Criterios de éxito

**Fase 1 OK si**:
- PWA install rate ≥ 20% de visitantes web mobile
- Lighthouse PWA score ≥ 90
- Crash-free sessions ≥ 99% en al menos 6 devices testeados

**Fase 2 OK si**:
- App publicada en Play Store
- ≥ 100 instalaciones en primeros 30 días (vía marketing BFA)
- Rating Play Store ≥ 4.0 ⭐

**Fase 3 OK si**:
- App publicada en App Store
- Apple review aprueba en primera o segunda iteración
- Rating App Store ≥ 4.0 ⭐

**Fase 4 OK si**:
- Retención D7 ≥ 30%
- Sesión promedio ≥ 8 minutos
- Al menos 1 capítulo de Historias visto por usuario activo

---

## Documentos relacionados

- `INSTALL.md` — instalación versión web (esta es la base)
- `AGROPOLY_CONTEXT.md` — contexto maestro del proyecto
- `AGROPOLY_ADRs.md` — decisiones arquitectónicas

---

**Próxima acción cuando se autorice**: revisar y aprobar Pre-requisitos (Fase 0) con stakeholders BFA antes de arrancar Fase 1.
