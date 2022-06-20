/* eslint-disable require-jsdoc */
import {ethers} from 'ethers';
import {useState} from 'react';
import {FlowerPoker} from '../../0xflowerpoker/typechain-types';
import {Match, MatchState} from '../utils/models';
import {
  AlchemyAPIKey,
  ChainId,
  ContractAddress,
  FlowerPokerABI,
  MetaMaskText,
  Network,
  SwitchNetworkText,
} from '../utils/utils';

export const useFlowerPokerContract = () => {
  const [matchCount, setMatchCount] = useState<Number>(0);
  const [matchesReady, setMatchesReady] = useState<Match[]>([]);
  const [matchesCompleted, setMatchesCompleted] = useState<Match[]>([]);
  const [askSize, setAskSize] = useState(1);
  const [contract, setContract] = useState<FlowerPoker>();
  const [gprovider, setGprovider] = useState<ethers.providers.Web3Provider>();
  const [account, setAccount] = useState<any>(MetaMaskText);
  const [connectButtonText, setConnectButtonText] = useState<string>('');
  const [writeContract, setWriteContract] = useState<FlowerPoker>();

  function makeWSContract(): FlowerPoker {
    const provider = new ethers.providers.AlchemyWebSocketProvider(
        Network, AlchemyAPIKey);
    return new ethers.Contract(
        ContractAddress, FlowerPokerABI, provider) as FlowerPoker;
  }

  function makeRWContract(): FlowerPoker | undefined {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const localAccount = provider.send('eth_requestAccounts', []);

    if (localAccount === undefined) {
      setAccount(MetaMaskText);
      return undefined;
    }

    const signer = provider.getSigner();
    const providedContract = new ethers.Contract(
        ContractAddress, FlowerPokerABI, signer);
    setGprovider(provider);
    setAccount(localAccount);

    return providedContract as FlowerPoker;
  }

  function getContract(RW: boolean = false): FlowerPoker {
    if (!RW && contract !== undefined && account !== undefined) return contract;
    if (RW && writeContract !== undefined && account !== undefined) {
      return writeContract;
    }

    const localContract = makeWSContract();
    let localWriteContract;
    setContract(localContract);
    if (window.ethereum) {
      localWriteContract = makeRWContract();
      setWriteContract(localWriteContract);
    }
    if (RW) {
      return localWriteContract as FlowerPoker;
    }
    return localContract as FlowerPoker;
  }

  async function makeOffer(event: any) {
    event.preventDefault();
    if (typeof window.ethereum !== 'undefined') {
      const contract = getContract(true);
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
      const contract = getContract(true);
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

  async function effect() {
    setConnectButtonText(await makeConnectButtonText());
    await loadMatches();

    async function loadMatches() {
      await gprovider?.send('eth_requestAccounts', []).then();
      const lmatchCount = await getReadyMatches();
      console.log('Got %d new matches', lmatchCount);
      setMatchCount(lmatchCount);
    }

    async function makeConnectButtonText(): Promise<string> {
      let text = account;
      if (account !== undefined && account !== MetaMaskText) {
        const network = await gprovider?.getNetwork();
        if (network !== undefined) {
          if (network.chainId !== ChainId) {
            text = SwitchNetworkText;
            setContract(makeWSContract());
          }
        }
      }
      return text;
    }

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

  return [
    matchesReady,
    matchesCompleted,
    makeOffer,
    makeHouseOffer,
    acceptMatch,
    effect,
    askSize,
    setAskSize,
    matchCount,
    connectButtonText,
  ] as const;
};
