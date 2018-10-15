import React, { Component } from 'react'
import {graphql, compose} from 'react-apollo'
import { getAuditLog } from '../../../queries'

import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 20,
    margin: 10
  },
  textField: {
    width: '60%',
    marginLeft:'20%',
    marginBottom: 10
  },
  menu: {
    width: 200,
  },
  button: {
    margin: theme.spacing.unit,
  },
  actionButton: {
    textAlign: 'center',
    marginTop: 10
  },
});


class AuditLogList extends Component {

  constructor(props){
    super(props)
    const key = this.props.currentKey
    this.state = {
      id: key.id,
      key: key.key,
      date:'',
      action: ''
    }
  }

  render() {
    const { classes } = this.props
    var data = this.props.data
    if(data.loading){
      return <Typography className={classes.root} variant='subheading'>Loading...</Typography>
    }else{

      if(!data.keyVault_AuditLogs){
        return <Typography className={classes.root} variant='subheading'>There has been an erorr.</Typography>
      }
      if(data.keyVault_AuditLogs.length === 0){
        return <Typography className={classes.root} variant='subheading'>There is no audit history for this key.</Typography>
      }

      return (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.keyVault_AuditLogs.map(row => {
              return (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.date}
                  </TableCell>
                  <TableCell>{row.action}</TableCell>
                  <TableCell>{row.details}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )
    }
  }

}

export default compose(
  graphql(getAuditLog, { // What follows is the way to pass a parameter to a query.
    options: (props) => {
      return {
        variables: {
          key: props.currentKey.id
        }
      }
    }
  }),
  withStyles(styles)
)(AuditLogList)
