import { BigNumber, BigNumberish, Block, Contract } from 'ethers'
import { ContractTransaction } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'

// --- Simulation configurations ---
// TODO Consider refactoring to an enum instead of string.
export type GovernorType = 'oz' | 'bravo' | 'arb'

interface SimulationConfigBase {
  type: 'executed' | 'proposed' | 'new'
  daoName: string // e.g. 'Compound' or 'Uniswap'
  governorAddress: string // address of the governor
  governorType: GovernorType
}

export interface SimulationConfigExecuted extends SimulationConfigBase {
  type: 'executed'
  proposalId: BigNumberish // ID of the executed proposal
}

export interface SimulationConfigProposed extends SimulationConfigBase {
  type: 'proposed'
  proposalId: BigNumberish // ID of the executed proposal
}

export interface SimulationConfigNew extends SimulationConfigBase {
  type: 'new'
  targets: string[]
  values: BigNumberish[]
  signatures: string[]
  calldatas: string[]
  description: string
}

export interface SimulationConfigArbL2ToL1 extends SimulationConfigBase {
  type: 'arbl2tol1'
  targets: string[]
  values: BigNumberish[]
  signatures: string[]
  calldatas: string[]
  description: string
  parentId: BigNumberish
  idoffset: BigNumberish
}

export interface SimulationConfigArbRetryable extends SimulationConfigBase {
  type: 'arbretryable'
  targets: string[]
  values: BigNumberish[]
  signatures: string[]
  calldatas: string[]
  description: string
  parentId: BigNumberish
  idoffset: BigNumberish
  from: string
  chainId: 42161 | 42170
}

export type SimulationConfig =
  | SimulationConfigExecuted
  | SimulationConfigProposed
  | SimulationConfigNew
  | SimulationConfigArbL2ToL1
  | SimulationConfigArbRetryable

export interface SimulationResult {
  sim: TenderlySimulation
  proposal: ProposalEvent
  latestBlock: Block
}

export interface SimulationData extends SimulationResult {
  config: SimulationConfig
}

// --- Proposal checks ---
export type ProposalActions = [
  // defined as an array instead of an object because the return data from governor.getActions()
  // has no `values` key if all values are zero
  string[],
  BigNumber[],
  string[],
  string[]
]

// TODO If adding support for a third governor, instead of hardcoding optional governor-specific
// fields, make this a union type of each governor's individual proposal type.
export interface ProposalStruct {
  id: BigNumber
  proposer?: string
  eta: BigNumber
  startBlock?: BigNumber // Compound governor
  startTime?: BigNumber // OZ governor
  endBlock?: BigNumber // Compound governor
  endTime?: BigNumber // OZ governor
  forVotes: BigNumber
  againstVotes: BigNumber
  abstainVotes: BigNumber
  canceled: boolean
  executed: boolean
}

export interface ProposalEvent {
  id?: BigNumber // Bravo governor
  proposalId?: BigNumber // OZ governor
  proposer: string
  startBlock: BigNumber
  endBlock: BigNumber
  description: string
  targets: string[]
  values: BigNumber[]
  signatures: string[]
  calldatas: string[]
  chainid: string
}

export type Message = string

export type CheckResult = {
  info: Message[]
  warnings: Message[]
  errors: Message[]
}

export type ProposalData = {
  governor: Contract
  timelock: Contract
  provider: JsonRpcProvider
}

export interface ProposalCheck {
  name: string
  checkProposal(proposal: ProposalEvent, tx: TenderlySimulation, deps: ProposalData): Promise<CheckResult>
}

export interface AllCheckResults {
  [checkId: string]: { name: string; result: CheckResult }
}

// --- Tenderly types, Request ---
// Response from tenderly endpoint that encodes state data
type StorageEncodingResponse = {
  stateOverrides: {
    // these keys are the contract addresses, all lower case
    [key: string]: {
      value: {
        // these are the slot numbers, as 32 byte hex strings
        [key: string]: string
      }
    }
  }
}

type StateObject = {
  balance?: string
  code?: string
  storage?: Record<string, string>
}

type ContractObject = {
  contractName: string
  source: string
  sourcePath: string
  compiler: {
    name: 'solc'
    version: string
  }
  networks: Record<
    string,
    {
      events?: Record<string, string>
      links?: Record<string, string>
      address: string
      transactionHash?: string
    }
  >
}

export type TenderlyPayload = {
  network_id: '1' | '3' | '4' | '5' | '42' | '42161'
  block_number?: number
  transaction_index?: number
  from: string
  to: string
  input: string
  gas: number
  gas_price?: string
  value?: string
  simulation_type?: 'full' | 'quick'
  save?: boolean
  save_if_fails?: boolean
  state_objects?: Record<string, StateObject>
  contracts?: ContractObject[]
  block_header?: {
    number?: string
    timestamp?: string
  }
  generate_access_list?: boolean
}

// --- Tenderly types, Response ---
// NOTE: These type definitions were autogenerated using https://app.quicktype.io/, so are almost
// certainly not entirely accurate (and they have some interesting type names)

export interface TenderlySimulation {
  transaction: Transaction
  simulation: Simulation
  contracts: TenderlyContract[]
  generated_access_list: GeneratedAccessList[]
}

interface TenderlyContract {
  id: string
  contract_id: string
  balance: string
  network_id: string
  public: boolean
  boolean
  verified_by: string
  verification_date: null
  address: string
  contract_name: string
  ens_domain: null
  type: string
  evm_version: string
  compiler_version: string
  optimizations_used: boolean
  optimization_runs: number
  libraries: null
  data: Data
  creation_block: number
  creation_tx: string
  creator_address: string
  created_at: Date
  number_of_watches: null
  language: string
  in_project: boolean
  number_of_files: number
  standard?: string
  standards?: string[]
  token_data?: TokenData
}

interface Data {
  main_contract: number
  contract_info: ContractInfo[]
  abi: ABI[]
  raw_abi: null
}

interface ABI {
  type: ABIType
  name: string
  constant: boolean
  anonymous: boolean
  inputs: SoltypeElement[]
  outputs: Output[] | null
}

interface SoltypeElement {
  name: string
  type: SoltypeType
  storage_location: StorageLocation
  components: SoltypeElement[] | null
  offset: number
  index: string
  indexed: boolean
  simple_type?: Type
}

interface Type {
  type: SimpleTypeType
}

enum SimpleTypeType {
  Address = 'address',
  Bool = 'bool',
  Bytes = 'bytes',
  Slice = 'slice',
  String = 'string',
  Uint = 'uint',
}

enum StorageLocation {
  Calldata = 'calldata',
  Default = 'default',
  Memory = 'memory',
  Storage = 'storage',
}

enum SoltypeType {
  Address = 'address',
  Bool = 'bool',
  Bytes32 = 'bytes32',
  MappingAddressUint256 = 'mapping (address => uint256)',
  MappingUint256Uint256 = 'mapping (uint256 => uint256)',
  String = 'string',
  Tuple = 'tuple',
  TypeAddress = 'address[]',
  TypeTuple = 'tuple[]',
  Uint16 = 'uint16',
  Uint256 = 'uint256',
  Uint48 = 'uint48',
  Uint56 = 'uint56',
  Uint8 = 'uint8',
}

interface Output {
  name: string
  type: SoltypeType
  storage_location: StorageLocation
  components: SoltypeElement[] | null
  offset: number
  index: string
  indexed: boolean
  simple_type?: SimpleType
}

interface SimpleType {
  type: SimpleTypeType
  nested_type?: Type
}

enum ABIType {
  Constructor = 'constructor',
  Event = 'event',
  Function = 'function',
}

interface ContractInfo {
  id: number
  path: string
  name: string
  source: string
}

interface TokenData {
  symbol: string
  name: string
  decimals: number
}

interface GeneratedAccessList {
  address: string
  storage_keys: string[]
}

interface Simulation {
  id: string
  project_id: string
  owner_id: string
  network_id: string
  block_number: number
  transaction_index: number
  from: string
  to: string
  input: string
  gas: number
  gas_price: string
  value: string
  method: string
  status: boolean
  access_list: null
  queue_origin: string
  created_at: Date
}

interface Transaction {
  hash: From
  block_hash: string
  block_number: number
  from: From
  gas: number
  gas_price: number
  gas_fee_cap: number
  gas_tip_cap: number
  cumulative_gas_used: number
  gas_used: number
  effective_gas_price: number
  input: string
  nonce: number
  to: From
  index: number
  value: string
  access_list: null
  status: boolean
  addresses: string[]
  contract_ids: string[]
  network_id: string
  function_selector: string
  transaction_info: TransactionInfo
  timestamp: Date
  method: string
  decoded_input: null
}

interface TransactionInfo {
  contract_id: string
  block_number: number
  transaction_id: From
  contract_address: From
  method: string
  parameters: null
  intrinsic_gas: number
  refund_gas: number
  call_trace: CallTrace
  stack_trace: null | StackTrace[]
  logs: Log[] | null
  state_diff: StateDiff[]
  raw_state_diff: null
  console_logs: null
  created_at: Date
}

interface StackTrace {
  file_index: number
  contract: string
  name: string
  line: number
  error: string
  error_reason: string
  code: string
  op: string
  length: number
}

interface CallTrace {
  hash: From
  contract_name: string
  function_name: string
  function_pc: number
  function_op: string
  function_file_index: number
  function_code_start: number
  function_line_number: number
  function_code_length: number
  function_states: CallTraceFunctionState[]
  caller_pc: number
  caller_op: string
  call_type: string
  from: From
  from_balance: string
  to: From
  to_balance: string
  value: string
  caller: Caller
  block_timestamp: Date
  gas: number
  gas_used: number
  intrinsic_gas: number
  input: string
  decoded_input: Input[]
  state_diff: StateDiff[]
  logs: Log[]
  output: string
  decoded_output: FunctionVariableElement[]
  network_id: string
  calls: CallTraceCall[]
}

interface Caller {
  address: From
  balance: string
}

interface CallTraceCall {
  hash: string
  contract_name: string
  function_name: string
  function_pc: number
  function_op: string
  function_file_index: number
  function_code_start: number
  function_line_number: number
  function_code_length: number
  function_states: CallTraceFunctionState[]
  function_variables: FunctionVariableElement[]
  caller_pc: number
  caller_op: string
  caller_file_index: number
  caller_line_number: number
  caller_code_start: number
  caller_code_length: number
  call_type: string
  from: From
  from_balance: null
  to: From
  to_balance: null
  value: null
  caller: Caller
  block_timestamp: Date
  gas: number
  gas_used: number
  input: string
  decoded_input: Input[]
  output: string
  decoded_output: FunctionVariableElement[]
  network_id: string
  calls: PurpleCall[]
}

interface PurpleCall {
  hash: string
  contract_name: string
  function_name: string
  function_pc: number
  function_op: string
  function_file_index: number
  function_code_start: number
  function_line_number: number
  function_code_length: number
  function_states?: FluffyFunctionState[]
  function_variables?: FunctionVariable[]
  caller_pc: number
  caller_op: string
  caller_file_index: number
  caller_line_number: number
  caller_code_start: number
  caller_code_length: number
  call_type: string
  from: From
  from_balance: null | string
  to: string
  to_balance: null | string
  value: null | string
  caller: Caller
  block_timestamp: Date
  gas: number
  gas_used: number
  refund_gas?: number
  input: string
  decoded_input: Input[]
  output: string
  decoded_output: FunctionVariable[] | null
  network_id: string
  calls: FluffyCall[] | null
}

interface FluffyCall {
  hash: string
  contract_name: string
  function_name?: string
  function_pc: number
  function_op: string
  function_file_index?: number
  function_code_start?: number
  function_line_number?: number
  function_code_length?: number
  function_states?: FluffyFunctionState[]
  function_variables?: FunctionVariable[]
  caller_pc: number
  caller_op: string
  caller_file_index: number
  caller_line_number: number
  caller_code_start: number
  caller_code_length: number
  call_type: string
  from: string
  from_balance: null | string
  to: string
  to_balance: null | string
  value: null | string
  caller?: Caller
  block_timestamp: Date
  gas: number
  gas_used: number
  input: string
  decoded_input?: FunctionVariable[]
  output: string
  decoded_output: PurpleDecodedOutput[] | null
  network_id: string
  calls: TentacledCall[] | null
  refund_gas?: number
}

interface TentacledCall {
  hash: string
  contract_name: string
  function_name: string
  function_pc: number
  function_op: string
  function_file_index: number
  function_code_start: number
  function_line_number: number
  function_code_length: number
  function_states: PurpleFunctionState[]
  caller_pc: number
  caller_op: string
  caller_file_index: number
  caller_line_number: number
  caller_code_start: number
  caller_code_length: number
  call_type: string
  from: string
  from_balance: null
  to: string
  to_balance: null
  value: null
  caller: Caller
  block_timestamp: Date
  gas: number
  gas_used: number
  input: string
  decoded_input: FunctionVariableElement[]
  output: string
  decoded_output: FunctionVariable[]
  network_id: string
  calls: null
}

interface FunctionVariableElement {
  soltype: SoltypeElement
  value: string
}

interface FunctionVariable {
  soltype: SoltypeElement
  value: PurpleValue | string
}

interface PurpleValue {
  ballot: string
  basedOn: string
  configured: string
  currency: string
  cycleLimit: string
  discountRate: string
  duration: string
  fee: string
  id: string
  metadata: string
  number: string
  projectId: string
  start: string
  tapped: string
  target: string
  weight: string
}

interface PurpleFunctionState {
  soltype: SoltypeElement
  value: Record<string, string>
}

interface PurpleDecodedOutput {
  soltype: SoltypeElement
  value: boolean | PurpleValue | string
}

interface FluffyFunctionState {
  soltype: PurpleSoltype
  value: Record<string, string>
}

interface PurpleSoltype {
  name: string
  type: SoltypeType
  storage_location: StorageLocation
  components: null
  offset: number
  index: string
  indexed: boolean
}

interface Input {
  soltype: SoltypeElement | null
  value: boolean | string
}

interface CallTraceFunctionState {
  soltype: PurpleSoltype
  value: Record<string, string>
}

interface Log {
  name: string | null
  anonymous: boolean
  inputs: Input[]
  raw: LogRaw
}

interface LogRaw {
  address: string
  topics: string[]
  data: string
}

interface StateDiff {
  soltype: SoltypeElement | null
  original: string | Record<string, any>
  dirty: string | Record<string, any>
  raw: RawElement[]
}

interface RawElement {
  address: string
  key: string
  original: string
  dirty: string
}
