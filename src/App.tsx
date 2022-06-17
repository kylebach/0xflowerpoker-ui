import './App.css';

import {ethers} from "ethers";
import FP from '../0xflowerpoker/artifacts/contracts/FlowerPoker.sol/FlowerPoker.json';
import {FlowerPoker} from "../0xflowerpoker/typechain-types";
import React, {ReactElement, useEffect, useState} from 'react';

const ContractAddress = '0x73DD2F9a0A60897b38a0D5b82b4c9ED53a8a6db7';

export interface Match {
	id: ethers.BigNumber;
	sum: ethers.BigNumber;
	player1: string;
	player2: string;
	player1Result: MatchResult;
	player2Result: MatchResult;
	state: MatchState;
}

enum MatchResult {
	WAIT,
	BUST,
	PAIR,
	TWO_PAIR,
	THREE_OF_A_KIND,
	FULL_HOUSE,
	FOUR_OF_A_KIND,
	FIVE_OF_A_KIND
}

enum MatchState {
	READY,
	CANCELED,
	PLANTED,
	PLAYER_ONE,
	PLAYER_TWO,
	TIE_BOTH
}

function App() {
	const [account, setAccount] = useState('');
	const [matchesReady, setMatchesReady] = useState<Match[]>([]);
	const [matchesCompleted, setMatchesCompleted] = useState<Match[]>([]);
	const [askSize, setAskSize] = useState(1);
	const [contract, setContract] = useState<FlowerPoker>();

	useEffect(() => {
		getReadyMatches().finally()
	}, []);

	function initializeProvider(): FlowerPoker {
		if (contract !== undefined) return contract;
		let providedContract;
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			const signer = provider.getSigner();
			providedContract = new ethers.Contract(ContractAddress, FP.abi, signer);
		} else {
			const provider = new ethers.providers.AlchemyWebSocketProvider('matic', 'Pvz_dRRKpYU_ePBJkgjeHCmECSNiI29h');
			providedContract = new ethers.Contract(ContractAddress, FP.abi, provider);
		}
		setContract(providedContract as FlowerPoker);
		return providedContract as FlowerPoker;
	}

	async function makeOffer(event: any) {
		event.preventDefault();
		if (typeof window.ethereum !== "undefined") {
			const contract: FlowerPoker = await initializeProvider();
			try {
				await contract.createMatch(ethers.utils.parseEther('' + askSize), {
					value: ethers.utils.parseEther('' + askSize),
				});
			} catch (e) {
				console.log("error making offer: ", e);
			}
		}
	}

	async function getReadyMatches() {
		const contract = await initializeProvider();
		try {
			let matchesReady = [], matchesCompleted = [];
			let matchCount = await contract.matchCount();
			for (let i = 0; i < matchCount.toNumber(); i++) {
				let match = await contract.matches(i);
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
			setMatchesCompleted([...matchesCompleted])
		} catch (e) {
			console.log("error getting ready matches: ", e);
		}
	}

	function generateTableFromMatches(matches: Match[]): ReactElement {
		return (
			<table>
				<thead>
				<tr>
					<th>id</th>
					<th>player1</th>
					<th>player2</th>
					<th>player1Result</th>
					<th>player2Result</th>
					<th>state</th>
					<th>amount</th>
					<th>action</th>
				</tr>
				</thead>
				<tbody>
				{matches.map(it =>
					<tr key={it.id.toString()}>
						<th>{it.id.toString()}</th>
						<th>0x{it.player1.substring(2, 6).toUpperCase()}...{it.player1.substring(it.player1.length - 5, it.player1.length - 1).toUpperCase()}</th>
						<th>0x{it.player2.substring(2, 6).toUpperCase()}...{it.player2.substring(it.player2.length - 5, it.player2.length - 1).toUpperCase()}</th>
						<th>{MatchResult[it.player1Result]}</th>
						<th>{MatchResult[it.player2Result]}</th>
						<th>{MatchState[it.state]}</th>
						<th>{ethers.utils.formatUnits(it.sum.toString()).substring(0, 5)}</th>
						<th>{}</th>
					</tr>)
				}
				</tbody>
			</table>
		);
	}

	return (
		<div className="App">
			<div className="ActiveMatches">
				{generateTableFromMatches(matchesReady)}
				{generateTableFromMatches(matchesCompleted)}
			</div>
		</div>
	);
}

export default App;
