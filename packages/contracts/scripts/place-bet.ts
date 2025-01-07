import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { RoundManager } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";

dotenv.config({ path: '../../.env' });

async function main() {
  try {
    // Configuración
    const roundId = 1; // ID de la ronda en la que quieres apostar
    const team = 1; // 1 para Yes, 2 para No
    const betAmount = ethers.parseEther("0.00000001"); // Cantidad a apostar en ETH

    // Conectar al contrato
    const contractAddress = process.env.ROUNDMANAGER_ADDRESS;
    if (!contractAddress) throw new Error("ROUNDMANAGER_ADDRESS no encontrada en .env");

    // Obtener el signer (wallet)
    const [signer] = await ethers.getSigners();
    console.log("Usando wallet:", signer.address);

    // Verificar balance de ETH
    const balance = await signer.provider.getBalance(signer.address);
    console.log("Balance de ETH:", ethers.formatEther(balance), "ETH");

    const RoundManagerFactory = await ethers.getContractFactory("RoundManager");
    const contract = RoundManagerFactory.attach(contractAddress).connect(signer) as RoundManager;

    console.log(`Contrato RoundManager en: ${contractAddress}`);
    console.log(`Apostando ${ethers.formatEther(betAmount)} ETH en el equipo ${team === 1 ? 'Yes' : 'No'} para la ronda ${roundId}`);

    // Realizar la apuesta
    const tx = await contract.placeBet(roundId, team, { 
      value: betAmount,
      gasLimit: 300000 // Establecemos un límite de gas explícito
    }) as ContractTransactionResponse;
    console.log("Transacción enviada:", tx.hash);

    // Esperar confirmación
    const receipt = await tx.wait();
    if (!receipt) {
      throw new Error("No se recibió confirmación de la transacción");
    }
    console.log("Apuesta confirmada en el bloque:", receipt.blockNumber);
    console.log("Gas usado:", receipt.gasUsed.toString());

    // Verificar nuevo balance
    const newBalance = await signer.provider.getBalance(signer.address);
    console.log("Nuevo balance de ETH:", ethers.formatEther(newBalance), "ETH");

  } catch (error: any) {
    console.error("Error:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  }); 