import React, { Component } from 'react'

import firebase from './Firebase/firebase'

import JsxParser from 'react-jsx-parser'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'

import AsideNote from './AsideNote'
import InlineAudioPlayer from './InlineAudioPlayer'

import Note from './plugins/note'
import Highlight from './plugins/inline-highlight'
import InlineAudio from './plugins/inline-audio'
import InlineParagraph from './plugins/inline-paragraph'

const db = firebase.firestore()


const getFromDB = (thisObjRef) => {

  const lessonDoc = thisObjRef.props.match.params.lesson

  return new Promise(resolve => {
    db.collection("lessons").doc(lessonDoc).get()
      .then(doc => {
        if (doc.exists) {
          let jsonData = doc.data().jsonContent
          // return jsonData if it's defined
          if (jsonData) {
            let validJSONBlocks = []
            let convertedTableContent = []

            for (let block of jsonData.blocks) {
              if (block.type === 'table') {
                // convert table content Object into Array
                console.log(block.data.content)
                if (block.data.content) {
                  convertedTableContent = {
                    content: Object.values(block.data.content)
                  }
                }
                // console.log("converted to ", convertedTableContent)
                let convertedTableBlock = {
                  type: 'table',
                  data: convertedTableContent
                }
                validJSONBlocks.push(Object.assign({}, convertedTableBlock))
              }
              else {
                validJSONBlocks.push(Object.assign({}, block))
                // console.log("skipped", block, "and added to obj: ", validJSONBlocks)
              }
            }
          
            let blocksData = {
              time: jsonData.time,
              blocks: validJSONBlocks,
              version: jsonData.version
            }

            resolve(blocksData)
          }
          // otherwise set initial data
          else {
            let initialData = {
              "time" : 1550476186479,
              "blocks": [{
                "type": "header",
                "data": {
                  "text": "Start a new lesson",
                  "level": 2
                }
              }],
              "version" : "2.8.1"
            }
            resolve(initialData)
          }
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });
  });
}

const saveToDB = (lessonDoc, editorData) => {
  const lessonRef = db.collection("lessons").doc(lessonDoc)
  
  // find table blocks in the json
  // const tableBlocks = editorData.blocks.filter(block => block.type === 'table')
  let validJSONBlocks = []
  let convertedTableContent

  for (let block of editorData.blocks) {
    if (block.type === 'table') {
      // convert table content Array into an Object
      if (block.data.content) {
        convertedTableContent = {
          content: Object.assign({}, block.data.content)
        }
      }
      // console.log("converted to ", convertedTableContent)
      let convertedTableBlock = {
        type: 'table',
        data: convertedTableContent
      }
      validJSONBlocks.push(Object.assign({}, convertedTableBlock))
    }
    else {
      validJSONBlocks.push(Object.assign({}, block))
      // console.log("skipped", block, "and added to obj: ", validJSONBlocks)
    }
  }

  let jsonData = {
    time: editorData.time,
    blocks: validJSONBlocks,
    version: editorData.version
  }

  lessonRef.update({
    jsonContent: jsonData
  });

  console.log("saved to DB:", editorData)
}

const editorInstance = (thisObjRef, jsonData) => {
  
  const editor = new EditorJS({
    /**
     * Id of Element that should contain Editor instance
     */
    holder: 'editor',

    /**
    * Enable autofocus
    */
    autofocus: true,

    logLevel: 'VERBOSE',

    /**
    * Available Tools list.
    * Pass Tool's class or Settings object for each Tool you want to use
    */
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: 'Enter a header',
          levels: [1, 3],
          defaultLevel: 1
        },
        shortcut: 'ctrl+shift+h',
        inlineToolbar: true
      },
      list: {
        class: List,
        shortcut: 'ctrl+shift+l',
        inlineToolbar: true
      },
      table: {
        class: Table,
        shortcut: 'ctrl+shift+t',
        inlineToolbar: true
      },
      note: {
        class: Note,
        shortcut: 'ctrl+shift+n',
        inlineToolbar: true
      },
      highlight: {
        class: Highlight,
        inlineToolbar: true,
      },
      inlineAudio: {
        class: InlineAudio,
        inlineToolbar: true,
      },
      inlineParagraph: {
        class: InlineParagraph,
        inlineToolbar: true,
      }
    },

    /**
    * Previously saved data that should be rendered
    */
    data: jsonData,

    /**
      * onChange callback
      */
    onChange: () => { thisObjRef.saveData(thisObjRef) }

  })

  thisObjRef.setState({
    jsonContent: jsonData,
    editorInstance: editor,
  })

  if (jsonData.size !== 0) {
    thisObjRef.editorBlocksToJSX(jsonData)
  }
}


class Editor extends Component {
  

  constructor (props) {
    super(props)

    this.state = {
      jsxContent: '',
      jsonContent: '',
    }
  }

  
  componentDidMount() {
    let componentRef = this

    async function getData(thisObjRef) {
      return jsonData = await getFromDB(thisObjRef)
    }

    let jsonData = getData(componentRef)
    
    
    // initialize editor instance after database content was retrieved
    let editorTimer = setTimeout(function() {
      editorInstance(componentRef, jsonData)
    }, 450)

  }

  componentWillUnmount() {
    clearTimeout(this.editorTimer)
  }

  saveData = (thisObjRef) => {

    this.state.editorInstance.save()
      .then((editorData) => {

        this.setState({
          jsonContent: editorData
        })

        // run JSON to JSX conversion 
        this.editorBlocksToJSX(editorData)
      })
      .catch((error) => {
      console.log('Saving failed: ', error)
    });
    

  }


  editorBlocksToJSX = (editorData) => {
    let parsedResult = ``;

    for (let block of editorData.blocks) {
      switch (block.type) {
        case 'paragraph':
          parsedResult += `<p>${block.data.text}</p>`
          break
        case 'inlineParagraph':
          parsedResult += `<p className="inline">${block.data.text}</p>`
          break
        case 'header':
          parsedResult += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
          break
        case 'list':
          let listItems = ''
          for(let item of block.data.items) {
            listItems += `<li>${item}</li>`
          }
          if(block.data.style === 'unordered') {
            parsedResult += `<ul>${listItems}</ul>`
          }
          else {
            parsedResult += `<ol>${listItems}</ol>`
          }
          break
        case 'table':
          let tableCells = ''
          let tableRows = ''
          for (let row in block.data.content) {
            for (let col in block.data.content) {
              if (block.data.content[row][col]) {
                console.log("DEFINED", row, col)
                tableCells += `<td>${block.data.content[row][col]}</td>`
              }
            }
            tableRows += `<tr>${tableCells}</tr>`
            tableCells = ''
          }
          parsedResult += `<table><tbody>${tableRows}</tbody></table>`
          break
        case 'inlineAudio':
          parsedResult += `<InlineAudioPlayer audioSrc="${block.data.audioSrc}" text="${block.data.text}" />`
          break
        case 'note':
          parsedResult += `<AsideNote type="${block.data.type}" title="${block.data.title}" text="${block.data.text}" />`
          break
        default:
          return null
     }
    }

  //  console.log("Parsed", result)
   this.setState({
     jsxContent: parsedResult
   })
 }

  render() {

    console.log(this.state.jsonContent)

    return (
      <div className="lesson-editor" style={{ margin: '20px' }}>
        <h3>Editor</h3>

        <div id="editor" className="editor"></div>

        <button
          className="my-4 btn-teal"
          onClick={() => saveToDB(this.props.match.params.lesson, this.state.jsonContent, this.state.jsxContent)}
        >
          Save content
        </button>

        <h3 style={{ margin: '30px 0' }}>
          JSX Output
        </h3>
          <div id="html-output" className="lesson bg-white rounded px-8 pt-6 pb-8 mb-4">
          <JsxParser
            components={{ AsideNote, InlineAudioPlayer }}
            componentsOnly={ false }
            showWarnings={ true }
            jsx={this.state.jsxContent}
          />
          </div>

      </div>
    )
  }
}

export default Editor