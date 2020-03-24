import React from 'react'
import { Switch, Route } from 'react-router-dom'

import List from './components/List'
import Editor from './components/Editor'

import firebase from './components/Firebase/firebase'

const db = firebase.firestore()

const courseRef = db.collection("course").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
});

function App() {
  return (
    <Switch>
      <Route exact path="/" component={List} />
      <Route exact path="/courses/" component={List} />
      {/* list of available lessons in the course */}
      <Route exact path="/couses/:course" component={List} />
      {/* edit a particular lesson in the course */}
      <Route exact path="/couses/:course/:lesson" component={Editor} />
    </Switch>
  )
}

export default App;
