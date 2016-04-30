var VislistView = Ember.View.extend({

didInsertElement: function() {

     Ember.$.getScript('../static/ember/js/vendor/bs-for-ember/js/bootstrap-table.min.js');
  }

});

module.exports = VislistView;

