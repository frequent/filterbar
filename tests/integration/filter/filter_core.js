/*
 * mobile filter unit tests
 */

// TODO split out into seperate test files
(function($){
	var home = $.mobile.path.parseUrl( location.href ).pathname + location.search,
		insetVal = $.mobile.filterbar.prototype.options.inset;

	$.mobile.defaultTransition = "none";

  module( "Listview Search Filter" );

	var searchFilterId = "#search-filter-test";

	asyncTest( "Filter downs results when the user enters information", function() {
		var $searchPage = $(searchFilterId);
		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage(searchFilterId);
			},
			function() {
        $searchPage.find('input').val('at');
        $searchPage.find('input').trigger('change');
				setTimeout(function() {
          deepEqual($searchPage.find('li.ui-screen-hidden').length, 2);
        start();
        }, 500);
      }
		]);
	});

	asyncTest( "Redisplay results when user removes values", function() {
		var $searchPage = $(searchFilterId);
		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage(searchFilterId);
			},
			function() {
				$searchPage.find('input').val('a');
				$searchPage.find('input').trigger('change');
				deepEqual($searchPage.find("li[style^='display: none;']").length, 0);
				start();
			}
		]);
	});

  asyncTest( "Filter works fine with \\W- or regexp-special-characters", function() {
    var $searchPage = $(searchFilterId);
    $.testHelper.pageSequence([
      function() {
        $.mobile.changePage(searchFilterId);
      },
      function() {
        $searchPage.find('input').val('*');
        $searchPage.find('input').trigger('change');
        setTimeout(function() {
          deepEqual($searchPage.find('li.ui-screen-hidden').length, 4);
          start();
        }, 500);
      }
    ]);
  });

	asyncTest( "event filterbarbeforefilter firing", function() {
		var $searchPage = $( searchFilterId );
		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage( searchFilterId );
			},

			function() {
				var beforeFilterCount = 0;
				$searchPage.on( "filterbarbeforefilter", function( e ) {
					beforeFilterCount += 1;
				});

        $searchPage.find( 'input' ).val( "a" );
        $searchPage.find( 'input' ).trigger('input');
        $searchPage.find( 'input' ).trigger('keyup');
        $searchPage.find( 'input' ).trigger('change');
        equal( beforeFilterCount, 1, "filterbarbeforefilter should fire only once for the same value" );
        $searchPage.find( 'input' ).val( "ab" );
				$searchPage.find( 'input' ).trigger('input');
				$searchPage.find( 'input' ).trigger('keyup');
        equal( beforeFilterCount, 2, "filterbarbeforefilter should fire twice since value has changed" );
        start();
			}
		]);
	});

	asyncTest( "Filter downs results and dividers when the user enters information", function() {
		var	$searchPage = $("#search-filter-with-dividers-test");
		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage("#search-filter-with-dividers-test");
			},

			// wait for the page to become active/enhanced
			function(){
				$searchPage.find('input').val('at');
				$searchPage.find('input').trigger('change');
				setTimeout(function() {
					//there should be four hidden list entries
					deepEqual($searchPage.find('li.ui-screen-hidden').length, 4);

					//there should be two list entries that are list dividers and hidden
					deepEqual($searchPage.find('li.ui-screen-hidden:jqmData(role=list-divider)').length, 2);

					//there should be two list entries that are not list dividers and hidden
					deepEqual($searchPage.find('li.ui-screen-hidden:not(:jqmData(role=list-divider))').length, 2);
					start();
				}, 500);
			}
		]);
	});

	asyncTest( "Redisplay results when user removes values", function() {
		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage("#search-filter-with-dividers-test");
			},

			function() {
				$('.ui-page-active input').val('a');
				$('.ui-page-active input').trigger('change');

				setTimeout(function() {
					deepEqual($('.ui-page-active input').val(), 'a');
					deepEqual($('.ui-page-active li[style^="display: none;"]').length, 0);
					start();
				}, 500);
			}
		]);
	});

	asyncTest( "Dividers are hidden when preceding hidden rows and shown when preceding shown rows", function () {
		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage("#search-filter-with-dividers-test");
			},

			function() {
				var $page = $('.ui-page-active');

				$page.find('input').val('at');
				$page.find('input').trigger('change');

				setTimeout(function() {
					deepEqual($page.find('li:jqmData(role=list-divider):hidden').length, 2);
					deepEqual($page.find('li:jqmData(role=list-divider):hidden + li:not(:jqmData(role=list-divider)):hidden').length, 2);
					deepEqual($page.find('li:jqmData(role=list-divider):not(:hidden) + li:not(:jqmData(role=list-divider)):not(:hidden)').length, 2);
					start();
				}, 500);
			}
		]);
	});

	asyncTest( "Inset List View should refresh corner classes after filtering", 4 * 2, function () {
		var checkClasses = function() {
			var $page = $( ".ui-page-active" ),
				$li = $page.find( "li:visible" );
			ok($li.first().hasClass( "ui-first-child" ), $li.length+" li elements: First visible element should have class ui-first-child");
			ok($li.last().hasClass( "ui-last-child" ), $li.length+" li elements: Last visible element should have class ui-last-child");
		};

		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage("#search-filter-inset-test");
			},

			function() {
				var $page = $('.ui-page-active');
				$.testHelper.sequence([
					function() {
						checkClasses();

						$page.find('input').val('man');
						$page.find('input').trigger('change');
					},

					function() {
						checkClasses();

						$page.find('input').val('at');
						$page.find('input').trigger('change');
					},

					function() {
						checkClasses();

						$page.find('input').val('catwoman');
						$page.find('input').trigger('change');
					},

					function() {
						checkClasses();
						start();
					}
				], 50);
			}
		]);
	});

  module( "Custom search filter", {
		setup: function() {
			var self = this;
			this._refreshCornersCount = 0;
			this._refreshCornersFn = $.mobile.filterbar.prototype._addFirstLastClasses;

			//this.startTest = function() {
			//	return this._refreshCornersCount === 1;
			//};

			// _refreshCorners is the last method called in the filter loop
			// so we count the number of times _refreshCorners gets invoked to stop the test
			$.mobile.filterbar.prototype._addFirstLastClasses = function() {
				self._refreshCornersCount += 1;
				self._refreshCornersFn.apply( this, arguments );
				//if ( self.startTest() ) {
        //  start();
				//}
			}
		},
		teardown: function() {
			$.mobile.filterbar.prototype._refreshCorners = this._refreshCornersFn;
		}
	});

	asyncTest( "Custom filterCallback should cause iteration on all list elements", function(){
		var listPage = $( "#search-customfilter-test" ),
			filterCallbackCount = 0,
			expectedCount = 2 * listPage.find("li").length;
		expect( 1 );

		//this.startTest = function() {
    //  if ( this._refreshCornersCount === 3 ) {
			//	equal( filterCallbackCount, expectedCount, "filterCallback should be called exactly "+ expectedCount +" times" );
			//}
			//return this._refreshCornersCount === 3;
		//}

		$.testHelper.pageSequence( [
			function(){
				//reset for relative url refs
				$.mobile.changePage( home );
			},

			function() {
				$.mobile.changePage( "#search-customfilter-test" );
			},

			function() {
				// set the listview instance callback
				listPage.find( "ul" ).filterbar( "option", "filterCallback", function( text, searchValue, item ) {
          filterCallbackCount += 1;
					return text.toString().toLowerCase().indexOf( searchValue ) === -1;
				});

				// trigger a change in the search filter
				listPage.find( "input" ).val( "at" ).trigger( "change" );
        // need to wait because of the filterdelay
        window.setTimeout(function() {
          listPage.find( "input" ).val( "atw" ).trigger( "change" );
        },500);
			},

      function() {
        equal( filterCallbackCount, expectedCount, "filterCallback should be called exactly "+ expectedCount +" times" );
        start();
      }
		]);
	});

  asyncTest( "filterCallback can be altered after widget creation", function(){
    var listPage = $( "#search-customfilter-test" ),
      filterChangedCallbackCount = 0,
      expectedCount = 1 * listPage.find("li").length,
      runtest;
    expect( 1 );

    $.testHelper.pageSequence( [
      function(){
        //reset for relative url refs
        $.mobile.changePage( home );
      },

      function() {
        $.mobile.changePage( "#search-customfilter-test" );
      },

      function() {
				// set the filter instance callback
        listPage.find( "ul" ).filterbar( "option", "filterCallback", function() {
          filterChangedCallbackCount += 1;
        });

        listPage.find( "input" ).val( "foo" )
        listPage.find( "input" ).trigger( "change" );
      },
      
      function() {
        equal( filterChangedCallbackCount, expectedCount, "filterChangeCallback should be called exactly "+ expectedCount +" times" );
        start();
      }
    ]);
  });

	module( "Search Filter with filterReveal==true" );

	asyncTest( "Filter downs results when the user enters information", 3, function() {
		var $searchPage = $( "#search-filter-reveal-test" );

		$.testHelper.pageSequence([
			function() {
				$.mobile.changePage( $searchPage );
			},

			function() {
				deepEqual( $searchPage.find( 'li.ui-screen-hidden' ).length, 22);
			},

			function() {
				$searchPage.find( 'input' ).val( 'a' );
        $searchPage.find( 'input' ).trigger('change');
        window.setTimeout(function() {
          deepEqual( $searchPage.find('li.ui-screen-hidden').length, 11);  
        },500);
			},

			function() {
				$searchPage.find( 'input' ).val( '' );
        $searchPage.find( 'input' ).trigger('change');
        window.setTimeout(function() {
          deepEqual( $searchPage.find('li.ui-screen-hidden').length, 22);
          start();
        },500);
			}
		]);
	});
  
})(jQuery);
