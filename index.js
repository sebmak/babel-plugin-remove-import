/*
 *  Babel plugin to remove unwanted `import` declarations when building
 *  packages with babel transforms.
 *
 *  PLEASE USE WITH COUTION and check your RegExp expressions carefully.
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    return {
        visitor: {
            ImportDeclaration: function (nodePath, state) {
                //node.source.value contains the import declaration
                var text = nodePath.node.source.value;

                //plugin arguments
                var regex = state.opts;

                if (!(regex instanceof Array)) {
                    regex = [regex];
                }

                //convert string regexp patterns to instances of RegExp
                regex = regex.map(function(r) {
                    return typeof r === 'string' ? new RegExp(r) : r;
                });

                //iterate over all regexps to find a truthy one,
                //when found, remove the `import` node from the code
                for(var i = 0; i < regex.length; i++) {
                    if(isRegexExpressionTruthy(text, regex[i])) {
                        nodePath.remove();
                        break;
                    }
                }
            }
        }
    }
};

//check whether the text (import declaration) is matches the given regex
function isRegexExpressionTruthy(text, regex) {
    return (regex instanceof RegExp) ? !!text.match(regex) : false;
}
