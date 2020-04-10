import React from 'react';
import firebase from './Firebase/firebase'
import { Formik, Form, Field } from 'formik'

const LessonForm = ({curCourse}) => (
  <div>
    <h1>Create a new lesson</h1>
    <Formik
      initialValues={{ name: '' }}
      onSubmit={(values, { setSubmitting }) => {
          let data = {
            name: values.name,
            courseRef: '/courses/'+curCourse
          };
          const db = firebase.firestore()
          db.collection('lessons').doc().set(data);
          setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="name" name="name" placeholder="lesson name" className="form-field"/>
          <button className="btn-teal" type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>
);

export default LessonForm
