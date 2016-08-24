/**
 * Config file for our app domains.
 * 
 * this.collection represents all of our app domain (fields, actions, settings) information.
 *
 * This doesn't store the current domain, but rather all the data about each.
 * 
 * This data includes:
 * hotkeys
 * header view
 * subheader view
 * content view
 * 
 * @package Ninja Forms builder
 * @subpackage Main App
 * @copyright (c) 2015 WP Ninjas
 * @since 3.0
 */
define( [
	// Require our domain collection
	'models/app/domainCollection',
	// Require our fields domain files
	'views/fields/mainHeader',
	'views/fields/subHeader',
	'views/fields/mainContentFieldCollection',
	'views/fields/drawer/settingsTitle',
	// Require our actions domain files
	'views/actions/mainHeader', 
	'views/actions/subHeader',
	'views/actions/mainContent',
	// Require our settings domain files
	'views/advanced/mainHeader',
	'views/advanced/subHeader',
	'views/advanced/mainContent',
	// Empty View
	'views/app/empty',
	// FieldCollection: used by the default formContentData filter
	'models/fields/fieldCollection'
	], 
	function( 
		appDomainCollection,
		fieldsMainHeaderView,
		fieldsSubHeaderView,
		FieldsMainContentFieldCollectionView,
		fieldsSettingsTitleView,
		actionsMainHeaderView,
		actionsSubHeaderView,
		actionsMainContentView,
		settingsMainHeaderView,
		settingsSubHeaderView,
		settingsMainContentView,
		EmptyView,
		FieldCollection
	) {
	var controller = Marionette.Object.extend( {
		initialize: function() {
			/*
			 * Add our default formContentView filter.
			 */
			nfRadio.channel( 'formContent' ).request( 'add:viewFilter', this.defaultFormContentView, 10, this );
			
			/*
			 * Add our default formContentData filter.
			 */
			nfRadio.channel( 'formContent' ).request( 'add:loadFilter', this.defaultFormContentLoad, 10, this );

			/*
			 * Add our default formContentGutterView filters.
			 */
			nfRadio.channel( 'formContentGutters' ).request( 'add:leftFilter', this.defaultFormContentGutterView, 10, this );
			nfRadio.channel( 'formContentGutters' ).request( 'add:rightFilter', this.defaultFormContentGutterView, 10, this );

			// Define our app domains
			this.collection = new appDomainCollection( [
				{
					id: 'fields',
					nicename: 'Form Fields',
					hotkeys: {
						'Esc'				: 'close:drawer',
						'Ctrl+Shift+n'		: 'add:newField',
						'Ctrl+Shift+a'		: 'changeDomain:actions',
						'Ctrl+Shift+s'		: 'changeDomain:settings',
						'Alt+Ctrl+t'		: 'open:mergeTags',
						'up'				: 'up:mergeTags',
						'down'				: 'down:mergeTags',
						'Shift+return'		: 'return:mergeTags'
					},
					mobileDashicon: 'dashicons-menu',

					getMainHeaderView: function() {
						return new fieldsMainHeaderView();
					},

					getSubHeaderView: function() {
						return new fieldsSubHeaderView();
					},

					/**
					 * Get the formContent view that should be used in our builder.
					 * Uses two filters:
					 * 1) One for our formContentData
					 * 2) One for our formContentView
					 *
					 * If we don't have any view filters, we use the default formContentView.
					 * 
					 * @since  3.0
					 * @return formContentView backbone view.
					 */
					getMainContentView: function( collection ) {
						var formContentData = nfRadio.channel( 'settings' ).request( 'get:setting', 'formContentData' );
						
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var formContentViewFilters = nfRadio.channel( 'formContent' ).request( 'get:viewFilters' );
						
						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( formContentViewFilters, undefined );
						var callback = _.first( sortedArray );
						formContentView = callback();

						return new formContentView( { collection: formContentData } );
					},

					getSettingsTitleView: function( data ) {
						return new fieldsSettingsTitleView( data );
					},

					getGutterLeftView: function( data ) {
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var gutterFilters = nfRadio.channel( 'formContentGutters' ).request( 'get:leftFilters' );

						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( gutterFilters, undefined );
						var callback = _.first( sortedArray );
						gutterView = callback();

						return new gutterView(); 
					},

					getGutterRightView: function() {
						/*
						 * Check our fieldContentViewsFilter to see if we have any defined.
						 * If we do, overwrite our default with the view returned from the filter.
						 */
						var gutterFilters = nfRadio.channel( 'formContentGutters' ).request( 'get:rightFilters' );
						
						/* 
						* Get our first filter, this will be the one with the highest priority.
						*/
						var sortedArray = _.without( gutterFilters, undefined );
						var callback = _.first( sortedArray );
						gutterView = callback();

						return new gutterView(); 
					}

				},
				{
					id: 'actions',
					nicename: 'Emails & Actions',
					hotkeys: {
						'Esc'				: 'close:drawer',
						'Ctrl+Shift+n'		: 'add:newAction',
						'Ctrl+Shift+f'		: 'changeDomain:fields',
						'Ctrl+Shift+s'		: 'changeDomain:settings',
						'Alt+Ctrl+t'		: 'open:mergeTags',
						'up'				: 'up:mergeTags',
						'down'				: 'down:mergeTags',
						'Shift+return'		: 'return:mergeTags'
					},
					mobileDashicon: 'dashicons-external',

					getMainHeaderView: function() {
						return new actionsMainHeaderView();
					},

					getSubHeaderView: function() {
						return new actionsSubHeaderView();
					},
					
					getMainContentView: function() {
						var collection = nfRadio.channel( 'actions' ).request( 'get:collection' );
						return new actionsMainContentView( { collection: collection } );
					}
				},
				{
					id: 'settings',
					nicename: 'Advanced',
					hotkeys: {
						'Esc'				: 'close:drawer',
						'Ctrl+Shift+f'		: 'changeDomain:fields',
						'Ctrl+Shift+a'		: 'changeDomain:actions',
						'Alt+Ctrl+t'		: 'open:mergeTags',
						'up'				: 'up:mergeTags',
						'down'				: 'down:mergeTags',
						'Shift+return'		: 'return:mergeTags'
					},
					mobileDashicon: 'dashicons-admin-generic',

					getMainHeaderView: function() {
						return new settingsMainHeaderView();
					},

					getSubHeaderView: function() {
						return new settingsSubHeaderView();
					},
					
					getMainContentView: function() {
						var collection = nfRadio.channel( 'settings' ).request( 'get:typeCollection' );
						return new settingsMainContentView( { collection: collection } );
					}
				},
				{
					id: 'preview',
					nicename: 'Preview Form',
					classes: 'preview',
					dashicons: 'dashicons-visibility',
					mobileDashicon: 'dashicons-visibility',
					url: nfAdmin.previewurl
				}
			] );

			/*
			 * Send out a radio message with our domain config collection.
			 */
			nfRadio.channel( 'app' ).trigger( 'init:domainCollection', this.collection );

			/*
			 * Respond to requests to get the app domain collection.
			 */
			nfRadio.channel( 'app' ).reply( 'get:domainCollection', this.getDomainCollection, this );
			nfRadio.channel( 'app' ).reply( 'get:domainModel', this.getDomainModel, this );
		},

		getDomainCollection: function() {
			return this.collection;
		},

		getDomainModel: function( id ) {
			return this.collection.get( id );
		},

		defaultFormContentView: function( formContentData ) {
			return FieldsMainContentFieldCollectionView;
		},

		defaultFormContentLoad: function( formContentData ) {
			var fieldCollection = nfRadio.channel( 'fields' ).request( 'get:collection' );
	
			if ( 'undefined' == typeof formContentData || true === formContentData instanceof Backbone.Collection ) return fieldCollection;

        	var fieldModels = _.map( formContentData, function( key ) {
        		return fieldCollection.findWhere( { key: key } );
        	}, this );

        	return new FieldCollection( fieldModels );
		},

		defaultFormContentGutterView: function( formContentData ) {
			return EmptyView;
		}

	});

	return controller;
} );