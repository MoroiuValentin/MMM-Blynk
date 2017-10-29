# MMM-Blynk

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

I was looking for a solution to interconnect Blynk projects with MagicMirror. 
For those who do not know what Blynk is, you can take a look at http://www.blynk.cc/.
This is my solution.


Access http://blynk-cloud.com/YOUR_BLYNK_PROJECT_TOKEN/project 
and identify information that what you want to show in your MagicMirror.
In my case i have a NodeMCU v 1.0 and a DHT22 sensor for temperature and humidity.
```
I have made some changes to automate the process. 
Automatically detects DIGIT4_DISPLAY and LABELED_VALUE_DISPLAY 
widgets and then extracts 'label' and 'value' and displays them
```
You need to change the source code to suit your needs. 
In processData function add json path to  value that you want to display. 
In my case is:
```js
 		this.tempRequest = data.widgets[3].value;
		this.humiRequest = data.widgets[2].value;
```
Then in getDom function add check if device is connected and display temperature and humidity

```js

	if (this.statusRequest == "ONLINE") 
		{
		 	var temp = parseFloat(this.tempRequest).toFixed(1);
			var umid = parseFloat(this.humiRequest).toFixed(1);

			var wrappertempRequest = document.createElement("div");
			wrappertempRequest.innerHTML ="Temperature : " + temp + "&deg;C";


			var wrapperhumiRequest = document.createElement("div");
			wrapperhumiRequest.innerHTML ="Humidity : " + umid + " %";
			
			
			wrapper.appendChild(wrappertempRequest);
			wrapper.appendChild(wrapperhumiRequest);
		}
	// If device is offline
	else 
		{
			var wrapperstatusRequest = document.createElement("div");
			wrapperstatusRequest.innerHTML = "OFFLINE";

			wrapper.appendChild(wrapperstatusRequest);
		}

```
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


