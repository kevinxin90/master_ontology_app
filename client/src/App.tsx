import React, { Component } from 'react'
import { Link, Route, Router, Switch } from 'react-router-dom'
import { Grid, Menu, Segment } from 'semantic-ui-react'

//import Auth from './auth/Auth'
import { EditOntology } from './components/EditOntology'
import { CreateOntology } from './components/CreateOntology'
import { GetOntology } from './components/GetOntology'
import { NotFound } from './components/NotFound'
import { Ontologies } from './components/Ontologies'
import Auth from 'aws-amplify';
import awsconfig from './aws-exports'
import { withAuthenticator } from 'aws-amplify-react'
Auth.configure(awsconfig);

export interface AppProps { }

export interface AppProps {
  auth: any
  history: any
}

export interface AppState { }

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props)
  }

  render() {
    return (
      <div>
        <Segment style={{ padding: '2em 0em' }} vertical>
          <Grid container stackable verticalAlign="middle">
            <Grid.Row>
              <Grid.Column width={16}>
                <Router history={this.props.history}>
                  {this.generateMenu()}

                  {this.generateCurrentPage()}
                </Router>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </div>
    )
  }

  generateMenu() {
    return (
      <Menu>
        <Menu.Item name="home">
          <Link to="/">Home</Link>
        </Menu.Item>

      </Menu>
    )
  }


  generateCurrentPage() {
    // if (!this.props.auth.isAuthenticated()) {
    //   return <LogIn auth={this.props.auth} />
    // }

    return (
      <Switch>
        <Route
          path="/"
          exact
          render={props => {
            return <Ontologies {...props} />
          }}
        />

        <Route
          path="/ontologies/:id/edit"
          exact
          render={props => {
            return <EditOntology {...props} />
          }}
        />

        <Route
          path="/ontologies/:id/view"
          exact
          render={props => {
            return <GetOntology {...props} />
          }}
        />

        <Route
          path="/createontology"
          exact
          render={props => {
            return <CreateOntology {...props} />
          }}
        />

        <Route component={NotFound} />
      </Switch>
    )
  }
}

export default withAuthenticator(App, { includeGreetings: true });