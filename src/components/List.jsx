import React from 'react'
import { Link } from 'react-router-dom'
import firebase from './Firebase/firebase'
import { withRouter } from "react-router";
import LessonForm from "./LessonForm"
import CourseForm from "./CourseForm"

const db = firebase.firestore()

class List extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayList: false,
      listItems: {},
    }
  }

  componentDidMount() {

    // get all courses from the database and
    // store them in an object
    var courses = {}
    var index = 0
    db.collection("courses").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        var newLesson = {
          name: doc.data().name,
          lessons: doc.data().lessons,
          id: doc.id,
        }
        courses[index] = newLesson
        index += 1
      })

      // after 450ms set state to the retrieved DB data
      this.timer = setTimeout(this.displayListItems(courses), 450)
    })

  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  displayListItems = (listItems) => {
    this.setState({
      displayList: true,
      listItems: listItems,
    })
  }


  render() {

    const { displayList, listItems } = this.state
    const { listTitle } = this.props

    if (!displayList) {
      return <div>Loading...</div>
    }

    // conditionally render either a list of courses
    // or a list of lessons
    if (listTitle === "Courses") {
      return (
        <div className="container m-4">
          <h1 className="pb-4">{listTitle}</h1>
          <ul>
            {
              // iterate over courses stored in the state and display them
              Object.entries(listItems).map((listItem, i) => (
                // set the link to have a trailing slash
                <li key={i}>
                  <Link
                    className="text-blue-600 text-2xl"
                    to={listItem[1].id + "/"}
                  >
                    {listItem[1].name}
                  </Link>
                </li>
              ))
            }
          </ul>
          <CourseForm/>
        </div>
      )
    }

    else {

      // retrieve from the state only the course that is currently in the url parameter
      const currentCourse = Object.values(listItems).filter(listItem =>
        listItem.id === this.props.match.params.course
      )

      return (
        <div className="container m-4">
          <h1 className="pb-4">{currentCourse[0].name + " " + listTitle}</h1>
          <ul>
            {
              // iterate over lessons of the current course and display them
              Object.values(currentCourse[0].lessons).map((lesson, i) => (
                <li key={i}>
                  <Link
                    className="text-blue-600 text-2xl"
                    to={lesson.lessonRef.split('/')[1]}
                  >
                    {lesson.name}
                  </Link>
                </li>
              ))
            }
          </ul>
          <LessonForm curCourse={this.props.match.params.course} />
        </div>
      )
    }

  }
}

export default withRouter(List)
