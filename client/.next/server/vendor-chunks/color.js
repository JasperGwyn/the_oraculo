/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/color";
exports.ids = ["vendor-chunks/color"];
exports.modules = {

/***/ "(ssr)/../node_modules/color/index.js":
/*!**************************************!*\
  !*** ../node_modules/color/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const colorString = __webpack_require__(/*! color-string */ \"(ssr)/../node_modules/color-string/index.js\");\nconst convert = __webpack_require__(/*! color-convert */ \"(ssr)/../node_modules/color-convert/index.js\");\n\nconst skippedModels = [\n\t// To be honest, I don't really feel like keyword belongs in color convert, but eh.\n\t'keyword',\n\n\t// Gray conflicts with some method names, and has its own method defined.\n\t'gray',\n\n\t// Shouldn't really be in color-convert either...\n\t'hex',\n];\n\nconst hashedModelKeys = {};\nfor (const model of Object.keys(convert)) {\n\thashedModelKeys[[...convert[model].labels].sort().join('')] = model;\n}\n\nconst limiters = {};\n\nfunction Color(object, model) {\n\tif (!(this instanceof Color)) {\n\t\treturn new Color(object, model);\n\t}\n\n\tif (model && model in skippedModels) {\n\t\tmodel = null;\n\t}\n\n\tif (model && !(model in convert)) {\n\t\tthrow new Error('Unknown model: ' + model);\n\t}\n\n\tlet i;\n\tlet channels;\n\n\tif (object == null) { // eslint-disable-line no-eq-null,eqeqeq\n\t\tthis.model = 'rgb';\n\t\tthis.color = [0, 0, 0];\n\t\tthis.valpha = 1;\n\t} else if (object instanceof Color) {\n\t\tthis.model = object.model;\n\t\tthis.color = [...object.color];\n\t\tthis.valpha = object.valpha;\n\t} else if (typeof object === 'string') {\n\t\tconst result = colorString.get(object);\n\t\tif (result === null) {\n\t\t\tthrow new Error('Unable to parse color from string: ' + object);\n\t\t}\n\n\t\tthis.model = result.model;\n\t\tchannels = convert[this.model].channels;\n\t\tthis.color = result.value.slice(0, channels);\n\t\tthis.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;\n\t} else if (object.length > 0) {\n\t\tthis.model = model || 'rgb';\n\t\tchannels = convert[this.model].channels;\n\t\tconst newArray = Array.prototype.slice.call(object, 0, channels);\n\t\tthis.color = zeroArray(newArray, channels);\n\t\tthis.valpha = typeof object[channels] === 'number' ? object[channels] : 1;\n\t} else if (typeof object === 'number') {\n\t\t// This is always RGB - can be converted later on.\n\t\tthis.model = 'rgb';\n\t\tthis.color = [\n\t\t\t(object >> 16) & 0xFF,\n\t\t\t(object >> 8) & 0xFF,\n\t\t\tobject & 0xFF,\n\t\t];\n\t\tthis.valpha = 1;\n\t} else {\n\t\tthis.valpha = 1;\n\n\t\tconst keys = Object.keys(object);\n\t\tif ('alpha' in object) {\n\t\t\tkeys.splice(keys.indexOf('alpha'), 1);\n\t\t\tthis.valpha = typeof object.alpha === 'number' ? object.alpha : 0;\n\t\t}\n\n\t\tconst hashedKeys = keys.sort().join('');\n\t\tif (!(hashedKeys in hashedModelKeys)) {\n\t\t\tthrow new Error('Unable to parse color from object: ' + JSON.stringify(object));\n\t\t}\n\n\t\tthis.model = hashedModelKeys[hashedKeys];\n\n\t\tconst {labels} = convert[this.model];\n\t\tconst color = [];\n\t\tfor (i = 0; i < labels.length; i++) {\n\t\t\tcolor.push(object[labels[i]]);\n\t\t}\n\n\t\tthis.color = zeroArray(color);\n\t}\n\n\t// Perform limitations (clamping, etc.)\n\tif (limiters[this.model]) {\n\t\tchannels = convert[this.model].channels;\n\t\tfor (i = 0; i < channels; i++) {\n\t\t\tconst limit = limiters[this.model][i];\n\t\t\tif (limit) {\n\t\t\t\tthis.color[i] = limit(this.color[i]);\n\t\t\t}\n\t\t}\n\t}\n\n\tthis.valpha = Math.max(0, Math.min(1, this.valpha));\n\n\tif (Object.freeze) {\n\t\tObject.freeze(this);\n\t}\n}\n\nColor.prototype = {\n\ttoString() {\n\t\treturn this.string();\n\t},\n\n\ttoJSON() {\n\t\treturn this[this.model]();\n\t},\n\n\tstring(places) {\n\t\tlet self = this.model in colorString.to ? this : this.rgb();\n\t\tself = self.round(typeof places === 'number' ? places : 1);\n\t\tconst args = self.valpha === 1 ? self.color : [...self.color, this.valpha];\n\t\treturn colorString.to[self.model](args);\n\t},\n\n\tpercentString(places) {\n\t\tconst self = this.rgb().round(typeof places === 'number' ? places : 1);\n\t\tconst args = self.valpha === 1 ? self.color : [...self.color, this.valpha];\n\t\treturn colorString.to.rgb.percent(args);\n\t},\n\n\tarray() {\n\t\treturn this.valpha === 1 ? [...this.color] : [...this.color, this.valpha];\n\t},\n\n\tobject() {\n\t\tconst result = {};\n\t\tconst {channels} = convert[this.model];\n\t\tconst {labels} = convert[this.model];\n\n\t\tfor (let i = 0; i < channels; i++) {\n\t\t\tresult[labels[i]] = this.color[i];\n\t\t}\n\n\t\tif (this.valpha !== 1) {\n\t\t\tresult.alpha = this.valpha;\n\t\t}\n\n\t\treturn result;\n\t},\n\n\tunitArray() {\n\t\tconst rgb = this.rgb().color;\n\t\trgb[0] /= 255;\n\t\trgb[1] /= 255;\n\t\trgb[2] /= 255;\n\n\t\tif (this.valpha !== 1) {\n\t\t\trgb.push(this.valpha);\n\t\t}\n\n\t\treturn rgb;\n\t},\n\n\tunitObject() {\n\t\tconst rgb = this.rgb().object();\n\t\trgb.r /= 255;\n\t\trgb.g /= 255;\n\t\trgb.b /= 255;\n\n\t\tif (this.valpha !== 1) {\n\t\t\trgb.alpha = this.valpha;\n\t\t}\n\n\t\treturn rgb;\n\t},\n\n\tround(places) {\n\t\tplaces = Math.max(places || 0, 0);\n\t\treturn new Color([...this.color.map(roundToPlace(places)), this.valpha], this.model);\n\t},\n\n\talpha(value) {\n\t\tif (value !== undefined) {\n\t\t\treturn new Color([...this.color, Math.max(0, Math.min(1, value))], this.model);\n\t\t}\n\n\t\treturn this.valpha;\n\t},\n\n\t// Rgb\n\tred: getset('rgb', 0, maxfn(255)),\n\tgreen: getset('rgb', 1, maxfn(255)),\n\tblue: getset('rgb', 2, maxfn(255)),\n\n\thue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, value => ((value % 360) + 360) % 360),\n\n\tsaturationl: getset('hsl', 1, maxfn(100)),\n\tlightness: getset('hsl', 2, maxfn(100)),\n\n\tsaturationv: getset('hsv', 1, maxfn(100)),\n\tvalue: getset('hsv', 2, maxfn(100)),\n\n\tchroma: getset('hcg', 1, maxfn(100)),\n\tgray: getset('hcg', 2, maxfn(100)),\n\n\twhite: getset('hwb', 1, maxfn(100)),\n\twblack: getset('hwb', 2, maxfn(100)),\n\n\tcyan: getset('cmyk', 0, maxfn(100)),\n\tmagenta: getset('cmyk', 1, maxfn(100)),\n\tyellow: getset('cmyk', 2, maxfn(100)),\n\tblack: getset('cmyk', 3, maxfn(100)),\n\n\tx: getset('xyz', 0, maxfn(95.047)),\n\ty: getset('xyz', 1, maxfn(100)),\n\tz: getset('xyz', 2, maxfn(108.833)),\n\n\tl: getset('lab', 0, maxfn(100)),\n\ta: getset('lab', 1),\n\tb: getset('lab', 2),\n\n\tkeyword(value) {\n\t\tif (value !== undefined) {\n\t\t\treturn new Color(value);\n\t\t}\n\n\t\treturn convert[this.model].keyword(this.color);\n\t},\n\n\thex(value) {\n\t\tif (value !== undefined) {\n\t\t\treturn new Color(value);\n\t\t}\n\n\t\treturn colorString.to.hex(this.rgb().round().color);\n\t},\n\n\thexa(value) {\n\t\tif (value !== undefined) {\n\t\t\treturn new Color(value);\n\t\t}\n\n\t\tconst rgbArray = this.rgb().round().color;\n\n\t\tlet alphaHex = Math.round(this.valpha * 255).toString(16).toUpperCase();\n\t\tif (alphaHex.length === 1) {\n\t\t\talphaHex = '0' + alphaHex;\n\t\t}\n\n\t\treturn colorString.to.hex(rgbArray) + alphaHex;\n\t},\n\n\trgbNumber() {\n\t\tconst rgb = this.rgb().color;\n\t\treturn ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);\n\t},\n\n\tluminosity() {\n\t\t// http://www.w3.org/TR/WCAG20/#relativeluminancedef\n\t\tconst rgb = this.rgb().color;\n\n\t\tconst lum = [];\n\t\tfor (const [i, element] of rgb.entries()) {\n\t\t\tconst chan = element / 255;\n\t\t\tlum[i] = (chan <= 0.04045) ? chan / 12.92 : ((chan + 0.055) / 1.055) ** 2.4;\n\t\t}\n\n\t\treturn 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];\n\t},\n\n\tcontrast(color2) {\n\t\t// http://www.w3.org/TR/WCAG20/#contrast-ratiodef\n\t\tconst lum1 = this.luminosity();\n\t\tconst lum2 = color2.luminosity();\n\n\t\tif (lum1 > lum2) {\n\t\t\treturn (lum1 + 0.05) / (lum2 + 0.05);\n\t\t}\n\n\t\treturn (lum2 + 0.05) / (lum1 + 0.05);\n\t},\n\n\tlevel(color2) {\n\t\t// https://www.w3.org/TR/WCAG/#contrast-enhanced\n\t\tconst contrastRatio = this.contrast(color2);\n\t\tif (contrastRatio >= 7) {\n\t\t\treturn 'AAA';\n\t\t}\n\n\t\treturn (contrastRatio >= 4.5) ? 'AA' : '';\n\t},\n\n\tisDark() {\n\t\t// YIQ equation from http://24ways.org/2010/calculating-color-contrast\n\t\tconst rgb = this.rgb().color;\n\t\tconst yiq = (rgb[0] * 2126 + rgb[1] * 7152 + rgb[2] * 722) / 10000;\n\t\treturn yiq < 128;\n\t},\n\n\tisLight() {\n\t\treturn !this.isDark();\n\t},\n\n\tnegate() {\n\t\tconst rgb = this.rgb();\n\t\tfor (let i = 0; i < 3; i++) {\n\t\t\trgb.color[i] = 255 - rgb.color[i];\n\t\t}\n\n\t\treturn rgb;\n\t},\n\n\tlighten(ratio) {\n\t\tconst hsl = this.hsl();\n\t\thsl.color[2] += hsl.color[2] * ratio;\n\t\treturn hsl;\n\t},\n\n\tdarken(ratio) {\n\t\tconst hsl = this.hsl();\n\t\thsl.color[2] -= hsl.color[2] * ratio;\n\t\treturn hsl;\n\t},\n\n\tsaturate(ratio) {\n\t\tconst hsl = this.hsl();\n\t\thsl.color[1] += hsl.color[1] * ratio;\n\t\treturn hsl;\n\t},\n\n\tdesaturate(ratio) {\n\t\tconst hsl = this.hsl();\n\t\thsl.color[1] -= hsl.color[1] * ratio;\n\t\treturn hsl;\n\t},\n\n\twhiten(ratio) {\n\t\tconst hwb = this.hwb();\n\t\thwb.color[1] += hwb.color[1] * ratio;\n\t\treturn hwb;\n\t},\n\n\tblacken(ratio) {\n\t\tconst hwb = this.hwb();\n\t\thwb.color[2] += hwb.color[2] * ratio;\n\t\treturn hwb;\n\t},\n\n\tgrayscale() {\n\t\t// http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale\n\t\tconst rgb = this.rgb().color;\n\t\tconst value = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;\n\t\treturn Color.rgb(value, value, value);\n\t},\n\n\tfade(ratio) {\n\t\treturn this.alpha(this.valpha - (this.valpha * ratio));\n\t},\n\n\topaquer(ratio) {\n\t\treturn this.alpha(this.valpha + (this.valpha * ratio));\n\t},\n\n\trotate(degrees) {\n\t\tconst hsl = this.hsl();\n\t\tlet hue = hsl.color[0];\n\t\thue = (hue + degrees) % 360;\n\t\thue = hue < 0 ? 360 + hue : hue;\n\t\thsl.color[0] = hue;\n\t\treturn hsl;\n\t},\n\n\tmix(mixinColor, weight) {\n\t\t// Ported from sass implementation in C\n\t\t// https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209\n\t\tif (!mixinColor || !mixinColor.rgb) {\n\t\t\tthrow new Error('Argument to \"mix\" was not a Color instance, but rather an instance of ' + typeof mixinColor);\n\t\t}\n\n\t\tconst color1 = mixinColor.rgb();\n\t\tconst color2 = this.rgb();\n\t\tconst p = weight === undefined ? 0.5 : weight;\n\n\t\tconst w = 2 * p - 1;\n\t\tconst a = color1.alpha() - color2.alpha();\n\n\t\tconst w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2;\n\t\tconst w2 = 1 - w1;\n\n\t\treturn Color.rgb(\n\t\t\tw1 * color1.red() + w2 * color2.red(),\n\t\t\tw1 * color1.green() + w2 * color2.green(),\n\t\t\tw1 * color1.blue() + w2 * color2.blue(),\n\t\t\tcolor1.alpha() * p + color2.alpha() * (1 - p));\n\t},\n};\n\n// Model conversion methods and static constructors\nfor (const model of Object.keys(convert)) {\n\tif (skippedModels.includes(model)) {\n\t\tcontinue;\n\t}\n\n\tconst {channels} = convert[model];\n\n\t// Conversion methods\n\tColor.prototype[model] = function (...args) {\n\t\tif (this.model === model) {\n\t\t\treturn new Color(this);\n\t\t}\n\n\t\tif (args.length > 0) {\n\t\t\treturn new Color(args, model);\n\t\t}\n\n\t\treturn new Color([...assertArray(convert[this.model][model].raw(this.color)), this.valpha], model);\n\t};\n\n\t// 'static' construction methods\n\tColor[model] = function (...args) {\n\t\tlet color = args[0];\n\t\tif (typeof color === 'number') {\n\t\t\tcolor = zeroArray(args, channels);\n\t\t}\n\n\t\treturn new Color(color, model);\n\t};\n}\n\nfunction roundTo(number, places) {\n\treturn Number(number.toFixed(places));\n}\n\nfunction roundToPlace(places) {\n\treturn function (number) {\n\t\treturn roundTo(number, places);\n\t};\n}\n\nfunction getset(model, channel, modifier) {\n\tmodel = Array.isArray(model) ? model : [model];\n\n\tfor (const m of model) {\n\t\t(limiters[m] || (limiters[m] = []))[channel] = modifier;\n\t}\n\n\tmodel = model[0];\n\n\treturn function (value) {\n\t\tlet result;\n\n\t\tif (value !== undefined) {\n\t\t\tif (modifier) {\n\t\t\t\tvalue = modifier(value);\n\t\t\t}\n\n\t\t\tresult = this[model]();\n\t\t\tresult.color[channel] = value;\n\t\t\treturn result;\n\t\t}\n\n\t\tresult = this[model]().color[channel];\n\t\tif (modifier) {\n\t\t\tresult = modifier(result);\n\t\t}\n\n\t\treturn result;\n\t};\n}\n\nfunction maxfn(max) {\n\treturn function (v) {\n\t\treturn Math.max(0, Math.min(max, v));\n\t};\n}\n\nfunction assertArray(value) {\n\treturn Array.isArray(value) ? value : [value];\n}\n\nfunction zeroArray(array, length) {\n\tfor (let i = 0; i < length; i++) {\n\t\tif (typeof array[i] !== 'number') {\n\t\t\tarray[i] = 0;\n\t\t}\n\t}\n\n\treturn array;\n}\n\nmodule.exports = Color;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzL2NvbG9yL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFBLG9CQUFvQixtQkFBTyxDQUFDLGlFQUFjO0FBQzFDLGdCQUFnQixtQkFBTyxDQUFDLG1FQUFlOztBQUV2QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFNBQVMsUUFBUTtBQUNqQjtBQUNBLGNBQWMsbUJBQW1CO0FBQ2pDO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGNBQWM7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxTQUFTLFVBQVU7QUFDbkIsU0FBUyxRQUFROztBQUVqQixrQkFBa0IsY0FBYztBQUNoQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQSxrQkFBa0IsT0FBTztBQUN6QjtBQUNBOztBQUVBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0EsRUFBRTs7QUFFRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7O0FBRUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFFBQVEsVUFBVTs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsaUJBQWlCLFlBQVk7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsiL2hvbWUvamFzcGVyL3Byb2plY3RzL2VsaXphLW1vZGUtZXhhbXBsZS9ub2RlX21vZHVsZXMvY29sb3IvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgY29sb3JTdHJpbmcgPSByZXF1aXJlKCdjb2xvci1zdHJpbmcnKTtcbmNvbnN0IGNvbnZlcnQgPSByZXF1aXJlKCdjb2xvci1jb252ZXJ0Jyk7XG5cbmNvbnN0IHNraXBwZWRNb2RlbHMgPSBbXG5cdC8vIFRvIGJlIGhvbmVzdCwgSSBkb24ndCByZWFsbHkgZmVlbCBsaWtlIGtleXdvcmQgYmVsb25ncyBpbiBjb2xvciBjb252ZXJ0LCBidXQgZWguXG5cdCdrZXl3b3JkJyxcblxuXHQvLyBHcmF5IGNvbmZsaWN0cyB3aXRoIHNvbWUgbWV0aG9kIG5hbWVzLCBhbmQgaGFzIGl0cyBvd24gbWV0aG9kIGRlZmluZWQuXG5cdCdncmF5JyxcblxuXHQvLyBTaG91bGRuJ3QgcmVhbGx5IGJlIGluIGNvbG9yLWNvbnZlcnQgZWl0aGVyLi4uXG5cdCdoZXgnLFxuXTtcblxuY29uc3QgaGFzaGVkTW9kZWxLZXlzID0ge307XG5mb3IgKGNvbnN0IG1vZGVsIG9mIE9iamVjdC5rZXlzKGNvbnZlcnQpKSB7XG5cdGhhc2hlZE1vZGVsS2V5c1tbLi4uY29udmVydFttb2RlbF0ubGFiZWxzXS5zb3J0KCkuam9pbignJyldID0gbW9kZWw7XG59XG5cbmNvbnN0IGxpbWl0ZXJzID0ge307XG5cbmZ1bmN0aW9uIENvbG9yKG9iamVjdCwgbW9kZWwpIHtcblx0aWYgKCEodGhpcyBpbnN0YW5jZW9mIENvbG9yKSkge1xuXHRcdHJldHVybiBuZXcgQ29sb3Iob2JqZWN0LCBtb2RlbCk7XG5cdH1cblxuXHRpZiAobW9kZWwgJiYgbW9kZWwgaW4gc2tpcHBlZE1vZGVscykge1xuXHRcdG1vZGVsID0gbnVsbDtcblx0fVxuXG5cdGlmIChtb2RlbCAmJiAhKG1vZGVsIGluIGNvbnZlcnQpKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG1vZGVsOiAnICsgbW9kZWwpO1xuXHR9XG5cblx0bGV0IGk7XG5cdGxldCBjaGFubmVscztcblxuXHRpZiAob2JqZWN0ID09IG51bGwpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1lcS1udWxsLGVxZXFlcVxuXHRcdHRoaXMubW9kZWwgPSAncmdiJztcblx0XHR0aGlzLmNvbG9yID0gWzAsIDAsIDBdO1xuXHRcdHRoaXMudmFscGhhID0gMTtcblx0fSBlbHNlIGlmIChvYmplY3QgaW5zdGFuY2VvZiBDb2xvcikge1xuXHRcdHRoaXMubW9kZWwgPSBvYmplY3QubW9kZWw7XG5cdFx0dGhpcy5jb2xvciA9IFsuLi5vYmplY3QuY29sb3JdO1xuXHRcdHRoaXMudmFscGhhID0gb2JqZWN0LnZhbHBoYTtcblx0fSBlbHNlIGlmICh0eXBlb2Ygb2JqZWN0ID09PSAnc3RyaW5nJykge1xuXHRcdGNvbnN0IHJlc3VsdCA9IGNvbG9yU3RyaW5nLmdldChvYmplY3QpO1xuXHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHBhcnNlIGNvbG9yIGZyb20gc3RyaW5nOiAnICsgb2JqZWN0KTtcblx0XHR9XG5cblx0XHR0aGlzLm1vZGVsID0gcmVzdWx0Lm1vZGVsO1xuXHRcdGNoYW5uZWxzID0gY29udmVydFt0aGlzLm1vZGVsXS5jaGFubmVscztcblx0XHR0aGlzLmNvbG9yID0gcmVzdWx0LnZhbHVlLnNsaWNlKDAsIGNoYW5uZWxzKTtcblx0XHR0aGlzLnZhbHBoYSA9IHR5cGVvZiByZXN1bHQudmFsdWVbY2hhbm5lbHNdID09PSAnbnVtYmVyJyA/IHJlc3VsdC52YWx1ZVtjaGFubmVsc10gOiAxO1xuXHR9IGVsc2UgaWYgKG9iamVjdC5sZW5ndGggPiAwKSB7XG5cdFx0dGhpcy5tb2RlbCA9IG1vZGVsIHx8ICdyZ2InO1xuXHRcdGNoYW5uZWxzID0gY29udmVydFt0aGlzLm1vZGVsXS5jaGFubmVscztcblx0XHRjb25zdCBuZXdBcnJheSA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKG9iamVjdCwgMCwgY2hhbm5lbHMpO1xuXHRcdHRoaXMuY29sb3IgPSB6ZXJvQXJyYXkobmV3QXJyYXksIGNoYW5uZWxzKTtcblx0XHR0aGlzLnZhbHBoYSA9IHR5cGVvZiBvYmplY3RbY2hhbm5lbHNdID09PSAnbnVtYmVyJyA/IG9iamVjdFtjaGFubmVsc10gOiAxO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBvYmplY3QgPT09ICdudW1iZXInKSB7XG5cdFx0Ly8gVGhpcyBpcyBhbHdheXMgUkdCIC0gY2FuIGJlIGNvbnZlcnRlZCBsYXRlciBvbi5cblx0XHR0aGlzLm1vZGVsID0gJ3JnYic7XG5cdFx0dGhpcy5jb2xvciA9IFtcblx0XHRcdChvYmplY3QgPj4gMTYpICYgMHhGRixcblx0XHRcdChvYmplY3QgPj4gOCkgJiAweEZGLFxuXHRcdFx0b2JqZWN0ICYgMHhGRixcblx0XHRdO1xuXHRcdHRoaXMudmFscGhhID0gMTtcblx0fSBlbHNlIHtcblx0XHR0aGlzLnZhbHBoYSA9IDE7XG5cblx0XHRjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblx0XHRpZiAoJ2FscGhhJyBpbiBvYmplY3QpIHtcblx0XHRcdGtleXMuc3BsaWNlKGtleXMuaW5kZXhPZignYWxwaGEnKSwgMSk7XG5cdFx0XHR0aGlzLnZhbHBoYSA9IHR5cGVvZiBvYmplY3QuYWxwaGEgPT09ICdudW1iZXInID8gb2JqZWN0LmFscGhhIDogMDtcblx0XHR9XG5cblx0XHRjb25zdCBoYXNoZWRLZXlzID0ga2V5cy5zb3J0KCkuam9pbignJyk7XG5cdFx0aWYgKCEoaGFzaGVkS2V5cyBpbiBoYXNoZWRNb2RlbEtleXMpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBwYXJzZSBjb2xvciBmcm9tIG9iamVjdDogJyArIEpTT04uc3RyaW5naWZ5KG9iamVjdCkpO1xuXHRcdH1cblxuXHRcdHRoaXMubW9kZWwgPSBoYXNoZWRNb2RlbEtleXNbaGFzaGVkS2V5c107XG5cblx0XHRjb25zdCB7bGFiZWxzfSA9IGNvbnZlcnRbdGhpcy5tb2RlbF07XG5cdFx0Y29uc3QgY29sb3IgPSBbXTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGFiZWxzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRjb2xvci5wdXNoKG9iamVjdFtsYWJlbHNbaV1dKTtcblx0XHR9XG5cblx0XHR0aGlzLmNvbG9yID0gemVyb0FycmF5KGNvbG9yKTtcblx0fVxuXG5cdC8vIFBlcmZvcm0gbGltaXRhdGlvbnMgKGNsYW1waW5nLCBldGMuKVxuXHRpZiAobGltaXRlcnNbdGhpcy5tb2RlbF0pIHtcblx0XHRjaGFubmVscyA9IGNvbnZlcnRbdGhpcy5tb2RlbF0uY2hhbm5lbHM7XG5cdFx0Zm9yIChpID0gMDsgaSA8IGNoYW5uZWxzOyBpKyspIHtcblx0XHRcdGNvbnN0IGxpbWl0ID0gbGltaXRlcnNbdGhpcy5tb2RlbF1baV07XG5cdFx0XHRpZiAobGltaXQpIHtcblx0XHRcdFx0dGhpcy5jb2xvcltpXSA9IGxpbWl0KHRoaXMuY29sb3JbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHRoaXMudmFscGhhID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgdGhpcy52YWxwaGEpKTtcblxuXHRpZiAoT2JqZWN0LmZyZWV6ZSkge1xuXHRcdE9iamVjdC5mcmVlemUodGhpcyk7XG5cdH1cbn1cblxuQ29sb3IucHJvdG90eXBlID0ge1xuXHR0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5zdHJpbmcoKTtcblx0fSxcblxuXHR0b0pTT04oKSB7XG5cdFx0cmV0dXJuIHRoaXNbdGhpcy5tb2RlbF0oKTtcblx0fSxcblxuXHRzdHJpbmcocGxhY2VzKSB7XG5cdFx0bGV0IHNlbGYgPSB0aGlzLm1vZGVsIGluIGNvbG9yU3RyaW5nLnRvID8gdGhpcyA6IHRoaXMucmdiKCk7XG5cdFx0c2VsZiA9IHNlbGYucm91bmQodHlwZW9mIHBsYWNlcyA9PT0gJ251bWJlcicgPyBwbGFjZXMgOiAxKTtcblx0XHRjb25zdCBhcmdzID0gc2VsZi52YWxwaGEgPT09IDEgPyBzZWxmLmNvbG9yIDogWy4uLnNlbGYuY29sb3IsIHRoaXMudmFscGhhXTtcblx0XHRyZXR1cm4gY29sb3JTdHJpbmcudG9bc2VsZi5tb2RlbF0oYXJncyk7XG5cdH0sXG5cblx0cGVyY2VudFN0cmluZyhwbGFjZXMpIHtcblx0XHRjb25zdCBzZWxmID0gdGhpcy5yZ2IoKS5yb3VuZCh0eXBlb2YgcGxhY2VzID09PSAnbnVtYmVyJyA/IHBsYWNlcyA6IDEpO1xuXHRcdGNvbnN0IGFyZ3MgPSBzZWxmLnZhbHBoYSA9PT0gMSA/IHNlbGYuY29sb3IgOiBbLi4uc2VsZi5jb2xvciwgdGhpcy52YWxwaGFdO1xuXHRcdHJldHVybiBjb2xvclN0cmluZy50by5yZ2IucGVyY2VudChhcmdzKTtcblx0fSxcblxuXHRhcnJheSgpIHtcblx0XHRyZXR1cm4gdGhpcy52YWxwaGEgPT09IDEgPyBbLi4udGhpcy5jb2xvcl0gOiBbLi4udGhpcy5jb2xvciwgdGhpcy52YWxwaGFdO1xuXHR9LFxuXG5cdG9iamVjdCgpIHtcblx0XHRjb25zdCByZXN1bHQgPSB7fTtcblx0XHRjb25zdCB7Y2hhbm5lbHN9ID0gY29udmVydFt0aGlzLm1vZGVsXTtcblx0XHRjb25zdCB7bGFiZWxzfSA9IGNvbnZlcnRbdGhpcy5tb2RlbF07XG5cblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGNoYW5uZWxzOyBpKyspIHtcblx0XHRcdHJlc3VsdFtsYWJlbHNbaV1dID0gdGhpcy5jb2xvcltpXTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy52YWxwaGEgIT09IDEpIHtcblx0XHRcdHJlc3VsdC5hbHBoYSA9IHRoaXMudmFscGhhO1xuXHRcdH1cblxuXHRcdHJldHVybiByZXN1bHQ7XG5cdH0sXG5cblx0dW5pdEFycmF5KCkge1xuXHRcdGNvbnN0IHJnYiA9IHRoaXMucmdiKCkuY29sb3I7XG5cdFx0cmdiWzBdIC89IDI1NTtcblx0XHRyZ2JbMV0gLz0gMjU1O1xuXHRcdHJnYlsyXSAvPSAyNTU7XG5cblx0XHRpZiAodGhpcy52YWxwaGEgIT09IDEpIHtcblx0XHRcdHJnYi5wdXNoKHRoaXMudmFscGhhKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiO1xuXHR9LFxuXG5cdHVuaXRPYmplY3QoKSB7XG5cdFx0Y29uc3QgcmdiID0gdGhpcy5yZ2IoKS5vYmplY3QoKTtcblx0XHRyZ2IuciAvPSAyNTU7XG5cdFx0cmdiLmcgLz0gMjU1O1xuXHRcdHJnYi5iIC89IDI1NTtcblxuXHRcdGlmICh0aGlzLnZhbHBoYSAhPT0gMSkge1xuXHRcdFx0cmdiLmFscGhhID0gdGhpcy52YWxwaGE7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJnYjtcblx0fSxcblxuXHRyb3VuZChwbGFjZXMpIHtcblx0XHRwbGFjZXMgPSBNYXRoLm1heChwbGFjZXMgfHwgMCwgMCk7XG5cdFx0cmV0dXJuIG5ldyBDb2xvcihbLi4udGhpcy5jb2xvci5tYXAocm91bmRUb1BsYWNlKHBsYWNlcykpLCB0aGlzLnZhbHBoYV0sIHRoaXMubW9kZWwpO1xuXHR9LFxuXG5cdGFscGhhKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBuZXcgQ29sb3IoWy4uLnRoaXMuY29sb3IsIE1hdGgubWF4KDAsIE1hdGgubWluKDEsIHZhbHVlKSldLCB0aGlzLm1vZGVsKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy52YWxwaGE7XG5cdH0sXG5cblx0Ly8gUmdiXG5cdHJlZDogZ2V0c2V0KCdyZ2InLCAwLCBtYXhmbigyNTUpKSxcblx0Z3JlZW46IGdldHNldCgncmdiJywgMSwgbWF4Zm4oMjU1KSksXG5cdGJsdWU6IGdldHNldCgncmdiJywgMiwgbWF4Zm4oMjU1KSksXG5cblx0aHVlOiBnZXRzZXQoWydoc2wnLCAnaHN2JywgJ2hzbCcsICdod2InLCAnaGNnJ10sIDAsIHZhbHVlID0+ICgodmFsdWUgJSAzNjApICsgMzYwKSAlIDM2MCksXG5cblx0c2F0dXJhdGlvbmw6IGdldHNldCgnaHNsJywgMSwgbWF4Zm4oMTAwKSksXG5cdGxpZ2h0bmVzczogZ2V0c2V0KCdoc2wnLCAyLCBtYXhmbigxMDApKSxcblxuXHRzYXR1cmF0aW9udjogZ2V0c2V0KCdoc3YnLCAxLCBtYXhmbigxMDApKSxcblx0dmFsdWU6IGdldHNldCgnaHN2JywgMiwgbWF4Zm4oMTAwKSksXG5cblx0Y2hyb21hOiBnZXRzZXQoJ2hjZycsIDEsIG1heGZuKDEwMCkpLFxuXHRncmF5OiBnZXRzZXQoJ2hjZycsIDIsIG1heGZuKDEwMCkpLFxuXG5cdHdoaXRlOiBnZXRzZXQoJ2h3YicsIDEsIG1heGZuKDEwMCkpLFxuXHR3YmxhY2s6IGdldHNldCgnaHdiJywgMiwgbWF4Zm4oMTAwKSksXG5cblx0Y3lhbjogZ2V0c2V0KCdjbXlrJywgMCwgbWF4Zm4oMTAwKSksXG5cdG1hZ2VudGE6IGdldHNldCgnY215aycsIDEsIG1heGZuKDEwMCkpLFxuXHR5ZWxsb3c6IGdldHNldCgnY215aycsIDIsIG1heGZuKDEwMCkpLFxuXHRibGFjazogZ2V0c2V0KCdjbXlrJywgMywgbWF4Zm4oMTAwKSksXG5cblx0eDogZ2V0c2V0KCd4eXonLCAwLCBtYXhmbig5NS4wNDcpKSxcblx0eTogZ2V0c2V0KCd4eXonLCAxLCBtYXhmbigxMDApKSxcblx0ejogZ2V0c2V0KCd4eXonLCAyLCBtYXhmbigxMDguODMzKSksXG5cblx0bDogZ2V0c2V0KCdsYWInLCAwLCBtYXhmbigxMDApKSxcblx0YTogZ2V0c2V0KCdsYWInLCAxKSxcblx0YjogZ2V0c2V0KCdsYWInLCAyKSxcblxuXHRrZXl3b3JkKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBuZXcgQ29sb3IodmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb252ZXJ0W3RoaXMubW9kZWxdLmtleXdvcmQodGhpcy5jb2xvcik7XG5cdH0sXG5cblx0aGV4KHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBuZXcgQ29sb3IodmFsdWUpO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb2xvclN0cmluZy50by5oZXgodGhpcy5yZ2IoKS5yb3VuZCgpLmNvbG9yKTtcblx0fSxcblxuXHRoZXhhKHZhbHVlKSB7XG5cdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdHJldHVybiBuZXcgQ29sb3IodmFsdWUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHJnYkFycmF5ID0gdGhpcy5yZ2IoKS5yb3VuZCgpLmNvbG9yO1xuXG5cdFx0bGV0IGFscGhhSGV4ID0gTWF0aC5yb3VuZCh0aGlzLnZhbHBoYSAqIDI1NSkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG5cdFx0aWYgKGFscGhhSGV4Lmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0YWxwaGFIZXggPSAnMCcgKyBhbHBoYUhleDtcblx0XHR9XG5cblx0XHRyZXR1cm4gY29sb3JTdHJpbmcudG8uaGV4KHJnYkFycmF5KSArIGFscGhhSGV4O1xuXHR9LFxuXG5cdHJnYk51bWJlcigpIHtcblx0XHRjb25zdCByZ2IgPSB0aGlzLnJnYigpLmNvbG9yO1xuXHRcdHJldHVybiAoKHJnYlswXSAmIDB4RkYpIDw8IDE2KSB8ICgocmdiWzFdICYgMHhGRikgPDwgOCkgfCAocmdiWzJdICYgMHhGRik7XG5cdH0sXG5cblx0bHVtaW5vc2l0eSgpIHtcblx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9UUi9XQ0FHMjAvI3JlbGF0aXZlbHVtaW5hbmNlZGVmXG5cdFx0Y29uc3QgcmdiID0gdGhpcy5yZ2IoKS5jb2xvcjtcblxuXHRcdGNvbnN0IGx1bSA9IFtdO1xuXHRcdGZvciAoY29uc3QgW2ksIGVsZW1lbnRdIG9mIHJnYi5lbnRyaWVzKCkpIHtcblx0XHRcdGNvbnN0IGNoYW4gPSBlbGVtZW50IC8gMjU1O1xuXHRcdFx0bHVtW2ldID0gKGNoYW4gPD0gMC4wNDA0NSkgPyBjaGFuIC8gMTIuOTIgOiAoKGNoYW4gKyAwLjA1NSkgLyAxLjA1NSkgKiogMi40O1xuXHRcdH1cblxuXHRcdHJldHVybiAwLjIxMjYgKiBsdW1bMF0gKyAwLjcxNTIgKiBsdW1bMV0gKyAwLjA3MjIgKiBsdW1bMl07XG5cdH0sXG5cblx0Y29udHJhc3QoY29sb3IyKSB7XG5cdFx0Ly8gaHR0cDovL3d3dy53My5vcmcvVFIvV0NBRzIwLyNjb250cmFzdC1yYXRpb2RlZlxuXHRcdGNvbnN0IGx1bTEgPSB0aGlzLmx1bWlub3NpdHkoKTtcblx0XHRjb25zdCBsdW0yID0gY29sb3IyLmx1bWlub3NpdHkoKTtcblxuXHRcdGlmIChsdW0xID4gbHVtMikge1xuXHRcdFx0cmV0dXJuIChsdW0xICsgMC4wNSkgLyAobHVtMiArIDAuMDUpO1xuXHRcdH1cblxuXHRcdHJldHVybiAobHVtMiArIDAuMDUpIC8gKGx1bTEgKyAwLjA1KTtcblx0fSxcblxuXHRsZXZlbChjb2xvcjIpIHtcblx0XHQvLyBodHRwczovL3d3dy53My5vcmcvVFIvV0NBRy8jY29udHJhc3QtZW5oYW5jZWRcblx0XHRjb25zdCBjb250cmFzdFJhdGlvID0gdGhpcy5jb250cmFzdChjb2xvcjIpO1xuXHRcdGlmIChjb250cmFzdFJhdGlvID49IDcpIHtcblx0XHRcdHJldHVybiAnQUFBJztcblx0XHR9XG5cblx0XHRyZXR1cm4gKGNvbnRyYXN0UmF0aW8gPj0gNC41KSA/ICdBQScgOiAnJztcblx0fSxcblxuXHRpc0RhcmsoKSB7XG5cdFx0Ly8gWUlRIGVxdWF0aW9uIGZyb20gaHR0cDovLzI0d2F5cy5vcmcvMjAxMC9jYWxjdWxhdGluZy1jb2xvci1jb250cmFzdFxuXHRcdGNvbnN0IHJnYiA9IHRoaXMucmdiKCkuY29sb3I7XG5cdFx0Y29uc3QgeWlxID0gKHJnYlswXSAqIDIxMjYgKyByZ2JbMV0gKiA3MTUyICsgcmdiWzJdICogNzIyKSAvIDEwMDAwO1xuXHRcdHJldHVybiB5aXEgPCAxMjg7XG5cdH0sXG5cblx0aXNMaWdodCgpIHtcblx0XHRyZXR1cm4gIXRoaXMuaXNEYXJrKCk7XG5cdH0sXG5cblx0bmVnYXRlKCkge1xuXHRcdGNvbnN0IHJnYiA9IHRoaXMucmdiKCk7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcblx0XHRcdHJnYi5jb2xvcltpXSA9IDI1NSAtIHJnYi5jb2xvcltpXTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcmdiO1xuXHR9LFxuXG5cdGxpZ2h0ZW4ocmF0aW8pIHtcblx0XHRjb25zdCBoc2wgPSB0aGlzLmhzbCgpO1xuXHRcdGhzbC5jb2xvclsyXSArPSBoc2wuY29sb3JbMl0gKiByYXRpbztcblx0XHRyZXR1cm4gaHNsO1xuXHR9LFxuXG5cdGRhcmtlbihyYXRpbykge1xuXHRcdGNvbnN0IGhzbCA9IHRoaXMuaHNsKCk7XG5cdFx0aHNsLmNvbG9yWzJdIC09IGhzbC5jb2xvclsyXSAqIHJhdGlvO1xuXHRcdHJldHVybiBoc2w7XG5cdH0sXG5cblx0c2F0dXJhdGUocmF0aW8pIHtcblx0XHRjb25zdCBoc2wgPSB0aGlzLmhzbCgpO1xuXHRcdGhzbC5jb2xvclsxXSArPSBoc2wuY29sb3JbMV0gKiByYXRpbztcblx0XHRyZXR1cm4gaHNsO1xuXHR9LFxuXG5cdGRlc2F0dXJhdGUocmF0aW8pIHtcblx0XHRjb25zdCBoc2wgPSB0aGlzLmhzbCgpO1xuXHRcdGhzbC5jb2xvclsxXSAtPSBoc2wuY29sb3JbMV0gKiByYXRpbztcblx0XHRyZXR1cm4gaHNsO1xuXHR9LFxuXG5cdHdoaXRlbihyYXRpbykge1xuXHRcdGNvbnN0IGh3YiA9IHRoaXMuaHdiKCk7XG5cdFx0aHdiLmNvbG9yWzFdICs9IGh3Yi5jb2xvclsxXSAqIHJhdGlvO1xuXHRcdHJldHVybiBod2I7XG5cdH0sXG5cblx0YmxhY2tlbihyYXRpbykge1xuXHRcdGNvbnN0IGh3YiA9IHRoaXMuaHdiKCk7XG5cdFx0aHdiLmNvbG9yWzJdICs9IGh3Yi5jb2xvclsyXSAqIHJhdGlvO1xuXHRcdHJldHVybiBod2I7XG5cdH0sXG5cblx0Z3JheXNjYWxlKCkge1xuXHRcdC8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvR3JheXNjYWxlI0NvbnZlcnRpbmdfY29sb3JfdG9fZ3JheXNjYWxlXG5cdFx0Y29uc3QgcmdiID0gdGhpcy5yZ2IoKS5jb2xvcjtcblx0XHRjb25zdCB2YWx1ZSA9IHJnYlswXSAqIDAuMyArIHJnYlsxXSAqIDAuNTkgKyByZ2JbMl0gKiAwLjExO1xuXHRcdHJldHVybiBDb2xvci5yZ2IodmFsdWUsIHZhbHVlLCB2YWx1ZSk7XG5cdH0sXG5cblx0ZmFkZShyYXRpbykge1xuXHRcdHJldHVybiB0aGlzLmFscGhhKHRoaXMudmFscGhhIC0gKHRoaXMudmFscGhhICogcmF0aW8pKTtcblx0fSxcblxuXHRvcGFxdWVyKHJhdGlvKSB7XG5cdFx0cmV0dXJuIHRoaXMuYWxwaGEodGhpcy52YWxwaGEgKyAodGhpcy52YWxwaGEgKiByYXRpbykpO1xuXHR9LFxuXG5cdHJvdGF0ZShkZWdyZWVzKSB7XG5cdFx0Y29uc3QgaHNsID0gdGhpcy5oc2woKTtcblx0XHRsZXQgaHVlID0gaHNsLmNvbG9yWzBdO1xuXHRcdGh1ZSA9IChodWUgKyBkZWdyZWVzKSAlIDM2MDtcblx0XHRodWUgPSBodWUgPCAwID8gMzYwICsgaHVlIDogaHVlO1xuXHRcdGhzbC5jb2xvclswXSA9IGh1ZTtcblx0XHRyZXR1cm4gaHNsO1xuXHR9LFxuXG5cdG1peChtaXhpbkNvbG9yLCB3ZWlnaHQpIHtcblx0XHQvLyBQb3J0ZWQgZnJvbSBzYXNzIGltcGxlbWVudGF0aW9uIGluIENcblx0XHQvLyBodHRwczovL2dpdGh1Yi5jb20vc2Fzcy9saWJzYXNzL2Jsb2IvMGU2YjRhMjg1MDA5MjM1NmFhM2VjZTA3YzZiMjQ5ZjAyMjFjYWNlZC9mdW5jdGlvbnMuY3BwI0wyMDlcblx0XHRpZiAoIW1peGluQ29sb3IgfHwgIW1peGluQ29sb3IucmdiKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IHRvIFwibWl4XCIgd2FzIG5vdCBhIENvbG9yIGluc3RhbmNlLCBidXQgcmF0aGVyIGFuIGluc3RhbmNlIG9mICcgKyB0eXBlb2YgbWl4aW5Db2xvcik7XG5cdFx0fVxuXG5cdFx0Y29uc3QgY29sb3IxID0gbWl4aW5Db2xvci5yZ2IoKTtcblx0XHRjb25zdCBjb2xvcjIgPSB0aGlzLnJnYigpO1xuXHRcdGNvbnN0IHAgPSB3ZWlnaHQgPT09IHVuZGVmaW5lZCA/IDAuNSA6IHdlaWdodDtcblxuXHRcdGNvbnN0IHcgPSAyICogcCAtIDE7XG5cdFx0Y29uc3QgYSA9IGNvbG9yMS5hbHBoYSgpIC0gY29sb3IyLmFscGhhKCk7XG5cblx0XHRjb25zdCB3MSA9ICgoKHcgKiBhID09PSAtMSkgPyB3IDogKHcgKyBhKSAvICgxICsgdyAqIGEpKSArIDEpIC8gMjtcblx0XHRjb25zdCB3MiA9IDEgLSB3MTtcblxuXHRcdHJldHVybiBDb2xvci5yZ2IoXG5cdFx0XHR3MSAqIGNvbG9yMS5yZWQoKSArIHcyICogY29sb3IyLnJlZCgpLFxuXHRcdFx0dzEgKiBjb2xvcjEuZ3JlZW4oKSArIHcyICogY29sb3IyLmdyZWVuKCksXG5cdFx0XHR3MSAqIGNvbG9yMS5ibHVlKCkgKyB3MiAqIGNvbG9yMi5ibHVlKCksXG5cdFx0XHRjb2xvcjEuYWxwaGEoKSAqIHAgKyBjb2xvcjIuYWxwaGEoKSAqICgxIC0gcCkpO1xuXHR9LFxufTtcblxuLy8gTW9kZWwgY29udmVyc2lvbiBtZXRob2RzIGFuZCBzdGF0aWMgY29uc3RydWN0b3JzXG5mb3IgKGNvbnN0IG1vZGVsIG9mIE9iamVjdC5rZXlzKGNvbnZlcnQpKSB7XG5cdGlmIChza2lwcGVkTW9kZWxzLmluY2x1ZGVzKG1vZGVsKSkge1xuXHRcdGNvbnRpbnVlO1xuXHR9XG5cblx0Y29uc3Qge2NoYW5uZWxzfSA9IGNvbnZlcnRbbW9kZWxdO1xuXG5cdC8vIENvbnZlcnNpb24gbWV0aG9kc1xuXHRDb2xvci5wcm90b3R5cGVbbW9kZWxdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0XHRpZiAodGhpcy5tb2RlbCA9PT0gbW9kZWwpIHtcblx0XHRcdHJldHVybiBuZXcgQ29sb3IodGhpcyk7XG5cdFx0fVxuXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID4gMCkge1xuXHRcdFx0cmV0dXJuIG5ldyBDb2xvcihhcmdzLCBtb2RlbCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBDb2xvcihbLi4uYXNzZXJ0QXJyYXkoY29udmVydFt0aGlzLm1vZGVsXVttb2RlbF0ucmF3KHRoaXMuY29sb3IpKSwgdGhpcy52YWxwaGFdLCBtb2RlbCk7XG5cdH07XG5cblx0Ly8gJ3N0YXRpYycgY29uc3RydWN0aW9uIG1ldGhvZHNcblx0Q29sb3JbbW9kZWxdID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0XHRsZXQgY29sb3IgPSBhcmdzWzBdO1xuXHRcdGlmICh0eXBlb2YgY29sb3IgPT09ICdudW1iZXInKSB7XG5cdFx0XHRjb2xvciA9IHplcm9BcnJheShhcmdzLCBjaGFubmVscyk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBDb2xvcihjb2xvciwgbW9kZWwpO1xuXHR9O1xufVxuXG5mdW5jdGlvbiByb3VuZFRvKG51bWJlciwgcGxhY2VzKSB7XG5cdHJldHVybiBOdW1iZXIobnVtYmVyLnRvRml4ZWQocGxhY2VzKSk7XG59XG5cbmZ1bmN0aW9uIHJvdW5kVG9QbGFjZShwbGFjZXMpIHtcblx0cmV0dXJuIGZ1bmN0aW9uIChudW1iZXIpIHtcblx0XHRyZXR1cm4gcm91bmRUbyhudW1iZXIsIHBsYWNlcyk7XG5cdH07XG59XG5cbmZ1bmN0aW9uIGdldHNldChtb2RlbCwgY2hhbm5lbCwgbW9kaWZpZXIpIHtcblx0bW9kZWwgPSBBcnJheS5pc0FycmF5KG1vZGVsKSA/IG1vZGVsIDogW21vZGVsXTtcblxuXHRmb3IgKGNvbnN0IG0gb2YgbW9kZWwpIHtcblx0XHQobGltaXRlcnNbbV0gfHwgKGxpbWl0ZXJzW21dID0gW10pKVtjaGFubmVsXSA9IG1vZGlmaWVyO1xuXHR9XG5cblx0bW9kZWwgPSBtb2RlbFswXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0bGV0IHJlc3VsdDtcblxuXHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRpZiAobW9kaWZpZXIpIHtcblx0XHRcdFx0dmFsdWUgPSBtb2RpZmllcih2YWx1ZSk7XG5cdFx0XHR9XG5cblx0XHRcdHJlc3VsdCA9IHRoaXNbbW9kZWxdKCk7XG5cdFx0XHRyZXN1bHQuY29sb3JbY2hhbm5lbF0gPSB2YWx1ZTtcblx0XHRcdHJldHVybiByZXN1bHQ7XG5cdFx0fVxuXG5cdFx0cmVzdWx0ID0gdGhpc1ttb2RlbF0oKS5jb2xvcltjaGFubmVsXTtcblx0XHRpZiAobW9kaWZpZXIpIHtcblx0XHRcdHJlc3VsdCA9IG1vZGlmaWVyKHJlc3VsdCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fTtcbn1cblxuZnVuY3Rpb24gbWF4Zm4obWF4KSB7XG5cdHJldHVybiBmdW5jdGlvbiAodikge1xuXHRcdHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbihtYXgsIHYpKTtcblx0fTtcbn1cblxuZnVuY3Rpb24gYXNzZXJ0QXJyYXkodmFsdWUpIHtcblx0cmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiBbdmFsdWVdO1xufVxuXG5mdW5jdGlvbiB6ZXJvQXJyYXkoYXJyYXksIGxlbmd0aCkge1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHR5cGVvZiBhcnJheVtpXSAhPT0gJ251bWJlcicpIHtcblx0XHRcdGFycmF5W2ldID0gMDtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gYXJyYXk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29sb3I7XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/color/index.js\n");

/***/ })

};
;