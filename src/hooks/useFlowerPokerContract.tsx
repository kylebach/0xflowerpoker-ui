/* eslint-disable require-jsdoc */
import {ethers} from 'ethers';
import {useState} from 'react';
import {FlowerPoker} from '../../0xflowerpoker/typechain-types';
import {Match, MatchState} from '../utils/models';
import {
  AlchemyAPIKey,
  ContractAddress,
  FlowerPokerABI,
  Network,
} from '../utils/utils';

export const useFlowerPokerContract = () => {
  const [matchesReady, setMatchesReady] = useState<Match[]>([]);
  const [matchesCompleted, setMatchesCompleted] = useState<Match[]>([]);
  const [askSize, setAskSize] = useState(1);
  const [contract, setContract] = useState<FlowerPoker>();
  const [gprovider, setGprovider] = useState<ethers.providers.Web3Provider>();

  function getContract(): FlowerPoker {
    if (contract !== undefined) return contract;
    let providedContract;
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      setGprovider(provider);
      providedContract = new ethers.Contract(
          ContractAddress, FlowerPokerABI, signer);
    } else {
      const provider = new ethers.providers.AlchemyWebSocketProvider(
          Network, AlchemyAPIKey);
      providedContract = new ethers.Contract(
          ContractAddress, FlowerPokerABI, provider);
    }
    setContract(providedContract as FlowerPoker);
    return providedContract as FlowerPoker;
  }

  async function makeOffer(event: any) {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      const contract = await getContract();
      try {
        const res = await contract.createMatch(
            ethers.utils.parseEther('' + askSize), {
              value: ethers.utils.parseEther('' + askSize),
              gasLimit: 500000,
            });
        await res.wait();
        getReadyMatches();
      } catch (e) {
        console.log('error making offer: ', e);
      }
    }
  }

  async function makeHouseOffer(event: any) {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      const contract = await getContract();
      try {
        const res = await contract.createHouseMatch(
            ethers.utils.parseEther('' + askSize), {
              value: ethers.utils.parseEther('' + askSize),
              gasLimit: 500000,
            });
        await res.wait();
        getReadyMatches();
      } catch (e) {
        console.log('error making offer: ', e);
      }
    }
  }

  async function acceptMatch(id: ethers.BigNumber, sum: ethers.BigNumber) {
    const contract = getContract();
    const res = await contract.acceptMatch(id, {value: sum, gasLimit: 150000});
    await res.wait();
    getReadyMatches();
  }

  async function getReadyMatches(): Promise<Number> {
    const contract = getContract();
    try {
      const matchesReady = []; const matchesCompleted = [];
      const matchCount = await contract.matchCount();
      for (let i = matchCount.toNumber() - 1; i >= 0; i--) {
        const match: Match = await contract.matches(i);
        switch (match.state) {
          case MatchState.READY:
            matchesReady.push(match);
            break;
          case MatchState.CANCELED:
          case MatchState.PLANTED:
            break;
          case MatchState.PLAYER_ONE:
          case MatchState.PLAYER_TWO:
          case MatchState.TIE_BOTH:
            matchesCompleted.push(match);
            break;
        }
      }
      setMatchesReady([...matchesReady]);
      setMatchesCompleted([...matchesCompleted]);
    } catch (e) {
      console.log('error getting ready matches: ', e);
    }
    return matchesCompleted.length + matchesReady.length;
  }

  function onEvents() {
    const contract = getContract();
    contract.on('FlowersPicked', (event) => {
      getReadyMatches().then();
    });
    contract.on('FlowersPlanted', (event) => {
      getReadyMatches().then();
    });
    contract.on('offerPosted', (event) => {
      getReadyMatches().then();
    });
    contract.on('offerPosted', (event) => {
      getReadyMatches().then();
    });
    contract.on('offerCancled', (event) => {
      getReadyMatches().then();
    });
  }

  function effect() {
    console.log('getting matches');
    loadMatches().then();
    async function loadMatches() {
      await gprovider?.send('eth_requestAccounts', []).then();
      const matchCount = await getReadyMatches();
      console.log('loaded ', matchCount);
    }
    onEvents();
  }

  return [
    matchesReady,
    matchesCompleted,
    makeOffer,
    makeHouseOffer,
    acceptMatch,
    effect,
    askSize,
    setAskSize,
  ] as const;
};
