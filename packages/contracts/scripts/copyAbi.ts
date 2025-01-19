import * as fs from 'fs'
import * as path from 'path'

function copyAbi() {
  // Ruta origen (en contracts)
  const sourcePath = path.join(__dirname, '../src/abis/RoundManagerABI.ts')
  
  // Ruta destino (en client)
  const targetPath = path.join(__dirname, '../../../client/config/abis/RoundManager.ts')
  
  // Leer el archivo fuente
  const sourceContent = fs.readFileSync(sourcePath, 'utf8')
  
  // Escribir en el destino
  fs.writeFileSync(targetPath, sourceContent)
  
  console.log('ABI copied successfully to client')
}

copyAbi() 