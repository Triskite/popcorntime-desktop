(function (App) {
	'use strict';

	var test = [{'_id':'tt0285403','images':{'poster':'https://walter.trakt.us/images/shows/000/004/532/posters/original/ef39783a42.jpg','fanart':'https://walter.trakt.us/images/shows/000/004/532/fanarts/original/6c173f7802.jpg','banner':'https://walter.trakt.us/images/shows/000/004/532/banners/original/e35c4687de.jpg'},'imdb_id':'tt0285403','last_updated':1425415151019,'num_seasons':5,'slug':'scrubs','title':'Scrubs','tvdb_id':'76156','year':'2001'}];
		




/* works
	var OfflineCollection = App.Model.Collection.extend({

		model: App.Model.Movie,
		popid: 'offline_id',
		type: 'offline',
		getProviders: function () {

			return {
				//torrents: test,
				torrents: App.Config.getProvider('offline'),
				//			subtitle: App.Config.getProvider('subtitle'),
				//			metadata: App.Trakt
			};

		}



		

	});

	App.Model.OfflineCollection = OfflineCollection;
	*/

	var Q = require('q');

	var OfflineCollection = Backbone.Collection.extend({
		model: App.Model.Movie,

		initialize: function (models, options) {
			this.providers = {
				torrent: App.Providers.get('Offline')
			};

			options = options || {};
			options.filter = options.filter || new App.Model.Filter();

			this.filter = _.defaults(_.clone(options.filter.attributes), {
				page: 1
			});
			this.hasMore = true;

			Backbone.Collection.prototype.initialize.apply(this, arguments);
		},

		fetch: function () {
			var self = this;

			if (this.state === 'loading' && !this.hasMore) {
				return;
			}

			this.state = 'loading';
			self.trigger('loading', self);

			var torrent = this.providers.torrent;
			var torrentPromise = torrent.fetch(this.filter);
			//var torrentPromise = {'imdb_id':'tt2562232','image':'https://walter.trakt.us/images/movies/000/121/489/posters/thumb/ca5213ec51.jpg?1420099345','torrents':{'720p':{'url':'http://yts.re/torrent/download/51340689C960F0778A4387AEF9B4B52FD08390CB.torrent','magnet':'magnet:?xt=urn:btih:51340689C960F0778A4387AEF9B4B52FD08390CB&tr=udp://open.demonii.com:1337&tr=udp://tracker.coppersurfer.tk:6969','size':908775661,'filesize':'866.68 MB','seed':18891,'peer':2351,'health':'excellent'},'1080p':{'url':'http://yts.re/torrent/download/2302ECAB74207E7831055400563A61AA23025FE5.torrent','magnet':'magnet:?xt=urn:btih:2302ECAB74207E7831055400563A61AA23025FE5&tr=udp://open.demonii.com:1337&tr=udp://tracker.coppersurfer.tk:6969','size':1979157182,'filesize':'1.84 GB','seed':9905,'peer':2201,'health':'good'}},'title':'Birdman','genre':['Comedy','Drama'],'synopsis':'A fading actor best known for his portrayal of a popular superhero attempts to mount a comeback by appearing in a Broadway play. As opening night approaches, his attempts to become more altruistic, rebuild his career, and reconnect with friends and family prove more difficult than expected.','runtime':119,'year':2014,'subtitle':{'en':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36408.zip','pt-br':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36409.zip','da':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-37613.zip','nl':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36900.zip','fa':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36839.zip','fi':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36841.zip','el':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36415.zip','id':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-39074.zip','pt':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36481.zip','es':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36393.zip','tr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36485.zip','fr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36430.zip','sr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36522.zip','ar':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36593.zip','ro':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36432.zip','hr':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36431.zip','he':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36916.zip','no':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-37699.zip','sv':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36483.zip','it':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36640.zip','ru':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-38631.zip','pl':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36748.zip','cs':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-39721.zip','sl':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36521.zip','hu':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36437.zip','bg':'http://www.yifysubtitles.com/subtitle-api/birdman-yify-36446.zip'},'backdrop':'https://walter.trakt.us/images/movies/000/121/489/fanarts/original/e4103f5545.jpg?1420099352','rating':8.3,'trailer':'http://youtube.com/watch?v=2bqh-UCY6Zg','provider':'Yts','_id':'3MIr1QiOYqxgulNu','type':'bookmarkedmovie'};


			var idsPromise = torrentPromise.then(_.bind(torrent.extractIds, torrent));

			return Q.all([torrentPromise])
				.spread(function (movies) {

					// If a new request was started...
					_.each(movies, function (movie) {
						var id = movie.imdb_id;
					});

					if (_.isEmpty(movies)) {
						win.debug('hasMore = false');
						self.hasMore = false;
					}

					self.add(movies);
					self.trigger('sync', self);
					self.state = 'loaded';
					self.trigger('loaded', self, self.state);
				})
				.catch(function (err) {
					self.state = 'error';
					self.trigger('loaded', self, self.state);
					win.error(err.message, err.stack);
				});
		},

		fetchMore: function () {
			win.debug('fetchMore');
			//this.filter.page += 1;
			//this.fetch();
		}

	});
	App.Model.OfflineCollection = OfflineCollection;

})(window.App);