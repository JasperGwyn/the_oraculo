# Bitácora del Proyecto

## 2024-01-03 10:30

### Objetivo de la sesión
Documentar el proceso para clonar un proyecto y comenzar con un historial limpio usando una rama huérfana en Git.

### Desafíos encontrados
- Necesidad de mantener el código actual pero comenzar con un historial de commits limpio
- Evitar cargar todo el historial de commits antiguos al clonar el repositorio

### Solución propuesta y pasos
1. Clonar el repositorio normalmente:
   ```bash
   git clone <url-repositorio>
   ```
2. Crear una rama huérfana (sin historia):
   ```bash
   git checkout --orphan nueva-rama-limpia
   ```
3. Agregar todos los archivos actuales:
   ```bash
   git add .
   ```
4. Realizar el commit inicial:
   ```bash
   git commit -m "feat: commit inicial"
   ```
5. Eliminar la rama main actual:
   ```bash
   git branch -D main
   ```
6. Renombrar la rama huérfana a main:
   ```bash
   git branch -m main
   ```
7. Forzar el push al remoto:
   ```bash
   git push -f origin main
   ```

### Razón o explicación
Esta solución funciona porque:
1. La rama huérfana no hereda ningún historial previo
2. Se mantiene todo el código actual pero con un historial limpio
3. El repositorio comienza desde cero pero con el estado actual del código
4. Es útil para proyectos que quieren mantener el código pero reiniciar su historial

### Próximos pasos / Reflexiones
- Asegurarse de que todos los colaboradores estén al tanto del cambio
- Considerar hacer un backup del historial antiguo si fuera necesario
- Documentar esta práctica en la guía de contribución del proyecto

## 2024-12-28 15:45

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

## 2024-12-25 17:45

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

## 2024-12-29 00:45

### Objetivo de la sesión
Establecer el formato correcto del ABI para que funcione con Wagmi y AppKit, específicamente para el contrato RoundManager.

### Desafíos encontrados
- El ABI en formato JSON completo no funcionaba correctamente con Wagmi
- Errores de tipo al intentar usar el ABI con las funciones de escritura del contrato
- Discrepancia entre el formato del ABI en `RoundManager.ts` y el formato que funcionaba en `test2/abi.ts`

### Solución propuesta y pasos
1. Simplificar el formato del ABI para que sea más conciso y tipado:
   ```typescript
   export const RoundManagerABI = [
     {
       name: 'placeBet',
       type: 'function',
       stateMutability: 'payable',
       inputs: [
         { name: 'roundId', type: 'uint256' },
         { name: 'team', type: 'uint8' }
       ],
       outputs: []
     },
     // ... otras funciones siguiendo el mismo formato
   ] as const
   ```

2. Asegurar que cada función del ABI tenga:
   - `name`: nombre exacto de la función
   - `type`: 'function'
   - `stateMutability`: 'pure', 'view', 'payable', etc.
   - `inputs`: array de parámetros con nombre y tipo
   - `outputs`: array de valores de retorno con tipo

3. Agregar `as const` al final del array para asegurar que TypeScript infiera los tipos correctamente

### Razón o explicación
La solución funciona porque:
1. El formato simplificado es más fácil de mantener y menos propenso a errores
2. La aserción `as const` permite a TypeScript inferir tipos literales, lo que mejora el tipado
3. El formato coincide con lo que Wagmi espera internamente
4. Los tipos de datos están correctamente mapeados entre Solidity y TypeScript

### Próximos pasos / Reflexiones
- Documentar todos los tipos de datos soportados y sus equivalencias
- Considerar crear un script para generar el ABI automáticamente desde el contrato
- Evaluar si se necesitan tipos más específicos para ciertos parámetros
- Mantener sincronizado el ABI con cualquier cambio en el contrato

## 2024-01-04 11:30

### Objetivo de la sesión
Resolver el problema de restauración automática del scroll en la navegación entre páginas, específicamente cuando se vuelve a la página principal desde una página de detalle de ronda.

### Desafíos encontrados
- Al volver a la página principal, el scroll se restauraba a la posición anterior
- El comportamiento persistía incluso después de intentar resetear el scroll manualmente con `window.scrollTo(0, 0)`
- El problema ocurría tanto en navegación normal como al recargar la página (F5)

### Solución propuesta y pasos
1. Identificar que el problema era causado por el comportamiento por defecto del navegador de restaurar la posición del scroll
2. Modificar el componente principal (`page.tsx`) para desactivar la restauración automática:
   ```typescript
   useEffect(() => {
     // Disable scroll restoration
     if ('scrollRestoration' in history) {
       history.scrollRestoration = 'manual'
     }
     
     window.scrollTo(0, 0)
   }, [])
   ```

### Razón o explicación
La solución funciona porque:
1. `history.scrollRestoration = 'manual'` desactiva el comportamiento automático del navegador de restaurar la posición del scroll
2. Al establecerlo en 'manual', tenemos control total sobre la posición del scroll
3. El `useEffect` asegura que esto se aplique cada vez que se monta el componente
4. `window.scrollTo(0, 0)` ahora funciona efectivamente ya que el navegador no sobrescribe la posición

### Próximos pasos / Reflexiones
- Considerar si este comportamiento debería aplicarse a otras páginas de la aplicación
- Documentar esta solución en la guía de desarrollo para futuros casos similares
- Evaluar si hay casos específicos donde querríamos mantener la posición del scroll