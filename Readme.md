
# User-Targeting

Target user names in chat rooms with @[username].

## Installation

$ component install AndreasKlein/user-targeting

## Usage

```html
<input type="text" id="input">
```
Initialize:
```js
var $input = $('#input'),
getUserNames = function() { return ["John Doe", "Max Mustermann"]; },
dropdownView = UserTargeting.initDropdown($input, getUserNames);
```

Use targeting api:
```js
var targeting = UserTargeting.targeting();

message = "Hi @John Doe and @Max Mustermann"
message = targeting.wrapUserNames(message, getUserNames(), "Max Mustermann");

if (targeting.referencesName(message, "John Doe")) {
	//do something hip
}
```
You can also use targeting.referencesEveryone or targeting.referencesNameOrEveryone

## License

MIT