/**
 * Build styles
 */
require('./index.css').toString();

/**
 * Inline Code Tool for the Editor.js
 *
 * Allows to wrap inline fragment and style it somehow.
 */
class InlineHighlight {
  /**
   * Class name for term-tag
   *
   * @type {string}
   */
  static get CSS() {
    return 'inline-highlight';
  };

  /**
   * Get Tool icon's SVG
   * @return {string}
   */
  get toolboxIcon() {
    return '<svg width="19" height="13" viewBox="0 0 19 13" xmlns="http://www.w3.org/2000/svg"><path d="M60,10 C-10,0 -10,100 60,90" /></svg>';
  }
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
    return {
      title: 'Highlight'
    };
}

  /**
   */
  constructor({api}) {
    this.api = api;

    /**
     * Toolbar Button
     *
     * @type {HTMLElement|null}
     */
    this.button = null;

    /**
     * Tag represented the term
     *
     * @type {string}
     */
    this.tag = 'span';

    /**
     * CSS classes
     */
    this.iconClasses = {
      base: this.api.styles.inlineToolButton,
      active: this.api.styles.inlineToolButtonActive
    };
  }

  /**
   * Specifies Tool as Inline Toolbar Tool
   *
   * @return {boolean}
   */
  static get isInline() {
    return true;
  }

  /**
   * Create button element for Toolbar
   *
   * @return {HTMLElement}
   */
  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.iconClasses.base);
    this.button.innerHTML = this.toolboxIcon;

    return this.button;
  }

  /**
   * Wrap/Unwrap selected fragment
   *
   * @param {Range} range - selected fragment
   */
  surround(range) {
    if (!range) {
      return;
    }

    let termWrapper = this.api.selection.findParentTag(this.tag, InlineHighlight.CSS);

    /**
     * If start or end of selection is in the highlighted block
     */
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  /**
   * Wrap selection with term-tag
   *
   * @param {Range} range - selected fragment
   */
  wrap(range) {
    /**
     * Create a wrapper for highlighting
     */
    let span = document.createElement(this.tag);

    span.classList.add(InlineHighlight.CSS);

    /**
     * SurroundContent throws an error if the Range splits a non-Text node with only one of its boundary points
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Range/surroundContents}
     *
     * // range.surroundContents(span);
     */
    span.appendChild(range.extractContents());
    range.insertNode(span);

    /**
     * Expand (add) selection to highlighted block
     */
    this.api.selection.expandToTag(span);
  }

  /**
   * Unwrap term-tag
   *
   * @param {HTMLElement} termWrapper - term wrapper tag
   */
  unwrap(termWrapper) {
    /**
     * Expand selection to all term-tag
     */
    this.api.selection.expandToTag(termWrapper);

    let sel = window.getSelection();
    let range = sel.getRangeAt(0);

    let unwrappedContent = range.extractContents();

    /**
     * Remove empty term-tag
     */
    termWrapper.parentNode.removeChild(termWrapper);

    /**
     * Insert extracted content
     */
    range.insertNode(unwrappedContent);

    /**
     * Restore selection
     */
    sel.removeAllRanges();
    sel.addRange(range);
  }

  /**
   * Check and change Term's state for current selection
   */
  checkState() {
    const termTag = this.api.selection.findParentTag(this.tag, InlineHighlight.CSS);

    this.button.classList.toggle(this.iconClasses.active, !!termTag);
  }


  /**
   * Sanitizer rule
   * @return {{span: {class: string}}}
   */
  static get sanitize() {
    return {
      code: {
        class: InlineHighlight.CSS
      }
    };
  }
}

module.exports = InlineHighlight;