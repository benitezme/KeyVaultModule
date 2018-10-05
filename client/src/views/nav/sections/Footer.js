import React, { Component } from 'react'
import { compose } from 'recompose'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'

// Images
import aalogo from '../../../img/aa-logo-vert.svg'

const styles = theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  layout: {
    width: 'auto',
    marginTop: theme.spacing.unit * 7,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1200 + theme.spacing.unit * 3 * 2)]: {
      width: 1200,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: `${theme.spacing.unit * 6}px 0`
  },
  footerContainer: {
    marginRight: theme.spacing.unit * 8,
    marginLeft: theme.spacing.unit * 8
  },
  footerLink: {
    textDecoration: 'none'
  }
})

class Footer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      selected: '',
      user: null
    }
  }
  render () {
    const { classes } = this.props
    return (
      <footer className={classNames(classes.footer, classes.layout)}>
            <Grid
              container
              spacing={32}
              justify='space-evenly'
              className={classes.footerContainer}
            >
              <Grid item xs>
                <Typography variant='title' color='textPrimary' gutterBottom>
                  Pages
                </Typography>
                <NavLink to='/' className={classes.footerLink}>
                  <Typography variant='subheading' color='textSecondary'>
                    Home
                  </Typography>
                </NavLink>
                <NavLink to='/browse' className={classes.footerLink}>
                  <Typography variant='subheading' color='textSecondary'>
                    Browse
                  </Typography>
                </NavLink>
              </Grid>
              <Grid item xs>

                <Typography variant='title' color='textPrimary' gutterBottom>
                    Support
                  </Typography>

                <a
                  href='https://advancedalgos.net/documentation-quick-start.shtml'
                  target='_blank>'
                  className={classes.footerLink}
                >
                  <Typography variant='subheading' color='textSecondary'>
                    Documentation
                  </Typography>
                </a>
                <a
                  href='https://t.me/advancedalgoscommunity'
                  target='_blank>'
                  className={classes.footerLink}
                >
                  <Typography variant='subheading' color='textSecondary'>
                    Telegram
                  </Typography>
                </a>
              </Grid>
              <Grid item xs>
                <Typography variant='title' color='textPrimary' gutterBottom>
                  Modules
                </Typography>
                <a
                  href='https://develop.advancedalgos.net'
                  target='_blank>'
                  className={classes.footerLink}
                >
                  <Typography variant='subheading' color='textSecondary'>
                    Platform
                  </Typography>
                </a>
                <a
                  href='https://users.advancedalgos.net'
                  target='_blank>'
                  className={classes.footerLink}
                >
                  <Typography variant='subheading' color='textSecondary'>
                    Users
                  </Typography>
                </a>
                <a
                  href='https://teams.advancedalgos.net'
                  target='_blank>'
                  className={classes.footerLink}
                >
                  <Typography variant='subheading' color='textSecondary'>
                    Teams
                  </Typography>
                </a>
                <a
                  href='https://keyvault.advancedalgos.net'
                  target='_blank>'
                  className={classes.footerLink}
                >
                  <Typography variant='subheading' color='textSecondary'>
                    Key Vault
                  </Typography>
                </a>
              </Grid>
              <Grid item xs>
                <NavLink to='/'>
                  <img alt='' src={aalogo} width={98} height={140} />
                </NavLink>
              </Grid>
            </Grid>
          </footer>

    )
  }
}

export default compose(
  withStyles(styles)
)(Footer)
