import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

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
    Row
} from 'reactstrap';

let timer = null;
const EditProfile = ({ auth, updateProfile }) => {
    const [notification, setNotification] = React.useState(false);
    const [alert, setAlert] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [isEditing, setIsEditing] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [validation, setValidation] = React.useState({
        username: null,
        email: null
    });
    const [preventSubmit, setPreventSubmit] = React.useState(false);

    React.useEffect(() => {
        setUsername(auth.user.name);
        setEmail(auth.user.email);

        return () => {
            if (timer !== null) {
                clearTimeout(timer);
            }
        };
    }, []);

    const handleInputChange = (e, func) => {
        if (!Object.values(validation).every(value => value === null)) {
            setValidation({
                username: null,
                email: null
            });
        }

        if (alert) {
            setAlert(false);
        }

        if (notification) {
            setNotification(false);
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
        setPreventSubmit(true);

        let data = {
            name: username,
            email
        };
        updateProfile(auth.user.id, data)
            .then(res => { handleUpdateSuccess(res) })
            .catch(err => { handleUpdateError(err) })
            .finally(() => {
                setPreventSubmit(false);
            });
    }

    const handleUpdateSuccess = res => {
        setAlert(false);
        setNotification(true);
        setMessage(res.msg);
        setIsEditing(false);

        timer = setTimeout(() => {
            setNotification(false);
            clearTimeout(timer);
        }, 2000);
    }

    const handleUpdateError = err => {
        setNotification(false);
        setAlert(true);
        setMessage(err.msg);
    }

    const onCancelClick = () => {
        setUsername(auth.user.name);
        setEmail(auth.user.email);
        setIsEditing(false);
    }

    return (
        <Container style={{ marginTop: '5rem' }}>
            <Col className='mt-4' md={{ size: 6, offset: 3 }}>
                <h1>Profile</h1>
                <Container className={isEditing ? 'd-none p-0' : ''}>
                    <Row>
                        <p className='mx-0 my-auto'><b>Name:</b> {username}</p>
                    </Row>
                    <Row className='mt-1'>
                        <p className='mx-0 my-auto'><b>Email:</b> {email}</p>
                    </Row>
                    <Row className='mt-2'>
                        <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    </Row>
                    <Row className='mt-4'>
                        <Alert color='success' isOpen={notification} toggle={() => { setNotification(false) }}>{message}</Alert>
                    </Row>
                </Container>
                <Form className={isEditing ? '' : 'd-none'} onSubmit={handleSubmit}>
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

                    <FormGroup>
                        <Button disabled={preventSubmit} color='primary'>Save</Button>
                        <Button className='ml-2' onClick={onCancelClick} color='secondary'>Cancel</Button>
                    </FormGroup>

                    <Alert color='danger' isOpen={alert} toggle={() => { setAlert(false) }}>{message}</Alert>
                </Form>
            </Col>
        </Container>
    )
}
EditProfile.propTypes = {
    auth: PropTypes.object.isRequired,
    updateProfile: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { updateProfile })(EditProfile);
