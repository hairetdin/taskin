import DS from 'ember-data';
import Ember from 'ember';

export default DS.Transform.extend({
  i18n: Ember.inject.service(),

  deserialize(serialized) {
    if (serialized === 'AD'){
      return this.get('i18n').t('Administrator');
    } else if (serialized === 'EX') {
      return this.get('i18n').t('Executor');
    } else if (serialized === 'WA') {
      return this.get('i18n').t('Watcher');
    }
    return serialized;
  },

  serialize(deserialized) {

    if (deserialized === 'Administrator'){
      return 'AD';
    } else if (deserialized === 'Executor') {
      return 'EX';
    } else if (deserialized === 'Watcher') {
      return 'WA';
    }

    return deserialized;
  }
});
