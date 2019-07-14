var faScripts = ( function( $ ) {
	'use strict';

	var jsBodyClass = function() {
		$('body').addClass('js');
	},

	/*
     * Tabbed sections. Change div classes as needed
     * See: https://codepen.io/cssjockey/pen/jGzuK
     */
    tabs = function() {
    	var hash = getHashFilter();
    	var $activeHashLink = $('div.tabs-container > ul.tablinks > li > a[href="#' + hash + '"]' );

    	if( hash !== '' && $activeHashLink.length ) {
    		// Stop page from scrolling to anchor on page load.
    		// https://stackoverflow.com/questions/3659072/how-to-disable-anchor-jump-when-loading-a-page
    		setTimeout(function() {
    		    window.scrollTo(0, 0);
    		  }, 1);
    		$('div.tabs-container > ul.tablinks li').removeClass('active');
    		$('div.tabs-container > .tab').removeClass('active');
    		$activeHashLink.closest( 'li' ).addClass('active');
    		$('div.tabs-container').find( '.tab#' + hash ).addClass('active');
    	}

		$("div.tabs-container > ul.tablinks li a").click(function(event){
			event.preventDefault();
			var hash = $(this).attr('href');
			// Changing location hash would still scroll on Chrome.
			// See: http://www.ridgesolutions.ie/index.php/2012/09/11/html-javascript-setting-hash-without-browser-scrolling/
			// window.location.hash = hash;
			history.replaceState(null, null, hash);

			var $activeli = $(this).closest('li');

	        if (!$activeli.hasClass('active')) {

				$('div.tabs-container > ul.tablinks li').removeClass('active');
				$('div.tabs-container > .tab').removeClass('active');

				$activeli.addClass('active');

				$('div.tabs-container').find( '.tab' + hash ).addClass('active');
				$(document).trigger('activeTab');
	        }
	        return false;
	    });
    },

    dropdown = function(){
    	$('.dropdown > .dropdown-toggle').click( function(){

    		var $toggle = $(this),
    		    $content = $toggle.closest( '.dropdown' ).find( '.dropdown-content' );

    			$toggle.toggleClass( 'active' );
    			$content.slideToggle();
    		
    	});
    },

    scrollHeader = function() {
	    window.addEventListener('scroll', function(e){
	        var distanceY = window.pageYOffset || document.documentElement.scrollTop,
	            changeOn = 50,
	            header = $('.navbar');
	        if (distanceY > changeOn) {
	            header.addClass('headerscroll');
	        } else {
	            if ( header.hasClass('headerscroll') ) {
	                header.removeClass('headerscroll');
	            }
	        }
	    });
	},

	priceTable = function(){
		var csvData, jsonData, pricetable;
		var $priceTableContainer = $('#price-table');

		$.ajax({
			url: 'data/prices.csv',
			dataType: 'text',
			async: true,
			beforeSend: function(){
				$('#price-table').addClass('loading');
			},
			success: function( data ) {
				csvData = data;
				jsonData = csvJSON( csvData );
				jsonData = addIDs( jsonData ); // Need IDs for each row
				pricetable = new Tabulator("#price-table", {
					data:jsonData,           //load row data from array
					layout:"fitColumns",      //fit columns to width of table
					responsiveLayout:false, 
					tooltips:true,            //show tool tips on cells
					addRowPos:"top",          //when adding a new row, add it to the top of the table
					history:true,             //allow undo and redo actions on the table
					//pagination:"local",       //paginate the data
					//paginationSize:30,         //allow 7 rows per page of data
					movableColumns:true,      //allow column order to be changed
					resizableRows:true,       //allow row order to be changed
					columns:[               // Define table Columns
						{ title:'Package Type', field:'type', visible:false, frozen:true },
						{ title:'Package', field:'package', minWidth: 140, frozen:true, widthgrow:1 },
			            { title:'Adult (SGD $)', field:'adult', sorter:"number", width: 130, widthgrow:1 },
			            { title:'NSF (SGD $)', field:'nsf', sorter:"number", width: 130, widthgrow:1 },
			            { title:'Child (SGD $)', field:'child', sorter:"number", width: 130, widthgrow:1 },
					],
					initialSort:[             //set the initial sort order of the data
						{column:"type", dir:"asc"},
					],
					groupBy:"type",
					groupHeader:function(value, count, data, group){
					    return 'Package Type: ' +value;
					},
				} );
			},
			// error: function( data ){
			// 	console.log( data )
			// }
		});
		$(document).on('activeTab', function() {
		    pricetable.redraw();
		  });
	},

	packageTable = function(){
		var csvData, jsonData, packagetable;
		var $packageTableContainer = $('#package-table');

		$.ajax({
			url: 'data/packages.csv',
			dataType: 'text',
			async: true,
			beforeSend: function(){
				$('#package-table').addClass('loading');
			},
			success: function( data ) {
				csvData = data;
				jsonData = csvJSON( csvData );
				jsonData = addIDs( jsonData ); // Need IDs for each row
				packagetable = new Tabulator("#package-table", {
					data:jsonData,           //load row data from array
					layout:"fitColumns",      //fit columns to width of table
					responsiveLayout:false, 
					tooltips:true,            //show tool tips on cells
					addRowPos:"top",          //when adding a new row, add it to the top of the table
					history:true,             //allow undo and redo actions on the table
					//pagination:"local",       //paginate the data
					//paginationSize:30,         //allow 7 rows per page of data
					movableColumns:true,      //allow column order to be changed
					resizableRows:true,       //allow row order to be changed
					columns:[               // Define table Columns
						{ title:'Package Type', field:'type', visible:true, width:130, frozen:true },
						{ title:'Capoeira', field:'capoeira', sorter:"boolean", formatter:"tickCross", minWidth: 100, widthgrow:1 },
			            { title:'BJJ', field:'bjj', sorter:"boolean", formatter:"tickCross", width: 70, widthgrow:1 },
			            { title:'Music', field:'music', sorter:"boolean", formatter:"tickCross", width: 100, widthgrow:1 },
			            { title:'Capoeira Conditioning', field:'capoeira-conditioning', sorter:"boolean", formatter:"tickCross", width: 120, widthgrow:1 },
			            { title:'BJJ Conditioning', field:'bjj-conditioning', sorter:"boolean", formatter:"tickCross", width: 120, widthgrow:1 },
			            { title:'Movement', field:'movement', sorter:"boolean", formatter:"tickCross", width: 120, widthgrow:1 },
					],
					initialSort:[             //set the initial sort order of the data
						{column:"type", dir:"asc"},
					],
				} );
			},
			// error: function( data ){
			// 	console.log( data )
			// }
		});
		$(document).on('activeTab', function() {
		    packagetable.redraw();
		  });
	},

	/**
	 * Initialize Genesis Sample.
	 *
	 * Internal functions to execute on full page load.
	 *
	 * @since 2.6.0
	 */
	load = function() {

		jsBodyClass();
		tabs();
		dropdown();
		scrollHeader();
		priceTable();
		packageTable();
	};

	function getHashFilter() {
		var hashFilter = location.hash.substring(1);
		return decodeURIComponent( hashFilter );
	}

	// Expose the load and ready functions.
	return {
		load: load
	};

	// Convert csv data to json
	// https://gist.github.com/iwek/7154578#file-csv-to-json-js
	function csvJSON( csv ){
		// var csv is the CSV file with headers

		var lines=csv.split("\r");

		var result = [];

		var headers=lines[0].split(",");

		for(var i=1;i<lines.length;i++){

		  var obj = {};
		  var currentline=lines[i].split(",");

		  for(var j=0;j<headers.length;j++){
			  obj[headers[j]] = currentline[j];
		  }

		  result.push(obj);

		}

		return result; //JavaScript object
		//return JSON.stringify(result); //JSON
	}

	function addIDs( data ) {
		$.each( data, function( index, value ){
				data[index].id = index + 1;
		} );
		return data;
	}

}( jQuery ) );

jQuery( window ).on( 'load', faScripts.load );
