import React from 'react';
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getProducts } from '../actions/products';
import { insertIntoCart } from '../actions/cart';

import {
    Button,
    Card, CardBody, CardImg, CardImgOverlay, CardText,
    Col,
    Container,
    Row
} from 'reactstrap';

const cardStyle = {
    marginBottom: '2.5rem',
    cursor: 'pointer'
}

const cardImageStyle = {
    height: '20rem',
    objectFit: 'cover'
}

function Home({ products, getProducts, insertIntoCart }) {
    const [hoverId, setHoverId] = React.useState(0);
    const [redirect, setRedirect] = React.useState('');
    const btnAddToCart = React.useRef(null);

    React.useEffect(() => {
        getProducts();
    }, []);

    const handleCardClick = (e, productId) => {
        if (btnAddToCart.current.props.name === e.target.name) {
            insertIntoCart(productId)
                .then(() => { })
                .catch(err => { console.log(err) });
        } else {
            setRedirect(`/products/${productId}`)
        }
    }

    const handleMouseEnterCard = (e, productId) => {
        setHoverId(productId);
    }

    const handleMouseLeaveCard = e => {
        setHoverId(0);
    }

    if (redirect.length > 0) {
        return (<Redirect to={redirect} />);
    }

    return (
        <Container style={{ marginTop: '5rem' }} fluid={true}>
            <Col md={{ size: 10, offset: 1 }} xs={{ offset: 1, span: 10 }} >
                <Row style={{ minWidth: 800 }} >
                    {products.map(product => (
                        <Col key={product.id} md={4} xs={6} sm={6} lg={3}>
                            <Card
                                onMouseEnter={e => { handleMouseEnterCard(e, product.id) }}
                                onMouseLeave={handleMouseLeaveCard}
                                onClick={e => { handleCardClick(e, product.id) }}
                                body outline color='muted'
                                style={cardStyle}
                            >
                                <CardImg
                                    style={parseInt(product.units) === 0 ? { ...cardImageStyle, opacity: 0.5 } : cardImageStyle}
                                    src={product.image}
                                />
                                <CardImgOverlay className='d-flex flex-column' style={{ padding: 0 }}>
                                    <Button ref={btnAddToCart} className='mt-auto' name='btnAddToCart' variant={parseInt(product.units) === 0 ? 'danger' : 'secondary'} style={product.id === hoverId ? { width: '100%' } : { display: 'none' }}>{parseInt(product.units) === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}</Button>
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
    products: PropTypes.array.isRequired,
    getProducts: PropTypes.func.isRequired,
    insertIntoCart: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    products: state.products.products
});

export default connect(mapStateToProps, { getProducts, insertIntoCart })(Home);
