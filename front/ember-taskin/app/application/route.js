import Ember from 'ember';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  session: Ember.inject.service('session'),
  init(){
    this.get('session').authenticate('authenticator:django');
  },

  titleToken: 'Projects',


  model() {
    return this.get('store').findAll('project');
  },

  setupController: function(controller, model) {
    controller.set("model", model);

    let sessionProjectName = this.get('session.data.project.name');
    //console.log(this.get('session.data.project.id'));
    let session = this.get('session');
    this.store.query('project', {'name':sessionProjectName}).then(
      function(currentProject){
        if (currentProject.get('length') == 0){
          session.set('data.project',{});
        }
      }
    );
  },
});
