import React from 'react';
import firebase from './Firebase/firebase'
import { Formik, Form, Field } from 'formik';

const CourseForm = () => {
  function lessonData(lessonsArr, setDoc, db, lessonDoc) {
    let newData = {
      name: lessonsArr,
      refCourse: '/courses/'+setDoc.id
    };
    // Add a new document in collection "cities" with ID 'LA'
    lessonDoc.set(newData);
  }
  return (<div>
    <h1>Create a new course</h1>
    <Formik
      initialValues={{ name: ''}}
      onSubmit={(values, { setSubmitting }) => {
          let data = {
            category: values.category,
            name: values.name,
            img: values.img,
            lessons: []
          };
          const db = firebase.firestore()
          let setDoc = db.collection('courses').doc()
          setDoc.set(data);
          let lessonsArr = values.lessons.replace(/ /g, "").split(",")
          for(var i = 0; i < lessonsArr.length; i++) {
            let lessonDoc = db.collection('lessons').doc()
            setTimeout(lessonData(lessonsArr[i], setDoc, db, lessonDoc), 400)
            let tmpData = {
              name: lessonsArr[i],
              refLesson: '/lessons/'+lessonDoc.id
            };
            setDoc.update({
              lessons: firebase.firestore.FieldValue.arrayUnion(tmpData)
            });
          }

          setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field type="category" name="category" placeholder="Category"/>
          <Field type="name" name="name" placeholder="Name"/>
          <Field type="img" name="img" placeholder="img"/>
          <Field type="lessons" name="lessons" placeholder="lessons"/>
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </Form>
      )}
    </Formik>
  </div>)
};

export default CourseForm
