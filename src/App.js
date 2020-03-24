import React from 'react'
import { Switch, Route } from 'react-router-dom'

import List from './components/List'
import Editor from './components/Editor'

import firebase from './components/Firebase/firebase'

const db = firebase.firestore()

function App() {

var courses = []

// If you run a query, you will be charged for any documents returned
// by that query, not the total number of documents in the collection.

const courseRef = db.collection("courses").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
    courses.push(doc.id)
    console.log(courses)
  });
});

  return (
    <Switch>
      // <Route exact path="/" render={() => <List courses={courses} />} />
      // <Route exact path="/courses/" render={() => <List courses={courses} />} />
      {/* list of available lessons in the course */}
      // <Route exact path="/courses/:course" render={() => <List courses={courses} />} />
      {/* edit a particular lesson in the course */}
      <Route exact path="/:lesson" component={Editor} />
      <Route exact path="/courses/:course/:lesson" component={Editor} />
    </Switch>
  )
}

export default App;
