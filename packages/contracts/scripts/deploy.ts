import { run } from "hardhat";
import { getContractFactory } from "@nomicfoundation/hardhat-ethers/types";
import * as fs from 'fs';
import * as path from 'path';

async function updateAddresses(newAddress: string) {
  // Actualizar .env
  const envPath = path.join(__dirname, '../../../.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  const addressRegex = /^ROUNDMANAGER_ADDRESS=.+$/m;
  const currentLine = envContent.match(addressRegex)?.[0];
  
  if (currentLine) {
    const newLine = `ROUNDMANAGER_ADDRESS=${newAddress} #nuevo ${currentLine.split('=')[1]}`;
    envContent = envContent.replace(addressRegex, newLine);
  } else {
    envContent += `\nROUNDMANAGER_ADDRESS=${newAddress}`;
  }
  fs.writeFileSync(envPath, envContent);
  
  // Actualizar .env.local
  const envLocalPath = path.join(__dirname, '../../../client/.env.local');
  let envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
  const localAddressRegex = /^NEXT_PUBLIC_ROUNDMANAGER_ADDRESS=.+$/m;
  const currentLocalLine = envLocalContent.match(localAddressRegex)?.[0];
  
  if (currentLocalLine) {
    const newLocalLine = `NEXT_PUBLIC_ROUNDMANAGER_ADDRESS=${newAddress} #nuevo ${currentLocalLine.split('=')[1]}`;
    envLocalContent = envLocalContent.replace(localAddressRegex, newLocalLine);
  } else {
    envLocalContent += `\nNEXT_PUBLIC_ROUNDMANAGER_ADDRESS=${newAddress}`;
  }
  fs.writeFileSync(envLocalPath, envLocalContent);
  
  console.log(`Updated contract addresses in .env and .env.local`);
}

async function main() {
  console.log("Deploying RoundManager...");

  const RoundManager = await getContractFactory("RoundManager");
  const roundManager = await RoundManager.deploy();

  await roundManager.waitForDeployment();

  const contractAddress = await roundManager.getAddress();
  console.log(`RoundManager deployed to ${contractAddress}`);

  // Actualizar archivos con la nueva dirección
  await updateAddresses(contractAddress);

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