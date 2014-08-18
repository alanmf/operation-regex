$(document).ready(function() {
    var urlVars = getUrlVars(window.location.href);
    console.log(urlVars["test"]);
    if (urlVars["regex"]) {
      $("#regex-input").val(decodeURIComponent(urlVars["regex"]));
      runRegexChecking();
    }

    if (urlVars["test"]) {
    $("#test-string-input").val(decodeURIComponent(urlVars["test"]));
      runRegexChecking();
    }

    $("#test-string-input").bind('keyup paste change', function() {
      runRegexChecking();
    });

    $("#regex-input").bind('keyup paste change', function() {
      runRegexChecking();
    });

    function runRegexChecking() {
      cleanup();
      var regex_input = $("#regex-input").val();
      var test_string = $("#test-string-input").val();
      updateShareUrl(encodeURIComponent(regex_input), encodeURIComponent(test_string));
      var regular_expression = validateRegex(regex_input);
      checkRegexWhitespace(regex_input);
      checkMatch(regular_expression, test_string);
    }

    function getUrlVars() {
      var vars = [], hash;
      var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
      for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
      }
      return vars;
    }

    function updateShareUrl(regex, test) {
      $("#share").attr('href', "file:///var/www/operation-regex/index.html?regex=" + regex + "&test=" + test);
    }

    function checkRegexWhitespace(regex_input) {
      if (regex_input.match(/\s$|^\s/)) {
        $("#regex-input").parent(".control-group").addClass("warning");
        $("#bad-regex").append("Warning: Your regular expression contains leading or trailing whitespace.<br>");
      }
    }

    function validateRegex(regex_input) {
      try {
        var regular_expression = new RegExp(regex_input);
        return regular_expression
      } catch(err) {
        $("#regex-input").parent(".control-group").addClass("error");
        $("#bad-regex").html("Error: " + err.message + "<br>");
        return null
      }
    }
    function checkMatch(regex, str) {
      var regex_match = str.match(regex);
      if (regex_match && $("#regex-input").val() != "") {
        $("#pre-matched").show();
        var input_text = $("#test-string-input").val();
        $("#matched-regex").html(input_text.replace(regex_match[0], "<span class='match_highlight'>" + regex_match[0] + "</span>"));

        if (regex_match.length > 1) {
          $("#groups-container").show();
          var results_html = "<dl>";
          for (var i=1; i < regex_match.length; ++i) {
            if (i in regex_match) {
              var s = regex_match[i];
              results_html += "<dt>Group " + i + "</dt>";
              if (s == "") {
                s = "Empty Group!";
              }
              results_html += "<pre class='span5'><dd>" + s + "</dd></pre>";
            }
          }
          results_html += "<dl>";
          $("#results").html(results_html);
        }
        updateResults(regex_match);
      } else {
        $("#match-message").text("No match");
      }
      return regex_match ? true : false
    }
    function updateResults(regex_match) {
      $("#test-string-input").parent(".control-group").addClass("success");
      $("#match-message").text("");
      if ($("#regex-input").val() != "") {
        $("#match-message").text("Match at index " + regex_match.index);
      }
    }

    function cleanup() {
        $("#bad-regex").html("");
        $("#regex-input").parent(".control-group").removeClass("error");
        $("#regex-input").parent(".control-group").removeClass("warning");
        $("#groups-container").hide();
        $("#test-string-input").parent(".control-group").removeClass("success");
        $("#pre-matched").hide();
        $("#match-message").text("");
    }
});
