import React from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { getProduct } from '../actions/products';

import {
    Button,
    Card, CardBody, CardImg, CardImgOverlay, CardText,
    Col,
    Container,
    UncontrolledCarousel,
    Row
} from 'reactstrap';

let canRedirect = true;

const Product = ({ auth, products, getProduct, ...props, }) => {
    const [redirect, setRedirect] = React.useState('');

    React.useEffect(() => {
        getProduct(props.match.params.productId);
    }, []);

    const handleClick = e => {
        if (auth.isAuthenticated) {
            setRedirect('');
        } else {
            setRedirect('/');
        }
    }

    if (redirect.length > 0 && canRedirect) {
        canRedirect = false;
        props.setShowLoginModal(true);
        return (<Redirect to={redirect} />);
    } else if (!canRedirect) {
        canRedirect = true;
        setRedirect('');
    }

    let productItem, quantity;
    if (products.product === null) {
        return null;
    } else {
        productItem = [
            {
                src: products.product.image,
                caption: '',
                header: ''
            },
        ]

        quantity = parseInt(products.product.units);
    }

    return (
        <Container className='mt-4'>
            <Row>
                <Col md={6} style={{ maxHeight: 500 }}>
                    <UncontrolledCarousel controls={false} indicators={false} items={productItem} />
                </Col>
                <Col className='ml-4' md={5} xs={11}>
                    <Row>
                        <h1 style={{ fontFamily: 'Montserrat', letterSpacing: '0.15rem', textRendering: 'optimizeLegibility' }}>{products.product.name}</h1>
                    </Row>
                    <Row className='mt-4'>
                        <h5 style={quantity === 0 ? { textDecoration: 'line-through' } : {}}>${products.product.price}</h5>
                        <p className='ml-2' style={{ fontSize: '0.8rem' }}>{quantity === 0 ? 'Out of stock' : `(${quantity} available in stock)`}</p>
                    </Row>
                    <Row className='mt-4'>
                        <Button className='btn-block' onClick={handleClick} style={{ fontWeight: 'bold', fontSize: '1.25rem' }} color='success'>Purchase</Button>
                    </Row>
                    <Row className='mt-5'>
                        <h3>About Product</h3>
                    </Row>
                    <Row className='mt-2'>
                        <p>{products.product.description}</p>
                    </Row>
                </Col>
            </Row>
        </Container >
    )
}

const mapStateToProps = state => ({
    products: state.products,
    auth: state.auth
});

export default connect(mapStateToProps, { getProduct })(Product);
