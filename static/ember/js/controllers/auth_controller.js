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


