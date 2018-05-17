/**
 * jquery-behaviours
 * https://github.com/hdpe/jquery-behaviours
 *
 * Simple jQuery plugin for behaviour attaching. For when you don't have
 * anything like the need for a full-blown front-end framework à la Angular
 * or React.
 *
 * MIT License
 *
 * Copyright (c) 2018 Ryan Pickett
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
;(function(factory) {
  "use strict";

  if (typeof module !== "undefined") {
    module.exports = function($) {
      factory($);
    }
  } else {
    factory(jQuery);
  }

})(function($) {
  "use strict";

  var behaviours = [];

  /**
   * Apply all registered behaviours to the matched elements and/or their
   * children where applicable.
   *
   * @returns {jQuery}
   */
  $.fn.behaviours = function() {
    return this.each(function(i, el) {
      $.each(getSortedBehaviours(), function(j, behaviour) {
        getContextElements(behaviour.selector, el).each(function() {
          applyBehaviour(this, behaviour);
        });
      });
    });
  };

  /**
   * The maximum priority (first to run) that a behaviour can be assigned.
   *
   * @type {number}
   */
  $.fn.behaviours.MAX_PRIORITY = 0;

  /**
   * The minimum priority (last to run) that a behaviour can be assigned.
   *
   * @type {number}
   */
  $.fn.behaviours.MIN_PRIORITY = Number.MAX_VALUE;

  /**
   * The priority that a behaviour is assigned if none is specified.
   *
   * @type {number}
   */
  $.fn.behaviours.DEFAULT_PRIORITY = 100;

  /**
   * Register a function {fn} applicable to a selector {selector} to be
   * bound on the set of matched elements and/or their children whenever
   * $...behaviours() is called.
   *
   * The function {fn} takes no arguments and its bound (this) context is
   * the matched element.
   *
   * @param selector {string}
   * @param fn {Function}
   * @param priority {number}
   */
  $.fn.behaviours.register = function(selector, fn, priority) {
    behaviours.push({
      selector: selector,
      fn: fn,
      priority: (typeof priority === "number" && priority >= 0) ? priority :
				$.fn.behaviours.DEFAULT_PRIORITY
    });
  };

  // private functions

  /**
   * Get the elements matching {selector} equal to or children of element
   * {context} - we can't just use jQuery.find etc. for this as we are
   * looking to locate e.g. the selector '.context .subcontext .selector'
   * within '.subcontext'.
   *
   * @param selector {string}
   * @param context {HTMLElement}
   * @returns {jQuery}
   */
  function getContextElements(selector, context) {
    // efficient path for $(document)
    if (context.nodeType === 9 /* DOCUMENT_NODE */ ) {
      return $(selector, context);
    }
    // onerous path
    return $(context).find("*")
      .addBack()
      .filter(function() {
        return $(this).is(selector);
      });
  }

  /**
   * Apply a behaviour to the given element. The names of attached behaviours
   * are stored in the element's arbitrary data, and behaviours will not be
   * attached to the same element more than once.
   *
   * @param element {HTMLElement}
   * @param behaviour {Function}
   */
  function applyBehaviour(element, behaviour) {
    var el = $(element),
      REGISTERED_BEHAVIOURS_KEY = "behaviour-list",
      data = el.data(REGISTERED_BEHAVIOURS_KEY) || "",
      encodedSelectors = data.split(/,/),
      encoded = encodeURIComponent(behaviour.selector);

    if ($.inArray(encoded, encodedSelectors) === -1) {
      el.data(REGISTERED_BEHAVIOURS_KEY, (data === "" ? "" : (data + ",")) + encoded);

      behaviour.fn.apply(element);
    }
  }

  /**
   * Return the behaviours array sorted by priority.
   *
   * @returns {Function[]}
   */
  function getSortedBehaviours() {
    var sorted = behaviours.slice();
    sorted.sort(function(a, b) {
      return a.priority - b.priority;
    });
    return sorted;
  }

});
