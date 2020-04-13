/**
 * Build styles
 */
// require('./index.css').toString();

/**
 * @class Audio
 * @classdesc Audio Tool for Editor.js
 * @property {AudioData} data - Audio Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} AudioData
 * @description Audio Tool`s input and output data
 * @property {string} title - Audio`s title
 * @property {string} text - Audio`s text
 *
 * @typedef {object} AudioConfig
 * @description Audio Tool`s initial configuration
 * @property {string} titlePlaceholder - placeholder to show in Audio`s title input
 * @property {string} textPlaceholder - placeholder to show in Audio`s text input
 */
export default class InlineAudio {
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
      return {
        icon: '<b>Audio</b>',
        title: 'Audio'
      };
  }


  /**
   * Default placeholder for Audio source
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_AUDIO_SRC_PLACEHOLDER() {
    return 'audioSrc';
  }

  
  /**
   * Default placeholder for Audio inline text
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_TEXT_PLACEHOLDER() {
    return 'text';
  }

  /**
   * Audio Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: 'cdx-note',
      audioSrc: 'cdx-note__type',
      text: 'cdx-note__text',
      input: this.api.styles.input,
    };
  }

  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {AudioData} data — previously saved data
   * @param {AudioConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({data, config, api}) {
    this.api = api;

    this.audioSrcPlaceholder = config.audioSrcPlaceholder || InlineAudio.DEFAULT_AUDIO_SRC_PLACEHOLDER;
    this.textPlaceholder = config.textPlaceholder || InlineAudio.DEFAULT_TEXT_PLACEHOLDER;

    this.data = {
      audioSrc: data.audioSrc || '',
      text: data.text || '',
    };
  }

  /**
   * Create Audio Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const container = this._make('div', [this.CSS.baseClass, this.CSS.wrapper]);
    const audioSrc = this._make('div', [this.CSS.input, this.CSS.audioSrc], {
      contentEditable: true,
      innerHTML: this.data.audioSrc
    });
    const text = this._make('div', [this.CSS.input, this.CSS.text], {
      contentEditable: true,
      innerHTML: this.data.text
    });
  
    audioSrc.dataset.placeholder = this.audioSrcPlaceholder;
    text.dataset.placeholder = this.textPlaceholder;

    container.appendChild(audioSrc);
    container.appendChild(text);

    return container;
  }

  /**
   * Extract Audio data from Audio Tool element
   *
   * @param {HTMLDivElement} AudioElement - element to save
   * @returns {AudioData}
   */
  save(AudioElement) {
    const audioSrc = AudioElement.querySelector(`.${this.CSS.audioSrc}`);
    const text = AudioElement.querySelector(`.${this.CSS.text}`);

    return Object.assign(this.data, {
      audioSrc: audioSrc.innerHTML,
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
   * Sanitizer config for Audio Tool saved data
   * @return {Object}
   */
   static get sanitize() {
     return {
      audioSrc: {
          a: {
            href: true
          }
        },
      text: {
        b: true,
        br: true,
        a: {
          href: true
        },
        i: true
      }
    }
  }
}
