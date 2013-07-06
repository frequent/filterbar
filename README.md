#### filterbar - jQuery Mobile filter widget 

- Version:  0.1.3
- based:    JQM 1.4pre (next branch)
- status:   CSS and Qunit missing/need fix, still buggy.

A generic filter widget for jQuery Mobile based on the listview filter extension.

Demo: [here](http://www.franckreich.de/jqm/filter/demo.html)

How to use:  
Replace the `listview.filter.js` extension with the `filter.js` file. To create a filter, just
add `data-filter="true"` to an element of your liking. The filter should work with `listviews`, `tables`, 
`selects`, `controlgroups` and random elements (see the demo how to filter `<p>` tags for example).

Don't forget you can always provide a `data-filtertext` in case an element does not have a `text()`
for JQM to filter. For example, this should work:

````
  <div data-filter="true">
    <img src="1.jpg" alt="one" data-filtertext="image, one, foo, bar" />
    <img src="2.jpg" alt="two" data-filtertext="image, two, baz, bam" />
    <img src="3.jpg" alt="three" data-filtertext="image, three, cous, cous" />
  </div>
````

### Changes:  

## 0.1.3
- added `data-mini` option.
- prefixed `reveal`, `placeholder`, `theme` and `callback` with **filter** for backwards compatability
- fixed default Qunit tests, now adding more... 

## 0.1.2
- 

## 0.1.1 (initial commit)
- Wrapping `<form>` is now a wrapping `div` so filters can be included inside forms.
- The `itemSelector` option can be set on multiple datasets, so it is possible to use a single filter for
multiple datasets (like filtering a list in a panel and a group of icons in the content section).

Options:  
Some options are inherited from the element the filter is declard upon. 

The following options can be set:
- `data-filterTheme` = theme to style the filter (default `a`)
- `data-filterPlacehodler` = text to display as placeholder (default `filter items...`)
- `data-filterReveal` = whether to use the normal filter or autocomplete (default `false`)
- `data-filterCallback` = whether a custom callback is supplied (default `false`)
- `data-inset` = whether to inset the textinput (default `true`)
- `data-target` (NEW, class, e.g. `data-target="foo"`) = where to appended the filter
- `data-itemSelector` (NEW, class, e.g. `data-itemSelector="foo"`) = wrapper(s) containing elements to filter.
- `data-mini` = make the input a mini-input



