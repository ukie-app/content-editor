import React, { Component } from 'react'

import firebase from './Firebase/firebase'

import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from '@editorjs/table'
import CustomParagraph from './plugins/CustomParagraph/CustomParagraph'

import ParsedHtmlComponent from './ParsedHtmlComponent'
const db = firebase.firestore()

//
// const saveToDB = (lessonDoc, editorText) => {
//   const lessonRef = db.collection("lessons").doc(lessonDoc)
//
//   lessonRef.update({contentHtml: editorText});
//   console.log("saved to DB:", editorText)
// }
//
// function getFromDB(lessonDoc, objRef) {
//   db.collection("lessons").doc(lessonDoc).get()
//     .then(doc => {
//       if (doc.exists) {
//         // console.log('Document data:', doc.data().contentHtml)
//         let html = doc.data().contentHtml
//         // update state, local storange and inner HTML of the editor
//         if (html) {
//           objRef.setState({ html })
//           localStorage.setItem('content', JSON.stringify(html))
//           objRef.editor.content.innerHTML = html
//         }
//         else {
//           localStorage.setItem('content', '')
//           objRef.editor.content.innerHTML = "<p>Start new lesson</p>"
//         }
//       }
//     })
//     .catch(err => {
//       console.log('Error getting document', err);
//     });
//   }

class Editor extends Component {
  // editor = null

  constructor (props) {
    super(props)

    this.state = {
      html: '',
      editorInstance: null,
      rawOutputData: null
    }
  }

  componentDidMount() {
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

      /**
     * Previously saved data that should be rendered
     */
      data: {},

      /**
      * onReady callback
      */
     onReady: () => {console.log('Editor.js is ready to work!')},

     /**
      * onChange callback
      */
     onChange: () => {this.saveData()}

    });

    this.setState({
      editorInstance: editor
    })


  }

  saveData = () => {
    this.state.editorInstance.save().then((outputData) => {
      console.log('Article data: ', outputData)
      this.setState({
        rawOutputData: outputData
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
     }
    }

   console.log("Parsed", result)
   this.setState({
     html: result
   })
 }

  render() {

    console.log("STATE", this.state)

    return (
      <div className="lesson-editor" style={{ margin: '20px' }}>
        <h3>Editor</h3>

        <div id="editor" className="pell"></div>

        <button
          className="btn btn-green"
          onClick={() => this.saveData()}
        >
          Save content
        </button>

        <h3 style={{ marginTop: '50px' }}>HTML Output</h3>

        <div id="html-output">
          {this.state.html}
        </div>
      </div>
    )
  }
}

export default Editor
