import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { fetchUser } from '../actions/auth';

import {
    Alert,
    Button,
    Form, FormGroup, FormFeedback,
    Input,
    Label,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Row
} from 'reactstrap';

const LoginModal = ({ auth, fetchUser, dispatch, ...props }) => {
    const [alert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [remember, setRemember] = React.useState(false);
    const [validation, setValidation] = React.useState({
        email: null,
        password: null
    });
    const [preventSubmit, setPreventSubmit] = React.useState(false);

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

        if (preventSubmit) {
            return;
        }

        // validate empty fields
        if (email.length === 0) {
            setValidation({ ...validation, email: 'Please provide an email' });
            return;
        }
        if (password.length === 0) {
            setValidation({ ...validation, password: 'Please provide a password' });
            return;
        }

        setPreventSubmit(true);
        fetchUser(email, password, remember)
            .then(handleLoginSuccess)
            .catch(err => { handleLoginError(err); })
            .finally(() => {
                setPreventSubmit(false);
            });
    }

    const handleLoginSuccess = () => {
        setEmail('');
        setPassword('');
        props.toggle();

        return (<Redirect to='/' />);
    }

    const handleLoginError = (err) => {
        setAlert(true);
        setMessage(err.msg);
    }

    return (
        <Modal
            {...props}
        >
            <ModalHeader toggle={props.toggle}>Login to E-Commerce</ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
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

                    <FormGroup check>
                        <Input checked={remember} type='checkbox' id='loginRemember' onChange={() => { setRemember(!remember) }} value={password} />
                        <Label for='loginRemember'>Remember Me</Label>
                    </FormGroup>

                    <Button className='mt-2' disabled={preventSubmit} color='primary'>Login</Button>

                    <Alert className='mt-4' color='danger' isOpen={alert} toggle={() => { setAlert(false) }}>{message}</Alert>
                </Form>
            </ModalBody>
            <ModalFooter style={{ justifyContent: 'space-between' }}>
                <Row className='align-items-center ml-1'>
                    <p style={{ margin: 0 }}>Not a member?</p>
                    <Link className='ml-1' color='link' onClick={props.toggle} to='/register'>Register</Link>
                </Row>

            </ModalFooter>
        </Modal>
    )
}
LoginModal.propTypes = {
    auth: PropTypes.object.isRequired,
    fetchUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { fetchUser })(LoginModal);
