import React from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import store from '../store';
import { fetchUser } from '../actions/auth';

import {
    Alert,
    Button,
    Form, FormGroup, FormFeedback,
    Input,
    Label,
    Modal, ModalHeader, ModalBody,
} from 'reactstrap';

const LoginModal = ({ error, auth, dispatch, ...props }) => {
    const [alert, setAlert] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [validation, setValidation] = React.useState({
        email: null,
        password: null
    });

    React.useEffect(() => {
        if (error.header === 'login') {
            setAlert(true);
        }
    }, [error]);

    const handleDismiss = () => {
        setAlert(false);
    }

    const handleInputChange = (e, func) => {
        if (!Object.values(validation).every(value => value === null)) {
            setValidation({
                email: null,
                password: null,
            });
        }

        if (alert) {
            setAlert(false);
        }

        func(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();

        // validate empty fields
        if (email.length === 0) {
            setValidation({ ...validation, email: 'Please provide an email' });
            return;
        }
        if (password.length === 0) {
            setValidation({ ...validation, password: 'Please provide a password' });
            return;
        }

        store.dispatch(fetchUser(email, password));
    }

    if (auth.isAuthenticated) {
        return <Redirect to="/" />
    }

    return (
        <Modal
            {...props}
        >
            <ModalHeader toggle={props.toggle}>Login to E-Commerce</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    <Alert color='danger' isOpen={alert} toggle={handleDismiss}>{error.msg}</Alert>

                    <FormGroup>
                        <Label for='loginEmail'>Email</Label>
                        <Input invalid={validation.email !== null} type='email' id='loginEmail' onChange={e => { handleInputChange(e, setEmail) }} value={email} />
                        <FormFeedback>{validation.email}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for='loginPassword'>Password</Label>
                        <Input invalid={validation.password !== null} type='password' id='loginPassword' onChange={e => { handleInputChange(e, setPassword) }} value={password} />
                        <FormFeedback>{validation.password}</FormFeedback>
                    </FormGroup>

                    <Button color='primary'>Login</Button>
                </Form>
            </ModalBody>
        </Modal>
    )
}

const mapStateToProps = state => ({
    error: state.errors,
    auth: state.auth
});

export default connect(mapStateToProps)(LoginModal);
