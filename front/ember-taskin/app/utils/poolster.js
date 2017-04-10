import Ember from 'ember';


export default Ember.Object.extend({

  interval: function() {
    return 60000; // Time between polls (in ms)
  }.property().readOnly(),

  isRun: false,

  // Schedules the function `f` to be executed every `interval` time.
  schedule: function(f) {
    return Ember.run.later(this, function() {
      f.apply(this);
      this.set('timer', this.schedule(f));
    }, this.get('interval'));
  },

  // Stops the pollster
  stop: function() {
    Ember.run.cancel(this.get('timer'));
    this.set('isRun', false);
  },

  // Starts the pollster, i.e. executes the `onPoll` function every interval.
  start: function() {
    this.set('timer', this.schedule(this.get('onPoll')));
    this.set('isRun', true);
  },

  onPoll: function(){
    // Issue JSON request and add data to the store
  },
});

//export default function poolster() {
//  return true;
//}
