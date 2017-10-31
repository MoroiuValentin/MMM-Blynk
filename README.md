# MMM-Blynk

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

I was looking for a solution to interconnect Blynk projects with MagicMirror.
For those who do not know what Blynk is, you can take a look at http://www.blynk.cc/.

This module automatically detects DIGIT4_DISPLAY and LABELED_VALUE_DISPLAY
widgets (for the moment), then extracts 'label' : 'value' and displays them.

The advantage of using this solution is that you can grab this information over the internet
from a remote location.

## Installation
    1. Navigate into your MagicMirror's modules folder  
    2. Execute `git clone https://github.com/MoroiuValentin/MMM-Blynk.git`.


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
				authToken: "",
				displayType: "" // options available are 'box' and 'text'.  
        widgetsColor: "" //widgets text color
			}
		}
    ]
}
```

## Configuration options
The following properties can be configured:


<table width="100%">
	<!-- why, markdown... -->
	<thead>
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
	<thead>
	<tbody>
		<tr>
			<td><code>authToken</code></td>
			<td>For every Blynk progect you get a authentication token.<br>
				<br><b>Possible values:</b> <code>string</code>
				<br><b>Default value:</b> <code>""</code>
			</td>
		</tr>
		<tr>
			<td><code>displayType</code></td>
			<td>Control how information will be display<br>
				<br><b>Possible values:</b> <code>simple, box, lcd</code>
				<br><b>Default value:</b> <code>"box"</code>
			</td>
		</tr>
	</tbody>
</table>
