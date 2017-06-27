## jquery-behaviours ##

Simple jQuery plugin for behaviour attaching. For when you don't have anything
like the need for a full-blown front-end framework à la Angular or React.

```javascript
// register
$.fn.behaviours.register('.selector', function() {
  $(this).click(function() {
    // blah
  });
});
```

```javascript
// on page load
$(function() {
  $(document).behaviours();
});
```

```javascript
// reapply on DOM change
$(function() {
  $('.selector').load('/fragment.html').complete(function() {
    $(this).behaviours();
  });
});
```

```javascript
// to hell with <script> tag order
$.fn.behaviours.register('.selector', function() {
  // blah
}, $.fn.behaviours.MAX_PRIORITY);
```

etc.
