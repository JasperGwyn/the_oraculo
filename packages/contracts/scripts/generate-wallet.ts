import { ethers } from "ethers";

async function main() {
    // Generar una nueva wallet aleatoria
    const wallet = ethers.Wallet.createRandom();
    
    console.log("\n=== Nueva Wallet Generada ===");
    console.log(`Dirección: ${wallet.address}`);
    console.log(`Clave Privada: ${wallet.privateKey}`);
    console.log(`Frase Mnemónica: ${wallet.mnemonic?.phrase}`);
    console.log("\n⚠️  IMPORTANTE: Guarda esta información de forma segura!");
    console.log("No compartas tu clave privada ni frase mnemónica con nadie.");
    console.log("\nPara usar esta wallet:");
    console.log("1. Guarda la clave privada en tu .env como MODE_PRIVATE_KEY");
    console.log("2. Importa la frase mnemónica en MetaMask");
    console.log("3. Obtén MODE tokens de testnet del faucet");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 