import React from 'react'
import ReactHtmlParser from 'react-html-parser'

const ParsedHtmlComponent = ({ html }) => {
  return(
    <div>{ ReactHtmlParser(html) }</div>
  )
}

export default ParsedHtmlComponent