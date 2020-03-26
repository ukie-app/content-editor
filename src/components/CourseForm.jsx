import React from 'react';
import firebase from './Firebase/firebase'
import { Formik, Form, Field } from 'formik';

const CourseForm = () => {
  function lessonData(lessonsArr, setDoc, db, lessonDoc) {
    let newData = {
      name: lessonsArr,
      refCourse: '/courses/' + setDoc.id
    };
    // Add a new document in collection courses with auto-generated ID
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
            description: values.description,
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
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-1/4 px-3 mb-6 mb-0">
              <Field type="category" name="category" placeholder="category" className="form-field" />
            </div>

            <div className="w-1/4 px-3">
              <Field type="name" name="name" placeholder="name" className="form-field" />
            </div>

            <div className="w-1/4 px-3">
              <Field type="description" name="description" placeholder="description" className="form-field"/>
            </div>

            <div className="w-1/4 px-3">
              <Field type="img" name="img" placeholder="imgLink" className="form-field"/>
            </div>

            <div className="w-full px-3 pb-6">
              <Field type="lessons" name="lessons" placeholder="array of new lessons separated by comma" className="w-full form-field" />
            </div>

            <button type="submit" className="btn-teal mx-auto" disabled={isSubmitting}>
              Submit
            </button>

          </div>
        </Form>
      )}
    </Formik>
  </div>)
};

export default CourseForm
