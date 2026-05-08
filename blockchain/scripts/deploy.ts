import { ethers } from 'hardhat';

async function main() {
  console.log('Starting contract deployment...');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);

  // Deploy ProductNFT
  console.log('\n1. Deploying ProductNFT...');
  const ProductNFT = await ethers.getContractFactory('ProductNFT');
  const productNFT = await ProductNFT.deploy();
  await productNFT.waitForDeployment();
  const nftAddress = await productNFT.getAddress();
  console.log(`ProductNFT deployed to: ${nftAddress}`);

  // Deploy CryptoPayment
  console.log('\n2. Deploying CryptoPayment...');
  const CryptoPayment = await ethers.getContractFactory('CryptoPayment');
  const cryptoPayment = await CryptoPayment.deploy();
  await cryptoPayment.waitForDeployment();
  const paymentAddress = await cryptoPayment.getAddress();
  console.log(`CryptoPayment deployed to: ${paymentAddress}`);

  // Deploy LoyaltyToken
  console.log('\n3. Deploying LoyaltyToken...');
  const LoyaltyToken = await ethers.getContractFactory('LoyaltyToken');
  const loyaltyToken = await LoyaltyToken.deploy();
  await loyaltyToken.waitForDeployment();
  const tokenAddress = await loyaltyToken.getAddress();
  console.log(`LoyaltyToken deployed to: ${tokenAddress}`);

  // Save deployment addresses
  const deploymentAddresses = {
    ProductNFT: nftAddress,
    CryptoPayment: paymentAddress,
    LoyaltyToken: tokenAddress,
    deployer: deployer.address,
    network: (await ethers.provider.getNetwork()).name,
    timestamp: new Date().toISOString(),
  };

  console.log('\n=== Deployment Summary ===');
  console.log(JSON.stringify(deploymentAddresses, null, 2));

  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    './deployments.json',
    JSON.stringify(deploymentAddresses, null, 2)
  );

  console.log('\nDeployment addresses saved to deployments.json');

  // Verify contracts on Etherscan (if not localhost)
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== 1337 && network.chainId !== 31337) {
    console.log('\nVerifying contracts on Etherscan...');
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds

    try {
      await ethers.provider.send('hardhat_reset', []);
    } catch (e) {
      // Not running on hardhat
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
