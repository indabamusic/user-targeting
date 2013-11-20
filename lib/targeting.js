/*
*
* Initializes Targeting with optional activation character
*
* @param {String} char (optional)
*
*/

function Targeting(char) {
  if(!(this instanceof Targeting)) return new Targeting(char);

  this.char = char || '@';
  this.EVERYONE_TAGS = ['anyone', 'everybody', 'anybody', 'everyone'];
  this.targetRegexp = new RegExp(this.char+"([^\\s]+)$");
  this.everyoneRegexp = new RegExp("("+this.char+"("+this.EVERYONE_TAGS.join('|')+"))", "gi");
};

/*
*
* Finds last target value in `str`.
* Target values are start with the activation character (default: '@').
*
* @param {String} str
*
* @return {String}
*
*/

Targeting.prototype.findTargetValue = function(str) {
  var matches = str.match(this.targetRegexp);
  if (matches) return matches[1];
};


/*
*
* Finds matching usernames and everone-tags in `value`.
*
* @param {String} value
* @param {Array} userNames
*
* @return {Array}
*
*/

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


/*
*
* Replaces the target with full match (full name).
*
* @param {String} message
* @param {String} value
*
* @return {String}
*
*/

Targeting.prototype.replaceTargetValue = function(message, value) {
  var match = message.match(this.targetRegexp)[1];
  message = message.substring(0, message.length-match.length);
  return message + value;
};


/*
*
* Wraps user names in html <span> elements.
* Matches with `myName` and everbody-tag get a '.target-self', other names a '.target' class.
*
* @param {String} message
* @param {Array} userNames
* @param {String} myName
*
* @return {String}
*
*/

Targeting.prototype.wrapUserNames = function(message, userNames, myName) {
  if (message.indexOf(this.char) == -1) return message;

  if (myName) {
    var myNameIndex = userNames.indexOf(myName);
    if (myNameIndex == -1) userNames.splice(myNameIndex, 1);
    message = message.replace(this.nameRegexp(myName), "<span class=\"user-targeting target target-self\">$1</span>");
  }

  message = message.replace(this.userNamesRegexp(userNames),  "<span class=\"user-targeting target\">$1</span>");
  message = message.replace(this.everyoneRegexp,              "<span class=\"user-targeting target target-self\">$1</span>");

  return message;
};


/*
*
* Checks if 'message' references 'name'.
*
* @param {String} message
* @param {String} name
*
* @return {Boolean}
*
*/

Targeting.prototype.referencesName = function(message, name) {
  return Boolean(message.match(this.nameRegexp(name)));
};


/*
*
* Checks if 'message' references everbody-tags.
*
* @param {String} message
*
* @return {Boolean}
*
*/

Targeting.prototype.referencesEveryone = function(message) {
  return Boolean(message.match(this.everyoneRegexp));
};


/*
*
* Checks if 'message' references 'name' or everbody-tags.
*
* @param {String} message
* @param {String} name
*
* @return {Boolean}
*
*/

Targeting.prototype.referencesNameOrEveryone = function(message, name) {
  return this.referencesName(message, name) || this.referencesEveryone(message);
};



var reRegexpChars = new RegExp(/[|&;$%@*"<>()+,]/g);


/*
*
* Returns sanitized Regular Expression built with 'name' and the activation character.
*
* @param {String} name
*
* @return {RegExp}
*
*/


Targeting.prototype.nameRegexp = function(name) {
  if (this.setNameRegexp) return this.setNameRegexp;
  
  name = name
    .replace(/\\/g, "\\\\")
    .replace(reRegexpChars, "");
  return new RegExp("("+this.char+"("+name+"))", "gi");
};



Targeting.prototype.userNamesRegexp = function(userNames) {
  if (this.setUserNamesRegexp) return this.setUserNamesRegexp;

  var escapedUserNames = [];

  userNames.forEach(function(name){
    escapedUserNames.push( name.replace(/\\/g, "\\\\").replace(reRegexpChars, "") );
  });
  
  return new RegExp("("+this.char+"("+escapedUserNames.join('|')+"))", "gi");
};
/*
* 
* Exports Targeting.
*
*/

module.exports = Targeting;
