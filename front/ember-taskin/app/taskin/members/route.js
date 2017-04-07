import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),
  model() {
    return this.modelFor('taskin/projects/show').get('projectmember_set');
  },

  actions: {
    deleteMember(member_id) {
      let confirmation = confirm(this.get('i18n').t("Are you sure?"));
      let member = this.store.peekRecord('taskin/member', member_id);
      if (confirmation) {
        member.destroyRecord();
      }
    }
  }
});
