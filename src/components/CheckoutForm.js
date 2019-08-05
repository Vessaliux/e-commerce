import React, { Component } from 'react';
import axios from 'axios';
import { CardElement, injectStripe } from 'react-stripe-elements';

import { connect } from 'react-redux';
import { cartCheckout } from '../actions/cart';

import {
    Button,
    Form,
    Modal, ModalHeader, ModalBody,
    Row,
    Toast, ToastHeader, ToastBody
} from 'reactstrap';

const CheckoutForm = ({ cartCheckout, ...props }) => {
    const [notification, setNotification] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [preventSubmit, setPreventSubmit] = React.useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setPreventSubmit(true);

        const { token } = await props.stripe.createToken({ name: "E-Commerce" });

        cartCheckout(token)
            .then(res => {
                setNotification(true);
            }).catch(err => {
                console.log(err.response);
                setError(true);
            }).finally(() => {
                setPreventSubmit(false);
                props.toggle();
                props.toggleCheckout();
            });
    }

    return (
        <React.Fragment>
            <Modal isOpen={props.isOpen} toggle={props.toggle}>
                <Form onSubmit={handleSubmit}>
                    <ModalHeader toggle={props.toggle}>Payment via Stripe</ModalHeader>
                    <ModalBody>
                        <Row className='flex-column px-3 py-2'>
                            <CardElement disabled={preventSubmit} id='card-element' className='p-2' />
                        </Row>

                        <Button disabled={preventSubmit} className='mt-2' color='info' style={{ width: '100%' }}>Pay ${props.calculate ? props.calculate() : 0} SGD</Button>
                    </ModalBody>
                </Form>
            </Modal>
            <Toast style={{ position: 'fixed', top: 0, right: 0, zIndex: 2000 }} isOpen={notification}>
                <ToastHeader toggle={() => setNotification(false)} icon='success'>Success</ToastHeader>
                <ToastBody>Your purchase has been successfully processed!</ToastBody>
            </Toast>
            <Toast style={{ position: 'fixed', top: 0, right: 0, zIndex: 2000 }} isOpen={error}>
                <ToastHeader toggle={() => setError(false)} icon='danger'>Error</ToastHeader>
                <ToastBody>Oops! An error ocurred.</ToastBody>
            </Toast>
        </React.Fragment>
    );
}

export default connect(null, { cartCheckout })(injectStripe(CheckoutForm));
