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
