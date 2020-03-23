import React from 'react'
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser'

const ParsedHtmlComponent = ({ html }) => {
  return(
    <div>{ ReactHtmlParser(html) }</div>
  )
}

export default ParsedHtmlComponent