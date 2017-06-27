var jsdom = require('jsdom'),
    jquery = require('jquery');

describe('jquery-behaviours', function() {

  it('applies a behaviour throughout the document', function() {
    doWithDocument('<div></div>', function(document, $) {
      var applied = false;

      $.fn.behaviours.register('div', function() { applied = true; });

      $(document).behaviours();

      expect(applied).toBe(true);
    });
  });

  it('applies a behaviour throughout an element', function() {
    doWithDocument('<div></div>', function(document, $) {
      var applied = false;

      $.fn.behaviours.register('div', function() { applied = true; });

      $('div').behaviours();

      expect(applied).toBe(true);
    });
  });

  it('applies a behaviour only once', function() {
    doWithDocument('<div></div>', function(document, $) {
      var appliedCount = 0;

      $.fn.behaviours.register('div', function() { ++appliedCount; });

      $(document).behaviours()
      $('div').behaviours();

      expect(appliedCount).toBe(1);
    });
  });

  it('applies a behaviour registered on a child element', function() {
    doWithDocument('<div><span></span></div>', function(document, $) {
      var applied = false;

      $.fn.behaviours.register('div span', function() { applied = true; });

      $('div').behaviours();

      expect(applied).toBe(true);
    });
  });

  it('applies behaviours in priority order', function() {
    doWithDocument('<div class="a b c"></div>', function(document, $) {
      var appliedChars = '';

      $.fn.behaviours.register('.a', function() { appliedChars += 'x'; });
      $.fn.behaviours.register('.b', function() { appliedChars += 'y'; }, $.fn.behaviours.MAX_PRIORITY);
      $.fn.behaviours.register('.c', function() { appliedChars += 'z'; }, $.fn.behaviours.MIN_PRIORITY);

      $(document).behaviours();

      expect(appliedChars).toBe('yxz');
    });
  });

  // private functions

  function doWithDocument(html, callback) {

    var dom = new jsdom.JSDOM(html),
        $ = jquery(dom.window);

    require('../jquery-behaviours.js')($);

    callback(dom.window.document, $);
  }
});
