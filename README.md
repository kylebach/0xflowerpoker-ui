# 0xflowerpoker!

User interface for 0xflowerpoker smart contract https://github.com/kylebach/0xflowerpoker https://git.i.bachin.ski/kgb/0xflowerpoker implentation of the game https://runelive.fandom.com/wiki/Flower_Poker using chainlink verifiable random functions. This ensures provably fair flower-pokering, powered by the blockchain!

The interface uses Alchemy WebSockets to read the contract data from the blockchain and your browser's injected Web3 wallet for writing.

## Interface
![Alt interface](./img1.png?raw=true "UI")

## Building & Deploying
With Docker
```
git submodule update --init
docker build . -t 0xfp
docker run -itp 3000:3000 0xfp
```