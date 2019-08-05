import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { registerUser } from '../actions/auth';

import {
    Alert,
    Button,
    Col,
    Container,
    Form, FormGroup, FormFeedback,
    Input,
    Label
} from 'reactstrap';

const Register = ({ auth, registerUser }) => {
    const [alert, setAlert] = React.useState(false);
    const [notification, setNotification] = React.useState(false);
    const [message, setMessage] = React.useState('');
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
    const [preventSubmit, setPreventSubmit] = React.useState(false);

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
        setPreventSubmit(true);

        let data = {
            name: username,
            email,
            password,
            c_password: password2
        }
        registerUser(data)
            .then(res => { handleRegisterSuccess(res) })
            .catch(err => { handleRegisterError(err) })
            .finally(() => {
                setPreventSubmit(false);
            });
    }

    const handleRegisterSuccess = res => {
        setAlert(false);
        setNotification(true);
        setMessage(res.msg);

        setUsername('');
        setEmail('');
        setPassword('');
        setPassword2('');

        let timer = setTimeout(() => {
            setNotification(false);
            clearTimeout(timer);
        }, 2000);
    }

    const handleRegisterError = err => {
        setNotification(false);
        setAlert(true);
        setMessage(err.msg);
    }

    if (auth.isAuthenticated) {
        return <Redirect to="/" />;
    }

    return (
        <Container style={{ marginTop: '5rem' }}>
            <Col md={{ size: 6, offset: 3 }}>
                <h1>Register</h1>
                <Form className='mt-4' onSubmit={handleSubmit}>
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

                    <Button disabled={preventSubmit} className='mb-4' color='primary'>Register</Button>

                    <Alert color='danger' isOpen={alert} toggle={() => { setAlert(false) }}>{message}</Alert>
                    <Alert color='success' isOpen={notification} toggle={() => { setNotification(false) }}>{message}</Alert>
                </Form>
            </Col>
        </Container>
    )
}
Register.propTypes = {
    auth: PropTypes.object.isRequired,
    registerUser: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { registerUser })(Register);
