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

})