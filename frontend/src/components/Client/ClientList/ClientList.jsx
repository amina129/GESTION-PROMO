import React, { Component } from 'react';
import { Button, ButtonGroup, Container, Table } from 'reactstrap';
import {AppNavbar} from '../../common/AppNavbar';
import { Link } from 'react-router-dom';

export class ClientList extends Component {
    constructor(props) {
        super(props);
        this.state = {clients: [], isLoading: true};
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        fetch('/clients')
            .then(response => response.json())
            .then(data => this.setState({clients: data, isLoading: false}))
            .catch(error => {
                console.error('Error fetching clients:', error);
                this.setState({isLoading: false});
            });
    }

    async remove(id) {
        try {
            await fetch(`/clients/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let updatedClients = [...this.state.clients].filter(i => i.id !== id);
            this.setState({clients: updatedClients});
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    }

    render() {
        const {clients, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const clientList = clients.map(client => {
            return <tr key={client.id}>
                <td style={{whiteSpace: 'nowrap'}}>{client.name}</td>
                <td>{client.email}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/clients/" + client.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(client.id)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/clients/new">Add Client</Button>
                    </div>
                    <h3>Clients</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th width="20%">Name</th>
                            <th width="20%">Email</th>
                            <th width="10%">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clientList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}