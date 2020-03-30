import React, { Component } from 'react'
import { init } from 'pell'

import firebase from './Firebase/firebase'

import ParsedHtmlComponent from './ParsedHtmlComponent'

import 'pell/dist/pell.css'

const db = firebase.firestore()

const exec = (command, value = null) => (
  document.execCommand(command, false, value)
)

const saveToDB = (lessonDoc, editorText) => {
  const lessonRef = db.collection("lessons").doc(lessonDoc)

  lessonRef.update({contentHtml: editorText});
  console.log("saved to DB:", editorText)
}

function getFromDB (lessonDoc, objRef) {
  db.collection("lessons").doc(lessonDoc).get()
    .then(doc => {
      if (doc.exists) {
        // console.log('Document data:', doc.data().contentHtml)
        let html = doc.data().contentHtml
        // update state, local storange and inner HTML of the editor
        if (html) {
          objRef.setState({ html })
          localStorage.setItem('content', JSON.stringify(html))
          objRef.editor.content.innerHTML = html
        }
        else {
          localStorage.setItem('content', '')
          objRef.editor.content.innerHTML = "<p>Start new lesson</p>"
        }
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

class Editor extends Component {
  editor = null

  constructor (props) {
    super(props)

    this.state = {
      html: '',
    }
  }

  componentDidMount() {
    this.editor = init({
      element: document.getElementById('editor'),
      defaultParagraphSeparator: 'div',
      // document.getElementById('editor').content.innerHTML: localStorage.getItem('content')
      onChange: (html) => ((
        this.setState({ html }),
        localStorage.setItem('content', JSON.stringify(html))
      )),
      actions: [
        'bold',
        'underline',
        'italic',
        'strikethrough',
        'paragraph',
        {
          name: 'div',
          icon: '<b>DIV</b>',
          title: 'Insert div',
          result: () => exec('formatBlock', '<div>')
        },
        {
          name: 'em dash',
          icon: '<b>―</b>',
          title: 'Insert Em Dash',
          result: () => exec('insertText', '―')
        },
        'heading1',
        {
          name: 'subtitle',
          icon: '<b>H<sub>3</sub></b>',
          title: 'Make subtitle',
          result: () => exec('formatBlock', '<h3>')
        },
        {
          name: 'divider',
          icon: '<b>hr</b>',
          title: 'Insert divider',
          result: () => exec('insertHtml', '<hr class="lesson-divider">')
        },
        'quote',
        'olist',
        'ulist',
        {
          name: 'save',
          icon: '&#x1f4be;',
          title: 'Save to DB',
          result: () => saveToDB(this.props.match.params.lesson, localStorage.getItem('content').replace(/"/g, ''))
        },
      ],
      classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'editor-content',
        selected: 'pell-button-selected',
      },
    })

    getFromDB(this.props.match.params.lesson, this);
  }

  render() {
    return (
      <div className="lesson-editor" style={{ margin: '20px' }}>
        <h3>Editor</h3>

        <div id="editor" className="pell"></div>

        <h3 style={{ marginTop: '50px' }}>HTML Output</h3>

        <div id="html-output">
          {this.state.html}
          {/* <ParsedHtmlComponent html={this.state.html} /> */}
        </div>
      </div>
    )
  }
}

export default Editor
