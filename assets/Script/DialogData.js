var DialogData = function () {
	this.in = null;
	this.roles = [];
	this.phrases = [];
	this.sequence = null;
	this.current = 0;
};
var TYPE = DialogData.Type = cc.Enum({
	PHRASE: 0,
	OPTION: 1
})
cc.js.mixin(DialogData.prototype, {
	start: function () {
		this.current = this.in;
	},
	
	getRole: function (id) {
		return this.roles[id];
	},

	appendPhrase: function (role, phrase) {
		var roleid = this.roles.indexOf(role);
		if (roleid === -1) {
			roleid = this.roles.length;
			this.roles.push(role);
		}
		this.phrases.push({
			type: TYPE.PHRASE,
			role: roleid,
			phrase: phrase
		});
	},

	appendOption: function (options) {
		this.phrases.push({
			type: TYPE.OPTION,
			options: options
		})
	},

	next: function () {
		var phrase = this.phrases[this.current];
		this.current++;
		return phrase;
	}
});

module.exports = DialogData;