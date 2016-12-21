var DialogData = require('DialogData');

var DialogParser = (function () {
    var PHRASE_REG = /^#([\s\w\d]+)#(.+)$/;
    var OPTION_SEP = '|';

    return {
        parseDialog: function (content) {
            var data = new DialogData();
            data.in = content.in;

            var entries = content.entries;
            var sequence = content.sequence;
            var i, l;

            for (i in entries) {
                var entry = entries[i];
                var phrase = PHRASE_REG.exec(entry);
                if (phrase) {
                    data.appendPhrase(i, phrase[1], phrase[2]);
                    continue;
                }
                var options = entry.split(OPTION_SEP);
                if (options.length > 1) {
                    data.appendOption(options);
                    continue;
                }
            }
            data.sequence = sequence;
            return data;
        }
    }
})()

module.exports = DialogParser;