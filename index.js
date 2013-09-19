var targeting = require('./lib/targeting')
  , dropdown = require('./lib/dropdown');


UserTargeting = {
  initDropdown: dropdown,
  targeting: targeting
};

module.exports = UserTargeting;