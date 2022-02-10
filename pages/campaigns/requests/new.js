import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import { Router, Link } from '../../../routes';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/Campaign';
import web3 from '../../../ethereum/web3';

class RequestNew extends Component {
    state = {
        value: '',
        description: '',
        recipient: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props){
        const { address } = props.query;

        return { address };
    }


    onSubmit = async (event) => {
        event.preventDefault();

        const campaign = Campaign(this.props.address);
        const { value, description, recipient } = this.state;
        
        this.setState({ loading: true, errorMessage: '' })

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({ 
                from: accounts[0]
            });

            Router.pushRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false })
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}/requests`}>
                    <a>
                        {`< Back`}
                    </a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            type="text"
                            value={this.state.description}
                            onChange={({ target }) => this.setState({ description: target.value })}
                            disabled={this.state.loading}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value</label>
                        <Input
                            type="number"
                            label="ether"
                            labelPosition="right"
                            value={this.state.value}
                            onChange={({ target }) => this.setState({ value: target.value })}
                            disabled={this.state.loading}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Recipient</label>
                        <Input
                            type="text"
                            value={this.state.recipient}
                            onChange={({ target }) => this.setState({ recipient: target.value })}
                            disabled={this.state.loading}
                        />
                    </Form.Field>
                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;