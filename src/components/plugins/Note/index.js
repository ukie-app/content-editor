/**
 * Build styles
 */
/**
 * Import Tool's icon
 */
// import ToolboxIcon from './svg/pencil.svg';

require('./index.css').toString();

/**
 * @class Note
 * @classdesc Note Tool for Editor.js
 * @property {NoteData} data - Note Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} NoteData
 * @description Note Tool`s input and output data
 * @property {string} title - Note`s title
 * @property {string} text - Note`s text
 *
 * @typedef {object} NoteConfig
 * @description Note Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in Note`s title input
 * @property {string} textPlaceholder - placeholder to show in Note`s text input
 */
export default class Note {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
      return {
        icon: '<svg width="15" height="14" viewBox="0 0 15 14" xmlns="http://www.w3.org/2000/svg"><path d="M13.53 6.185l.027.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.569-1.568l4.838-4.837L6.396 2.23A1.125 1.125 0 1 1 7.986.64l5.52 5.518.025.027zm-5.815 0l.026.025a1.109 1.109 0 0 1 0 1.568l-5.644 5.644a1.109 1.109 0 1 1-1.568-1.568l4.837-4.837L.58 2.23A1.125 1.125 0 0 1 2.171.64L7.69 6.158l.025.027z" /></svg>',
        title: 'Note'
      };
  }

  // /**
  //  * Empty Note is not empty Block
  //  * @public
  //  * @returns {boolean}
  //  */
  // static get contentless() {
  //   return true;
  // }

  /**
   * Allow to press Enter inside the Note
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

    /**
   * Default placeholder for Note type
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TYPE_PLACEHOLDER() {
    return 'Type';
  }

  /**
   * Default placeholder for Note title
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TITLE_PLACEHOLDER() {
    return 'Title';
  }

  /**
   * Default placeholder for Note text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TEXT_PLACEHOLDER() {
    return 'Text';
  }

  /**
   * Allow Note to be converted to/from other blocks
   */
  static get conversionConfig(){
    return {
      /**
       * To create Note data from string, simply fill 'text' property
       */
      import: 'text',
      /**
       * To create string from Note data, concatenate text and title
       * @param {QuoteData} quoteData
       * @return {string}
       */
      export: function (noteData) {
        return noteData.title ? `${noteData.text} — ${noteData.title}` : noteData.text;
      }
    };
  }

  /**
   * Note Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-note',
      type: 'cdx-note__type',
      title: 'cdx-note__title',
      input: this.api.styles.input,
      text: 'cdx-note__text'
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {NoteData} data — previously saved data
   * @param {NoteConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this.typePlaceholder = config.typePlaceholder || Note.DEFAULT_TYPE_PLACEHOLDER;
    this.titlePlaceholder = config.titlePlaceholder || Note.DEFAULT_TITLE_PLACEHOLDER;
    this.textPlaceholder = config.textPlaceholder || Note.DEFAULT_TEXT_PLACEHOLDER;

    this.data = {
      type: data.type || '',
      title: data.title || '',
      text: data.text || ''
    };
  }

  /**
   * Create Note Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const type = this._make('div', [this.CSS.input, this.CSS.type], {
      contentEditable: true,
      innerHTML: this.data.type
    });
    const title = this._make('div', [this.CSS.input, this.CSS.title], {
      contentEditable: true,
      innerHTML: this.data.title
    });
    const text = this._make('div', [this.CSS.input, this.CSS.text], {
      contentEditable: true,
      innerHTML: this.data.text
    });

    type.dataset.placeholder = this.typePlaceholder;
    title.dataset.placeholder = this.titlePlaceholder;
    text.dataset.placeholder = this.textPlaceholder;

    container.appendChild(type);
    container.appendChild(title);
    container.appendChild(text);

    return container;
  }

  /**
   * Extract Note data from Note Tool element
   *
   * @param {HTMLDivElement} NoteElement - element to save
   * @returns {NoteData}
   */
  save(NoteElement) {
    const type = NoteElement.querySelector(`.${this.CSS.type}`);
    const title = NoteElement.querySelector(`.${this.CSS.title}`);
    const text = NoteElement.querySelector(`.${this.CSS.text}`);

    return Object.assign(this.data, {
      type: type.innerHTML,
      title: title.innerHTML,
      text: text.innerHTML
    });
  }

  /**
   * Helper for making Elements with attributes
   *
   * @param  {string} tagName           - new Element tag name
   * @param  {array|string} classNames  - list or name of CSS classname(s)
   * @param  {Object} attributes        - any attributes
   * @return {Element}
   */
  _make(tagName, classNames = null, attributes = {}) {
    let el = document.createElement(tagName);

    if ( Array.isArray(classNames) ) {
      el.classList.add(...classNames);
    } else if( classNames ) {
      el.classList.add(classNames);
    }

    for (let attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }

  /**
   * Sanitizer config for Note Tool saved data
   * @return {Object}
   */
   static get sanitize() {
     return {
        type: {
          b: true,
          br: true,
          a: {
            href: true
          },
          i: true
        },
        title: {
          b: true,
          br: true,
          a: {
            href: true
          },
          i: true
        },
        text: {
          b: true,
          br: true,
          a: {
            href: true
          },
          i: true
        }
      };
  }
}
