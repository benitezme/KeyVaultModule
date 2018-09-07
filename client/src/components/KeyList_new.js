import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import {getKeysQuery} from '../queries/queries';

//Material-ui
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

//components
import KeyDetails from './KeyDetails';

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 600,
    padding: theme.spacing.unit * 2,
  },
  image: {
    width: 128,
    height: 128,
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
      selected:''
    }
  }

  displayKeys(){
    var data = this.props.data;
    const { classes } = this.props;

    if(data.loading){
      return <div>Loading keys...</div>;
    }else{
      return data.keys.map(key => {
        return (
          <Paper className={classes.root}>
                <Grid container spacing={16}>
                  <Grid item>
                    <ButtonBase className={classes.image}>
                      <img className={classes.img} alt="complex" src="../img/poloniex.png" />
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
    }
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

export default graphql(getKeysQuery)(KeyList);
