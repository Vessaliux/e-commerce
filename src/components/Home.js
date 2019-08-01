import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProducts } from '../actions/products';

import { Button, Card, CardBody, CardImg, CardImgOverlay, CardText, Col, Container, Row } from 'reactstrap';

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

    const handleMouseLeaveCard = e => {
        setHoverId(0);
    }

    return (
        <Container className='mt-4' fluid={true}>
            <Col md={{ size: 10, offset: 1 }} xs={{ offset: 1, span: 10 }} >
                <Row style={{ minWidth: 800 }} >
                    {products.map(product => (
                        <Col key={product.id} md={4} xs={6} sm={6} lg={3}>
                            <Card
                                onMouseEnter={e => { handleMouseEnterCard(e, product.id) }}
                                onMouseLeave={handleMouseLeaveCard}
                                onClick={handleCardClick}
                                body outline color='muted'
                                style={cardStyle}
                            >
                                <CardImg
                                    style={parseInt(product.units) === 0 ? { ...cardImageStyle, opacity: 0.5 } : cardImageStyle}
                                    src={product.image}
                                />
                                <CardImgOverlay className='d-flex flex-column' style={{ padding: 0 }}>
                                    <Button className='mt-auto' variant={parseInt(product.units) === 0 ? 'danger' : 'secondary'} style={product.id === hoverId ? { width: '100%' } : { display: 'none' }}>{parseInt(product.units) === 0 ? 'OUT OF STOCK' : 'PURCHASE'}</Button>
                                </CardImgOverlay>
                                <CardBody>
                                    <CardText className='text-primary'>{product.name}</CardText>
                                    <CardText className='text-muted' style={{ fontWeight: 'bold' }}>${product.price}</CardText>
                                </CardBody>
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
