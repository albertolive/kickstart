import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/Campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        loadingApprove: false,
        loadingFinalize: false
    };

    onApprove = async () => {
        const { id, address } = this.props;
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();

        this.setState({ loadingApprove: true });

        try {
            await campaign.methods.approveRequest(id).send({ from: accounts[0] });
            
            Router.replaceRoute(`/campaigns/${address}/requests`);
        } catch (err) {
           console.log(err.message);
        }

        this.setState({ loadingApprove: false });
    }

    onFinalize = async () => {
        const { id, address } = this.props;
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();

        this.setState({ loadingFinalize: true });

        try {
            await campaign.methods.finalizeRequest(id).send({ from: accounts[0] });
            
            Router.replaceRoute(`/campaigns/${address}/requests`);
        } catch (err) {
           console.log(err.message);
        }

        this.setState({ loadingFinalize: false });
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const { description, value, recipient, approvalCount, complete } = request;
        const readyToFinalize = approvalCount > approversCount / 2;
        return (
            <Row disabled={complete} positive={readyToFinalize && !complete}>
                <Cell>{id}</Cell>
                <Cell>{description}</Cell>
                <Cell>{web3.utils.fromWei(value, 'ether')}</Cell>
                <Cell>{recipient}</Cell>
                <Cell>{`${approvalCount} / ${approversCount}`}</Cell>
                <Cell>
                    <Button 
                        color="green" 
                        basic={!complete}
                        disabled={complete || approvalCount === approversCount}
                        loading={this.state.loadingApprove}
                        onClick={this.onApprove}>
                        {complete ? 'Approved' : 'Approve'}
                    </Button>
                </Cell>
                <Cell>
                    <Button 
                        color={complete ? 'green' : 'teal'}
                        basic={!complete}
                        disabled={!readyToFinalize || complete} 
                        loading={this.state.loadingFinalize}
                        onClick={this.onFinalize}>
                        {complete ? 'Finalized' : 'Finalize'}
                    </Button>
                </Cell>
            </Row>
        );
    }
}

export default RequestRow;