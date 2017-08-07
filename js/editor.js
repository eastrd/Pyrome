$(function(){
   let name = null;
   let content = null;

   // Get current tab's URL
   let URL = null;
   chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
     URL = tabs[0].url;
   });

   let editor = CodeMirror.fromTextArea(document.getElementById("CodeForm"),{
      mode: "python",
      lineNumbers: true,
      extraKeys: {"Ctrl-Space":"autocomplete"}
    });
  editor.setSize('560px','200px');
  let words =''
  editor.on("cursorActivity", function () {
            //get the current value in textarea
            words = editor.getValue() + '';

        });
  // Use JQuery to post the form to local Flask
  $('#submit').click(function(){
        let compiled_words = words;
        var Domain = URL.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];
        while (compiled_words.indexOf("PYROME_URL") !== -1 || compiled_words.indexOf("PYROME_DOMAIN") !== -1){
          compiled_words = compiled_words.replace("PYROME_URL", '"""' + URL + '"""').replace("PYROME_DOMAIN", '"""' + Domain + '"""');
        }
        $.ajax({
        type:   "POST",
        url:    "http://localhost/run",
        data:   { "Python" :compiled_words },
        success: function(response, xml){
          $("#output").val(response);
        },
        fail: function(status){
          alert(status);
        }
      });
  });

  // Clear the output textare when the clear button is clicked
  $("#outputclear").click(function(){
    $("#output").val("");
  });

  // Clear the CodeForm textare when the clear button is clicked
  $("#inputclear").click(function(){
    editor.setValue('');
  });

  /*
  //Load button
  $("#load").click(function(){
       name = $("#ScriptName").val();
      chrome.storage.local.get(name, function(pair){
        content = pair[name];
      $.ajax({
        type: "POST",
        url:  "http://localhost/load",
        data: { "Script" : content },
        success: function(response, xml){
          editor.setValue(response);
        },
        fail: function(status){
          alert(status);
        }
      });

      });
  });
*/


  $("#delete").click(function(){
     name = $("#ScriptName").val();
     chrome.storage.local.remove([name], function(){
        //alert("Deleted!");
        window.location.href="editor.html";
     });
  });

  // Save button
  $("#save").click(function(){
    var Name = $("#ScriptName").val();
    var Content = words;
    if (Name != ""){
      chrome.storage.local.set({[Name]: Content}, function(){
        //alert("Saved!");
        window.location.href="editor.html";
      });
    }
    else{
      alert("Script name cannot be blank!")
    }
  });

  // Back button
  $("#back").click(function(){
    window.location.href = "nav.html";
  });

  chrome.storage.local.get(null, function(items){
    var allKeys = Object.keys(items);
    for (var i=0; i<allKeys.length; i++){
      $("#list").append('<li class="list-group-item" id="item">' + allKeys[i] + '</li>');
    }
    // Implemented click-to-load functionality
    $('ul').on('click', 'li', function() {
      name = $(this).text();
      chrome.storage.local.get(name, function(pair){
        content = pair[name];
        $.ajax({
          type: "POST",
          url:  "http://localhost/load",
          data: { "Script" : content },
          success: function(response, xml){
            editor.setValue(response);
            $("#ScriptName").val(name);
          },
          fail: function(status){
            alert(status);
          }
        });
      });
    });
  });

  /*    Editor Related Scripts      */
  $("#CodeForm").keydown(function(e){
    key = e.keyCode;
    if (key == 9){
      var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;
      this.value = val.substring(0, start) + '    ' + val.substring(end);
      this.selectionStart = this.selectionEnd = start + 4;
      return false;
    }
  });
});
