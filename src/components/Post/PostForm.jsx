import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { addPost, updatePost } from '../../redux-toolkit/Slice/postSlice';

const PostForm = ({ show, setShow, edit, updateValue, premiumPostId, setEdit, getAllPost }) => {
    const dispatch = useDispatch();

    const handleClose = () => {
        setShow(false);
        setEdit(false);
    };

    //------- Formik -------
    const initialValues = {
        postTitle: edit ? updateValue.postTitle : '',
        description: edit ? updateValue.description : ''
    };

    const schemaValidation = Yup.object({
        postTitle: Yup.string().required('Post title is required'),
        description: Yup.string().required('Description is required')
    });

    const handleSubmit = async (postData, { resetForm }) => {
        try {
            const formData = {
                postTitle: postData.postTitle,
                description: postData.description
            };

            if (edit) {
                const res = await dispatch(updatePost({ postId: premiumPostId, postData: formData }));
                if (res.meta.requestStatus === 'fulfilled') {
                    getAllPost();
                    resetForm();
                    handleClose();
                }
            } else {
                const res = await dispatch(addPost(formData));
                if (res.meta.requestStatus === 'fulfilled') {
                    getAllPost();
                    resetForm();
                    handleClose();
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{edit ? 'Update Post' : 'Add Post'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={schemaValidation}
                    onSubmit={handleSubmit}
                >
                    {(formik) => (
                        <FormikForm>
                            <Form.Group className="mb-3">
                                <label htmlFor="postTitle">Enter Post Title</label>
                                <Field
                                    className="form-control"
                                    id="postTitle"
                                    name="postTitle"
                                />
                                <ErrorMessage name="postTitle" component="div" className="text-danger" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <label htmlFor="description">Enter Post Description</label>
                                <Field
                                    className="form-control"
                                    id="description"
                                    name="description"
                                />
                                <ErrorMessage name="description" component="div" className="text-danger" />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="mt-3">
                                {edit ? 'Update' : 'Add'}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default PostForm;