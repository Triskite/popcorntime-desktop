(function (App) {
	'use strict';

	var OfflineBrowser = App.View.PCTBrowser.extend({
		collectionModel: App.Model.OfflineCollection,
		filters: {
			genres: App.Config.genres,
			sorters: App.Config.sorters
		}
	});

	App.View.OfflineBrowser = OfflineBrowser;
})(window.App);
