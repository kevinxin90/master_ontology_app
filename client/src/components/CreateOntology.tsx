import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import { createOntology } from '../api/ontology-api'

enum UploadState {
    NoUpload,
    FetchingPresignedUrl,
    UploadingFile,
}



export class CreateOntology extends React.PureComponent<
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

    handleSubmit = async (event: React.SyntheticEvent) => {
        event.preventDefault()

        try {
            if (!this.state.conceptId) {
                alert('Concept ID should be filled')
                return
            }
            if (!parseInt(this.state.conceptId)) {
                alert('Concept ID must be an interger')
                return
            }

            if (!this.state.displayName) {
                alert('Display Name should be filled')
                return
            }
            await createOntology(this.state)

            alert('A new ontology was created!')
            this.props.history.push("/")
        } catch (e) {
            alert('Could not create a new ontology: ' + e.message)
        } finally {
            this.setUploadState(UploadState.NoUpload)
        }
    }

    setUploadState(uploadState: UploadState) {
        this.setState({
            uploadState
        })
    }

    render() {
        return (
            <div>
                <h1>Creating new ontology</h1>

                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Concept ID</label>
                        <input
                            type="text"
                            name="conceptId"
                            placeholder="concept id"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Display Name</label>
                        <input
                            type="text"
                            name="displayName"
                            placeholder="Disease of Eye"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Description</label>
                        <input
                            type="text"
                            name="description"
                            placeholder="Disease Targeting the Eye"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Parent Concept IDs</label>
                        <input
                            type="text"
                            name="parentIds"
                            placeholder="1,2"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Child Concept IDs</label>
                        <input
                            type="text"
                            name="childIds"
                            placeholder="3,4"
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Alternate Names</label>
                        <input
                            type="text"
                            name="alternateNames"
                            placeholder="Name1, Name2"
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
                    Create
        </Button>
            </div>
        )
    }
}
