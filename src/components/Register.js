import React from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { registerUser } from '../actions/auth';

import {
    Alert,
    Button,
    Col,
    Container,
    Form, FormGroup, FormFeedback,
    Input,
    Label,
    Modal, ModalHeader, ModalBody,
} from 'reactstrap';

const Register = ({ error, auth, notification, registerUser }) => {
    const [alert, setAlert] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [validation, setValidation] = React.useState({
        username: null,
        email: null,
        password: null,
        password2: null
    });

    React.useEffect(() => {
        if (error.header === 'register') {
            setAlert(true);
        }
    }, [error]);

    React.useEffect(() => {
        if (notification.header === 'register') {
            console.log(notification);
        }
    }, [notification]);

    const handleDismiss = () => {
        setAlert(false);
    }

    const handleInputChange = (e, func) => {
        if (!Object.values(validation).every(value => value === null)) {
            setValidation({
                username: null,
                email: null,
                password: null,
                password2: null
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
        const fields = {
            username,
            email,
            password,
            password2
        }
        for (const [key, value] of Object.entries(fields)) {
            if (value.length === 0) {
                const obj = {};
                obj[key] = `Please enter ${key}`;
                setValidation({ ...validation, ...obj });

                return;
            }
        }

        registerUser({
            name: username,
            email,
            password,
            c_password: password2
        });
    }

    if (auth.isAuthenticated) {
        return <Redirect to="/" />
    }

    return (
        <Container className='mt-4'>
            <Col md={{ size: 6, offset: 3 }}>
                <h1>Register</h1>
                <Form className='mt-4' onSubmit={handleSubmit}>
                    <Alert color='danger' isOpen={alert} toggle={handleDismiss}>{error.msg}</Alert>

                    <FormGroup>
                        <Label for='registerUsername'>Name</Label>
                        <Input invalid={validation.username !== null} type='text' id='registerUsername' onChange={e => { handleInputChange(e, setUsername) }} name='username' value={username} />
                        <FormFeedback>{validation.username}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for='registerEmail'>Email</Label>
                        <Input invalid={validation.email !== null} type='email' id='registerEmail' onChange={e => { handleInputChange(e, setEmail) }} name='email' value={email} />
                        <FormFeedback>{validation.email}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for='registerPassword'>Password</Label>
                        <Input invalid={validation.password !== null} type='password' id='registerPassword' onChange={e => { handleInputChange(e, setPassword) }} name='password' value={password} />
                        <FormFeedback>{validation.password}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for='registerPasswordConfirm'>Confirm Password</Label>
                        <Input invalid={validation.password2 !== null} type='password' id='registerPasswordConfirm' onChange={e => { handleInputChange(e, setPassword2) }} name='password2' value={password2} />
                        <FormFeedback>{validation.password2}</FormFeedback>
                    </FormGroup>

                    <Button color='primary'>Register</Button>
                </Form>
            </Col>
        </Container>
    )
}

const mapStateToProps = state => ({
    error: state.errors,
    auth: state.auth,
    notification: state.notification
});

export default connect(mapStateToProps, { registerUser })(Register);
