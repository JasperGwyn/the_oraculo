# Bitácora del Proyecto

## 2024-01-09 15:45

### Objetivo de la sesión
Resolver el problema de conexión de la billetera a través de AppKit y Wagmi, específicamente el error "connection.connector.getChainId is not a function" que impedía la interacción con el contrato RoundManager.

### Desafíos encontrados
- Error al intentar obtener el chainId de la conexión: "connection.connector.getChainId is not a function"
- Configuración incorrecta de la integración entre AppKit y Wagmi
- Problemas con la variable de entorno del Project ID de Reown
- Discrepancia entre la configuración estándar de Wagmi y la requerida por AppKit

### Solución propuesta y pasos
1. Se modificó la configuración de Wagmi para usar el adaptador oficial de AppKit:
   ```typescript
   import { cookieStorage, createStorage } from '@wagmi/core'
   import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
   import { modeNetwork } from './chains'

   const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

   export const wagmiAdapter = new WagmiAdapter({
     storage: createStorage({
       storage: cookieStorage
     }),
     ssr: true,
     projectId,
     networks: [modeNetwork]
   })

   export const config = wagmiAdapter.wagmiConfig
   ```

2. Se aseguró que el Project ID estuviera correctamente configurado en las variables de entorno
3. Se implementó el manejo de cookies para el almacenamiento (recomendado para Next.js)
4. Se habilitó el soporte SSR en la configuración

### Razón o explicación
La solución funciona porque:
1. AppKit requiere una configuración específica a través de su adaptador de Wagmi
2. El adaptador maneja internamente la conexión con la billetera y el cambio de red
3. El uso de cookies para el almacenamiento evita problemas de hidratación en Next.js
4. La configuración de SSR asegura que la aplicación funcione correctamente tanto en el servidor como en el cliente

### Próximos pasos / Reflexiones
- Implementar manejo de errores más robusto para problemas de conexión
- Considerar agregar soporte para múltiples redes
- Documentar el proceso de configuración para futuros desarrolladores
- Evaluar la necesidad de implementar un sistema de reconexión automática
- Considerar agregar tests para verificar la integración con AppKit

## 2024-01-09 17:45

### Objetivo de la sesión
Implementar la funcionalidad de conexión de wallet usando Reown AppKit en el proyecto Next.js. https://docs.reown.com/appkit/next/core/installation

### Desafíos encontrados
- Confusión inicial al intentar consolidar la configuración de WalletConnect en un solo archivo
- Errores de tipado y problemas con la estructura del proyecto al no seguir exactamente la documentación
- Inconsistencias entre las networks definidas en diferentes archivos de configuración
- El botón de conexión no funcionaba inicialmente debido a una implementación incorrecta

### Solución propuesta y pasos
0. Instalar la opción Next.js y WAGMI
1. Seguir estrictamente la estructura de archivos propuesta en la documentación:
   - `config/index.tsx` para la configuración de Wagmi
   - `context/index.tsx` para el provider de React con AppKit
   - `components/AuthButton.tsx` para el botón de conexión
2. Mantener la separación de responsabilidades:
   - Configuración base en `config/index.tsx` (sin 'use client')
   - Lógica del provider en `context/index.tsx` (con 'use client')
3. Utilizar el web component `<appkit-button />` directamente en lugar de crear una implementación personalizada
4. Asegurar consistencia en la configuración de networks entre archivos

### Razón o explicación
La solución funciona porque:
1. Respeta la arquitectura de Next.js separando código del cliente y del servidor
2. Mantiene una clara separación de responsabilidades entre configuración y componentes
3. Aprovecha los web components oficiales de AppKit que ya están optimizados y probados
4. Evita problemas de hidratación al manejar correctamente el estado del lado del cliente

### Próximos pasos / Reflexiones
- Importante: Para implementaciones de wallet, es mejor seguir la documentación paso a paso manualmente en lugar de delegar la tarea a un asistente
- Pendiente: Verificar que la configuración de networks sea la correcta para el proyecto
- Considerar: Agregar manejo de errores y estados de carga en el proceso de conexión
- Documentar: Crear una guía de uso para el equipo sobre cómo interactuar con la wallet