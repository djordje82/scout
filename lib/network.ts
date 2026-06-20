import type { Chain } from './circle/chains'

type NetworkConfig = {
  caip2: `${string}:${string}`
  circleChain: Chain
  usdcAddress: string
  blockExplorer: string
  label: string
}

const MAINNET: NetworkConfig = {
  caip2:         'eip155:8453',
  circleChain:   'BASE',
  usdcAddress:   '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  blockExplorer: 'https://basescan.org',
  label:         'Base',
}

const TESTNET: NetworkConfig = {
  caip2:         'eip155:84532',
  circleChain:   'BASE-SEPOLIA',
  usdcAddress:   '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
  blockExplorer: 'https://sepolia.basescan.org',
  label:         'Base Sepolia',
}

export function networkConfig(): NetworkConfig {
  return process.env.NETWORK === 'testnet' ? TESTNET : MAINNET
}
