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


