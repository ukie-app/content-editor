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

  lessonRef.update({text: editorText});
  console.log("saved:", editorText)

}

function getFromDB (lessonDoc, state) {
  const lessonRef = db.collection("lessons").doc(lessonDoc)
  let getDoc = lessonRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data().contentHtml);
        let html = doc.data().contentHtml
        state.setState({ html })
        localStorage.setItem('content', JSON.stringify(html))
        exec('insertHTML', html)
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
      html: localStorage.getItem('content'),
    }
  }

  componentDidMount () {
    this.editor = init({
      element: document.getElementById('editor'),
      defaultParagraphSeparator: 'div',
      // document.getElementById('editor').content.innerHTML: localStorage.getItem('content')
      onChange: (html) => (
        this.setState({ html }),
        localStorage.setItem('content', JSON.stringify(html))

      ),
      actions: [
        'bold',
        {
          name: 'content',
          icon: '<b>C</b>',
          title: 'Get content',
          result: () => getFromDB(this.props.match.params.lesson, this)
        },
        'underline',
        'italic',
        'strikethrough',
        'paragraph',
        'heading1',
        {
          name: 'subtitle',
          icon: '<b>H<sub>3</sub></b>',
          title: 'Make subtitle',
          result: () => exec('formatBlock', '<h3>')
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
        // 'code',
        // 'line',
        // 'link',
        // 'image',
      ],
      classes: {
        actionbar: 'pell-actionbar',
        button: 'pell-button',
        content: 'editor-content',
        selected: 'pell-button-selected',
      },
    })
  }

  render() {
    console.log(this.state)
    return (
      <div className="lesson-editor">
        <h3>Editor:</h3>
        <div id="editor" className="pell">
        </div>
        <h3>HTML Output:</h3>
        <div id="html-output">
          <ParsedHtmlComponent html={this.state.html} />
        </div>
      </div>
    );
  }
}

export default Editor
