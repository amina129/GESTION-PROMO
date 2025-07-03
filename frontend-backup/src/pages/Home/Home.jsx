import React, { Component } from 'react';
import {AppNavbar} from '../../components/common/AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import '../../styles/App.css'
export class Home extends Component {
    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Button color="link" tag={Link} to="/clients">Clients</Button>
                </Container>
            </div>
        );
    }
}