import React from 'react'
import '../styles/App.css';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function GenericNotFound() {
    return (
        <Container>
            <Row>
                <Col md={12}>
                    <Row className='justify-content-center'>
                        <h1>Oops!</h1>
                    </Row>
                    <div className='mt-4' />
                    <Row className='justify-content-center'>
                        <h1>404 Not Found</h1>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default GenericNotFound
