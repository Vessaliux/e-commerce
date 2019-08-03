import React from 'react';
import { Redirect } from 'react-router-dom';

import { connect } from 'react-redux';
import { updateProfile } from '../actions/users';

import {
    Alert,
    Button,
    Col,
    Container,
    Form, FormGroup, FormFeedback,
    Input,
    Label,
} from 'reactstrap';

const EditProfile = ({ error, auth, notification, updateProfile }) => {
    const [notificationAlert, setNotificationAlert] = React.useState(false);
    const [errorAlert, setErrorAlert] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [validation, setValidation] = React.useState({
        username: null,
        email: null
    });

    React.useEffect(() => {
        if (error.header === 'edit_profile') {
            setNotificationAlert(false);
            setErrorAlert(true);
        }
    }, [error]);

    React.useEffect(() => {
        if (notification.header === 'edit_profile') {
            setErrorAlert(false);
            setNotificationAlert(true);
            let timer = setTimeout(() => {
                setNotificationAlert(false);
            }, 3000);

            return () => {
                clearTimeout(timer);
            }
        }
    }, [notification]);

    React.useEffect(() => {
        setUsername(auth.user.name);
        setEmail(auth.user.email);
    }, [true]);

    const handleInputChange = (e, func) => {
        if (!Object.values(validation).every(value => value === null)) {
            setValidation({
                username: null,
                email: null
            });
        }

        if (errorAlert) {
            setErrorAlert(false);
        }

        if (notificationAlert) {
            setNotificationAlert(false);
        }

        func(e.target.value);
    }

    const handleSubmit = e => {
        e.preventDefault();

        // validate empty fields
        const fields = {
            username,
            email
        }
        for (const [key, value] of Object.entries(fields)) {
            if (value.length === 0) {
                const obj = {};
                obj[key] = `Please enter ${key}`;
                setValidation({ ...validation, ...obj });

                return;
            }
        }

        updateProfile(auth.user.id, {
            name: username,
            email
        });
    }

    return (
        <Container className='mt-4'>
            <Col md={{ size: 6, offset: 3 }}>
                <h1>Profile</h1>
                <Form className='mt-4' onSubmit={handleSubmit}>
                    <FormGroup>
                        <Label for='editUsername'>Name</Label>
                        <Input invalid={validation.username !== null} type='text' id='editUsername' onChange={e => { handleInputChange(e, setUsername) }} value={username} />
                        <FormFeedback>{validation.username}</FormFeedback>
                    </FormGroup>

                    <FormGroup>
                        <Label for='editEmail'>Email</Label>
                        <Input invalid={validation.email !== null} type='email' id='editEmail' onChange={e => { handleInputChange(e, setEmail) }} value={email} />
                        <FormFeedback>{validation.email}</FormFeedback>
                    </FormGroup>

                    <Button className='mb-4'>Edit</Button>

                    <Alert color='danger' isOpen={errorAlert} toggle={() => { setErrorAlert(!errorAlert) }}>{error.msg}</Alert>
                    <Alert color='success' isOpen={notificationAlert} toggle={() => { setNotificationAlert(!notificationAlert) }}>{notification.msg}</Alert>
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

export default connect(mapStateToProps, { updateProfile })(EditProfile);
