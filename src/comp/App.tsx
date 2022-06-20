/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import '../styles/App.css';

import {ethers} from 'ethers';
import React, {ReactElement, useEffect} from 'react';
import {useFlowerPokerContract} from '../hooks/useFlowerPokerContract';
import {Match, MatchResult, MatchState} from '../utils/models';
import 'bulma/css/bulma.min.css';

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
  ] = useFlowerPokerContract();

  useEffect(() => {
    effect();
  }, []);

  function generateNewMatchForm(): ReactElement {
    return (
      <div className="box" key="button-box">
        <b>New Match</b>
        <div className="">
          <input
            className="input"
            value={askSize}
            onChange={
              (event) => setAskSize(Number.parseFloat(event.target.value))
            }
            name="askSize"
            type="number"
            step="0.1"
            placeholder="enter amount"
          />
          <br></br>
          <br></br>
          <div className="group">
            <div className="columns">
              <button className="column button is-info" onClick={makeOffer}>Bet vs player</button>
              <button className="column button is-primary" onClick={makeHouseOffer}>Bet vs house</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function generateAcceptMatchButton(
      id: ethers.BigNumber,
      sum: ethers.BigNumber,
  ): ReactElement {
    return (
      <button className="button is-primary" onClick={() => acceptMatch(id, sum)}>take bet</button>
    );
  }

  function numToFlower(f: Number, p: string): ReactElement {
    const path = '/flowers/' + f.toString() + '.png';
    return (
      <img src={path} alt={f.toString()} key={f.toString() + p}></img>
    );
  }

  function shortenAddr(addr: string): string {
    return '0x' + addr.substring(2, 6).toUpperCase() + '...' + addr.substring(addr.length - 5, addr.length - 1).toUpperCase();
  }

  function matchToFlowerPatch(match: Match, player1: boolean): ReactElement {
    let p1 = [];
    const p2 = [];
    let f = match.flowers.toNumber();
    for (let i = 0; i < 5; i++) {
      const c = f % 10;
      f /= 10;
      f = Math.floor(f);
      p2.push(c);
    }
    for (let i = 0; i < 5; i++) {
      const c = f % 10;
      f /= 10;
      f = Math.floor(f);
      p1.push(c);
    }
    p1 = player1 ? p1 : p2;
    const text = player1 ? MatchResult[match.player1Result] : MatchResult[match.player2Result];
    let addr = player1 ? match.player1.toString() : match.player2.toString();
    addr = shortenAddr(addr);
    let c = 0;
    return (
      <div key={player1 ? match.player1Result.toString() : match.player2Result.toString()}>
        {p1.map((it) => numToFlower(it, player1?'p1' + (c++).toString():'p2' + (c++).toString()))}
        <br></br>
        {text}
        <br></br>
        {addr}
      </div>
    );
  }

  function matchToCardComplete(match: Match): ReactElement {
    let winner = match.state == MatchState.TIE_BOTH ? undefined : MatchState.PLAYER_ONE ? match.player1.toString() : match.player2.toString();
    winner = winner === undefined ? undefined : shortenAddr(winner);
    return (
      <div className="box" key={match.id.toString()}>
        <div className="columns">
          <div className="id column">
            #<b>{match.id.toString()}</b>
          </div>
          <div className="column">
            {matchToFlowerPatch(match, true)}
          </div>
          <div className="column">
            {matchToFlowerPatch(match, false)}
          </div>
          <div className="column">
            {MatchState[match.state]}
            <br></br>
            {'pot Ξ' + ethers.utils.formatUnits(match.sum.toString()).substring(0, 5)}
            <br></br>
            {winner}
          </div>
        </div>
      </div>
    );
  }

  function matchToCardReady(match: Match): ReactElement {
    return (
      <div className="box" key={match.id.toString()}>
        <div className="columns">
          <div className="id column">
            #<b>{match.id.toString()}</b>
          </div>
          <div className="column">
            {shortenAddr(match.player1)}
          </div>
          <div className="column">
            {MatchState[match.state]}
            <br></br>
            {'current pot Ξ' + ethers.utils.formatUnits(match.sum.toString()).substring(0, 5)}
          </div>
          <div className="column">
            {generateAcceptMatchButton(match.id, match.sum)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* <div className="navbar box">
        <div className="navbar-item">
          0xflowerpoker
        </div>
        <div>
          <button>
            connect
          </button>
        </div>
      </div> */}
      <div className="matches container is-max-desktop">
        {generateNewMatchForm()}
        <div className="box">
          <b>
            Ready Matches
          </b>
          {(matchesReady.map((it) => matchToCardReady(it)))}
        </div>
        <div className="box">
          <b>
            Completed Matches
          </b>
          {(matchesCompleted.map((it) => matchToCardComplete(it)))}
        </div>
      </div>
    </div>
  );
}

export default App;
