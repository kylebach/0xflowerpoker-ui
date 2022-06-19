/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import '../styles/App.css';

import {ethers} from 'ethers';
import React, {ReactElement, useEffect} from 'react';
import {useFlowerPokerContract} from '../hooks/useFlowerPokerContract';
import {Match, MatchResult, MatchState} from '../utils/utils';

function App() {
  const [
    matchesReady,
    matchesCompleted,
    makeOffer,
    makeHouseOffer,
    acceptMatch,
    effect,
    askSize,
    setAskSize,
    askSizeHouse,
    setAskSizeHouse,
  ] = useFlowerPokerContract();

  useEffect(() => {
    effect();
  }, []);

  function generateNewMatchForm(): ReactElement {
    return (
      <div>
        <form onSubmit={makeOffer}>
          <input
            className="form-control"
            value={askSize}
            onChange={
              (event) => setAskSize(Number.parseFloat(event.target.value))
            }
            name="askSize"
            type="number"
            step="0.1"
            placeholder="enter amount"
          />
          <button type="submit">Open Bet</button>
        </form>
      </div>
    );
  }

  function generateNewHouseMatchForm(): ReactElement {
    return (
      <div>
        <form onSubmit={makeHouseOffer}>
          <input
            className="form-control"
            value={askSizeHouse}
            onChange={
              (event) => setAskSizeHouse(Number.parseFloat(event.target.value))
            }
            name="askSizeHouse"
            type="number"
            step="0.1"
            placeholder="enter amount"
          />
          <button type="submit">Open Bet</button>
        </form>
      </div>
    );
  }

  function generateAcceptMatchButton(
      id: ethers.BigNumber,
      sum: ethers.BigNumber,
      state: MatchState,
  ): ReactElement {
    if (state !== MatchState.READY) {
      return (
        <div></div>
      );
    }
    return (
      <button onClick={() => acceptMatch(id, sum)}>take bet</button>
    );
  }

  function generateTableFromMatches(matches: Match[]): ReactElement {
    return (
      <table>
        <thead>
          <tr>
            <th>id</th>
            <th>flowers</th>
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
          {matches.map((it) =>
            <tr key={it.id.toString()}>
              <th>{it.id.toString()}</th>
              <th>{it.flowers.toString()}</th>
              <th>0x{it.player1.substring(2, 6).toUpperCase()}...{it.player1.substring(it.player1.length - 5, it.player1.length - 1).toUpperCase()}</th>
              <th>0x{it.player2.substring(2, 6).toUpperCase()}...{it.player2.substring(it.player2.length - 5, it.player2.length - 1).toUpperCase()}</th>
              <th>{MatchResult[it.player1Result]}</th>
              <th>{MatchResult[it.player2Result]}</th>
              <th>{MatchState[it.state]}</th>
              <th>{ethers.utils.formatUnits(it.sum.toString()).substring(0, 5)}</th>
              <th>{generateAcceptMatchButton(it.id, it.sum, it.state)}</th>
            </tr>)
          }
        </tbody>
      </table>
    );
  }

  return (
    <div className="App">
      <div className="matches">
        ready matches
        {generateTableFromMatches(matchesReady)}
        past matches
        {generateTableFromMatches(matchesCompleted)}
        create a new match
        {generateNewMatchForm()}
        create a new match against house
        {generateNewHouseMatchForm()}
      </div>
    </div>
  );
}

export default App;
