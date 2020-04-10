import React, { Component } from 'react'

import firebase from './Firebase/firebase'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import CustomParagraph from './plugins/CustomParagraph/CustomParagraph'

import ParsedHtmlComponent from './ParsedHtmlComponent'
const db = firebase.firestore()


const saveToDB = (lessonDoc, editorText) => {
  const lessonRef = db.collection("lessons").doc(lessonDoc)

  lessonRef.update({contentHtml: editorText});
  console.log("saved to DB:", editorText)
}

function getFromDB (lessonDoc, thisObjRef) {

  console.log("GET FROM DB | thisObjRef:", thisObjRef)
  db.collection("lessons").doc(lessonDoc).get()
    .then(doc => {
      if (doc.exists) {
        // console.log('Document data:', doc.data().contentHtml)
        let jsonData = doc.data().jsonContent
        let htmlData = doc.data().htmlContent
        // update state, local storange and inner HTML of the editor
        if (jsonData && htmlData) {
          console.log("jsonData", jsonData)
          // thisObjRef.setState({
          //   jsonContent: jsonData,
          //   htmlContent: htmlData,
          // })
          // localStorage.setItem('content', JSON.stringify(jsonData))
          return jsonData
        }
        else {
          // localStorage.setItem('content', '')
          console.log("intitial data")
          let initialData = {
            "time" : 1550476186479,
            "blocks": [
              {
                "type": "header",
                "data": {
                   "text": "Start a new lesson",
                   "level": 2
                }
             },
            ],
            "version" : "2.8.1"
          }
          return initialData
        }
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }


class Editor extends Component {
  // editor = null

  constructor (props) {
    super(props)

    this.state = {
      htmlContent: '',
      jsonContent: '',
      editorInstance: null,
      rawOutputData: null
    }
  }

  componentDidMount() {

    let jsonData = {}

    async function getJsonData(lessonDoc) {
      console.log('calling getJsonData')
      jsonData = await getFromDB(lessonDoc)
      console.log("jsonData after calling", jsonData)
    }

    
    // getJsonData(this.props.match.params.lesson)

    // setTimeout(jsonData = getFromDB(this.props.match.params.lesson), 450)

    console.log("data", jsonData)

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
            levels: [1, 2, 3, 4],
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

      // /**
      //  * Previously saved data that should be rendered
      //  */
      data: jsonData,

      /**
      * onReady callback
      */
     onReady: () => {console.log("Editor is ready")},

     /**
      * onChange callback
      */
     onChange: () => {this.saveData()}

    });

    this.setState({
      editorInstance: editor
    })

    // console.log("EDITOR", editor)
    // editor.configuration.data = getFromDB(this.props.match.params.lesson, this)

    // editor.isReady
    //   .then(() => {
        
    //     setTimeout(getFromDB(this.props.match.params.lesson, editor), 450)
        
    //     console.log("updated editor data", editor.configuration.data)
        
    //     /** Do anything you need after editor initialization */
    //   })
    //   .catch((reason) => {
    //     console.log(`Editor.js initialization failed because of ${reason}`)
    //   });

    
  }

  saveData = () => {
    this.state.editorInstance.save().then((outputData) => {
      console.log('Article data: ', outputData)
      this.setState({
        jsonContent: outputData
      })
      this.editorBlocksToJSX(outputData)
    }).catch((error) => {
      console.log('Saving failed: ', error)
    });
  }



  editorBlocksToJSX = (outputData) => {
    let result = ``;

    for (let block of outputData.blocks) {
      switch (block.type) {
        case 'paragraph':
          result += `<p class="lesson-paragraph">${block.data.text}</p>`
          break
        case 'header':
          result += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`
          break
        case 'list':
          let listItems = ''
          for(let item of block.data.items) {
            listItems += `<li>${item}</li>`
          }
          if(block.data.style === 'unordered') {
            result += `<ul>${listItems}</ul>`
          }
          else {
            result += `<ol>${listItems}</ol>`
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
          result += `<table><tbody>${tableRows}</tbody></table>`
          break
        default:
          return null
     }
    }

  //  console.log("Parsed", result)
   this.setState({
     html: result
   })
 }

  render() {

    // console.log("STATE", this.state)

    return (
      <div className="lesson-editor" style={{ margin: '20px' }}>
        <h3>Editor</h3>

        <div id="editor" className="pell"></div>

        <button
          className="my-4 btn-teal"
          onClick={() => this.saveData()}
        >
          Save content
        </button>

        <h3 style={{ marginTop: '30px' }}>
          HTML Output
        </h3>
        <div id="html-output">
          {this.state.html}
        </div>
      </div>
    )
  }
}

export default Editor
