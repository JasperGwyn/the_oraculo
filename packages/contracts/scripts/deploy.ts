import { ethers, run } from "hardhat";
import * as fs from 'fs';
import * as path from 'path';

async function updateEnvLocal(newAddress: string) {
  const envPath = path.join(__dirname, '../../../client/.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Buscar la línea actual de NEXT_PUBLIC_ROUNDMANAGER_ADDRESS
  const addressRegex = /^NEXT_PUBLIC_ROUNDMANAGER_ADDRESS=.+$/m;
  const currentLine = envContent.match(addressRegex)?.[0];

  if (currentLine) {
    // Si ya existe una dirección, actualizarla y mantener la anterior como comentario
    const newLine = `NEXT_PUBLIC_ROUNDMANAGER_ADDRESS=${newAddress} #nuevo ${currentLine.split('=')[1]}`;
    envContent = envContent.replace(addressRegex, newLine);
  } else {
    // Si no existe, agregarla
    envContent += `\nNEXT_PUBLIC_ROUNDMANAGER_ADDRESS=${newAddress}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`Updated .env.local with new contract address`);
}

async function main() {
  console.log("Deploying RoundManager...");

  const RoundManager = await ethers.getContractFactory("RoundManager");
  const roundManager = await RoundManager.deploy();

  await roundManager.waitForDeployment();

  const contractAddress = await roundManager.getAddress();
  console.log(`RoundManager deployed to ${contractAddress}`);

  // Actualizar .env.local
  await updateEnvLocal(contractAddress);

  // Esperar unos bloques antes de verificar
  console.log("Esperando unos bloques antes de verificar...");
  await new Promise(resolve => setTimeout(resolve, 30000)); // 30 segundos

  // Verificar el contrato
  console.log("Verificando contrato...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });
    console.log("Contrato verificado exitosamente");
  } catch (error: any) {
    if (error.message.includes("Already Verified")) {
      console.log("El contrato ya está verificado");
    } else {
      console.error("Error al verificar:", error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});