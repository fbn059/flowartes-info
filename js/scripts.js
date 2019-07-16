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

	schedule = function(){
		var csvData, 
		    jsonData,
		    scheduleData,
		    scheduleMarkup,
		    scheduleTableContainer = $("#schedule-table");

		$.ajax({
			url: 'data/schedule.csv',
			dataType: 'text',
			async: true,
			beforeSend: function(){
				scheduleTableContainer.addClass('loading');
			},
			success: function( data ) {
				csvData = data;
				jsonData = csvJSON( csvData );

				scheduleData = formatScheduleData( jsonData );

				scheduleMarkup = scheduleTable( scheduleData );

				scheduleTableContainer.html( scheduleMarkup );
			},
			error: function( data ){
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
				$priceTableContainer.addClass('loading');
			},
			success: function( data ) {
				
				csvData = data;
				jsonData = csvJSON( csvData );
				jsonData = addIDs( jsonData );
				
				pricetable = new Tabulator("#price-table", {
					data:jsonData,
					layout:"fitColumns",
					responsiveLayout:false, 
					tooltips:true,
					addRowPos:"top",
					history:true,
					movableColumns:true,
					resizableRows:true,
					columns:[
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
				$priceTableContainer.removeClass('loading');
			},
			error: function( data ){
			}
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
				$packageTableContainer.addClass('loading');
			},
			success: function( data ) {

				csvData = data;
				jsonData = csvJSON( csvData );
				jsonData = addIDs( jsonData );
				
				packagetable = new Tabulator("#package-table", {
					data:jsonData,
					layout:"fitColumns",
					responsiveLayout:false, 
					tooltips:true,
					addRowPos:"top",
					history:true,
					movableColumns:true,
					resizableRows:true,
					columns:[
						{ title:'Package Type', field:'type', visible:true, width:130, frozen:true },
						{ title:'Capoeira', field:'capoeira', sorter:"boolean", formatter:"tickCross", minWidth: 100, widthgrow:1 },
			            { title:'BJJ', field:'bjj', sorter:"boolean", formatter:"tickCross", width: 70, widthgrow:1 },
			            { title:'Music', field:'music', sorter:"boolean", formatter:"tickCross", width: 100, widthgrow:1 },
			            { title:'Capoeira Conditioning', field:'capoeira-conditioning', sorter:"boolean", formatter:"tickCross", width: 120, widthgrow:1 },
			            { title:'BJJ Conditioning', field:'bjj-conditioning', sorter:"boolean", formatter:"tickCross", width: 120, widthgrow:1 },
			            { title:'Movement', field:'movement', sorter:"boolean", formatter:"tickCross", width: 120, widthgrow:1 },
					],
					initialSort:[
						{column:"type", dir:"asc"},
					],
				} );
				$packageTableContainer.removeClass('loading');
			},
			error: function( data ){
			}
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
		schedule();
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

		// different linebreaks on different OS. Need to keep this in mind
		//https://stackoverflow.com/questions/5034781/js-regex-to-split-by-line
		var lines=csv.match(/[^\r\n]+/g);

		var result = [];

		var headers=lines[0].split(",");

		for(var i=1;i<lines.length;i++){

		  var obj = {};
		  var currentline=lines[i].split(",");

		  for(var j=0;j<headers.length;j++){
			  obj[headers[j]] = currentline[j];
		  }
		  if( !isEmpty(obj) ) {
		  	result.push(obj);
		  }

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

	function formatScheduleData( data ) {
		var arr = [],
		    day,
		    period = {};
		
		// Setup structure of schedule data array
		for(var i=0;i<7;i++){
			arr[i] = {
				"day": i,
				"periods" : [
				]
			};
		}

		// [
		//   {
		//     "day": "Day number",
		//     "periods": [
		//       {
		//         "start": "Period start time",
		//         "end": "Period end time",
		//         "title": "Period title",
		//         "backgroundColor": "Period background color",
		//         "borderColor":"Period border color",
		//         "textColor": "Period text color"
		//       }
		//     ]
		//   }
		// ]
		$.each( data, function( index, value ){

			if( value.dayNumber.length ){

				day = parseInt( value.dayNumber );
				period = value;
				arr[day].periods.push(period);
			}	
		} );
		return arr;
	}

	function scheduleTable( data ) {
		console.log(data);
		var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		var periods;
		var html = '';
		var day;
		var title, time;
		$.each( data, function( index, day ){
			periods = day.periods;
			day = days[parseInt(day.day)];
			html += '<div class="day">';
			html += '<p class="day-name">'+ day +'</p>';
			$.each( periods, function( i, period ){
				title = '<span class="period-title">'+ period.title +'</span><br/>';
				time = '<span class="period-time">'+ period.start + "–" + period.end +'</span>'
				html += '<li class="period" style="background-color:'+period.backgroundColor.replace(/\|/g,',')+'">'+ title + time +'</li>';
			} );
			html += '</div>';
		} );
		return $.parseHTML(html);
	}
	
	// https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
	function isEmpty(obj) {
	    for(var key in obj) {
	        if(obj.hasOwnProperty(key))
	            return false;
	    }
	    return true;
	}

}( jQuery ) );

jQuery( window ).on( 'load', faScripts.load );
