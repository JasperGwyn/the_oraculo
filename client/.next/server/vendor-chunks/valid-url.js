/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/valid-url";
exports.ids = ["vendor-chunks/valid-url"];
exports.modules = {

/***/ "(ssr)/../node_modules/valid-url/index.js":
/*!******************************************!*\
  !*** ../node_modules/valid-url/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("/* module decorator */ module = __webpack_require__.nmd(module);\n(function(module) {\n    'use strict';\n\n    module.exports.is_uri = is_iri;\n    module.exports.is_http_uri = is_http_iri;\n    module.exports.is_https_uri = is_https_iri;\n    module.exports.is_web_uri = is_web_iri;\n    // Create aliases\n    module.exports.isUri = is_iri;\n    module.exports.isHttpUri = is_http_iri;\n    module.exports.isHttpsUri = is_https_iri;\n    module.exports.isWebUri = is_web_iri;\n\n\n    // private function\n    // internal URI spitter method - direct from RFC 3986\n    var splitUri = function(uri) {\n        var splitted = uri.match(/(?:([^:\\/?#]+):)?(?:\\/\\/([^\\/?#]*))?([^?#]*)(?:\\?([^#]*))?(?:#(.*))?/);\n        return splitted;\n    };\n\n    function is_iri(value) {\n        if (!value) {\n            return;\n        }\n\n        // check for illegal characters\n        if (/[^a-z0-9\\:\\/\\?\\#\\[\\]\\@\\!\\$\\&\\'\\(\\)\\*\\+\\,\\;\\=\\.\\-\\_\\~\\%]/i.test(value)) return;\n\n        // check for hex escapes that aren't complete\n        if (/%[^0-9a-f]/i.test(value)) return;\n        if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return;\n\n        var splitted = [];\n        var scheme = '';\n        var authority = '';\n        var path = '';\n        var query = '';\n        var fragment = '';\n        var out = '';\n\n        // from RFC 3986\n        splitted = splitUri(value);\n        scheme = splitted[1]; \n        authority = splitted[2];\n        path = splitted[3];\n        query = splitted[4];\n        fragment = splitted[5];\n\n        // scheme and path are required, though the path can be empty\n        if (!(scheme && scheme.length && path.length >= 0)) return;\n\n        // if authority is present, the path must be empty or begin with a /\n        if (authority && authority.length) {\n            if (!(path.length === 0 || /^\\//.test(path))) return;\n        } else {\n            // if authority is not present, the path must not start with //\n            if (/^\\/\\//.test(path)) return;\n        }\n\n        // scheme must begin with a letter, then consist of letters, digits, +, ., or -\n        if (!/^[a-z][a-z0-9\\+\\-\\.]*$/.test(scheme.toLowerCase()))  return;\n\n        // re-assemble the URL per section 5.3 in RFC 3986\n        out += scheme + ':';\n        if (authority && authority.length) {\n            out += '//' + authority;\n        }\n\n        out += path;\n\n        if (query && query.length) {\n            out += '?' + query;\n        }\n\n        if (fragment && fragment.length) {\n            out += '#' + fragment;\n        }\n\n        return out;\n    }\n\n    function is_http_iri(value, allowHttps) {\n        if (!is_iri(value)) {\n            return;\n        }\n\n        var splitted = [];\n        var scheme = '';\n        var authority = '';\n        var path = '';\n        var port = '';\n        var query = '';\n        var fragment = '';\n        var out = '';\n\n        // from RFC 3986\n        splitted = splitUri(value);\n        scheme = splitted[1]; \n        authority = splitted[2];\n        path = splitted[3];\n        query = splitted[4];\n        fragment = splitted[5];\n\n        if (!scheme)  return;\n\n        if(allowHttps) {\n            if (scheme.toLowerCase() != 'https') return;\n        } else {\n            if (scheme.toLowerCase() != 'http') return;\n        }\n\n        // fully-qualified URIs must have an authority section that is\n        // a valid host\n        if (!authority) {\n            return;\n        }\n\n        // enable port component\n        if (/:(\\d+)$/.test(authority)) {\n            port = authority.match(/:(\\d+)$/)[0];\n            authority = authority.replace(/:\\d+$/, '');\n        }\n\n        out += scheme + ':';\n        out += '//' + authority;\n        \n        if (port) {\n            out += port;\n        }\n        \n        out += path;\n        \n        if(query && query.length){\n            out += '?' + query;\n        }\n\n        if(fragment && fragment.length){\n            out += '#' + fragment;\n        }\n        \n        return out;\n    }\n\n    function is_https_iri(value) {\n        return is_http_iri(value, true);\n    }\n\n    function is_web_iri(value) {\n        return (is_http_iri(value) || is_https_iri(value));\n    }\n\n})(module);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL3ZhbGlkLXVybC9pbmRleC5qcyIsIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQyIsInNvdXJjZXMiOlsiL2hvbWUvamFzcGVyL3Byb2plY3RzL2VsaXphLW1vZGUtZXhhbXBsZS9ub2RlX21vZHVsZXMvdmFsaWQtdXJsL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihtb2R1bGUpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBtb2R1bGUuZXhwb3J0cy5pc191cmkgPSBpc19pcmk7XG4gICAgbW9kdWxlLmV4cG9ydHMuaXNfaHR0cF91cmkgPSBpc19odHRwX2lyaTtcbiAgICBtb2R1bGUuZXhwb3J0cy5pc19odHRwc191cmkgPSBpc19odHRwc19pcmk7XG4gICAgbW9kdWxlLmV4cG9ydHMuaXNfd2ViX3VyaSA9IGlzX3dlYl9pcmk7XG4gICAgLy8gQ3JlYXRlIGFsaWFzZXNcbiAgICBtb2R1bGUuZXhwb3J0cy5pc1VyaSA9IGlzX2lyaTtcbiAgICBtb2R1bGUuZXhwb3J0cy5pc0h0dHBVcmkgPSBpc19odHRwX2lyaTtcbiAgICBtb2R1bGUuZXhwb3J0cy5pc0h0dHBzVXJpID0gaXNfaHR0cHNfaXJpO1xuICAgIG1vZHVsZS5leHBvcnRzLmlzV2ViVXJpID0gaXNfd2ViX2lyaTtcblxuXG4gICAgLy8gcHJpdmF0ZSBmdW5jdGlvblxuICAgIC8vIGludGVybmFsIFVSSSBzcGl0dGVyIG1ldGhvZCAtIGRpcmVjdCBmcm9tIFJGQyAzOTg2XG4gICAgdmFyIHNwbGl0VXJpID0gZnVuY3Rpb24odXJpKSB7XG4gICAgICAgIHZhciBzcGxpdHRlZCA9IHVyaS5tYXRjaCgvKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKFteXFwvPyNdKikpPyhbXj8jXSopKD86XFw/KFteI10qKSk/KD86IyguKikpPy8pO1xuICAgICAgICByZXR1cm4gc3BsaXR0ZWQ7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGlzX2lyaSh2YWx1ZSkge1xuICAgICAgICBpZiAoIXZhbHVlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBjaGVjayBmb3IgaWxsZWdhbCBjaGFyYWN0ZXJzXG4gICAgICAgIGlmICgvW15hLXowLTlcXDpcXC9cXD9cXCNcXFtcXF1cXEBcXCFcXCRcXCZcXCdcXChcXClcXCpcXCtcXCxcXDtcXD1cXC5cXC1cXF9cXH5cXCVdL2kudGVzdCh2YWx1ZSkpIHJldHVybjtcblxuICAgICAgICAvLyBjaGVjayBmb3IgaGV4IGVzY2FwZXMgdGhhdCBhcmVuJ3QgY29tcGxldGVcbiAgICAgICAgaWYgKC8lW14wLTlhLWZdL2kudGVzdCh2YWx1ZSkpIHJldHVybjtcbiAgICAgICAgaWYgKC8lWzAtOWEtZl0oOj9bXjAtOWEtZl18JCkvaS50ZXN0KHZhbHVlKSkgcmV0dXJuO1xuXG4gICAgICAgIHZhciBzcGxpdHRlZCA9IFtdO1xuICAgICAgICB2YXIgc2NoZW1lID0gJyc7XG4gICAgICAgIHZhciBhdXRob3JpdHkgPSAnJztcbiAgICAgICAgdmFyIHBhdGggPSAnJztcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJyc7XG4gICAgICAgIHZhciBmcmFnbWVudCA9ICcnO1xuICAgICAgICB2YXIgb3V0ID0gJyc7XG5cbiAgICAgICAgLy8gZnJvbSBSRkMgMzk4NlxuICAgICAgICBzcGxpdHRlZCA9IHNwbGl0VXJpKHZhbHVlKTtcbiAgICAgICAgc2NoZW1lID0gc3BsaXR0ZWRbMV07IFxuICAgICAgICBhdXRob3JpdHkgPSBzcGxpdHRlZFsyXTtcbiAgICAgICAgcGF0aCA9IHNwbGl0dGVkWzNdO1xuICAgICAgICBxdWVyeSA9IHNwbGl0dGVkWzRdO1xuICAgICAgICBmcmFnbWVudCA9IHNwbGl0dGVkWzVdO1xuXG4gICAgICAgIC8vIHNjaGVtZSBhbmQgcGF0aCBhcmUgcmVxdWlyZWQsIHRob3VnaCB0aGUgcGF0aCBjYW4gYmUgZW1wdHlcbiAgICAgICAgaWYgKCEoc2NoZW1lICYmIHNjaGVtZS5sZW5ndGggJiYgcGF0aC5sZW5ndGggPj0gMCkpIHJldHVybjtcblxuICAgICAgICAvLyBpZiBhdXRob3JpdHkgaXMgcHJlc2VudCwgdGhlIHBhdGggbXVzdCBiZSBlbXB0eSBvciBiZWdpbiB3aXRoIGEgL1xuICAgICAgICBpZiAoYXV0aG9yaXR5ICYmIGF1dGhvcml0eS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmICghKHBhdGgubGVuZ3RoID09PSAwIHx8IC9eXFwvLy50ZXN0KHBhdGgpKSkgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgYXV0aG9yaXR5IGlzIG5vdCBwcmVzZW50LCB0aGUgcGF0aCBtdXN0IG5vdCBzdGFydCB3aXRoIC8vXG4gICAgICAgICAgICBpZiAoL15cXC9cXC8vLnRlc3QocGF0aCkpIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNjaGVtZSBtdXN0IGJlZ2luIHdpdGggYSBsZXR0ZXIsIHRoZW4gY29uc2lzdCBvZiBsZXR0ZXJzLCBkaWdpdHMsICssIC4sIG9yIC1cbiAgICAgICAgaWYgKCEvXlthLXpdW2EtejAtOVxcK1xcLVxcLl0qJC8udGVzdChzY2hlbWUudG9Mb3dlckNhc2UoKSkpICByZXR1cm47XG5cbiAgICAgICAgLy8gcmUtYXNzZW1ibGUgdGhlIFVSTCBwZXIgc2VjdGlvbiA1LjMgaW4gUkZDIDM5ODZcbiAgICAgICAgb3V0ICs9IHNjaGVtZSArICc6JztcbiAgICAgICAgaWYgKGF1dGhvcml0eSAmJiBhdXRob3JpdHkubGVuZ3RoKSB7XG4gICAgICAgICAgICBvdXQgKz0gJy8vJyArIGF1dGhvcml0eTtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dCArPSBwYXRoO1xuXG4gICAgICAgIGlmIChxdWVyeSAmJiBxdWVyeS5sZW5ndGgpIHtcbiAgICAgICAgICAgIG91dCArPSAnPycgKyBxdWVyeTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChmcmFnbWVudCAmJiBmcmFnbWVudC5sZW5ndGgpIHtcbiAgICAgICAgICAgIG91dCArPSAnIycgKyBmcmFnbWVudDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaXNfaHR0cF9pcmkodmFsdWUsIGFsbG93SHR0cHMpIHtcbiAgICAgICAgaWYgKCFpc19pcmkodmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc3BsaXR0ZWQgPSBbXTtcbiAgICAgICAgdmFyIHNjaGVtZSA9ICcnO1xuICAgICAgICB2YXIgYXV0aG9yaXR5ID0gJyc7XG4gICAgICAgIHZhciBwYXRoID0gJyc7XG4gICAgICAgIHZhciBwb3J0ID0gJyc7XG4gICAgICAgIHZhciBxdWVyeSA9ICcnO1xuICAgICAgICB2YXIgZnJhZ21lbnQgPSAnJztcbiAgICAgICAgdmFyIG91dCA9ICcnO1xuXG4gICAgICAgIC8vIGZyb20gUkZDIDM5ODZcbiAgICAgICAgc3BsaXR0ZWQgPSBzcGxpdFVyaSh2YWx1ZSk7XG4gICAgICAgIHNjaGVtZSA9IHNwbGl0dGVkWzFdOyBcbiAgICAgICAgYXV0aG9yaXR5ID0gc3BsaXR0ZWRbMl07XG4gICAgICAgIHBhdGggPSBzcGxpdHRlZFszXTtcbiAgICAgICAgcXVlcnkgPSBzcGxpdHRlZFs0XTtcbiAgICAgICAgZnJhZ21lbnQgPSBzcGxpdHRlZFs1XTtcblxuICAgICAgICBpZiAoIXNjaGVtZSkgIHJldHVybjtcblxuICAgICAgICBpZihhbGxvd0h0dHBzKSB7XG4gICAgICAgICAgICBpZiAoc2NoZW1lLnRvTG93ZXJDYXNlKCkgIT0gJ2h0dHBzJykgcmV0dXJuO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHNjaGVtZS50b0xvd2VyQ2FzZSgpICE9ICdodHRwJykgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZnVsbHktcXVhbGlmaWVkIFVSSXMgbXVzdCBoYXZlIGFuIGF1dGhvcml0eSBzZWN0aW9uIHRoYXQgaXNcbiAgICAgICAgLy8gYSB2YWxpZCBob3N0XG4gICAgICAgIGlmICghYXV0aG9yaXR5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBlbmFibGUgcG9ydCBjb21wb25lbnRcbiAgICAgICAgaWYgKC86KFxcZCspJC8udGVzdChhdXRob3JpdHkpKSB7XG4gICAgICAgICAgICBwb3J0ID0gYXV0aG9yaXR5Lm1hdGNoKC86KFxcZCspJC8pWzBdO1xuICAgICAgICAgICAgYXV0aG9yaXR5ID0gYXV0aG9yaXR5LnJlcGxhY2UoLzpcXGQrJC8sICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG91dCArPSBzY2hlbWUgKyAnOic7XG4gICAgICAgIG91dCArPSAnLy8nICsgYXV0aG9yaXR5O1xuICAgICAgICBcbiAgICAgICAgaWYgKHBvcnQpIHtcbiAgICAgICAgICAgIG91dCArPSBwb3J0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBvdXQgKz0gcGF0aDtcbiAgICAgICAgXG4gICAgICAgIGlmKHF1ZXJ5ICYmIHF1ZXJ5Lmxlbmd0aCl7XG4gICAgICAgICAgICBvdXQgKz0gJz8nICsgcXVlcnk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihmcmFnbWVudCAmJiBmcmFnbWVudC5sZW5ndGgpe1xuICAgICAgICAgICAgb3V0ICs9ICcjJyArIGZyYWdtZW50O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzX2h0dHBzX2lyaSh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaXNfaHR0cF9pcmkodmFsdWUsIHRydWUpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGlzX3dlYl9pcmkodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIChpc19odHRwX2lyaSh2YWx1ZSkgfHwgaXNfaHR0cHNfaXJpKHZhbHVlKSk7XG4gICAgfVxuXG59KShtb2R1bGUpO1xuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/valid-url/index.js\n");

/***/ })

};
;