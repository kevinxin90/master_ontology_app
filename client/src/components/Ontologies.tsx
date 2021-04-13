import { History } from 'history'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { deleteOntology, getOntologies, searchOntology } from '../api/ontology-api'
//import Auth from '../auth/Auth'
import { getUserGroup } from '../auth/cognito'
import { Ontology } from '../types/Ontology'

interface OntologiessProps {
  history: History
  edit?: Ontology
}

interface OntologiesState {
  ontologies: Ontology[]
  loadingOntologies: boolean
  group: string[]
}

export class Ontologies extends React.PureComponent<OntologiessProps, OntologiesState> {
  constructor(props) {
    super(props);
    this.onOntologySearch = this.onOntologySearch.bind(this);
  }
  state: OntologiesState = {
    ontologies: [],
    loadingOntologies: true,
    group: []
  }


  onEditButtonClick = (ontology: Ontology) => {
    this.props.history.push(`/ontologies/${ontology.id}/edit`)
  }

  onOntologyCreate = async () => {
    this.props.history.push(`/createontology`)
  }

  onOntologyView = async (id: string) => {
    this.props.history.push(`/ontologies/${id}/view`)
  }

  onOntologyDelete = async (ontologyId: string) => {
    try {
      await deleteOntology(ontologyId)
      this.setState({
        ontologies: this.state.ontologies.filter(ontology => ontology.id != ontologyId)
      })
    } catch {
      alert('Ontology deletion failed')
    }
  }

  onOntologySearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (event.target.value) {
        const res = await searchOntology(event.target.value);
        this.setState({
          ontologies: res
        })
      } else {
        const ontologies = await getOntologies()
        this.setState({
          ontologies
        })
      }

    } catch {
      alert('Ontology search failed')
    }
  }

  async componentDidMount() {
    try {
      // const session = await Auth.currentSession();
      // console.log("id token", session.getIdToken().getJwtToken())
      // const user = await Auth.currentAuthenticatedUser();
      // console.log('groups', user.signInUserSession.accessToken.payload["cognito:groups"])
      const ontologies = await getOntologies()
      const group = await getUserGroup();
      this.setState({
        ontologies,
        group,
        loadingOntologies: false
      })
    } catch (e) {
      this.setState({ loadingOntologies: false })
      alert(`Failed to fetch ontologies: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Master Ontology Management Portal</Header>
        {this.renderCreateOntologyInput()}
        {this.renderSearchOntologyInput()}
        {this.renderOntologies()}
      </div>
    )
  }

  renderSearchOntologyInput() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <Input
            label="Search"
            onChange={this.onOntologySearch}
            placeholder="search..."
            fluid
            actionPosition="left"
          />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCreateOntologyInput() {
    if (this.state.group.includes('ontology')) {
      return (
        <Grid.Row>
          <Grid.Column width={16}>
            <Button
              icon
              color="green"
              onClick={() => this.onOntologyCreate()}
            >Add new Ontology</Button>
          </Grid.Column>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
      )
    }

  }

  renderOntologies() {
    if (this.state.loadingOntologies) {
      return this.renderLoading()
    }

    return this.renderOntologiesList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Ontologies
        </Loader>
      </Grid.Row>
    )
  }

  renderOntologiesList() {
    return (
      <Grid padded>
        <Grid.Row key={"explanation"}>
          <Grid.Column width={2} verticalAlign="middle">
            <b>ID</b>
          </Grid.Column>
          <Grid.Column width={4} verticalAlign="middle">
            <b>Name</b>
          </Grid.Column>
          <Grid.Column width={6} verticalAlign="middle">
            <b>DESCRIPTION</b>
          </Grid.Column>
          <Grid.Column width={1} floated="right">
            <b>DETAIL</b>
          </Grid.Column>
          {this.state.group.includes('ontology') ? <Grid.Column width={1} floated="right">
            <b>EDIT</b>
          </Grid.Column> : ''}
          {this.state.group.includes('ontology') ? <Grid.Column width={1} floated="right">
            <b>DELETE</b>
          </Grid.Column> : ''}

          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </Grid.Row>
        {this.state.ontologies.map((todo, pos) => {
          return (
            <Grid.Row key={todo.id}>
              <Grid.Column width={2} verticalAlign="middle">
                {todo.conceptId}
              </Grid.Column>
              <Grid.Column width={4} verticalAlign="middle">
                {todo.displayName}
              </Grid.Column>
              <Grid.Column width={6} verticalAlign="middle">
                {todo.description}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="green"
                  onClick={() => this.onOntologyView(todo.id)}
                >
                  <Icon name="folder open" />
                </Button>
              </Grid.Column>
              {this.state.group.includes('ontology') ?
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="blue"
                    onClick={() => this.onEditButtonClick(todo)}
                  >
                    <Icon name="pencil" />
                  </Button>
                </Grid.Column> : ''}
              {this.state.group.includes('ontology') ?
                <Grid.Column width={1} floated="right">
                  <Button
                    icon
                    color="red"
                    onClick={() => this.onOntologyDelete(todo.id)}
                  >
                    <Icon name="delete" />
                  </Button>
                </Grid.Column> : ''}
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
