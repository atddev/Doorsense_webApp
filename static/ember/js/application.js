;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{}],2:[function(require,module,exports){
var App = require('./app');

App.Router.map(function() {
	this.resource('cpage', {path: '/cpage/'});
	this.resource('logglist', {path: '/logglist/'});
	this.resource('logg',{path:'/logg/:logg_id'});

});

App.CpageRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('logg');
	},
});

App.LogglistRoute = Ember.Route.extend({
	model: function(){
		return this.store.find('logg');
	},
});


App.CpageiRoute = Ember.Route.extend({
	model: function(params){
		return this.store.find('logg',params.logg_id);
	},
});


},{"./app":1}],3:[function(require,module,exports){
var AuthController = Ember.Controller.extend({
	username: '',
	password: '',
	remember: false,
	isLoggedIn: false,
	errorMsg: '',
	actions: {
		logout: function(){
			var remember = this.get('remember');
			var token = App.getCookie('csrftoken');
			var url = '../session/';
			var controllerObj = this;
			Ember.$.ajax({
			    url: url,
			    headers: {"X-CSRFToken": token},
			    type: "DELETE"
			})
			.then(function(){
				if(App.debug){console.log('Logout success.')}
				controllerObj.set('isLoggedIn', false);
				App.setSession('isLoggedIn',false);
				controllerObj.set('errorMsg', '')
					// wait .5 seconds and go to add submition page
							Bootstrap.GNM.push('تم تسجيل الخروج بنجاح', '');

						setTimeout(
 						 function() 
						  {
						    window.location.replace("/");
						  //  window.location.href = "/";
						  }, 500);
				if(!remember){
					App.setSession('username','');
					App.setLocal('password','');
					App.setLocal('remember',false);

				}
				
			})
			.fail(function(){
	    		if(App.debug){console.log('Logout failed')}
	    	});
		}
	},
	init: function(){
		if(App.getSession('username')||App.getLocal('username')){ this.set('username', App.getSession('username'))};
    	if(App.getLocal('password')!=""){ this.set('password', App.getLocal('password'))};
    	if(App.getSession('isLoggedIn')){ this.set('isLoggedIn', Ember.$.parseJSON(App.getSession('isLoggedIn')))};
    	if(App.getLocal('remember')){ this.set('remember', Ember.$.parseJSON(App.getLocal('remember')))};
	}
});

module.exports = AuthController;



},{}],4:[function(require,module,exports){
var CpageController = Ember.ArrayController.extend({

  sortAscending: false,
  sortProperties: ['id'],

});

module.exports = CpageController;


},{}],5:[function(require,module,exports){
var IndexController = Ember.Controller.extend({
	username: '',
	password: '',
	isLoggedIn: false,
	errorMsg: '',
	actions: {
		login: function(){
			var token = App.getCookie('csrftoken');
			var username = this.get('username');
			var password = this.get('password');
			var formData = 'csrfmiddlewaretoken='+token+'&username='+this.get('username')+'&password='+this.get('password');
			var url = '../session/'
			var controllerObj = this;
			Ember.$.ajax({
				headers: {"X-CSRFToken": token},
			    url: url,
			    type: "POST",
			    contentType:"application/x-www-form-urlencoded",
			    data: formData
			})
			.then(function(response){
				console.log(response)
				if(!response.session.success){//unsuccessful login
					if(App.debug){console.log('Login POST Request to ' +url+' was unsuccessful.')}
					if(App.debug){console.log('The error was: '+response.session.message)}
					controllerObj.set('errorMsg', response.session.message);
				}
				else{//successful login
					if(App.debug){console.log('Login POST Request to ' +url+' was successful.')}
					controllerObj.set('isLoggedIn', true);
					App.setSession('username',username);
					App.setSession('isLoggedIn',true);

						Bootstrap.GNM.push('Login Successful....', '');
						
						// wait 2 seconds and go to add submition page
						setTimeout(
 						 function() 
						  {
						    window.location.replace("/#/cpage");
						 //   window.location.href = "/#/cpage";
						  }, 500);

				}
			})
			.fail(function(){
	    		if(App.debug){console.log('Login failed')}
	    		controllerObj.set('isLoggedIn', false);
	    	});

		},
        },		
	init: function(){
		if(App.getSession('username')||App.getLocal('username')){ this.set('username', App.getSession('username'))};
    	if(App.getLocal('password')!=""){ this.set('password', App.getLocal('password'))};
    	if(App.getSession('isLoggedIn')){ this.set('isLoggedIn', Ember.$.parseJSON(App.getSession('isLoggedIn')))};
	}
});

module.exports = IndexController;



},{}],6:[function(require,module,exports){
var LoggController = Ember.ObjectController.extend({

});

module.exports = LoggController;


},{}],7:[function(require,module,exports){
var LogglistController = Ember.ArrayController.extend({
    sortProperties: ['vis_time'],
    sortAscending: false,

});

module.exports = LogglistController;


},{}],8:[function(require,module,exports){
// This file is auto-generated by `ember build`.
// You should not modify it.

var App = window.App = require('./config/app');
require('./templates');


App.AuthController = require('./controllers/auth_controller');
App.CpageController = require('./controllers/cpage_controller');
App.IndexController = require('./controllers/index_controller');
App.LoggController = require('./controllers/logg_controller');
App.LogglistController = require('./controllers/logglist_controller');
App.Logg = require('./models/logg');
App.VislistView = require('./views/vislist_view');

require('./config/routes');

module.exports = App;


},{"./config/app":1,"./config/routes":2,"./controllers/auth_controller":3,"./controllers/cpage_controller":4,"./controllers/index_controller":5,"./controllers/logg_controller":6,"./controllers/logglist_controller":7,"./models/logg":9,"./templates":10,"./views/vislist_view":11}],9:[function(require,module,exports){
var Logg = DS.Model.extend({
    event: DS.attr('string'),
    stime: DS.attr('string'),
    vis_date: DS.attr('string'),
    vis_time: DS.attr('string'),
});

module.exports = Logg;


},{}],10:[function(require,module,exports){

Ember.TEMPLATES['application'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', hashTypes, hashContexts, escapeExpression=this.escapeExpression;


  data.buffer.push("<div class=\"container\">	\n	<div class=\"clearfix\"></div>	\n\n	<div class=\"container\" style=\"padding-top: 10px;\">\n		");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "outlet", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	</div>\n	<div class=\"clearfix\"></div>\n	");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "bs-growl-notifications", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("\n	<footer>\n        <p>Door Sense</p>\n    </footer>\n</div>\n\n\n");
  return buffer;
  
});

Ember.TEMPLATES['cpage'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("    \n                                     ");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("tr")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "logg", "id", options) : helperMissing.call(depth0, "link-to", "logg", "id", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                                     ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("                     \n                                        <td><span class=\"badge\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "event", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span></td> \n                                        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "stime", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>  \n                                        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "vis_date", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\n                                        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "vis_time", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\n                                        ");
  return buffer;
  }

  data.buffer.push("  <div id=\"page-wrapper\">\n\n            <div class=\"container-fluid\">\n\n                <!-- Page Heading -->\n                <div class=\"row\">\n                    <div class=\"col-lg-12\">\n                        <h1 class=\"page-header\">\n                            Metawear Logs\n                        </h1>\n                        <ol class=\"breadcrumb\">\n                            <li class=\"active\">\n                                <i class=\"fa fa-fw fa-desktop\"></i>  <a href=\"/#/cpage\">Door Logs</a>\n                            </li>\n                        </ol>\n                    </div>\n                </div>\n                <!-- /.row -->\n                \n                    <div class=\"col-lg-8\">\n                        <h3>Last 10 logs</h3>\n                        <div class=\"table-responsive\">\n                            <table class=\"table table-bordered table-hover table-striped\">\n                                <thead>\n                                    <tr>\n                                        <th data-align=\"center\" > Event <span class=\"glyphicon glyphicon-user\"> </span>  </th>\n                                        <th data-align=\"center\" > Time  <span class=\"glyphicon glyphicon-eye-open\"> </span> </th>\n                                        <th data-align=\"center\"> Date <span class=\"glyphicon glyphicon-calendar\"> </span> </th>\n                                        <th> Server Time <span class=\"glyphicon glyphicon-time\"></span> </th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                     ");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers.each.call(depth0, "controller", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n                                </tbody>\n                            </table>\n                        </div>\n\n                         <br><br>\n                    </div>\n                \n                <!-- /.row -->\n\n\n            </div>\n            <!-- /.container-fluid -->\n\n        </div>\n        <!-- /#page-wrapper -->\n\n   \n    <!-- /#wrapper -->\n\n    <!-- jQuery -->\n    <script src=\"../static/js/jquery.js\"></script>\n\n    <!-- Bootstrap Core JavaScript -->\n    <script src=\"static/js/bootstrap.min.js\"></script>\n\n\n    <!-- Latest compiled and minified CSS -->\n<link rel=\"stylesheet\" href=\"//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.8.1/bootstrap-table.min.css\">\n\n<!-- Latest compiled and minified JavaScript -->\n<script src=\"//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.8.1/bootstrap-table.min.js\"></script>\n\n");
  return buffer;
  
});

Ember.TEMPLATES['index'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, hashTypes, hashContexts, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1, hashTypes, hashContexts, options;
  data.buffer.push("\n		\n		<form class=\"form\">\n			\n	    	<div class=\"form-group has-error\">\n	    		<label class=\"control-label\"><div class=\"alert alert-danger\" style=\"padding: 5px; margin-bottom: 0px;\" role=\"alert\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "errorMsg", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</div></label>\n	      		");
  hashContexts = {'class': depth0,'valueBinding': depth0,'action': depth0,'placeholder': depth0};
  hashTypes = {'class': "STRING",'valueBinding': "STRING",'action': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'class': ("form-control"),
    'valueBinding': ("username"),
    'action': ("login"),
    'placeholder': ("Username")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n	      	</div>\n	      	<div class=\"form-group has-error\">\n	      		");
  hashContexts = {'class': depth0,'valueBinding': depth0,'action': depth0,'placeholder': depth0,'type': depth0};
  hashTypes = {'class': "STRING",'valueBinding': "STRING",'action': "STRING",'placeholder': "STRING",'type': "STRING"};
  options = {hash:{
    'class': ("form-control"),
    'valueBinding': ("password"),
    'action': ("login"),
    'placeholder': ("Password"),
    'type': ("password")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n	      	</div>\n	      	<button type=\"button\" class=\"btn btn-primary btn-md\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Sign in</button>\n	     \n	      	\n\n	    </form>\n	");
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = '', stack1, hashContexts, hashTypes, options;
  data.buffer.push("\n	    <form class=\"form\">\n	    	<div class=\"form-group\">\n	      		");
  hashContexts = {'class': depth0,'valueBinding': depth0,'action': depth0,'placeholder': depth0};
  hashTypes = {'class': "STRING",'valueBinding': "STRING",'action': "STRING",'placeholder': "STRING"};
  options = {hash:{
    'class': ("form-control"),
    'valueBinding': ("username"),
    'action': ("login"),
    'placeholder': ("Username")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n	      	</div>\n	      	<div class=\"form-group\">\n	      		");
  hashContexts = {'class': depth0,'valueBinding': depth0,'action': depth0,'placeholder': depth0,'type': depth0};
  hashTypes = {'class': "STRING",'valueBinding': "STRING",'action': "STRING",'placeholder': "STRING",'type': "STRING"};
  options = {hash:{
    'class': ("form-control"),
    'valueBinding': ("password"),
    'action': ("login"),
    'placeholder': ("Password"),
    'type': ("password")
  },contexts:[],types:[],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.input || depth0.input),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "input", options))));
  data.buffer.push("\n	      	</div>\n	      	<button type=\"button\" class=\"btn btn-primary btn-md\" ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers.action.call(depth0, "login", {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push(">Sign in</button>\n	    </form>\n	");
  return buffer;
  }

  data.buffer.push(" <!-- Latest compiled and minified CSS -->\n<link rel=\"stylesheet\" href=\"//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.8.1/bootstrap-table.min.css\">\n\n<!-- Latest compiled and minified JavaScript -->\n<script src=\"//cdnjs.cloudflare.com/ajax/libs/bootstrap-table/1.8.1/bootstrap-table.min.js\"></script>\n\n	");
  hashTypes = {};
  hashContexts = {};
  stack1 = helpers['if'].call(depth0, "errorMsg", {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n\n");
  return buffer;
  
});

Ember.TEMPLATES['logg'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("    \n						<li class=\"list-group-item\"><strong>thing</strong><br> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "visitor_id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n                        ");
  return buffer;
  }

  data.buffer.push("\n\n        <div id=\"page-wrapper\">\n\n            <div class=\"container-fluid\">\n\n                <!-- Page Heading -->\n                <div class=\"row\">\n                    <div class=\"col-lg-12\">\n                        <h1 class=\"page-header\">\n                            Log Details\n                        </h1>\n                        <ol class=\"breadcrumb\">\n                            <li>\n                                <i class=\"fa fa-fw fa-desktop\"></i>  <a href=\"/#/cpage\">Metawear Logs</a>\n                            </li>\n                            <li class=\"active\">\n                                <i class=\"fa fa-file\"></i> Log\n                            </li>\n                        </ol>\n                    </div>\n                </div>\n                <!-- /.row -->\n						<ul class=\"list-group\">\n					 \n                       ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "visitor", "visitor_id", options) : helperMissing.call(depth0, "link-to", "visitor", "visitor_id", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n						<li class=\"list-group-item\"><strong>thingTwo</strong><br> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "inspec_id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n						<li class=\"list-group-item\"><strong>Date</strong><br> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "vis_date", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n						<li class=\"list-group-item\"><strong>Time</strong><br> ");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "vis_time", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</li>\n                        </ul>\n\n               \n                <!-- /.row -->\n\n\n\n\n            </div>\n            <!-- /.container-fluid -->\n\n        </div>\n        <!-- /#page-wrapper -->\n\n    <!-- jQuery -->\n    <script src=\"../static/js/jquery.js\"></script>\n\n    <!-- Bootstrap Core JavaScript -->\n    <script src=\"static/js/bootstrap.min.js\"></script>\n\n");
  return buffer;
  
});

Ember.TEMPLATES['logglist'] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var buffer = '', stack1, stack2, hashTypes, hashContexts, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, hashContexts, hashTypes, options;
  data.buffer.push("    \n                                     ");
  hashContexts = {'tagName': depth0};
  hashTypes = {'tagName': "STRING"};
  options = {hash:{
    'tagName': ("tr")
  },inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0],types:["STRING","ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  stack2 = ((stack1 = helpers['link-to'] || depth0['link-to']),stack1 ? stack1.call(depth0, "logg", "id", options) : helperMissing.call(depth0, "link-to", "logg", "id", options));
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                                     ");
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = '', hashTypes, hashContexts;
  data.buffer.push("                     \n                                        <td><span class=\"badge\">");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "visitor_id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</span></td> \n                                        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "inspec_id", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>  \n                                        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "vis_date", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\n                                        <td>");
  hashTypes = {};
  hashContexts = {};
  data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "vis_time", {hash:{},contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data})));
  data.buffer.push("</td>\n                                        ");
  return buffer;
  }

  data.buffer.push("       ");
  hashTypes = {};
  hashContexts = {};
  options = {hash:{},contexts:[depth0],types:["STRING"],hashContexts:hashContexts,hashTypes:hashTypes,data:data};
  data.buffer.push(escapeExpression(((stack1 = helpers.render || depth0.render),stack1 ? stack1.call(depth0, "auth", options) : helperMissing.call(depth0, "render", "auth", options))));
  data.buffer.push("\n\n\n        <div id=\"page-wrapper\">\n\n            <div class=\"container-fluid\">\n\n                <!-- Page Heading -->\n                <div class=\"row\">\n                    <div class=\"col-lg-12\">\n                        <h1 class=\"page-header\">\n                           Logs\n                        </h1>\n                        <ol class=\"breadcrumb\">\n                            <li>\n                                <i class=\"fa fa-fw fa-desktop\"></i>  <a href=\"/#/cpage\">Control Panel</a>\n                            </li>\n                            <li class=\"active\">\n                                <i class=\"fa fa-list\"></i> Logs\n                            </li>\n                        </ol>\n                    </div>\n                </div>\n\n                <!-- /.start TEST table -->\n\n<div class=\"col-sm-8\">\n<span class=\"counter pull-right\"></span>\n     <table class=\"table table-bordered table-hover table-striped\" data-toggle=\"table\" data-pagination=\"true\" data-search=\"true\">\n                                <thead>\n                                    <tr>\n                                        <th data-align=\"center\" > Event <span class=\"glyphicon glyphicon-user\"> </span>  </th>\n                                        <th data-align=\"center\" > Time  <span class=\"glyphicon glyphicon-eye-open\"> </span> </th>\n                                        <th data-align=\"center\"> Date <span class=\"glyphicon glyphicon-calendar\"> </span> </th>\n                                        <th> Server Time <span class=\"glyphicon glyphicon-time\"></span> </th>\n                                    </tr>\n                                </thead>\n                                <tbody>\n                                     ");
  hashTypes = {};
  hashContexts = {};
  stack2 = helpers.each.call(depth0, "controller", {hash:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],hashContexts:hashContexts,hashTypes:hashTypes,data:data});
  if(stack2 || stack2 === 0) { data.buffer.push(stack2); }
  data.buffer.push("\n                                </tbody>\n                            </table>\n                            <br><br>\n</div>\n\n\n            </div>\n            <!-- /.container-fluid -->\n\n        </div>\n        <!-- /#page-wrapper -->\n\n\n    <!-- jQuery -->\n    <script src=\"../static/js/jquery.js\"></script>\n\n    <!-- Bootstrap Core JavaScript -->\n    <script src=\"static/js/bootstrap.min.js\"></script>\n\n\n");
  return buffer;
  
});



},{}],11:[function(require,module,exports){
var VislistView = Ember.View.extend({

didInsertElement: function() {

     Ember.$.getScript('../static/ember/js/vendor/bs-for-ember/js/bootstrap-table.min.js');
  }

});

module.exports = VislistView;


},{}]},{},[8])
;