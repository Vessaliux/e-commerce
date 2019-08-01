import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProducts } from '../actions/products';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const cardStyle = {
    marginBottom: '2.5rem',
    cursor: 'pointer'
}

const cardImageStyle = {
    height: '20rem',
    objectFit: 'cover'
}

function Home({ products, getProducts }) {
    const [hoverId, setHoverId] = React.useState(0);

    React.useEffect(() => {
        getProducts();
    }, [true]);

    const handleCardClick = (e) => {
        console.log(e.target);
    }

    const handleMouseEnterCard = (e, productId) => {
        setHoverId(productId);
    }

    return (
        <Container fluid='true'>
            <Col md={{ offset: 1, span: 10 }} xs={{ offset: 1, span: 10 }} >
                <Row style={{ minWidth: 800 }} className='justify-content-left' >
                    {products.map(product => (
                        <Col key={product.id} md={4} xs={6} sm={6} lg={3}>
                            <Card id={`card_${product.id}`} onMouseEnter={e => { handleMouseEnterCard(e, product.id) }} onClick={handleCardClick} border='info' style={cardStyle}>
                                <Card.Img style={parseInt(product.units) === 1000 ? { ...cardImageStyle, opacity: 0.5 } : cardImageStyle} variant="top" src={product.image} />
                                <Card.ImgOverlay style={{ padding: 0 }}>
                                    <Button variant={parseInt(product.units) === 1000 ? 'danger' : 'secondary'} style={product.id === hoverId ? { width: '100%' } : { display: 'none' }}>{parseInt(product.units) === 1000 ? 'OUT OF STOCK' : 'PURCHASE'}</Button>
                                </Card.ImgOverlay>
                                <Card.Body>
                                    <Card.Text className='text-primary'>{product.name}</Card.Text>
                                    <Card.Text style={{ fontWeight: 'bold' }}>${product.price}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Container >
    )
}

Home.propTypes = {
    products: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    products: state.products.products
});

export default connect(mapStateToProps, { getProducts })(Home);
