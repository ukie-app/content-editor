import React from 'react'
import { Link } from 'react-router-dom'
import firebase from './Firebase/firebase'

const db = firebase.firestore()

// let lessonDoc = db.collection("lessons").doc("FegguLgwkBrcKJOA9lau").get().then(doc =>
//   console.log(doc.data())  
// )

class List extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      displayList: false,
      listItems: {},
    }

    console.log("URL PARAM", this.props.match)
  }
  


  componentDidMount() {

    const { listTitle } = this.props
    var index = 0

    // If you run a query, you will be charged for any documents returned
    // by that query, not the total number of documents in the collection.

    // conditionally get different data from the database
    if (listTitle === "Courses") {
      var courses = {}
       // get all courses from the database
      const lessonRef = db.collection("courses").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // console.log(doc.id, "=>", doc.data().name);
          var newLesson = {
            name: doc.data().name,
            lessons: doc.data().lessons,
            id: doc.id,
          }
          courses[index] = newLesson
          console.log("courses", courses)
          index += 1
        })
        // after 450ms set state to the retrieved DB data
        this.timer = setTimeout(this.displayListItems(courses), 450)
       })
      
      
      // this.timer = setTimeout(this.displayListItems(courses), 100050)
    }

    else if (listTitle === "Lessons") {
      var lessons = {}
      // const urlParam = this.props.match.params

      console.log("URL PARAM", this.props.match)
      
      let lessonDoc = db.collection("lessons").doc("FegguLgwkBrcKJOA9lau").get().then(doc =>
        console.log(doc.data())  
      )
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  displayListItems = (listItems) => {
    this.setState({
      displayList: true,
      listItems: listItems,
    }, () => console.log("change state", this.state))
  
  }


  render() {

    const { displayList, listItems } = this.state
    const { listTitle } = this.props

    if (!displayList) {
      return <div>Loading...</div>
    }

    return (
        <div className="container m-4">
        <h1 className="pb-4">{listTitle}</h1>
        
          <ul>
            {
              Object.entries(listItems).map((listItem, i) => (
                console.log("LI", listItem),
                  <li key={i}>
                    <Link
                      className="text-blue-600"
                      to={
                        (listTitle === "Courses")
                          ? listItem[1].id
                          : "lessons/" + listItem[1].id
                        }
                    >
                      {listItem[1].name}
                    </Link>
                  </li>
              ))
            }
          </ul>
        </div>
    )
  }
}

export default List
