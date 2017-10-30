# MMM-Blynk

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

I was looking for a solution to interconnect Blynk projects with MagicMirror. 
For those who do not know what Blynk is, you can take a look at http://www.blynk.cc/.

This module automatically detects DIGIT4_DISPLAY and LABELED_VALUE_DISPLAY 
widgets (for the moment), then extracts 'label' : 'value' and displays them. 



The advantage of using this solution is that you can grab this information over the internet
from a remote location.
	

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
		{
			module: "MMM-Blynk",
			header: "Blynk Project",
			position: "bottom_right",
			config: {
				authToken: ""
			}
		}
    ]
}
```

## Configuration options


