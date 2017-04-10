import Ember from 'ember';
import RSVP from 'rsvp';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';


export default Ember.Route.extend(AuthenticatedRouteMixin, {

  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),

  model() {
    return RSVP.hash({
      project: this.store.createRecord('project'),
      creator: this.store.findRecord('user', this.get('session.data.authenticated.user.id')),
    });
  },

  actions: {

    saveProject(newProject) {
      //let creator_id = this.get('session.data.authenticated.user.id');
      let creator = this.controller.get('model.creator');
      //let person = creator.get('person')
      this.controller.set('model.project.creator', creator);
      newProject.save()
        .then((project)=> {
          //set new project as default
          this.get('session').set('data.project', {'id':project.id, 'name':project.get('name')});
        }).
        //then(() => this.transitionTo('project'));
        then(() => this.transitionTo('tasks', newProject.id));
    },

    willTransition(transition) {

      let model = this.controller.get('model.project');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

        if (confirmation) {
          model.rollbackAttributes();
        } else {
          transition.abort();
        }
      }
    }
  }
});
