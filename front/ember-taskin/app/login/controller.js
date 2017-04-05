// app/login/controller.js
import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),

  actions: {
    authenticate() {
      let { identification, password } = this.getProperties('identification', 'password');
      this.get('session').authenticate('authenticator:django', identification, password)
      //this.get('session').authenticate('authenticator:django')
        .then(() => {
          //console.log('Success! authenticated with token: ' + this.get('session.data.authenticated.access_token'));
          this.transitionToRoute('taskin');
        }, (err) => {
          //alert('Error obtaining token: ' + err.responseText);
          alert('Ошибка входа: ' + err.error);
          this.transitionToRoute('login');
        })
        .catch((reason) => {
          this.set('errorMessage', reason.error || reason);
        });
    },

    invalidateSession() {
      this.get('session').invalidate();
    }
  }
});
