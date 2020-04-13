import React from 'react'
import ReactHtmlParser from 'react-html-parser'

const AsideNote = ({ type, title, text }) => {

  // console.log("RECEIVED PROPS: ", type, title, text)

  let imgSrc = ""
  let color = ""

  switch (type) {
    case "history":
      imgSrc = "https://image.flaticon.com/icons/svg/1183/1183815.svg"
      color = "orange"
      break
    case "culture":
      imgSrc = "https://image.flaticon.com/icons/svg/439/439510.svg"
      color = "orange"
      break
    default:
      console.log("No Type Provided")
      break
  }

  return (
    <div className="note relative my-12">
      <div className="absolute left-0" style={{ top: '3%', left: '-23px', zIndex: '3'}}>
        <img className="h-12" src={imgSrc} alt={title} />
      </div>
      <div className={`relative rounded pl-12 pr-8 pt-4 pb-8 mb-4 bg-${color}-200`}>

        <h4 className="font-bold text-xl mb-4">{title}</h4>
        <p className="">{ ReactHtmlParser(text) }</p>
      </div>

    </div>
  )
}

export default AsideNote