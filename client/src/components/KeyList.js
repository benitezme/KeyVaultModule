import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import {getKeysQuery} from '../queries/queries';
import { getItem } from '../utils/local-storage'

//Material-ui
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

import { compose } from 'recompose';

// Images
import poloniexImage from '../img/poloniex.png'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
    margin:10,
  },
  image: {
    width: 128,
    height: '100%',
    cursor:'default',
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',

  },
});

class KeyList extends Component {

  constructor(props){
    super(props);
    this.state={
      selected:'',
      user:null
    }
  }

  displayKeys(){
    var data = this.props.data;
    const { classes } = this.props;
    // this.props.user = this.state.user;
    if(data.loading){
      return <div>Loading keys...</div>;
    }else{
      if(data.keys){
        return data.keys.map(key => {
          return (
            <Paper className={classes.root}>
              <Grid container spacing={16}>
                <Grid item>
                  <ButtonBase className={classes.image}>
                    <img className={classes.img} alt="complex" src={poloniexImage} />
                  </ButtonBase>
                </Grid>
                <Grid item xs={12} sm container>
                  <Grid item xs container direction="column" spacing={16}>
                    <Grid item xs>
                      <Typography gutterBottom variant="subheading">
                        Key: {key.key}
                      </Typography>
                      <Typography gutterBottom>Type: {key.type}</Typography>
                      <Typography gutterBottom>Description: {key.description}</Typography>
                      <Typography gutterBottom>Valid From: {key.validFrom}</Typography>
                      <Typography gutterBottom>Valid To: {key.validTo}</Typography>
                      <Typography gutterBottom>Active: {key.active.toString()}</Typography>
                      <Typography gutterBottom>Boot id: {key.botId}</Typography>

                      {/* <Typography color="textSecondary">ID: 1030114</Typography> */}
                    </Grid>
                    <Grid item>
                      <Typography style={{ cursor: 'pointer' }}>Deactivate</Typography>
                    </Grid>
                  </Grid>
                  {/* <Grid item>
                    <Typography variant="subheading">$19.00</Typography>
                  </Grid> */}
                </Grid>
              </Grid>
            </Paper>
          )
        })
      }else{
        return <div>You don't have any key yet</div>
      }
    }
  }

  componentDidMount() {
    this._asyncRequest = getItem('user').then(
      user => {
        this._asyncRequest = null;
        this.setState({user:JSON.parse(user)});
      }
    );
  }

  render() {
    return (
      <div>
        <ul id="key-list">
          {this.displayKeys()}
        </ul>
        {/* <KeyDetails keyId={this.state.selected}/> */}
      </div>
    );
  }
}

KeyList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default compose(
  graphql(getKeysQuery),
  withStyles(styles)
)(KeyList);
