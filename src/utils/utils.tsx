/* eslint-disable no-unused-vars */
import {ethers} from 'ethers';
import FP from
  '../../0xflowerpoker/artifacts/contracts/FlowerPoker.sol/FlowerPoker.json';

export const ContractAddress = '0x66366af4537c67e7f0D5DE1717f72fce40568392';
export const FlowerPokerABI = FP.abi;

export const Network = 'matic';
export const AlchemyAPIKey = 'Pvz_dRRKpYU_ePBJkgjeHCmECSNiI29h';

export interface Match {
    id: ethers.BigNumber;
    sum: ethers.BigNumber;
    player1: string;
    player2: string;
    player1Result: MatchResult;
    player2Result: MatchResult;
    state: MatchState;
    flowers: ethers.BigNumber;
}

export enum MatchResult {
    WAIT,
    BUST,
    PAIR,
    TWO_PAIR,
    THREE_OF_A_KIND,
    FULL_HOUSE,
    FOUR_OF_A_KIND,
    FIVE_OF_A_KIND
}

export enum MatchState {
    READY,
    CANCELED,
    PLANTED,
    PLAYER_ONE,
    PLAYER_TWO,
    TIE_BOTH
}
