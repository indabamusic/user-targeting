/*

Initialize Targeting

@param {String} char (optional)

*/

function Targeting(char) {
  this.char = char || '@';
  this.EVERYONE_TAGS = ['anyone', 'everybody', 'anybody', 'everyone'];
  this.targetRegexp = new RegExp(this.char+"([^\\s]+)$");
  this.everyoneRegexp = new RegExp("("+this.char+"("+this.EVERYONE_TAGS.join('|')+"))", "gi");
};

/*

returns target value

@param {String} str

*/

Targeting.prototype.findTargetValue = function(str) {
  var matches = str.match(this.targetRegexp);
  if (matches) return matches[1];
};


Targeting.prototype.getMatchingUserNames = function(value, userNames) {
  var regex = new RegExp(value, "gi"),
      matchingUsers = [],
      tags = this.EVERYONE_TAGS.slice(0,2);

  userNames.forEach(function(name) { tags.push(name) });

  for (var i=0;i<tags.length;i++) {
    var tag = tags[i];
    if (tag.match(regex)) matchingUsers.push(tag);
  }
  return matchingUsers;
};


Targeting.prototype.replaceTargetValue = function(message, value) {
  var match = message.match(this.targetRegexp)[1];
  message = message.substring(0, message.length-match.length);
  return message + value;
};


Targeting.prototype.wrapUserNames = function(message, userNames, myName) {
  userNames.forEach(function(name) {
    message = message.replace(this.nameRegexp(name), function(match, nameWithAt, name) {
      if (name === myName) {
        return '<span class="user-targeting target target-self">' + nameWithAt + '</span>';
      } else {
        return '<span class="user-targeting target">' + nameWithAt + '</span>';
      }
    })
  }, this)
  return message.replace(this.everyoneRegexp, "<span class=\"user-targeting target target-self\">$1</span>");
};


Targeting.prototype.referencesName = function(message, name) {
  return Boolean(message.match(this.nameRegexp(name)));
};

Targeting.prototype.referencesEveryone = function(message) {
  return Boolean(message.match(this.everyoneRegexp));
};

Targeting.prototype.referencesNameOrEveryone = function(message, name) {
  return this.referencesName(message, name) || this.referencesEveryone(message);
};


Targeting.prototype.nameRegexp = function(name) {
  var reRegexpChars = new RegExp(/[|&;$%@*"<>()+,]/g);
  name = name
    .replace(/\\/g, "\\\\")
    .replace(reRegexpChars, "")
  return new RegExp("("+this.char+"("+name+"))", "gi");
};


/*

Exports Targeting.

*/

module.exports = Targeting;
