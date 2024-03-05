import { generateNonEmergencySCSimConfig } from './lib'

// proposal data from https://github.com/ArbitrumFoundation/governance/blob/b5e97139e5f9907f80d2fa34f97c8f624c8dc83d/scripts/proposals/AtlasFeesAIP/atlais-aip-data.json
const propConfig = generateNonEmergencySCSimConfig(
  '0x928c169a000000000000000000000000e6841d92b0c345144506576ec13ecf5103ac7f49000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000005248f2a0bb000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000000000000000000000000000000000000000001800000000000000000000000000000000000000000000000000000000000000000d82fcbd0c53e9e9c1cfc7e0f2301f003ca89fc35b3bcf7e105d5e9d9906b831b000000000000000000000000000000000000000000000000000000000003f4800000000000000000000000000000000000000000000000000000000000000002000000000000000000000000a723c008e76e379c55599d2e4d93879beafda79c000000000000000000000000a723c008e76e379c55599d2e4d93879beafda79c0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000001e000000000000000000000000000000000000000000000000000000000000001800000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd00000000000000000000000036d0170d92f66e8949eb276c3ac4fea64f83704d00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001800000000000000000000000004dbd4fc535ac27206064b68ffcf827b0a60bab3f000000000000000000000000cf57572261c7c2bcf21ffd220ea7d1a27d40a82700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c000000000000000000000000000000000000000000000000000000000000000841cff79cd000000000000000000000000849e360a247132f961c9cbe95ba39106c72e126800000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000004b147f40c000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  'atlas fees sim'
);


export const config  = propConfig