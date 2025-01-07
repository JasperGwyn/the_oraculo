import { ethers, run } from "hardhat";

async function main() {
  console.log("Deploying RoundManager...");

  const RoundManager = await ethers.getContractFactory("RoundManager");
  const roundManager = await RoundManager.deploy();

  await roundManager.waitForDeployment();

  const contractAddress = await roundManager.getAddress();
  console.log(`RoundManager deployed to ${contractAddress}`);

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