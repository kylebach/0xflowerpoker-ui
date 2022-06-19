/* eslint-disable no-unused-vars */
import {ethers} from 'ethers';

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
