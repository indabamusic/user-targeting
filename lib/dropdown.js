var $ = require('jquery')
  , Targeting = require('./targeting')
  , View = require('view');


/*
*
* Initializes UserDropdownView with input element and function to return current users and optional character.
*
* @param {jQuery Object} $inputEl
* @param {Function} getCurrentUsers
* @param {String} char (optional, defaults to @)
*
*/

function UserDropdownView($inputEl, getCurrentUsers, char) {
  if(!(this instanceof UserDropdownView)) return new UserDropdownView($inputEl, getCurrentUsers, char);

  this.targeting = new Targeting(char);
  this.$input = $inputEl;
  this.$input.after('<ul class="user-targeting user-dropdown"></ul>');

  this.$el = this.$input.siblings('.user-targeting.user-dropdown');
  this.el = this.$el[0];
  this.$el.hide();
  this.getCurrentUsers = getCurrentUsers;

  this.bindings = { };
  this.bind('click .user-targeting.user-dropdown li', 'onClick');
  this.bind('mouseover .user-targeting.user-dropdown li', 'onMouseOver');
  this.bind('mouseout .user-targeting.user-dropdown li', 'onMouseOut');

  var self = this,
      keyCodes = [],
      keys = {
        ARROW_UP: 38,
        ARROW_DOWN: 40,
        ENTER: 13,
        TAB: 9,
        ESC: 27
      };

  Object.keys(keys).forEach(function(k) { keyCodes.push(keys[k]) });

  // check if dropdown menu needs to be shown on keyup
  this.$input.keyup(function(e) {
    if (!isActionKey(e.keyCode)) {  
      var targetValue = self.targeting.findTargetValue(e.target.value),
          matchingUserNames = [];

      if (targetValue) matchingUserNames = self.targeting.getMatchingUserNames(targetValue, self.getCurrentUsers());

      if (matchingUserNames.length > 0) {
        self.show(matchingUserNames);
      } else {
        self.hide();
      }  
    }
  });

  // respond to actionkeys on keydown
  this.$input.keydown(function(e) { 
    if (self.isVisible() && isActionKey(e.keyCode)) {
      switch (e.keyCode) {
        case keys.ARROW_UP:
          self.markPrev();
          break;
        case keys.ARROW_DOWN:
          self.markNext();
          break;
        case keys.ENTER:
        case keys.TAB:
          self.setInputValue(self.$marked().text());
          self.hide();
          break;
        case keys.ESC:
          self.hide();
          break;
      }
      e.preventDefault();
    }
  });

  function isActionKey(keyCode) { return keyCodes.indexOf(keyCode) !== -1; }
}


/*
*
* Adds Component/View functionality.
*
*/

UserDropdownView.prototype = Object.create(View.prototype);


/*
*
* Replaces value of input element with the matches user names.
* 
* @param {String} targetValue
* 
*/

UserDropdownView.prototype.setInputValue = function(targetValue) {
  var oldValue = this.$input.val(),
      newValue = this.targeting.replaceTargetValue(oldValue, targetValue);
  this.$input.val(newValue).focus();
};


/*
*
* Populates dropdown menu and shows it.
* 
* @param {Array} userNames
* 
*/

UserDropdownView.prototype.show = function(userNames) {
  var userList = '';
  userNames.forEach(function(name) {
    userList += '<li class="clickable">'+name+'</li>'
  });;
  this.$el.html(userList);
  this.$el.children('li:first-child').addClass('marked');
  this.$el.show();
};


/*
*
* Hides dropdown menu.
* 
*/

UserDropdownView.prototype.hide = function() {
  this.$el.hide();
};


/*
*
* Marks next dropdown menu element.
* 
*/

UserDropdownView.prototype.markNext = function() {
  var $next = this.$marked().next();
  if (! $next.length) {
    $next = this.$listElements().first();
  }
  this.unmarkAll();
  $next.addClass('marked');
};


/*
*
* Marks previous dropdown menu element.
* 
*/

UserDropdownView.prototype.markPrev = function() {
  var $next = this.$marked().prev();
  if (! $next.length) {
    $next = this.$listElements().last();
  }   
  this.unmarkAll();
  $next.addClass('marked');
};


/*
*
* Unmarks all dropdown menu elements.
* 
*/

UserDropdownView.prototype.unmarkAll = function() {
  this.$listElements().removeClass('marked');
};


/*
*
* Returns all selected dropdown menu elements.
* 
* @return {jQuery Object}
* 
*/

UserDropdownView.prototype.$marked = function() {
  return this.$el.find('li.marked');
};


/*
*
* Returns all dropdown menu elements.
* 
* @return {jQuery Object}
* 
*/

UserDropdownView.prototype.$listElements = function() {
  return this.$el.find('li');
};


/*
*
* Checks dropdown visibility.
* 
* @return {Boolean}
* 
*/

UserDropdownView.prototype.isVisible = function() {
  return this.$el.is(':visible');
}


/*
*
* Mouse events.
*
*/

UserDropdownView.prototype.onClick = function(e) {
  this.setInputValue(e.target.textContent);
  this.hide();
};

UserDropdownView.prototype.onMouseOver = function(e) {
  $(e.target).addClass('marked').siblings().removeClass('marked');
};

UserDropdownView.prototype.onMouseOut = function(e) {
  $(e.target).removeClass('marked');
};


/*
*
* Exports UserDropdownView
*
*/

module.exports = UserDropdownView;
