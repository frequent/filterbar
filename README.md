#### filterbar - jQuery Mobile filter widget 

- Version:  0.1
- based:    JQM 1.4pre (next branch)
- status:   CSS and Qunit missing/need fix, still buggy.

A generic filter widget for jQuery Mobile based on the listview filter extension.

Demo: [here](http://www.franckreich.de/jqm/filter/demo.html)

How to use:  
Replace the `listview.filter.js` extension with the `filter.js`. To create a filter, just
add `data-filter="true"` to an element you like. The filter works with `listviews`, `tables`, 
`selects`, `controlgroups` and random elements (see the demo how to filter `<p>` tags for example).

Don't forget you can always provide a `data-filtertext` in case an element does not have an `text()`
for JQM to filter. For example, this should work:

````
  <div data-filter="true">
    <img src="1.jpg" alt="one" data-filtertext="image, one, foo, bar" />
    <img src="2.jpg" alt="two" data-filtertext="image, two, baz, bam" />
    <img src="3.jpg" alt="three" data-filtertext="image, three, cous, cous" />
  </div>
````

Changes:  
The wrapping `<form>`, which was never submitted is now a wrapping `div` so filter can be included inside forms.
Also, the `itemSelector` option can be set on multiple datasets, so it is possible to use a single filter for
multiple listviews or different types of elements (like a listview menu in a panel and a list of icons in the content section).

Options:  
Many options can be inherited from the element, the filter is declard on. The following options can be set:
- `data-theme` = theme to style the filter (default `a`)
- `data-placehodler` = text to display as placeholder (default `filter items...`)
- `data-reveal` = whether to use the normal filter or autocomplete (default `false`)
- `data-callback` = whether a custom callback is supplied (default `false`)
- `data-inset` = whether to inset the textinput (default `true`)
- `data-target` (NEW, classname, e.g. `data-target="foo"`) = element to which the filter should be appended
- `data-itemSelector` (NEW, classname, e.g. `data-itemSelector="foo"`) = wrapper of the elements to filter.



