import React, { Component } from 'react'
import { Typography } from '@material-ui/core'
import TopBar from './nav'

class Home extends Component {
  render () {
    return (
      <React.Fragment>
        <TopBar
          size='big'
          title='Key Vault Module'
          text='Responsible for keeping the exchange API keys safe.'
          backgroundUrl='https://superalgos.org/img/photos/key-vault.jpg'
        />

        <div className='homePage container'>
          <Typography variant='h1' align='center' className='title'>
            Welcome to the Key Vault Module!
          </Typography>
          <Typography variant='h2' align='center' className='subtitle'>
            Securely stores and manages your exchange accounts’ API keys.
          </Typography>
          <div className='column'>
            <Typography align='justify'>
              The Key Vault is the module that manages and  securely stores your
              API keys. If you don’t know what an API key is or how to obtain
              it, <a href='https://www.superalgos.org/documentation-poloniex-api-key.shtml'
                target='_blank'>check the documentation</a>.
            </Typography>
            <Typography align='justify'>
              When running in live or competition modes, trading bots do real
              trading in real exchanges. Each team trades using their own account
              at the exchange. The funds in your exchange account are not consumed
              by the platform; instead, they are accessed only by your own bots,
              who obtain the API key at runtime from the vault.
            </Typography>
          </div>
          <div className='column'>
            <Typography align='justify'>
              At this point in time, you will need a verified account with
              Poloniex. If you don't have one, <a href='https://poloniex.com/signup'
                target='_blank'>get it here</a>. Make sure you go through the
              verification process so that you can trade freely.
              </Typography>
            <Typography align='justify'>
              We recommend either creating a new account to use specifically with
              Superalgos, or at least make sure you have very little money in
              it—just enough to play around and participate in competitions
              (0.002 BTC is more than enough).
            </Typography>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Home
