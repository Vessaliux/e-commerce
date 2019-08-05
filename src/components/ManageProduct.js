import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getProducts, updateProduct, uploadProductImage, insertProduct } from '../actions/products';

import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import {
    Alert,
    Button,
    Col,
    Container,
    Form, FormGroup, FormFeedback,
    Input, InputGroup, InputGroupAddon,
    Label,
    Modal, ModalHeader, ModalBody, ModalFooter,
    Spinner,
    Row
} from 'reactstrap';

let collapsed = [];
let fields = {};
let DeleteIndex = 0;
const ManageProduct = ({ products, getProducts, updateProduct, uploadProductImage, insertProduct, ...props }) => {
    const [collapsedList, setCollapsedList] = React.useState([]);
    const [fieldData, setFieldData] = React.useState({});
    const [deleteModal, setDeleteModal] = React.useState(false);
    const [addModal, setAddModal] = React.useState(false);
    const [addModalFields, setAddModalFields] = React.useState({
        name: '',
        price: 0,
        units: 0,
        uploading: false,
        alert: false,
        message: '',
        preventSubmit: false,
        validation: {
            name: null,
            price: null,
            units: null,
            image: null
        }
    });
    const [addProductImage, setAddProductImage] = React.useState('');

    React.useEffect(() => {
        getProducts();
    }, []);

    const handleEditClick = (e, row) => {
        e.target.setAttribute('disabled', '');

        if (!collapsed.includes(row.id)) {
            collapsed.push(row.id);
            setCollapsedList([...collapsed]);

            fields[row.id] = {
                name: row.name,
                price: row.price,
                units: row.units,
                btnEdit: e.target,
                alert: false,
                message: '',
                preventSubmit: false,
                validation: {
                    name: null,
                    price: null,
                    units: null
                }
            };
            setFieldData(fields);
        }
    }

    const handleCancelClick = row => {
        collapsed = collapsed.filter(value => value !== row.id);
        setCollapsedList([...collapsed]);

        fieldData[row.id].btnEdit.removeAttribute('disabled');
        delete fields[row.id];
        setFieldData({ ...fields });
    }

    const handleDeleteClick = row => {
        DeleteIndex = row.id;
        setDeleteModal(true);
    }

    const valueSortFunc = (a, b, order, dataField, rowA, rowB) => {
        if (order === 'asc') {
            return a - b;
        } else {
            return b - a;
        }
    }
    const alphabetSortFunc = (a, b, order, dataField, rowA, rowB) => {
        if (order === 'asc') {
            return a.localeCompare(b, 'en');
        } else {
            return b.localeCompare(a, 'en');
        }
    }

    const columns = [{
        dataField: 'id',
        text: 'ID',
        sort: true,
        headerStyle: {
            width: '5%'
        },
        sortFunc: valueSortFunc
    }, {
        dataField: 'image',
        text: 'Image',
        formatter: (cell) => {
            return <img style={{ width: '100%', height: '10rem', objectFit: 'cover', objectPosition: 'top' }} src={cell} />
        },
        headerStyle: {
            width: '20%'
        }
    }, {
        dataField: 'name',
        text: 'Product',
        sort: true,
        style: {
            fontWeight: 'bold'
        },
        sortFunc: alphabetSortFunc
    }, {
        dataField: 'price',
        text: 'Price (SGD)',
        type: 'number',
        sort: true,
        sortFunc: valueSortFunc
    }, {
        dataField: 'units',
        text: 'Stock',
        sort: true,
        sortFunc: valueSortFunc
    }, {
        dataField: 'created_at',
        text: 'Manage',
        isDummyField: true,
        formatter: (cell, row) => {
            return (
                <React.Fragment>
                    <Button onClick={e => { handleEditClick(e, row) }} color='secondary'>Edit</Button>
                    <Button onClick={() => { handleDeleteClick(row) }} className='ml-2' color='danger'>Delete</Button>
                </React.Fragment>
            )
        }
    }];

    const handleChange = (e, row) => {
        fields = { ...fields };
        fields[row.id][e.target.name] = e.target.value;

        if (!Object.values(fieldData[row.id].validation).every(value => value === null)) {
            fields[row.id].validation = {
                name: null,
                price: null,
                units: null
            }
        }

        setFieldData(fields);
    }

    const handleSubmit = (e, row) => {
        e.preventDefault();

        // validate empty fields
        const data = {
            name: fieldData[row.id].name,
            price: fieldData[row.id].price,
            units: fieldData[row.id].units
        }
        for (const [key, value] of Object.entries(data)) {
            if (value.length === 0) {
                const obj = {};
                obj[key] = `Please enter ${key}`;
                fields = { ...fields };
                fields[row.id].validation = { ...fields[row.id].validation, ...obj };
                setFieldData(fields);

                return;
            }
        }

        fields = { ...fields };
        fields[row.id].preventSubmit = true;
        setFieldData(fields);

        updateProduct(row.id, data)
            .then(res => { handleUpdateSuccess(res, row.id) })
            .catch(err => { handleUpdateError(err, row.id) });
    }

    const handleUpdateSuccess = (res, id) => {
        collapsed = collapsed.filter(value => value !== id);
        setCollapsedList([...collapsed]);

        fieldData[id].btnEdit.removeAttribute('disabled');
        delete fields[id];
        setFieldData({ ...fields });
    }

    const handleUpdateError = (err, id) => {
        fields = { ...fields };
        fields[id].alert = true;
        fields[id].message = err.msg;
        setFieldData(fields);
    }

    const handleModalCancel = e => {
        setDeleteModal(false);
    }

    const handleAddModalChange = e => {
        let data = {};
        data[e.target.name] = e.target.value;

        if (!Object.values(addModalFields.validation).every(value => value === null)) {
            data.validation = {
                name: null,
                price: null,
                units: null,
                image: null
            }
        }

        setAddModalFields({ ...addModalFields, ...data });
    }

    const handleUploadImage = e => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        setAddModalFields({ ...addModalFields, uploading: true, preventSubmit: true });
        uploadProductImage(formData)
            .then(res => {
                setAddModalFields({ ...addModalFields, validation: { ...addModalFields.validation, image: null } });
                setAddProductImage(res.image);
            })
            .catch(err => {
                setAddModalFields({ ...addModalFields, alert: true, message: err.msg });
            })
            .finally(() => {
                setAddModalFields({ ...addModalFields, uploading: false, preventSubmit: false });
            });
    }

    const handleAddProductSubmit = e => {
        e.preventDefault();

        // validate empty fields
        const data = {
            name: addModalFields.name,
            price: addModalFields.price,
            units: addModalFields.units,
        }
        for (const [key, value] of Object.entries(data)) {
            if (value.length === 0) {
                const obj = {};
                obj[key] = `Please enter ${key}`;
                setAddModalFields({
                    ...addModalFields,
                    validation: {
                        ...addModalFields.validation,
                        ...obj
                    }
                });

                return;
            }
        }

        if (addProductImage === '') {
            setAddModalFields({
                ...addModalFields,
                validation: {
                    ...addModalFields.validation,
                    image: 'Please upload an image'
                }
            });

            return;
        }

        data.image = addProductImage;

        setAddModalFields({ ...addModalFields, preventSubmit: true });
        insertProduct(data)
            .then(res => {
                setAddModal(false);
            })
            .catch(err => {
                setAddModalFields({ ...addModalFields, alert: true, message: err.msg });
            })
            .finally(() => {
                setAddModalFields({ ...addModalFields, preventSubmit: false });
            })
    }

    const expandRow = {
        renderer: row => {
            if (fieldData[row.id]) {
                return (
                    <Container className='mt-4'>
                        <Col className='mt-4' md={{ size: 6, offset: 3 }}>
                            <Form onSubmit={e => { handleSubmit(e, row) }}>
                                <FormGroup>
                                    <Label for='editName'>Product</Label>
                                    <Input disabled={fieldData[row.id].preventSubmit} invalid={fieldData[row.id].validation.name !== null} type='text' id='editName' name='name' onChange={e => { handleChange(e, row) }} value={fieldData[row.id].name} />
                                    <FormFeedback>{fieldData[row.id].validation.name}</FormFeedback>
                                </FormGroup>

                                <Label for='editPrice'>Price</Label>
                                <InputGroup>
                                    <InputGroupAddon addonType="prepend">S$</InputGroupAddon>
                                    <Input disabled={fieldData[row.id].preventSubmit} invalid={fieldData[row.id].validation.price !== null} min={0} type="number" id='editPrice' name='price' onChange={e => { handleChange(e, row) }} step='.01' value={fieldData[row.id].price} />
                                    <FormFeedback>{fieldData[row.id].validation.price}</FormFeedback>
                                </InputGroup>

                                <FormGroup className='mt-2'>
                                    <Label for='editUnits'>Stock</Label>
                                    <Input disabled={fieldData[row.id].preventSubmit} invalid={fieldData[row.id].validation.units !== null} min={0} type='number' id='editUnits' name='units' onChange={e => { handleChange(e, row) }} step='1' value={fieldData[row.id].units} />
                                    <FormFeedback>{fieldData[row.id].validation.units}</FormFeedback>
                                </FormGroup>

                                <FormGroup>
                                    <Button disabled={fieldData[row.id].preventSubmit} color='primary'>Save</Button>
                                    <Button disabled={fieldData[row.id].preventSubmit} className='ml-2' onClick={() => { handleCancelClick(row) }} color='secondary'>Cancel</Button>
                                </FormGroup>

                                <Alert isOpen={fieldData[row.id].alert} toggle={() => {
                                    fields = { ...fields }
                                    fields[row.id].alert = false;
                                    setFieldData(fields);
                                }} color='danger'>{fieldData[row.id].message}</Alert>
                            </Form>
                        </Col>
                    </Container>
                )
            } else {
                return null;
            }
        },
        expanded: collapsedList,
        expandByColumnOnly: true
    };

    return products.length === 0 ? null : (
        <React.Fragment>
            <Container style={{ marginTop: '5rem' }} fluid={true} style={{ width: '60%', minWidth: '800px' }}>
                <Row className='justify-content-center'>
                    <h1>Products</h1>
                </Row>

                <Button onClick={() => setAddModal(true)} className='mt-4 mb-2' color='success'>Add a Product</Button>

                <BootstrapTable
                    bootstrap4
                    data={products}
                    columns={columns}
                    keyField='id'
                    rowStyle={{ maxHeight: 200 }}
                    expandRow={expandRow}
                />
            </Container>

            <Modal isOpen={deleteModal} toggle={handleModalCancel} centered>
                <ModalHeader toggle={handleModalCancel}>Delete {DeleteIndex === 0 ? '' : products[DeleteIndex - 1].name}?</ModalHeader>
                <ModalFooter>
                    <Button color='danger'>Confirm</Button>
                    <Button onClick={handleModalCancel} color='secondary'>Cancel</Button>
                </ModalFooter>
            </Modal>

            <Modal isOpen={addModal} toggle={() => setAddModal(false)} centered>
                <ModalHeader toggle={() => setAddModal(false)}>Add Product</ModalHeader>
                <Form onSubmit={handleAddProductSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <Label for='addProductName'>Product</Label>
                            <Input disabled={addModalFields.preventSubmit} invalid={addModalFields.validation.name !== null} type='text' id='addProductName' name='name' onChange={handleAddModalChange} />
                            <FormFeedback>{addModalFields.validation.name}</FormFeedback>
                        </FormGroup>

                        <Label for='addProductPrice'>Price</Label>
                        <InputGroup>
                            <InputGroupAddon addonType="prepend">S$</InputGroupAddon>
                            <Input disabled={addModalFields.preventSubmit} invalid={addModalFields.validation.price !== null} type='number' id='addProductPrice' name='price' min={0} step={0.01} value={addModalFields.price} onChange={handleAddModalChange} />
                            <FormFeedback>{addModalFields.validation.price}</FormFeedback>
                        </InputGroup>

                        <FormGroup className='mt-4'>
                            <Label for='addProductUnits'>Stock</Label>
                            <Input disabled={addModalFields.preventSubmit} invalid={addModalFields.validation.units !== null} type='number' id='addProductUnits' name='units' min={0} step={1} value={addModalFields.units} onChange={handleAddModalChange} />
                            <FormFeedback>{addModalFields.validation.units}</FormFeedback>
                        </FormGroup>

                        <FormGroup>
                            <Label for='addProductImage'>Image</Label>
                            <Input disabled={addModalFields.preventSubmit} invalid={addModalFields.validation.image !== null} type='file' id='addProductImage' onChange={handleUploadImage} />
                            <Spinner className={addModalFields.uploading ? 'mt-4' : 'mt-4 d-none'} color='dark' />
                            <FormFeedback>{addModalFields.validation.image}</FormFeedback>
                        </FormGroup>

                        <Alert isOpen={addModalFields.alert} toggle={() => { setAddModalFields({ ...addModalFields, alert: false }) }} color='danger'>{addModalFields.message}</Alert>
                    </ModalBody>
                    <ModalFooter>
                        <Button disabled={addModalFields.preventSubmit} color='success'>Add</Button>
                        <Button color='secondary' onClick={() => setAddModal(false)}>Cancel</Button>
                    </ModalFooter>
                </Form>
            </Modal>
        </React.Fragment>
    )
}
ManageProduct.propTypes = {
    products: PropTypes.array.isRequired,
    getProducts: PropTypes.func.isRequired,
    updateProduct: PropTypes.func.isRequired,
    uploadProductImage: PropTypes.func.isRequired,
    insertProduct: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
    products: state.products.products
});

export default connect(mapStateToProps, { getProducts, updateProduct, uploadProductImage, insertProduct })(ManageProduct);
