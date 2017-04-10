import Ember from 'ember';


export default Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set("model", model);
    //this.store.query('member', {project: model.get('project.id')}, {include: 'user.person'});
    //console.log(this.store.peekAll('people/user', {include: 'person'}));
  },
});
