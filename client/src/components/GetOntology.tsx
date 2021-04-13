import * as React from 'react'
import { Button, Card, Grid, Loader } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getOntology } from '../api/ontology-api'

enum UploadState {
    NoUpload,
    FetchingPresignedUrl,
    UploadingFile,
}

interface EditOntologyProps {
    match: {
        params: {
            id: string
        }
    }
}

interface EditOntologyState {
    file: any
    uploadState: UploadState
}

export class GetOntology extends React.PureComponent<
    EditOntologyProps,
    EditOntologyState
> {
    state: EditOntologyState = {
        file: undefined,
        uploadState: UploadState.NoUpload
    }

    async componentDidMount() {
        try {
            const ontology = await getOntology(this.props.match.params.id)
            this.setState({
                file: ontology
            })
        } catch (e) {
            alert(`Failed to fetch ontology: ${e.message}`)
        }
    }

    handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (!files) return

        this.setState({
            file: files[0]
        })
    }


    render() {
        if (!this.state.file) {
            return this.renderLoading()
        }
        return (
            <div>
                <h1>{"Details about Ontology ID: " + this.state.file.id}</h1>

                <Card.Group>
                    <Card>
                        <Card.Content>
                            <Card.Header>{"Ontology ID: " + this.state.file.conceptId}</Card.Header>
                            <Card.Meta>{"Display Name: " + this.state.file.displayName}</Card.Meta>
                            <Card.Description>
                                {'Description: ' + this.state.file.description}
                            </Card.Description>
                            <Card.Description>
                                {'Parent Ids: ' + this.state.file.parentIds}
                            </Card.Description>
                            <Card.Description>
                                {'Child Ids: ' + this.state.file.childIds}
                            </Card.Description>
                            <Card.Description>
                                {'Alternate Names: ' + this.state.file.alternateNames}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </div>
        )
    }

    renderLoading() {
        return (
            <Grid.Row>
                <Loader indeterminate active inline="centered">
                    Loading Ontology info
            </Loader>
            </Grid.Row>
        )
    }

    renderButton() {

        return (
            <div>
                {this.state.uploadState === UploadState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
                {this.state.uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
                <Button
                    loading={this.state.uploadState !== UploadState.NoUpload}
                    type="submit"
                >
                    Upload
        </Button>
            </div>
        )
    }
}
