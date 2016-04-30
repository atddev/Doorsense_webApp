var App = Ember.Application.createWithMixins(Bootstrap.Register);

//Define any global variables or functions here using the 'App' namespace
App.api = "/api"
App.debug = true;


App.getLocal = function(name){
	return JSON.parse(localStorage.getItem(name));
}
App.setLocal = function (name, value){
	localStorage.setItem(name, JSON.stringify(value)); 
}
App.getSession = function(name){
	return JSON.parse(sessionStorage.getItem(name));
}
App.setSession = function (name, value){
	sessionStorage.setItem(name, JSON.stringify(value)); 
}
App.getCookie = function (cookieName){
	//Finds cookieName in window.document.cookie
	var cookieValue = document.cookie;
	var start = cookieValue.indexOf(" " + cookieName + "=");
	if (start == -1){
		start = cookieValue.indexOf(cookieName + "=");
	}
	if (start == -1){
	  	cookieValue = null;
	}
	else {
	  	start = cookieValue.indexOf("=", start) + 1;
	  	var end = cookieValue.indexOf(";", start);
	  	if (end == -1){
	    	end = cookieValue.length;
	    }
	  	cookieValue = unescape(cookieValue.substring(start,end));
	}
	return cookieValue;
};

App.setCookie = function (cookieName,value,exdays){
	//Adds cookieName in window.document.cookie following the format cookieName=value, where exdays sets the expiration date. exdays=null implies session cookie.
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie = cookieName + "=" + cookieValue;
};

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'http://43.251.157.170/api',
  headers: {
    "X-CSRFToken": App.getCookie('csrftoken'),
  }

}); //used by ember-data
App.store = DS.Store.extend({
  revision: 12,
  adapter: 'App.ApplicationAdapter'
  //adapter: DS.LSAdapter.create()
});; // used by ember-data

module.exports = App;

