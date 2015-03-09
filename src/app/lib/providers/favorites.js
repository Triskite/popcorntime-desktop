(function (App) {
	'use strict';
	var Q = require('q');

	var Favorites = function () {};
	Favorites.prototype.constructor = Favorites;

	var queryTorrents = function (filters) {
		return App.db.getBookmarks(filters)
			.then(function (data) {
					//win.error(JSON.stringify(data));
					return data;
				},
				function (error) {
					return [];
				});
	};

	var display = function (movieList) {
		win.error(JSON.stringify(movieList));

	};
	var formatForPopcorn = function (items) {
		var movieList = [];

		items.forEach(function (movie) {

			var deferred = Q.defer();
			// we check if its a movie
			// or tv show then we extract right data
			if (movie.type === 'movie') {
				// its a movie
				Database.getMovie(movie.imdb_id)
					.then(function (data) {
							data.type = 'bookmarkedmovie';
							if (/slurm.trakt.us/.test(data.image)) {
								data.image = data.image.replace(/slurm.trakt.us/, 'walter.trakt.us');
							}
							//win.error(JSON.stringify(data));
							deferred.resolve(data);
						},
						function (err) {
							deferred.reject(err);
						});
			} else {
				// its a tv show
				var _data = null;
				Database.getTVShowByImdb(movie.imdb_id)
					.then(function (data) {
						data.type = 'bookmarkedshow';
						data.imdb = data.imdb_id;
						// Fallback for old bookmarks without provider in database
						if (typeof (data.provider) === 'undefined') {
							data.provider = 'Eztv';
						}
						// This is an old boxart, fetch the latest boxart
						if (/slurm.trakt.us/.test(data.images.poster)) {
							// Keep reference to old data in case of error
							_data = data;
							var provider = App.Providers.get(data.provider);
							return provider.detail(data.imdb_id, data);
						} else {
							data.image = data.images.poster;
							//win.error(JSON.stringify(data));
							deferred.resolve(data);
							return null;
						}
					}, function (err) {
						deferred.reject(err);
					}).then(function (data) {
						if (data) {
							// Cache new show and return
							Database.updateTVShow(data);
							data.type = 'bookmarkedshow';
							data.imdb = data.imdb_id;
							data.image = data.images.poster;
							//win.error(JSON.stringify(data));
							deferred.resolve(data);
						}
					}, function (err) {
						// Show no longer exists on provider
						// Scrub bookmark and TV show
						// But return previous data one last time
						// So error to erase database doesn't show
						Database.deleteBookmark(_data.imdb_id);
						Database.deleteTVShow(_data.imdb_id);
						deferred.resolve(_data);
					});
			}
			//win.error(JSON.stringify(deferred.promise));
			movieList.push(deferred.promise);
			//win.error(JSON.stringify(deferred.promise));

		});
		//win.error(JSON.stringify(Q.all(movieList)));

		return Q.all(movieList)
			.then(display(JSON.stringify(movieList[0])));
	};

	Favorites.prototype.extractIds = function (items) {
		return _.pluck(items, 'imdb_id');
	};

	Favorites.prototype.fetch = function (filters) {
		return queryTorrents(filters)
			.then(formatForPopcorn);
	};

	App.Providers.Favorites = Favorites;

})(window.App);
