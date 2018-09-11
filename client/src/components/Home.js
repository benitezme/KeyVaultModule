import React, { Component } from 'react'

// Components

//import ChartUsers from './home/ChartUsers'

// Images

// import PortraitImage from '../img/aa-logo-dark-8.png'

class Home extends Component {

  render(){

    return (
      <div>

      <section>

        <div className="row">
          <div className="col s12 l6 offset-l1">
            <h2 className="indigo-text text-darken-4">
              Welcome to the Key Vault Module Home Page.
            </h2>
            <p>
              On this module you will be able to:
            </p>

            <ul>
                <li>Manage your exchange keys.</li>
                <li>Manage your bot associations.</li>
            </ul>
            <p>
               Please login at the right top corner to get started.
            </p>
          </div>
        </div>

      </section>

      </div>
    )
  }
}

export default Home
