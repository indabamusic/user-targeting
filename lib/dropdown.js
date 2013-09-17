var $ = require('jquery')
  , Targeting = require('./targeting')
  , View = require('view');

module.exports = UserDropdownView;


/*

Initialize UserDropdownView with input element and function to return current users

@param {jQuery Element} $inputEl
@param {Function} getCurrentUsers
@param {String} char (optional)

*/

function UserDropdownView($inputEl, getCurrentUsers, char) {
  this.targeting = Targeting(char);
  this.$input = $inputEl;
  this.$input.after('<ul class="user-dropdown"></ul>');

  this.$el = this.$input.siblings('.user-dropdown');
  this.el = this.$el[0];
  this.$el.hide();
  this.getCurrentUsers = getCurrentUsers;

  this.bindings = { };
  this.bind('click .user-dropdown li', 'onClick');
  this.bind('mouseover .user-dropdown li', 'onMouseOver');
  this.bind('mouseout .user-dropdown li', 'onMouseOut');

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

  this.$input.keyup(function(e) {
    if (!isActionKey(e.keyCode)) {  
      var targetValue = this.targeting.findTargetValue(e.target.value),
          matchingUserNames = [];

      if (targetValue) matchingUserNames = this.targeting.getMatchingUserNames(targetValue, self.getCurrentUsers());

      if (matchingUserNames.length > 0) {
        self.show(matchingUserNames);
      } else {
        self.hide();
      }  
    }
  });

  this.$input.keydown(function(e) { 
    if (self.$el.is(':visible') && isActionKey(e.keyCode)) {
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

  function isActionKey(keyCode) {
    return keyCodes.indexOf(keyCode) !== -1;
  }
}

UserDropdownView.prototype = Object.create(View.prototype);

UserDropdownView.prototype.setInputValue = function(targetValue) {
  var oldValue = this.$input.val(),
      newValue = this.targeting.replaceTargetValue(oldValue, targetValue);
  this.$input.val(newValue).focus();
};

UserDropdownView.prototype.show = function(userNames) {
  var userList = '';
  userNames.forEach(function(name) {
    userList += '<li class="clickable">'+name+'</li>'
  });;
  this.$el.html(userList);
  this.$el.children('li:first-child').addClass('marked');
  this.$el.show();
};

UserDropdownView.prototype.hide = function() {
  this.$el.hide();
};

UserDropdownView.prototype.markNext = function() {
  var $next = this.$marked().next();
  if (! $next.length) {
    $next = this.$listElements().first();
  }
  this.unmarkAll();
  $next.addClass('marked');
};

UserDropdownView.prototype.markPrev = function() {
  var $next = this.$marked().prev();
  if (! $next.length) {
    $next = this.$listElements().last();
  }   
  this.unmarkAll();
  $next.addClass('marked');
};

UserDropdownView.prototype.unmarkAll = function() {
  this.$listElements().removeClass('marked');
};

UserDropdownView.prototype.$marked = function() {
  return this.$el.find('li.marked');
};

UserDropdownView.prototype.$listElements = function() {
  return this.$el.find('li');
};


/*

Mouse events

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
