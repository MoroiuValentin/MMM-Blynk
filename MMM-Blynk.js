/* global Module */

/* Magic Mirror
 * Module: MMM-Blynk
 *
 * By
 * MIT Licensed.
 */

Module.register("MMM-Blynk", {
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000,
		apiBase : "http://blynk-cloud.com/",
		authToken : "",
		displayType: "box", // box or text
	},
	getScripts: function() {
		return ["moment.js",
						"moment-timezone.js",
						this.file('node_modules/string-format/lib/string-format.js')];
		},
	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
		var statusRequest = null;
		var x = null;


		//Flag for check if module is loaded
		this.loaded = false;


		// Schedule update timer.
		this.getData();
		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function() {
		var self = this;

		var urlApi = this.config.apiBase + this.config.authToken + "/project";

		console.log(urlApi);
		var retry = true;

		var dataRequest = new XMLHttpRequest();
		dataRequest.open("GET", urlApi, true);
		dataRequest.onreadystatechange = function() {
			console.log(this.readyState);
			if (this.readyState === 4) {
				console.log(this.status);
				if (this.status === 200) {
					self.processData(JSON.parse(this.response));
				} else if (this.status === 401) {
					this.updateDom(self.config.animationSpeed);
					Log.error(self.name, this.status);
					retry = false;
				} else {
					Log.error(self.name, "Could not load data.");
				}
				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		dataRequest.send();
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad ;
		var self = this;
		setTimeout(function() {
			self.getData();
		}, nextLoad);
	},

	// define html element for later use.
	html: {
		div: '<div class="simple"> {} </div>'
	},

	// tray to automate the proccess but i have some issue ... :)
	replaceTemplate: function(str, arg) {

	    var splitArgs = arg.split(" ");
	    var countOccurrence = (str.match(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/g)).length;
	  //  if(splitArgs.length != countOcur) later inpleement of check
	    for(var i = 0; i < splitArgs.length; i++)
	    {
	      var res = str.replace(/([{}])\1|[{](.*?)(?:!(.+?))?[}]/i, splitArgs[i]);
	      var str = res;
	    }
			console.log(str);
	  return str;
	},

	getDom: function() {
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		if (this.config.authToken ===""){
			wrapper.innerHTML = "Please insert the corect Blynk token in the config for module: " + this.name + "."
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		if (!this.loaded) {
		//	wrapper.innerHTML = "Loading";
			var str = this.html.div;
			var xy = "Loading";
			wrapper.innerHTML = this.replaceTemplate(str, xy);
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// If device (IOT) is ONLINE
		if (this.statusRequest == "ONLINE") {

			//define RegExp for check widget label
			var temppatt = new RegExp(/temp/i);
			var humidpatt = new RegExp(/umidi/i);
			var str = this.html.div;

			for(var j = 0; j < this.x.length; j++)
			{
				var splitData = this.x[j].split(":");

						if(temppatt.test(splitData[0]))
						{
							var arg = splitData[1];
							//wrapper.innerHTML = this.replaceTemplate(str, arg);
							var wrapperxRequest = document.createElement("div");
							wrapperxRequest.className = this.config.displayType;
							wrapperxRequest.innerHTML = splitData[1] + "°C";
							wrapper.appendChild(wrapperxRequest);
						}

						if(humidpatt.test(splitData[0]))
						{
							var wrapperxRequest = document.createElement("div");
							wrapperxRequest.className = this.config.displayType;
							wrapperxRequest.innerHTML = splitData[1] + " %";
							wrapper.appendChild(wrapperxRequest);
						}

			}


		}
		// If device is offline
		else {

			var dt = moment(this.offlineData);

			var wrapperstatusRequest = document.createElement("div");
			wrapperstatusRequest.innerHTML = "OFFLINE : <br>" + dt.format("hh:mm") +"  "+ dt.format("L");

			wrapper.appendChild(wrapperstatusRequest);
		}

		// Data from helper
		//return $('<div>'+xy+'</div>')[0];
		return wrapper;
	},

	getStyles: function () {
		return [
			"MMM-Blynk.css",
		];
	},


	processData: function(data) {
		//read device status
		this.statusRequest = data.devices[0].status;
		//read device disconnected time
		this.offlineData = data.devices[0].disconnectTime;
		this.x = [];

		console.log(this.x);
		for (var i = 0; i < data.widgets.length;  i++)
		{
			if(data.widgets[i].type == "DIGIT4_DISPLAY" || data.widgets[i].type == "LABELED_VALUE_DISPLAY")
			{
				this.x.push((data.widgets[i].label + " : " + parseFloat(data.widgets[i].value).toFixed(1)).toString());
				console.log(this.x);
			}
		}

		/*Access from browser http://blynk-cloud.com/YOUR_BLYNK_PROJECT_TOKEN/project and
			identify information that what you want to show in your magicmirror
			In my case i have a NodeMCU v 1.0 and a DHT22 sensor for temperature and humidity.
			The advantage of using this solution is that you can grab this information over the internet from remote location

		this.dataRequest = data;
		this.tempRequest = data.widgets[2].value;
		this.humiRequest = data.widgets[1].value;
		this.statusRequest = data.devices[0].status;

*/

		if (this.loaded === false) { this.updateDom(this.config.animationSpeed) ; }
		this.loaded = true;

		// the data if load
		// send notification to helper
		this.sendSocketNotification("MMM-Blynk-NOTIFICATION_TEST", data);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if(notification === "MMM-Blynk-NOTIFICATION_TEST") {
			// set dataNotification
			this.dataNotification = payload;
			this.updateDom();
		}
	},
});
