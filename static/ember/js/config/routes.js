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

