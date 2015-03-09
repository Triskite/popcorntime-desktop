(function (App) {
	'use strict';
	var Q = require('q');
	var inherits = require('util').inherits;
	//var Thumbbot = require('thumbbot');
/*
	var querystring = require('querystring');
	var request = require('request');
	var URL = false;
*/


	var offlineFiles = function () {};
	offlineFiles.prototype.constructor = offlineFiles;

	var queryTorrents = function (filters) {
		return App.db.getBookmarks(filters)
			.then(function (data) {
					return data;
				},
				function (error) {
					return [];
				});
	};

	var thumbnailMake = function (items) {
		return;
	};

	var formatTest = function (items) {
		var offlineList = {'imdb_id':'tt2562232','image':'https://walter.trakt.us/images/movies/000/121/489/posters/thumb/ca5213ec51.jpg?1420099345','torrents':{'720p':{'url':'http://yts.re/torrent/download/51340689C960F0778A4387AEF9B4B52FD08390CB.torrent','magnet':'magnet:?xt=urn:btih:51340689C960F0778A4387AEF9B4B52FD08390CB&tr=udp://open.demonii.com:1337&tr=udp://tracker.coppersurfer.tk:6969','size':908775661,'filesize':'866.68 MB','seed':18891,'peer':2351,'health':'excellent'},'1080p':{'url':'http://yts.re/torrent/download/2302ECAB74207E7831055400563A61AA23025FE5.torrent','magnet':'magnet:?xt=urn:btih:2302ECAB74207E7831055400563A61AA23025FE5&tr=udp://open.demonii.com:1337&tr=udp://tracker.coppersurfer.tk:6969','size':1979157182,'filesize':'1.84 GB','seed':9905,'peer':2201,'health':'good'}},'title':'Birdman','genre':['Comedy','Drama'],'synopsis':'A fading actor best known for his portrayal of a popular superhero attempts to mount a comeback by appearing in a Broadway play. As opening night approaches, his attempts to become more altruistic, rebuild his career, and reconnect with friends and family prove more difficult than expected.','runtime':119,'year':2014,'subtitle':{'en':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36408.zip','pt-br':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36409.zip','da':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-37613.zip','nl':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36900.zip','fa':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36839.zip','fi':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36841.zip','el':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36415.zip','id':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-39074.zip','pt':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36481.zip','es':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36393.zip','tr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36485.zip','fr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36430.zip','sr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36522.zip','ar':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36593.zip','ro':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36432.zip','hr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36431.zip','he':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36916.zip','no':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-37699.zip','sv':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36483.zip','it':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36640.zip','ru':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-38631.zip','pl':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36748.zip','cs':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-39721.zip','sl':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36521.zip','hu':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36437.zip','bg':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36446.zip'},'backdrop':'https://walter.trakt.us/images/movies/000/121/489/fanarts/original/e4103f5545.jpg?1420099352','rating':8.3,'trailer':'http://youtube.com/watch?v=2bqh-UCY6Zg','provider':'Yts','_id':'3MIr1QiOYqxgulNu','type':'bookmarkedmovie'};
		var vidPath = path.join(App.settings.tmpLocation, 'thumbtest/video.mp4');
		//win.debug(vidPath);
		//var video = new Thumbbot(vidPath);
		//video.seek('00:01:24'); // take a snapshot at 01:24 
		//var thumbnail = yield video.save();
		return offlineList;

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
							deferred.resolve(data);
						}
					}, function (err) {
						// Show no longer exists on provider
						// Scrub bookmark and TV show
						// But return previous data one last time
						// So error to erase database doesn't show
						Database.deleteOffline(_data.offline_id);
						//Database.deleteTVShow(_data.offline_id);
						deferred.resolve(_data);
					});
			}

			movieList.push(deferred.promise);
		});

		return Q.all(movieList);
	};

	offlineFiles.prototype.extractIds = function (items) {
		return _.pluck(items, 'offline_id');
	};

	offlineFiles.prototype.fetch = function (filters) {
		return queryTorrents(filters)
			.then(formatTest);
			//.then(formatForPopcorn);
	};


/*

	var offlineTor = function () {


		
		offlineTor.super_.call(this);
	};

	inherits(offlineTor, App.Providers.Generic);

	var queryTorrents = function (filters) {

		var deferred = Q.defer();

		var params = {};
		params.sort = 'seeds';
		params.limit = '50';

		if (filters.keywords) {
			params.keywords = filters.keywords.replace(/\s/g, '% ');
		}

		if (filters.genre) {
			params.genre = filters.genre;
		}

		if (filters.order) {
			params.order = filters.order;
		}

		if (filters.sorter && filters.sorter !== 'popularity') {
			params.sort = filters.sorter;
		}

		var url = AdvSettings.get('tvshowAPI').url + 'shows/' + filters.page + '?' + querystring.stringify(params).replace(/%25%20/g, '%20');
		win.info('Request to EZTV API');
		win.debug(url);
		request({
			url: url,
			json: true
		}, function (error, response, data) {
			if (error || response.statusCode >= 400) {
				deferred.reject(error);
			} else if (!data || (data.error && data.error !== 'No movies found')) {
				var err = data ? data.error : 'No data returned';
				win.error('API error:', err);
				deferred.reject(err);
			} else {
				data.forEach(function (entry) {
					entry.type = 'show';
				});
				deferred.resolve({
					results: data,
					hasMore: true
				});
			}
		});

		return deferred.promise;
	};

	// Single element query
	var queryTorrent = function (torrent_id, old_data) {
		return Q.Promise(function (resolve, reject) {
			var url = AdvSettings.get('tvshowAPI').url + 'show/' + torrent_id;

			win.info('Request to EZTV API');
			win.debug(url);
			request({
				url: url,
				json: true
			}, function (error, response, data) {
				if (error || response.statusCode >= 400) {
					reject(error);
				} else if (!data || (data.error && data.error !== 'No data returned')) {

					var err = data ? data.error : 'No data returned';
					win.error('API error:', err);
					reject(err);

				} else {
					// we cache our new elem
					win.error(JSON.stringify(data));
					resolve(data);
				}
			});
		});
	};

	offlineTor.prototype.extractIds = function (items) {
		return _.pluck(items.results, 'imdb_id');
	};

	offlineTor.prototype.fetch = function (filters) {
		return queryTorrents(filters);
	};

	offlineTor.prototype.detail = function (torrent_id, old_data) {
		return queryTorrent(torrent_id, old_data);
	};

	App.Providers.Offline = offlineTor;

*/
	App.Providers.Offline = offlineFiles;

})(window.App);
