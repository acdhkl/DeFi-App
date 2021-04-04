const { assert } = require('chai')

const TokenFarm = artifacts.require('TokenFarm')
const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')

require('chai')
.use(require('chai-as-promised'))
.should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}
contract('TokenFarm',([owner, investor]) => {
    let daiToken, dappToken, tokenFarm

    before(async () => {
        // Load smart tokens
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        // Transfer all DAPP tokens into the farm
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        // Send tokens to investor
        await daiToken.transfer(investor, tokens('100'), {from: owner})

    })

    describe ('Mock Dai deployment', async() => {
        it('has correct name', async () => {
            const name  = await daiToken.name()
            assert.equal(name, 'Mock DAI Token')
        })
    })

    describe ('Dapp Token deployment', async() => {
        it('has correct name', async () => {
            const name  = await dappToken.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe ('Token Farm deployment', async() => {
        it('has correct name', async () => {
            const name  = await tokenFarm.name()
            assert.equal(name, 'Dapp Token Farm')
        })

        it('contract contains correct amount of tokens', async() => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    describe('Farming tokens', async() => {
        it('rewards investors for staking Dai tokens', async() => {
            let result

            //Check investor balance prior to staking
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(), tokens('100'), 'investor mDai wallet balance correct before staking')
            
            // Stake mDai tokens
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: investor})
            await tokenFarm.stakeTokens(tokens('100'), {from: investor})

            //Check post-stake
            result = await daiToken.balanceOf(investor)
            assert.equal(result.toString(),tokens('0'), 'investor mDai wallet balance is correct post-stake')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(),tokens('100'), 'mDai balance of token farm post-stake is correct')

            result = await tokenFarm.stakingBalance(investor)
            assert.equal(result.toString(), tokens('100'), 'investor staking balance correct post-stake')

            result = await tokenFarm.isStaking(investor)
            assert.equal(result.toString(), 'true', 'investor staking status correct post-stake')

        })
    })




})