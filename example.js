var youngliving = require('./lib/youngliving').youngliving();

var login_options = {
  password: process.env.YL_PASSWORD,
  member_id: process.env.YL_MEMBER_ID
}

youngliving.use(login_options); // Store credentials

var report_options = {
  "reportid": "all",
  "periodid": 417,
  "sortby": "",
  "sortdesc": 1,
  "pagenumber": 1,
  "filters": [
    {
      "type": "level.less-or-equal",
      "value": 1
    }
  ],
  "resultsperpage": 100
}

youngliving.report(report_options, function(err, data){
  console.log("accounts", data.accounts);
  console.log(data.pagination.totalrows + ' members');
});
