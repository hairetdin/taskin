import Ember from 'ember';
import RSVP from 'rsvp';
import moment from 'moment';
//import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import Poolster from '../utils/poolster';

export default Ember.Route.extend(/*AuthenticatedRouteMixin,*/ {
  session: Ember.inject.service('session'),
  poolster: Poolster.create(),

  model(params) {
    if (this.get('session.isAuthenticated')){
      this.store.unloadAll('task');
      let current_user = this.get('session.data.authenticated.user.id');
      params.executor = current_user;
      //closed tasks will not show
      params.closed = 0;
      //return this.get('store').query('task', {executors__user: current_user});

      return RSVP.hash({
        params: params,
        //queryTasks: this.get('store').query('task', {executor: current_user, closed: 0}),
        queryTasks: this.get('store').query('task', params),
        tasks: this.store.peekAll('task'),
      });
    } else {
      return {};
    }

  },

  queryParams: {
    project: {
      refreshModel: true
    },
    page: {
      refreshModel: true
    },
    closed: {
      refreshModel: true
    },
    executor: {
      refreshModel: true
    }
  },

  startWatchingTime: function(controller){
    var self = this;
    controller.set('currentTime', moment());
    Ember.run.later(function(){
      self.startWatchingTime(controller);
      //console.log('startWatchingTime');
    }, 1000);
  },

  startWatchingTask: function(controller, user){
    var self = this;
    //let counterTask = this.store.query('task',{project:2}).then((result)=>{console.log(result.get('meta.count'));})
    //controller.set('counterTask', counterTask);

    //controller.set('model',this.get('store').query('task', {executors__user: user}));
    this.get('store').query('task', {executors__user: user});
    Ember.run.later(function(){
      self.startWatchingTask(controller, user);
      //console.log('startWatchingTime');
    }, 60000);
  },

  setupController: function(controller, model) {
    this.startWatchingTime(controller);
    // all your data is in model hash
    controller.set("model", model);
    //controller.set("session", this.session);
    if (this.get('session.isAuthenticated')){
      let current_user = this.get('session.data.authenticated.user.id');
      controller.set("user", this.store.findRecord('user',current_user));

      if (model.params.page === 1){
        //this.startWatchingTask(current_project, model.params);
        let store = this.get('store');
        this.set('poolster.onPoll', function(){
          //store.query('task', {project: current_project});
          store.query('task', model.params);
        });

        //console.log(this.get('poolster'));
        this.get('poolster').start();
        //controller.set('poolster', this.get('poolster'));
      }
    }
    //controller.set("newReview", model.newReview);
  },

  actions: {
    willTransition() {
      //console.log(this.get('poolster').stop());
      this.get('poolster').stop();
      //console.log(this.controller.get('poolster'));
    }
  }
});
