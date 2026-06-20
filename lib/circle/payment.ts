import { listWallets, getBalance } from './wallet'
import { payService } from './services'
import { networkConfig } from '@/lib/network'

export type PayResult = {
  data: string
  receipt: string
  cost: string
}

export type WalletBalance = {
  address: string
  usdc: number
}

const MOCK_WALLET = '0xdf907eaaca1a7996ee248dd7f51dd240cba08ec9'

function mockReceipt(): string {
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
}

export async function getAgentWalletAddress(): Promise<string> {
  const envAddress = process.env.AGENT_WALLET_ADDRESS?.trim()
  if (envAddress) return envAddress
  const wallets = await listWallets()
  const address = wallets[0]?.address
  if (!address) throw new Error('No Circle agent wallet found. Run: circle wallet login <email>')
  return address
}

export async function getWalletBalance(): Promise<WalletBalance> {
  if (process.env.USE_MOCK === 'true') {
    return { address: MOCK_WALLET, usdc: 5.0 }
  }

  const { circleChain } = networkConfig()
  const address = await getAgentWalletAddress()
  const balance = await getBalance({ address, chain: circleChain })
  const usdcToken = balance.tokens.find(t => t.symbol === 'USDC')
  return { address, usdc: parseFloat(usdcToken?.amount ?? '0') }
}

export async function payForService(
  url: string,
  body: Record<string, unknown>
): Promise<PayResult> {
  if (process.env.USE_MOCK === 'true') {
    // In mock mode, call the local endpoint directly (no payment)
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Search endpoint returned ${res.status}`)
    const data = await res.text()
    return { data, receipt: mockReceipt(), cost: '0.001' }
  }

  const { circleChain } = networkConfig()
  const address = await getAgentWalletAddress()
  const result = await payService({ url, address, data: body, method: 'POST', chain: circleChain })
  return {
    data: result.response,
    receipt: result.txHash ?? '',
    cost: result.amount,
  }
}
