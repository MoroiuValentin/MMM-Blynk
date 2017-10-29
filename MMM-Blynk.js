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
		authToken : ""
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() {
		var self = this;
		var dataRequest = null;
		var dataNotification = null;
        var tempRequest = null;
        var humiRequest = null;
		var statusRequest = null;


		//Flag for check if module is loaded
		this.loaded = false;
		this.token = true;

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
		setTimeout(function() {
			this.getData();
		}, nextLoad);
	},

	getDom: function() {
		
		// create element wrapper for show into the module
		var wrapper = document.createElement("div");

		if (this.config.authToken ===""){
			wrapper.innerHTML = "Please insert the corect Blynk token in the config for module: " + this.name + "."
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		
		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className = "dimmed light small";
			return wrapper;
		}
		

		// If device (IOT) is ONLINE
		if (this.statusRequest == "ONLINE") {

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
		else {
			var wrapperstatusRequest = document.createElement("div");
			wrapperstatusRequest.innerHTML = "OFFLINE";

			wrapper.appendChild(wrapperstatusRequest);
		}

		// Data from helper
		
		return wrapper;
	},

	getStyles: function () {
		return [
			"MMM-Blynk.css",
		];
	},
	

	processData: function(data) {
		
		/*Access from browser http://blynk-cloud.com/YOUR_BLYNK_PROJECT_TOKEN/project and 
			identify information that what you want to show in your magicmirror
			In my case i have a NodeMCU v 1.0 and a DHT22 sensor for temperature and humidity.
			The advantage of using this solution is that you can grab this information over the internet from remote location
		*/

		this.dataRequest = data;
		this.tempRequest = data.widgets[3].value;
		this.humiRequest = data.widgets[2].value;
		this.statusRequest = data.devices[0].status;
		


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
