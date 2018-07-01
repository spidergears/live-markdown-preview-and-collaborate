window.onload = function() {
  var showDown = new showdown.Converter();
  var mdPad = document.getElementById('md-pad');
  var livePreview = document.getElementById('live-preview');

  mdPad.addEventListener('keydown',function(e) {
    if(e.keyCode === 9) { // tab key
      var start = this.selectionStart;
      var end = this.selectionEnd;

      var target = e.target;
      var value = target.value;

      // set textarea value to: text before caret + tab + text after caret
      target.value = value.substring(0, start) + "\t" + value.substring(end);
      // put caret at right position again (add one for the tab)
      this.selectionStart = this.selectionEnd = start + 1;
      e.preventDefault();
    }
  });

  var markdownText;
  var generatePreview = function(){
    markdownText = mdPad.value;
    generatedHtml = showDown.makeHtml(markdownText);
    livePreview.innerHTML = generatedHtml;
  };

  var markdownTextChanged = function(){
    if(markdownText != mdPad.value)
      return true;
    return false;
  };

  setInterval(function(){
    if(markdownTextChanged())
      generatePreview();
  }, 500);

  mdPad.addEventListener('input', generatePreview);

  if(document.location.pathname.length > 1){ // not root path
    var documentName = document.location.pathname.substring(1);
    sharejs.open(documentName, 'text', function(error, doc){
      doc.attach_textarea(mdPad);
      generatePreview();
    });
  }

  generatePreview();
}
