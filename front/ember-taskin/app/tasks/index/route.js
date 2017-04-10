import Ember from 'ember';
import RSVP from 'rsvp';

export default Ember.Route.extend({
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

  model(params) {
    this.store.unloadAll('task');
    let currentProjectId = this.modelFor('projects/show').get('id');
    params.project = currentProjectId;
    this.store.query('member', {project: this.get('model.project.id')});

    return RSVP.hash({
      params: params,
      queryTasks: this.get('store').query('task',
        params
        //{project: current_project, page: params.page, closed: params.closed, executor: params.executor}
      ),
      tasks: this.store.peekAll('task'),
    });
  },
});
