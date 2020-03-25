import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import List from './components/List'
import Editor from './components/Editor'

function App() {

  return (
    <Switch>
      <Redirect exact from="/" to="/courses/" />
      <Redirect exact strict from="/courses" to="/courses/" />
      <Route exact strict path="/courses/" render={() => <List listTitle="Courses"  />} />
      {/* list of available lessons in the course */}
      <Route exact strict path="/courses/:course/" render={() => <List listTitle="Lessons" />} />
      {/* edit a particular lesson in the course */}
      <Route exact strict path="/courses/:course/:lesson" component={Editor} />
    </Switch>
  )
}

export default App;
