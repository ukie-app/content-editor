import React from 'react'

const List = ({match}) => {
  console.log("here", match.params.lesson)


  return (
    <ul>
      {
        // courses.forEach((item, i) =>
        //   console.log(courses[i])
        //   // <li key={i}>{item}</li>
        // )

      }
    </ul>
  )
}

export default List
