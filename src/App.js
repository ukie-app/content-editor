import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import List from './components/List'
import Editor from './components/Editor'

import firebase from './components/Firebase/firebase'

const db = firebase.firestore()

function App() {

  return (
    <Switch>
      <Redirect exact from="/" to="/courses/" />
      <Route exact path="/courses/" render={() => <List listTitle="Courses"  />} />
      {/* list of available lessons in the course */}
      <Route exact path="/courses/:course" render={() => <List listTitle="Lessons" />} />
      {/* edit a particular lesson in the course */}
      <Route exact path="/courses/:course/:lesson" component={Editor} />
    </Switch>
  )
}

export default App;
