import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin,{
  session: Ember.inject.service('session'),
  /* init work befor session.isAuthenticated, so beforeModel used
  init(){
    //this.get('session').authenticate('authenticator:django');
    if (!(this.get('session.isAuthenticated'))){
      //console.log('aplication init authentication work', this.get('session.data'));
      //this.get('session').authenticate('authenticator:django')
      .then(()=>{
        //console.log('aplication init auth success');
        //this.refresh();
      }, (reject) => {
        //console.log('reject');
        //this.transitionTo('login');
        //window.location.replace("/taskin/api-auth/login/?next=/taskin/");
      })
    }
  },
  */

  titleToken: 'Projects',

  beforeModel: function(){
    if (!(this.get('session.isAuthenticated'))){
      //try to authenticate with backend's session, if session is not authenticated
      this.get('session').authenticate('authenticator:django');
    }
  },


  model() {
    if (this.get('session.isAuthenticated')){
      return this.get('store').findAll('project');
    } else {
      return {}
    }
  },

  setupController: function(controller, model) {
    if (this.get('session.isAuthenticated')){
      controller.set("model", model);
      let sessionProjectName = this.get('session.data.project.name');
      let session = this.get('session');
      this.store.query('project', {'name':sessionProjectName}).then(
        function(currentProject){
          if (currentProject.get('length') == 0){
            session.set('data.project',{});
          }
        }
      );
    }
  },
});
