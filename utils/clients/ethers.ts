import { providers } from 'ethers'
import { RPC_URL, L1_RPC_URL, ARB1_RPC_URL, NOVA_RPC_URL } from '../constants'

export const provider = new providers.JsonRpcProvider(RPC_URL)
export const l1provider = new providers.JsonRpcProvider(L1_RPC_URL)
export const arb1provider = new providers.JsonRpcProvider(ARB1_RPC_URL)
export const novaprovider = new providers.JsonRpcProvider(NOVA_RPC_URL)

if ((await l1provider.getNetwork()).chainId !== 1) throw new Error('L1_RPC need to be Mainnet')
if ((await arb1provider.getNetwork()).chainId !== 42161) throw new Error('ARB1_RPC need to be Arbitrum')
if ((await novaprovider.getNetwork()).chainId !== 42170) throw new Error('NOVA_RPC need to be Nova')

console.log(`Your primary provider is connected to networkID ${(await provider.getNetwork()).chainId}`)
