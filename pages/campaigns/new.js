import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import { Router } from "../../routes";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({ from: accounts[0] });

      Router.push("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ loading: false, minimumContribution: "" });
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              type="number"
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={({ target }) =>
                this.setState({ minimumContribution: target.value })
              }
              disabled={this.state.loading}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button primary loading={this.state.loading}>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
