var targeting = require('./lib/targeting')
  , dropdown = require('./lib/dropdown');


UserTargeting = {
  initDropdown: function($inputEl, getCurrentUsers, char) {
    return dropdown($inputEl, getCurrentUsers, char);
  },
  targeting: targeting
};

module.exports = UserTargeting;