(function (App) {
	'use strict';

	var Offline = Backbone.Model.extend({
		events: {
			'change:torrents': 'updateHealth',
		},

		idAttribute: 'offline_id',

		initialize: function () {
			this.updateHealth();
		},

		updateHealth: function () {
			
		}
	});

	App.Model.Offline = Offline;
})(window.App);