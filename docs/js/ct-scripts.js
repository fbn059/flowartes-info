/**
 * jooja-boilerplate js, customised from Genesis Sample js.
 *
 * @package jooja-boilerplate\JS
 * @author  StudioPress
 * @license GPL-2.0+
 */

var genesisSample = ( function( $ ) {
	'use strict';

	/**
	 * Adjust site inner margin top to compensate for sticky header height.
	 *
	 * @since 2.6.0
	 */
	var moveContentBelowFixedHeader = function() {
		var siteInnerMarginTop = 0;

		if( $('.site-header').css('position') === 'fixed' && !$('body').hasClass('transparent-header') ) {
			siteInnerMarginTop = $('.site-header').outerHeight();
		}

		$('.site-inner').css('margin-top', siteInnerMarginTop);
	},

	pageRowMargins = function() {
		if( $('body').hasClass('page-rows') ) {
			var windowW = $(window).width(),
			contentW = $('.content > .entry > .entry-content').width(),
			negativeMargin = ( windowW - contentW ) / 2;
			$('.page-row').css({
				'margin-left' : '-' + negativeMargin + 'px',
				'margin-right' : '-' + negativeMargin + 'px'
			});
		}
	},

	/* 
	 * Back to top button
	 * reference: http://mark-anthony.ca/adding-a-jquery-scroll-to-top-button-to-a-webpage/ 
	 */
	backToTop = function() {
		var offset = 200;
		var duration = 700;
		$(window).scroll(function() {
			if ($(this).scrollTop() > offset) {
				$('.backtotop').fadeIn(duration);
			} else {
				$('.backtotop').fadeOut(duration);
				}
		});
					
		$('.backtotop').click(function(event) {
			event.preventDefault();
			jQuery('html, body').animate({scrollTop: 0}, duration);
			return false;
		});
	},

	accordion = function() {
		$( '.accordion-wrap > .accordion-content' ).addClass( 'displaynone' );

		$('.accordion-wrap .accordion-toggle').click(function(e){
			e.preventDefault();
			$(this).closest('.accordion-wrap').find('.accordion-content').not(':animated').slideToggle();
			$(this).toggleClass('accordion-toggle-active');
		});
	},

	/*
	 * Dynamically adjust site-container when store-wide notice is in effect
	 */
    storeNoticeSiteContainer = function() {
    	$('body.woocommerce-demo-store .site-container').ready( function(){
			var noticeheight = $('p.demo_store').innerHeight();
			$('.site-container').css('margin-top',noticeheight);
		});
    },

    /*
     * Tabbed sections. Change div classes as needed
     * See: https://codepen.io/cssjockey/pen/jGzuK
     */
    pagetabs = function() {
		$("div.pagetabs-container > ul.tablinks li").click(function(e){
	        if (!$(this).hasClass('current')) {
	            var tab_id = $(this).attr('data-id');

				$('div.pagetabs-container > ul.tablinks li').removeClass('current');
				$('div.pagetabs-container > .tab-content').removeClass('current');

				$(this).addClass('current');

				$('div.pagetabs-container').find( '.tab-content[data-id=' + tab_id + ']' ).addClass('current');
	        }
	    });
    },

    /*
     * Tabbed sections. Change div classes as needed
     * See: https://codepen.io/cssjockey/pen/jGzuK
     */
    reviewtabs = function() {
		$("div.review-tabs > ul.tablinks li").click(function(e){
	        if (!$(this).hasClass('current')) {
	            var tab_id = $(this).attr('data-id');

				$('div.review-tabs > ul.tablinks li').removeClass('current');
				$('div.review-tabs > .tab-content').removeClass('current');

				$(this).addClass('current');

				$('div.review-tabs').find( '.tab-content[data-id=' + tab_id + ']' ).addClass('current');
	        }
	    });
    },

    circleEffect = function(){
    	var dirpath = vars.themeDirectory;
    	$.ajax({
    		type: "GET",
    		url: dirpath + '/images/circle.svg',
    		// error: function( xhr, statusText ){ console.log( 'Error: ' +statusText  ) },
    		success: function( data ) {
    			// Need to force data into a string.
    			// See: https://css-tricks.com/ajaxing-svg-sprite/
    			var svg = new XMLSerializer().serializeToString(data.documentElement);
    			$('.circle-effect a').each( function(){;
    				var $el = $(this);
    				$el.append( svg );
    				$el.hover(
    					// on mouseover
    					function(){
    						$el.removeClass('reverse-animation');
    						$el.addClass('play-animation') 
    					},
    					// on mouse leaving
    					function() { 
    						$el.removeClass('play-animation'); 
    						$el.addClass('reverse-animation'); 
    					});
    			});
    		}
    	});
    },

    /*
     * Minimize the header on scrolling down
     * See: http://callmenick.com/post/animated-resizing-header-on-scroll
     */
    minimizeHeader = function() {
        window.addEventListener('scroll', function(e){
            var distanceY = window.pageYOffset || document.documentElement.scrollTop,
                shrinkOn = 50,
                header = $('header.site-header');
            if (distanceY > shrinkOn) {
                //classie.add(header,"smaller");
                header.addClass('smaller');
            } else {
                if ( header.hasClass('smaller') ) {
                    //classie.remove(header,"smaller");
                    header.removeClass('smaller');
                }
            }
        });
    },

	responsiveMenuToggle = function(){
		if( $('#genesis-mobile-nav-primary').hasClass( 'activated' ) ){
			$('.site-header').addClass('responsive-menu-active');
		}
		else {
			$('.site-header').removeClass('responsive-menu-active');
		}
	},

	expandingGrid = function(){
		// Call Gridder
		if( $('.gridder').length ){
			$('.gridder').gridderExpander({
			    scroll: true,
			    scrollOffset: 100,
			    scrollTo: "listitem", // panel or listitem
			    animationSpeed: 400,
			    animationEasing: "easeInOutExpo",
			    showNav: true, // Show Navigation
			    nextText: "", // Next button text
			    prevText: "", // Previous button text
			    closeText: "", // Close button text
			    onStart: function () {
			        //Gridder Inititialized
			        //console.log('On Gridder Initialized...');
			    },
			    onContent: function () {
			        //Gridder Content Loaded
			        //console.log('On Gridder Expand...');
			    },
			    onClosed: function () {
			        //Gridder Closed
			        //console.log('On Gridder Closed...');
			    }
			});
		}
	},

	matchHeight = function() {
		if( $.isFunction( window.matchHeight ) ) {
			var windowW = $(window).width();
			if( windowW > 480 ) {
				$('.gridder .gridder-list').matchHeight();
			}
			else {
				$('.gridder .gridder-list').css( 'height', '' );
			}
		}
	},

    responsiveTable = function(){
    	$('table.responsive-table').basictable({
		    breakpoint: 960,
		    forceResponsive: true
		}); 
    },

    moveEventInfo = function() {
    	var windowW = $(window).width();
    	var eventInfoDiv = $('.single-tribe_events div.event-info').remove();
    	if( windowW < 960 ) {
    		eventInfoDiv.insertAfter('header.entry-header');
    	} else {
    		$('.entry-content div.event-info').remove();
    		$('.sidebar-primary').prepend( eventInfoDiv );
    	}
    },

    parallax = function(){
    	var windowWidth = $( window ).width();
    	var scrolltop = $(window).scrollTop();
    	$(".parallax").each(function(){
    		if( windowWidth > 860 ) {
    			$(this).parallaxScroll({ friction: 0.4 });
    			if( $(this).hasClass( 'slideshow-block' ) ){
    				/*if( scrolltop > 0 ){
    					$(this).css("top", (scrolltop/4) + "px");
    				}*/
    				$(this).find('.carousel').css("top", (scrolltop/4) + "px");
    			}
    		}
    		else {
    			$(this).parallaxScroll = null;
    		}
    	});
    },

    tribeEventsDisplay = function(){
    	if( $( '#eventDisplayArr' ).length ) {
    		var eventDisplayArr = $( '#eventDisplayArr' ).attr( 'data-displayoptions' );
    		if( eventDisplayArr.length ) {
    			
    			eventDisplayArr = JSON.parse( eventDisplayArr );
    			
    			var eventSubheading = eventDisplayArr.subtitle;
    			var showBar = eventDisplayArr.barDisplay;
    			
    			$('h2.events-subheader').empty();
    			$('h2.events-subheader').append( eventSubheading );

    			if( showBar === 'hide' ) {
    				$('#tribe-events-bar').css( 'display', 'none' );
    			} else {
    				$('#tribe-events-bar').css( 'display', 'block' );
    			}
    		}
    	}
    },

    pagesSideNav = function(){
    	var arr = [], elements = $('.page-side-nav-anchor'), index, $markup;
    	
    	Array.prototype.forEach.call( elements, element => {
    		arr.push( {
    			'label' : $(element).attr( 'data-pagesidenav' ),
    			'id' : $(element).attr( 'id' ),
    		} );
    	} );

    	if( arr.length ) {
    		
    		$markup = $( '<ul>', {"class":"page-side-nav"} );
    			Array.prototype.forEach.call( arr, val => {
    				$markup.append( $( '<li class="page-side-nav-item"><a href="#'+ $(val).attr('id') +'"><span class="label">'+ $(val).attr('label') +'</span></a></li>' ) );
    			} );
    		$( '.site-footer' ).after( $markup );
    	}

    	var offset = 200, duration = 500;
    	$(window).scroll(function(){
    		if ($(this).scrollTop() > offset) {
    			$('.page-side-nav').fadeIn(duration);
    		} else {
    			$('.page-side-nav').fadeOut(duration);
    			}
    	});

    	$('.page-side-nav li a').click( function(event) {
			event.preventDefault();
			var siteHeaderHeight = $('.site-header').height();
			$('html, body').animate({
				scrollTop: $($(this).attr('href')).offset().top - siteHeaderHeight
    			}, 500, 'linear' );
    	} );
    },

    woocommerceNoticeFix = function(){
    	var $storeNoticeDismiss = $('.woocommerce-store-notice__dismiss-link');
    	var $siteContainer = $( '.site-container' );
    	if( !$storeNoticeDismiss.is(':visible') ) {
    		$siteContainer.css('margin-top', '0');
    	}
    	$storeNoticeDismiss.click( function(event){
    		$siteContainer.css( 'margin-top', '0' );
    	} );
    },

	/**
	 * Initialize Genesis Sample.
	 *
	 * Internal functions to execute on document load can be called here.
	 *
	 * @since 2.6.0
	 */
	init = function() {
		// Run on first load.
		moveContentBelowFixedHeader();
		backToTop();
		accordion();
		pagetabs();
		reviewtabs();
		circleEffect();
		minimizeHeader();
		storeNoticeSiteContainer();
		pageRowMargins();
		expandingGrid();
		matchHeight();
		responsiveTable();
		moveEventInfo();
		parallax();
		tribeEventsDisplay();
		pagesSideNav();
		woocommerceNoticeFix();
		

		$( window ).scroll( function(){ parallax(); } );

		// Run after window resize.
		$( window ).resize(function() {
			minimizeHeader();
			moveContentBelowFixedHeader();
			storeNoticeSiteContainer();
			pageRowMargins();
			matchHeight();
			moveEventInfo();
			parallax();
			woocommerceNoticeFix();
		});

		$( document ).ajaxSuccess( function(){
			tribeEventsDisplay();
		} );

		$('#genesis-mobile-nav-primary').click( function(){responsiveMenuToggle();} );

		// Run after the Customizer updates.
		// 1.5s delay is to allow logo area reflow.
		if (typeof wp.customize != "undefined") {
			wp.customize.bind( 'change', function ( setting ) {
				setTimeout(function() {
					moveContentBelowFixedHeader();
				  }, 1500);
			});
		}
	};

	// Expose the init function only.
	return {
		init: init
	};

})( jQuery );

jQuery( window ).on( 'load', genesisSample.init );