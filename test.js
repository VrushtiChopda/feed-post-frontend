<div className='d-flex justify-content-center'>
    <div className="col-lg-3 border border-1 rounded-3 m-3 shadow ">
        <h3 className='text-center'>{post.postTitle}</h3>
        <h5 className='text-center'>{post.description}</h5>
        {authorizedUser && authorizedUser._id === post.userId && (
            <>
                <hr />
                <div className='text-center justify-content-center'>
                    <LiaEdit
                        className='me-5 mb-2'
                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                        onClick={handleShow}
                    />
                    <MdOutlineDelete
                        className='me-5 mb-2'
                        style={{ fontSize: '25px', fontWeight: 'bolder' }}
                        onClick={() => handleDeletePost(post._id)}
                    />
                </div>
            </>
        )}
    </div>

    <div className='col-lg-3 m-3'>
        <TextareaAutosize
            className='w-100 rounded p-1'
            placeholder="Add a comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
        />
        <div>
            <button className='btn btn-outline-primary me-2' onClick={handleAddComment}>Add</button>
        </div>

        {commentById.map((comment) => (
            <div key={comment._id} className='w-75 p-1 m-2 border border-1 rounded-2 shadow-sm text-xl'>
                <div className='d-flex' onClick={() => handleToggle(comment._id)}>
                    <img src={user} style={{ width: '40px', maxHeight: '40px' }} alt='User' />
                    <div className='px-2'>
                        <h6 className='m-0 p-0'>{comment.userId.fullName}</h6>

                        {
                            editingCommentId === comment._id ? (
                                <div className='d-flex'>
                                    <Input
                                        value={editedComment}
                                        onChange={(e) => setEditedComment(e.target.value)}
                                        className='me-3'
                                    />
                                    <button
                                        className='btn btn-sm btn-outline-primary'
                                        onClick={() => handleUpdatedComment(comment._id)}
                                    >Update</button>
                                </div>
                            ) : (
                                <p className='m-0 p-0'>{comment.comment}</p>
                            )
                        }
                    </div>
                </div>

                {
                    authorizedUser && authorizedUser._id === comment.userId._id && (
                        openComments[comment._id] && (
                            <div className='d-flex justify-content-end mt-2'>
                                <LiaEdit
                                    className='mx-2'
                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                    onClick={() => handleEditComment(comment._id, comment.comment)}
                                />
                                <MdOutlineDelete
                                    style={{ fontSize: '25px', fontWeight: 'bolder' }}
                                    onClick={() => handleDeleteComment(comment._id)}
                                />
                            </div>
                        )
                    )
                }
            </div>
        ))}
    </div>

    {/* Modal for updating post */}
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Update post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Formik
                initialValues={initialValues}
                validationSchema={schemaValidation}
                onSubmit={handleSubmit}
            >
                {(formik) => (
                    <Form>
                        <label htmlFor="postTitle">Enter Post Title</label>
                        <Field
                            className='form-control'
                            id='postTitle'
                            name='postTitle'
                        />
                        <ErrorMessage name='postTitle' component="div" className="text-danger" />
                        <label htmlFor="description">Enter Post Description</label>
                        <Field
                            className='form-control'
                            id='description'
                            name='description'
                        />
                        <ErrorMessage name='description' component="div" className="text-danger" />

                        <Button variant="primary" type='submit' className="mt-3">
                            Update
                        </Button>
                    </Form>
                )}
            </Formik>
        </Modal.Body>
    </Modal>
</div>