import React, { Component } from 'react'
import { init } from 'pell'

import firebase from './Firebase/firebase'

import ParsedHtmlComponent from './ParsedHtmlComponent'

import 'pell/dist/pell.css'

const exec = (command, value = null) => (
  document.execCommand(command, false, value)
)

const saveToDB = (html) => {
  const db = firebase.firestore()

  const courseRef = db.collection("course").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
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
        this.setState({ html }), localStorage.setItem('content', JSON.stringify(html))
      ),
      actions: [
        'bold',
        {
          name: 'content',
          icon: '<b>C</b>',
          title: 'Get content',
          result: () => exec('insertHTML', localStorage.getItem('content').replace(/"/g, ''))
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
          result: () => saveToDB(localStorage.getItem('content').replace(/"/g, ''))
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