youngliving-node
================

NodeJS client library for the Young Living Essential Oils API

## Installation

<!-- `npm install youngliving-node` -->
Require `./lib/youngliving.js`

NPM package *coming soon* 

## Setup and Authentication
```javascript
var yl = require('youngliving-node').youngliving();

yl.use({ member_id: 'YOUR_YL_MEMBER_ID',
         password: 'YOUR_YL_PASSWORD' });
```

##Using the API

Once you've setup the API and/or authenticated, here is the full list of what you can do:

```javascript
var period = yl.get_period(); // or pass optional date parameter for a different period.
var per_page = 200, page_number = 1;

var handle_all_members = function(err, data) {
    // do something with data object.
    
    // if there are more results, this will automatically fetch them
    if(data.pagination.next) {
      data.pagination.next(handle_all_members);
    }
}

yl.all_members(period, per_page, page_number, report_callback);

```