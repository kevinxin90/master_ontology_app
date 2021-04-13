import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { updateOntology, getOntology } from '../api/ontology-api'

export class EditOntology extends React.PureComponent<
  any,
  any
> {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  state: any = {
    conceptId: null,
    description: null,
    displayName: null,
    childIds: null,
    parentIds: null,
    alternateNames: null
  }

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  async componentDidMount() {
    try {
      const ontology = await getOntology(this.props.match.params.id)
      this.setState({
        ...ontology
      })
    } catch (e) {
      alert(`Failed to fetch ontology: ${e.message}`)
    }
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if (!this.state.conceptId) {
        alert('Concept ID should be selected')
        return
      }

      if (!this.state.displayName) {
        alert('Display Name should be selected')
        return
      }
      await updateOntology(this.state)
      alert('This ontology has been updated!')
      this.props.history.push('/')


    } catch (e) {
      alert('Could not EDIT ontology: ' + e.message)
    }
  }

  render() {
    return (
      <div>
        <h1>Edit ontology {this.state.id}</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Concept ID</label>
            <input
              type="text"
              name="conceptId"
              placeholder={this.state.conceptId}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Display Name</label>
            <input
              type="text"
              name="displayName"
              placeholder={this.state.displayName}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <input
              type="text"
              name="description"
              placeholder={this.state.description}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Parent Concept IDs</label>
            <input
              type="text"
              name="parentIds"
              placeholder={this.state.parentIds}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Child Concept IDs</label>
            <input
              type="text"
              name="childIds"
              placeholder={this.state.childIds}
              onChange={this.handleChange}
            />
          </Form.Field>
          <Form.Field>
            <label>Alternate Names</label>
            <input
              type="text"
              name="alternateNames"
              placeholder={this.state.alternateNames}
              onChange={this.handleChange}
            />
          </Form.Field>
          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          UPDATE
        </Button>
      </div>
    )
  }
}


