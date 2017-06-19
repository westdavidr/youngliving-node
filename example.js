var yl = require('./lib/youngliving').youngliving();

var login_options = {
  password: process.env.YL_PASSWORD,
  member_id: process.env.YL_MEMBER_ID
}

// Store credentials
yl.use(login_options);

var period = yl.get_period(); // or pass optional date parameter for a different period.
var per_page = 200, page_number = 1;

var handle_all_members = function (err, data) {
  
  if (data.pagination.next) {
    data.pagination.next(handle_all_members);
  }
}

yl.all_members(period, per_page, page_number, handle_all_members);
