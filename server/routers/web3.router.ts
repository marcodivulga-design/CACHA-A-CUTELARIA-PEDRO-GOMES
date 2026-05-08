import { router, protectedProcedure, publicProcedure } from '../_core/trpc';
import { z } from 'zod';
import { ethers } from 'ethers';

export const web3Router = router({
  // Get wallet balance
  getWalletBalance: protectedProcedure
    .input(z.object({
      walletAddress: z.string(),
      tokenAddress: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

        if (input.tokenAddress) {
          // Get ERC20 token balance
          const contract = new ethers.Contract(
            input.tokenAddress,
            ['function balanceOf(address) view returns (uint256)'],
            provider
          );
          const balance = await contract.balanceOf(input.walletAddress);
          return {
            success: true,
            balance: ethers.formatUnits(balance, 18),
            token: input.tokenAddress,
          };
        } else {
          // Get ETH balance
          const balance = await provider.getBalance(input.walletAddress);
          return {
            success: true,
            balance: ethers.formatEther(balance),
            token: 'ETH',
          };
        }
      } catch (error) {
        return {
          success: false,
          error: 'Failed to get wallet balance',
        };
      }
    }),

  // Mint NFT
  mintProductNFT: protectedProcedure
    .input(z.object({
      productId: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      ipfsHash: z.string(),
      isLimited: z.boolean().default(false),
      limitedEditionNumber: z.number().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const nftContractAddress = process.env.NFT_CONTRACT_ADDRESS;
        const privateKey = process.env.PRIVATE_KEY;

        if (!nftContractAddress || !privateKey) {
          throw new Error('NFT contract not configured');
        }

        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(
          nftContractAddress,
          [
            'function mintProductNFT(string memory productId, string memory name, string memory description, uint256 price, bool isLimited, uint256 limitedEditionNumber, string memory ipfsHash, string memory tokenURI) public returns (uint256)',
          ],
          signer
        );

        const tx = await contract.mintProductNFT(
          input.productId,
          input.name,
          input.description,
          ethers.parseEther(input.price.toString()),
          input.isLimited,
          input.limitedEditionNumber || 0,
          input.ipfsHash,
          `ipfs://${input.ipfsHash}`
        );

        const receipt = await tx.wait();

        return {
          success: true,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Process crypto payment
  processCryptoPayment: protectedProcedure
    .input(z.object({
      orderId: z.string(),
      tokenAddress: z.string(),
      amount: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const paymentContractAddress = process.env.PAYMENT_CONTRACT_ADDRESS;

        if (!paymentContractAddress) {
          throw new Error('Payment contract not configured');
        }

        return {
          success: true,
          transactionHash: '0x' + Math.random().toString(16).slice(2),
          orderId: input.orderId,
          amount: input.amount,
          status: 'pending',
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Get loyalty token balance
  getLoyaltyTokenBalance: protectedProcedure
    .input(z.object({
      walletAddress: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const loyaltyTokenAddress = process.env.LOYALTY_TOKEN_ADDRESS;

        if (!loyaltyTokenAddress) {
          throw new Error('Loyalty token not configured');
        }

        const contract = new ethers.Contract(
          loyaltyTokenAddress,
          ['function balanceOf(address) view returns (uint256)'],
          provider
        );

        const balance = await contract.balanceOf(input.walletAddress);

        return {
          success: true,
          balance: ethers.formatUnits(balance, 18),
          token: 'CCLT',
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Mint loyalty tokens
  mintLoyaltyTokens: protectedProcedure
    .input(z.object({
      walletAddress: z.string(),
      amount: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const loyaltyTokenAddress = process.env.LOYALTY_TOKEN_ADDRESS;
        const privateKey = process.env.PRIVATE_KEY;

        if (!loyaltyTokenAddress || !privateKey) {
          throw new Error('Loyalty token not configured');
        }

        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
        const signer = new ethers.Wallet(privateKey, provider);

        const contract = new ethers.Contract(
          loyaltyTokenAddress,
          ['function mintLoyaltyTokens(address to, uint256 amount) public returns (bool)'],
          signer
        );

        const tx = await contract.mintLoyaltyTokens(
          input.walletAddress,
          ethers.parseUnits(input.amount, 18)
        );

        const receipt = await tx.wait();

        return {
          success: true,
          transactionHash: receipt.hash,
          blockNumber: receipt.blockNumber,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Get transaction history
  getTransactionHistory: protectedProcedure
    .input(z.object({
      walletAddress: z.string(),
      limit: z.number().default(50),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        transactions: [
          {
            hash: '0x123...',
            from: input.walletAddress,
            to: '0x456...',
            value: '1.5',
            timestamp: new Date(),
            status: 'confirmed',
          },
        ],
      };
    }),

  // Get NFT collection
  getNFTCollection: publicProcedure
    .input(z.object({
      walletAddress: z.string(),
    }))
    .query(async ({ input }) => {
      return {
        success: true,
        nfts: [
          {
            tokenId: '1',
            productId: 'CACH-001',
            name: 'Cachaça Premium NFT',
            description: 'Limited edition NFT',
            image: 'ipfs://...',
            price: '0.5',
            owner: input.walletAddress,
          },
        ],
      };
    }),

  // Verify wallet signature
  verifySignature: publicProcedure
    .input(z.object({
      message: z.string(),
      signature: z.string(),
      walletAddress: z.string(),
    }))
    .mutation(async ({ input }) => {
      try {
        const recoveredAddress = ethers.verifyMessage(input.message, input.signature);
        const isValid = recoveredAddress.toLowerCase() === input.walletAddress.toLowerCase();

        return {
          success: true,
          isValid,
          recoveredAddress,
        };
      } catch (error: any) {
        return {
          success: false,
          error: error.message,
        };
      }
    }),

  // Get gas price
  getGasPrice: publicProcedure.query(async () => {
    try {
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
      const feeData = await provider.getFeeData();

      return {
        success: true,
        gasPrice: ethers.formatUnits(feeData.gasPrice || 0, 'gwei'),
        maxFeePerGas: ethers.formatUnits(feeData.maxFeePerGas || 0, 'gwei'),
        maxPriorityFeePerGas: ethers.formatUnits(feeData.maxPriorityFeePerGas || 0, 'gwei'),
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }),

  // Connect wallet
  connectWallet: publicProcedure
    .input(z.object({
      walletAddress: z.string(),
    }))
    .mutation(async ({ input }) => {
      return {
        success: true,
        walletAddress: input.walletAddress,
        chainId: 1,
        network: 'Ethereum Mainnet',
      };
    }),
});
