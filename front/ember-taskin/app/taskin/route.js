import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),

  titleToken: 'Проекты',

  init(){
    this.get('session').authenticate('authenticator:django');
  },

  model() {
    return this.get('store').findAll('taskin/project');
  },

  setupController: function(controller, model) {
    controller.set("model", model);

    let sessionProjectName = this.get('session.data.project.name');
    //console.log(this.get('session.data.project.id'));
    let session = this.get('session');
    this.store.query('taskin/project', {'name':sessionProjectName}).then(
      function(currentProject){
        if (currentProject.get('length') == 0){
          session.set('data.project',{});
        }
      }
    );
  },
});
