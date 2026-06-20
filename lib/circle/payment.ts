import { createPublicClient, http, formatUnits } from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { x402Client, x402HTTPClient } from '@x402/core/client'
import { registerExactEvmScheme } from '@x402/evm/exact/client'
import { listWallets } from './wallet'
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

const USDC_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const

function mockReceipt(): string {
  return `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
}

function getViemChain() {
  const { circleChain } = networkConfig()
  return circleChain === 'BASE-SEPOLIA' ? baseSepolia : base
}

function buildX402HttpClient() {
  const rawKey = process.env.AGENT_WALLET_PRIVATE_KEY
  if (!rawKey) throw new Error('AGENT_WALLET_PRIVATE_KEY is not set')

  const privateKey = (rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`) as `0x${string}`
  const account = privateKeyToAccount(privateKey)

  const client = new x402Client()
  registerExactEvmScheme(client, { signer: account })
  return new x402HTTPClient(client)
}

let _httpClient: x402HTTPClient | null = null
function getX402HttpClient(): x402HTTPClient {
  if (!_httpClient) _httpClient = buildX402HttpClient()
  return _httpClient
}

function extractReceipt(headers: Headers): string {
  const header =
    headers.get('PAYMENT-RESPONSE') ??
    headers.get('payment-response') ??
    headers.get('X-PAYMENT-RESPONSE') ??
    ''
  if (!header) return ''
  try {
    const decoded = JSON.parse(Buffer.from(header, 'base64').toString('utf8')) as Record<string, unknown>
    return (decoded.transaction ?? decoded.txHash ?? header) as string
  } catch {
    return header
  }
}

export async function getAgentWalletAddress(): Promise<string> {
  const envAddress = process.env.AGENT_WALLET_ADDRESS?.trim()
  if (envAddress) return envAddress
  const wallets = await listWallets()
  const address = wallets[0]?.address
  if (!address) throw new Error('No agent wallet found — set AGENT_WALLET_ADDRESS or AGENT_WALLET_PRIVATE_KEY')
  return address
}

export async function getWalletBalance(): Promise<WalletBalance> {
  if (process.env.USE_MOCK === 'true') {
    return { address: MOCK_WALLET, usdc: 5.0 }
  }

  const { usdcAddress } = networkConfig()
  const address = await getAgentWalletAddress()
  const publicClient = createPublicClient({ chain: getViemChain(), transport: http() })
  const raw = await publicClient.readContract({
    address: usdcAddress as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  })
  return { address, usdc: parseFloat(formatUnits(raw, 6)) }
}

export async function payForService(
  url: string,
  body: Record<string, unknown>
): Promise<PayResult> {
  if (process.env.USE_MOCK === 'true') {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Search endpoint returned ${res.status}`)
    const data = await res.text()
    return { data, receipt: mockReceipt(), cost: '0.01' }
  }

  const httpClient = getX402HttpClient()

  // Probe: expect a 402 with payment requirements in the PAYMENT-REQUIRED header
  const probe = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (probe.ok) {
    const data = await probe.text()
    return { data, receipt: '', cost: '0' }
  }

  if (probe.status !== 402) {
    const text = await probe.text()
    throw new Error(`Search endpoint returned ${probe.status}: ${text}`)
  }

  // Parse 402 challenge (v2: from header; v1: from body)
  let bodyForV1: unknown
  try { bodyForV1 = await probe.json() } catch { /* v2 has empty body */ }
  const paymentRequired = httpClient.getPaymentRequiredResponse(
    (name) => probe.headers.get(name),
    bodyForV1,
  )

  // Sign the payment payload
  const paymentPayload = await httpClient.createPaymentPayload(paymentRequired)
  const paymentHeaders = httpClient.encodePaymentSignatureHeader(paymentPayload)

  // Retry with payment signature
  const paid = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...paymentHeaders },
    body: JSON.stringify(body),
  })

  if (!paid.ok) {
    const text = await paid.text()
    throw new Error(`Search endpoint returned ${paid.status} after payment: ${text}`)
  }

  const data = await paid.text()
  const receipt = extractReceipt(paid.headers)

  return { data, receipt, cost: '0.01' }
}
