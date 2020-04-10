import React, { Component } from 'react'

import firebase from './Firebase/firebase'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import CustomParagraph from './plugins/CustomParagraph/CustomParagraph'

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
            resolve(jsonData)
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

  lessonRef.update({
    jsonContent: editorData
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
    },

    /**
    * Previously saved data that should be rendered
    */
    data: jsonData,

    /**
    * onReady callback
    */
    onReady: () => { console.log("Editor is ready") },

    /**
      * onChange callback
      */
    onChange: () => { thisObjRef.saveData(thisObjRef) }

  });

  thisObjRef.setState({
    jsonContent: jsonData,
    editorInstance: editor,
  })
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
          parsedResult += `<p class="lesson-paragraph">${block.data.text}</p>`
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
              tableCells += `<td>${block.data.content[row][col]}</td>`
            }
            tableRows += `<tr>${tableCells}</tr>`
          }
          parsedResult += `<table><tbody>${tableRows}</tbody></table>`
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

    return (
      <div className="lesson-editor" style={{ margin: '20px' }}>
        <h3>Editor</h3>

        <div id="editor" className="pell"></div>

        <button
          className="my-4 btn-teal"
          onClick={() => saveToDB(this.props.match.params.lesson, this.state.jsonContent, this.state.jsxContent)}
        >
          Save content
        </button>

        <h3 style={{ marginTop: '30px' }}>
          HTML Output
        </h3>
        <div id="html-output">
          {this.state.jsxContent}
        </div>
      </div>
    )
  }
}

export default Editor
