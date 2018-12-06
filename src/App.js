import React, { Component } from 'react';
// Material-UI
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import httpHelper from './helper/httpHelper';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import _ from 'lodash';

// Material icons
import PagesIcon from '@material-ui/icons/Pages';
import SubjectIcon from '@material-ui/icons/Subject';

import 'typeface-roboto';

// Custom Style
const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flexGrow: 1
  },
  appBar: {
    backgroundColor: theme.palette.primary[theme.palette.type],
    color: theme.palette.primary.contrastText
  },
  widget: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 4
  },
  link: {
    color: theme.palette.text.secondary
  },
  containerGrid: {
      height: window.innerHeight-200,
      margin: '20px 50px',
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    const headerStyle = {
      outline: 'none',
    };

    this.state = {
        columnDefs: [
            {
              Header: "Basic Info",
              columns: [
                { Header: "Name", accessor: "name", headerStyle},
                { Header: "Native Name", accessor: "nativeName", headerStyle},
                { Header: "Capital", accessor: "capital", headerStyle},
              ]
            },
            {
              Header: "Population",
              columns: [
                {
                  Header: "Count",
                  accessor: "population",
                  headerStyle,
                },
                {
                  Header: "Sum",
                  accessor: "population",
                  headerStyle,
                  aggregate: vals => _.sum(vals)
                },
                {
                  Header: "Remark",
                  accessor: "Remark",
                  headerStyle,
                }]
            },
            {
              Header: "Region Info",
              columns: [
                { Header: "Region", accessor: "region", headerStyle, PivotValue: ({ value }) =>
                    <span style={{ color: "darkBlue" }}>
                      {value}
                    </span>
                },
                { Header: "Sub-Region", accessor: "subregion", headerStyle, PivotValue: ({ value }) =>
                    <span style={{ color: "darkBlue" }}>
                      {value}
                    </span>
                },
                { Header: "Area (sq. KM)", accessor: "area", headerStyle}
              ],
            },
        ],
        rowData: [],
        showPivot: false,
    };

    this.pivotAttributes = [];
    this.gotData = this.gotData.bind(this);
    this.handlePivot = this.handlePivot.bind(this);
  }

  componentDidMount() {
    const httpObj = {
      url: '/all?fields=name;capital;currencies;region;subregion;area;nativeName;languages;timezones;population',
      method: 'get',
    };
    httpHelper(httpObj, this.gotData);
  }

  /**
   * HTTP Response.
   * @param  {Object} data [HTTP Response Object.]
   */
  gotData({ data }) {
    this.setState({ rowData: data });
  }

  /**
   * Handle Pivot button click.
   */
  handlePivot() {
    this.setState({ showPivot: !this.state.showPivot });
  }

  render() {
    const { classes } = this.props;
    const { columnDefs, rowData, showPivot } = this.state;
    let pivotAttributes = [];

    if (showPivot) {
      pivotAttributes = ['region', 'subregion'];
    }

    return (
      <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              React-Table
            </Typography>
            <Tooltip title="Apply Pivot" enterDelay={300}>
               <IconButton onClick={this.handlePivot} color="inherit">
                 {showPivot ? <PagesIcon /> : <SubjectIcon />}
               </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Grid container>
          <Grid
            item
            xs={12}
            className={classes.containerGrid}
          >
            <ReactTable
              filterable
              data={rowData}
              columns={columnDefs}
              showPagination
              showPageSizeOptions
              showPaginationTop
              showPaginationBottom={false}
              defaultPageSize={20}
              className="-striped -highlight"
              pivotBy={pivotAttributes}
              collapseOnSortingChange={false}
              multiSort
              sortable
            />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
