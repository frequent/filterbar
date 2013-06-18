//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
//>>description: Adds a filterbar to an element collection
//>>label: Filter
//>>group: Widgets


define( [ "jquery", "./forms/textinput" ], function( jQuery ) {
//>>excludeEnd("jqmBuildExclude");
(function( $, undefined ) {
  "use strict";

  // TODO rename callback/deprecate and default to the item itself as the first argument
  var defaultCallback = function( text, searchValue /*, item */) {
    return text.toString().toLowerCase().indexOf( searchValue ) === -1;
  };

  $.widget("mobile.filterbar", $.mobile.widget, $.extend( {

      options: {
        filterTheme: null,
        filterPlaceholder: null,
        filterReveal: false,
        filterCallback: defaultCallback,
        filterInset: false,
        filterTarget: null,       // class, append filter to
        filterItemSelector: null  // class, wrapper for random filterable datasets
      },
      
      _onKeyUp: function(/* e */) {
        var search = this._search,
          o = this.options,
          el = this.element,
          val = search[ 0 ].value.toLowerCase(),
          filterItems = null,
          lastval = search.jqmData( "lastval" ) + "",
          childItems = false,
          itemtext = "",
          item, i,
          // Check if a custom filter callback applies
          isCustomcallback = o.filterCallback !== defaultCallback,
          getFilterableItems = o.filterItemSelector === undefined ? 
            el.find("> li, > option, tbody tr, tbody th, .ui-controlgroup-controls .ui-btn") :
              $("." + o.filterItemSelector).children(),
          fi = getFilterableItems,
          getAttrFixed = $.mobile.getAttribute;

        if ( lastval && lastval === val ) {
          // Execute the handler only once per value change
          return;
        }

        this._trigger( "beforefilter", "beforefilter", { input: search[ 0 ] } );

        // Change val as lastval for next execution
        search.jqmData( "lastval" , val );
        if ( isCustomcallback || val.length < lastval.length || val.indexOf( lastval ) !== 0 ) {

          // Custom filter callback applies or removed chars or pasted something totally different, check all items
          filterItems = getFilterableItems;
        } else {

          // Only chars added, not removed, only use visible subset
          filterItems = getFilterableItems.filter( ":not(.ui-screen-hidden)" );

          if ( !filterItems.length && o.filterReveal ) {
            filterItems = getFilterableItems.filter( ".ui-screen-hidden" );
          }
        }

        if ( val ) {

          // This handles hiding regular rows without the text we search for
          // and any list dividers without regular rows shown under it

          for ( i = filterItems.length - 1; i >= 0; i-- ) {
            item = $( filterItems[ i ] );
            itemtext = getAttrFixed(filterItems[ i ], "filtertext", true) || item.text();
            
            if ( item.is( "li:jqmData(role=list-divider)" ) ) {

              item.toggleClass( "ui-filter-hidequeue" , !childItems );

              // New bucket!
              childItems = false;

            } else if ( o.filterCallback( itemtext, val, item ) ) {

              //mark to be hidden
              item.toggleClass( "ui-filter-hidequeue" , true );
            } else {

              // There's a shown item in the bucket
              childItems = true;
            }
          }

          // Show items, not marked to be hidden
          filterItems
            .filter( ":not(.ui-filter-hidequeue)" )
            .toggleClass( "ui-screen-hidden", false );

          // Hide items, marked to be hidden
          filterItems
            .filter( ".ui-filter-hidequeue" )
            .toggleClass( "ui-screen-hidden", true )
            .toggleClass( "ui-filter-hidequeue", false );

        } else {

          //filtervalue is empty => show all
          filterItems.toggleClass( "ui-screen-hidden", !!o.filterReveal );
        }

        this._addFirstLastClasses( fi, this._getVisibles( fi, false ), false );
      },
      
      _create: function () {
        var el = this.element[0],
          o = this.options,
          getAttrFixed = $.mobile.getAttribute;

        // only read options on create
        o.filterTheme = getAttrFixed(el, "theme", true) || "a";
        o.filterPlaceholder = getAttrFixed(el, "placeholder", true) || "Filter items...";
        o.filterTarget = getAttrFixed(el, "target", true);
        o.filterInset = getAttrFixed(el, "inset", true) || false;
        o.filterItemSelector = getAttrFixed(el, "itemSelector", true) || undefined;

        this.refresh(true);
      },
      
      refresh: function (create) {
        var el, wrapper, search, items,
          o = this.options;

        el = this.element;

        // filterable elements
        items = o.filterItemSelector === undefined ?
          el.find("> li, > option, tbody tr, tbody th, .ui-controlgroup-controls .ui-btn") :
            $("." + o.filterItemSelector).children();
        
        if ( o.filterReveal ) {
          items.addClass( "ui-screen-hidden" );
        }

        // use a <div> to allow filters inside forms (we never submit anyway)
        wrapper = $( "<div>", {
          "class": "ui-filter ",
          "role": "search"
        });
        search = $( "<input>", {
          placeholder: o.filterPlaceholder
        })
        .attr( "data-" + $.mobile.ns + "type", "search" )
        .jqmData( "lastval", "" )
        .appendTo( wrapper )
        .textinput();

        this._on( search, { keyup: "_onKeyUp", change: "_onKeyUp", input: "_onKeyUp" } );

        $.extend( this, {
          _search: search
        });

        if ( o.filterInset ) {
          wrapper.addClass( "ui-filter-inset" );
        }

        if ( o.filterTarget) {
          wrapper.prependTo( $("." + o.filterTarget +"") );
        } else {
          wrapper.insertBefore( el );
        }
      }
  }, $.mobile.behaviors.addFirstLastClasses ) );

  $.mobile.filterbar.initSelector = ':jqmData(filter="true")';

  //auto self-init widgets
  $.mobile._enhancer.add( "mobile.filterbar" );

})( jQuery );
//>>excludeStart("jqmBuildExclude", pragmas.jqmBuildExclude);
});
//>>excludeEnd("jqmBuildExclude");
