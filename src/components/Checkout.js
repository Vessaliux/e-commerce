import React from 'react';
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchCart, insertIntoCart, removeFromCart } from '../actions/cart';

import {
    Button,
    Card, CardImg, CardText,
    Col,
    Input,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Row
} from 'reactstrap';
import { Elements } from 'react-stripe-elements'

import CheckoutForm from './CheckoutForm';

const Checkout = ({ auth, cart, fetchCart, insertIntoCart, removeFromCart, ...props }) => {
    const [checkout, setCheckout] = React.useState(false);

    const calculateSubTotal = () => {
        let total = 0;
        for (const item of Object.values(cart.items)) {
            total += parseInt(item.quantity) * parseFloat(item.price);
        }

        return total.toFixed(2);
    }

    const handleQuantityClick = (productId, offset) => {
        insertIntoCart(productId, offset)
            .then(() => { })
            .catch(err => { console.log(err) });
    }

    const handleCheckoutClick = () => {
        setCheckout(true);
    }

    return !cart.items ? null : (
        <React.Fragment>
            <Modal isOpen={props.isOpen} toggle={props.toggle}>
                <ModalHeader toggle={props.toggle}>Checkout</ModalHeader>
                <ModalBody className='p-0'>
                    {cart.items.map(item => (
                        <Card key={item.id}>
                            <Row className='no-gutters'>
                                <Col className='p-2' md={4} xs={4}>
                                    <CardImg src={item.product.image} />
                                </Col>
                                <Col md={8} xs={8}>
                                    <CardText className='mb-0'>{item.product.name}</CardText>
                                    <CardText style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>${parseFloat(item.price).toFixed(2)} SGD</CardText>
                                    <Row className='no-gutters'>
                                        <Button className='px-3' size='sm' style={{ fontWeight: 'bold' }} color='light' onClick={() => handleQuantityClick(item.product.id, -1)}>-</Button>
                                        <Input bsSize='sm' disabled className='mx-2' style={{ width: '3rem', textAlign: 'center' }} type='text' value={item.quantity} />
                                        <Button className='px-3' size='sm' style={{ fontWeight: 'bold' }} color='light' onClick={() => handleQuantityClick(item.product.id, 1)}>+</Button>
                                    </Row>
                                    <Button className='mt-1 mr-1' size='sm' style={{ position: 'absolute', top: 0, right: 0 }} color='danger' onClick={() => { removeFromCart(item.product.id) }}>Remove</Button>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </ModalBody>
                <ModalFooter style={{ justifyContent: 'flex-start', backgroundColor: '#e9ecef' }}>
                    <Col>
                        <CardText style={{ fontWeight: 'bold' }}>SUBTOTAL</CardText>
                    </Col>
                    <Col>
                        <CardText style={{ textAlign: 'right' }}>${calculateSubTotal()} SGD</CardText>
                    </Col>
                    <Button onClick={handleCheckoutClick}>Checkout</Button>
                </ModalFooter>
            </Modal>
            <Elements>
                <CheckoutForm isOpen={checkout} toggleCheckout={props.toggle} toggle={() => { setCheckout(false) }} calculate={calculateSubTotal} token={auth.token} />
            </Elements>
        </React.Fragment>
    )
}
Checkout.propTypes = {
    auth: PropTypes.object.isRequired,
    cart: PropTypes.object.isRequired,
    fetchCart: PropTypes.func.isRequired,
    insertIntoCart: PropTypes.func.isRequired,
    removeFromCart: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    cart: state.cart.cart
});

export default connect(mapStateToProps, { fetchCart, insertIntoCart, removeFromCart })(Checkout);
