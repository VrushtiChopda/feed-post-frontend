import { ErrorMessage, Field, Formik, Form as FormikForm } from 'formik';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { addPost, updatePost } from '../../redux-toolkit/Slice/postSlice';

const PostForm = ({ show, setShow, edit, updateValue, premiumPostId, setEdit, getAllPost }) => {
    const [image, setImage] = useState(null)

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
        console.log(postData, "----- postData ----------")
        console.log(image, "--------- image ---------")
        try {
            const formData = new FormData()
            if (image) {
                formData.append('postImage', image);
            }
            formData.append('postTitle', postData.postTitle)
            formData.append('description', postData.description)
            console.log(formData, "--------- formData ----------")

            let res;
            if (edit) {
                res = await dispatch(updatePost({ postId: premiumPostId, postData: formData }));
            } else {
                res = await dispatch(addPost({ postData: formData }));
            }
            if (res.meta.requestStatus === 'fulfilled') {
                getAllPost();
                resetForm();
                setImage(null);
                handleClose();
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
                        <FormikForm encType="multipart/form-data">

                            <label htmlFor="postImage">Upload Image</label>
                            <input
                                type="file"
                                className="form-control"
                                id="postImage"
                                onChange={(e) => setImage(e.target.files[0])}
                            />

                            <label htmlFor="postTitle">Enter Post Title</label>
                            <Field
                                className="form-control"
                                id="postTitle"
                                name="postTitle"
                            />
                            <ErrorMessage name="postTitle" component="div" className="text-danger" />

                            <label htmlFor="description">Enter Post Description</label>
                            <Field
                                className="form-control"
                                id="description"
                                name="description"
                            />
                            <ErrorMessage name="description" component="div" className="text-danger" />

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