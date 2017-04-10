import Ember from 'ember';
import Cookies from 'ember-cli-js-cookie';

export default Ember.Route.extend({
  session: Ember.inject.service('session'),
  i18n: Ember.inject.service(),
  ajax: Ember.inject.service(),
  model() {
    return this.store.createRecord('taskfile', {
      task: this.modelFor('tasks/show')
    });
  },

  actions: {
    saveFile() {
      let model = this.controller.get('model');
      let creator_id = this.get('session.data.authenticated.user.id');
      let creator = this.store.peekRecord('user', creator_id);
      model.set('creator', creator);
      let fileUpload = document.getElementById('file-field').files[0];

      /*
      model.set('attachment', file);
      model.save()
        .then(() => {
          this.transitionTo('taskfiles');
        }).catch(response => {
          console.log(response.errors);
        });
      */
      let host = this.store.adapterFor('application').get('host');
      let url = host + '/taskin/api/taskfiles/';
      //this.get('router.currentRouteName');

      let formData = new FormData();
      formData.append('task', model.get('task.id'));
      formData.append('creator', creator_id);
      formData.append('attachment', fileUpload);

      /*
      let req = new XMLHttpRequest();
      req.open('POST', url);
      let jwtoken = this.get('session.data.authenticated.access_token');
      req.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
      req.send(formData)
      this.transitionTo('taskfiles');
      */

      //let jwtoken = this.get('session.data.authenticated.access_token');
      let csrftoken = Cookies.get('csrftoken');

      Ember.$.ajax({
        url: url,
        type: 'POST',
        beforeSend: function(request) {
          request.setRequestHeader("X-CSRFToken", csrftoken);
          //request.setRequestHeader('Authorization', 'Bearer ' + jwtoken);
        },
        data: formData,
        processData: false,
        contentType: false
      })
        .then((response)=>{
          //console.log(response);
          this.store.findRecord('taskfile', response.id);
          this.transitionTo('taskfiles');
        })
        .catch(response => {
          //console.log(response);
          if (response.responseJSON.attachment) {
            this.controller.set('errorMessage', 'File do not selected');
          }
        });

    },

    willTransition(/*transition*/) {
      /*
      let model = this.controller.get('model');

      if (model.get('hasDirtyAttributes')) {
        let confirmation = confirm(this.get('i18n').t("Your changes haven't saved yet. Would you like to leave this form?"));

        if (confirmation) {
          model.rollbackAttributes();
          //this.store.unloadAll('taskboard/taskexecutor');
          //this.store.unloadAll('people/user');
        } else {
          transition.abort();
        }
      } else {
        return true;
      }
      */
      let model = this.controller.get('model');
      model.rollbackAttributes();
      return true;
    },
  }
});
