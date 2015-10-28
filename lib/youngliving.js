var fetch = require('node-fetch');
var url = require('url');
var fwk = require('fwk');

var youngliving = function(spec, my) {
  var _super = {};
  var that = {};

  my = my || {};
  my.host = 'https://www.youngliving.com/';
  my.port = 443;

  // ----------=----------- //
  // *** Public Methods *** //
  // ----------=----------- //

  use = function(login_opts) {
    if(typeof login_opts !== 'object') throw new Error("Wrong options.")

    my.auth = {
      memberId: login_opts.member_id,
      password: login_opts.password,
      token: null
    }
  }

  report = function(report_options, cb) {
    call('POST', '/vo.dlv.api/reportdata/v2/load', report_options, true, function(err, data) {
      if(data.pagination.currentpage < data.pagination.totalpages) {
        data.pagination.next = function(cb) {
          ++report_options.pagenumber;
          report(report_options, cb);
        }
      }

      cb(err, data);
    });
  }

  all_members = function(period, per_page, page_number, cb) {
    var report_options = {
      "reportid": "all",
      "periodid": 417,
      "sortby": "",
      "sortdesc": 1,
      "pagenumber": page_number,
      "filters": [
      ],
      "resultsperpage": per_page
    }

    report(report_options, cb);
  }

  // -----------=----------- //
  // *** Private Methods *** //
  // -----------=----------- //

  fetch_status = function(response) {
    if (response.ok) {
      return Promise.resolve(response)
    } else {
      var error = new Error(response.statusText || response.status)
      error.response = response
      return Promise.reject(error)
    }
  }

  call = function(method, path, params, auth, callback) {
    var full_url = url.resolve(my.host, path);
    var body = JSON.stringify(params);

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = body.length.toString();

    if(auth) {
      if(!my.auth.token) {
        return login(function(){ call(method, path, params, auth, callback); });
      } else {
          headers["AuthToken"] = my.auth.token;
      }
    }

    fetch(full_url, { method: method, body: body, headers: headers })
      .then(fetch_status)
      .then(function(res) {
          return res.json();
      }).then(function(json) {
          callback(null, json);
      }).catch(function(err) {
          callback(err);
      });
  }

  login = function(cb) {
    call('POST', '/api/accounts/token', my.auth, false, function(err, token) {
      if(!err) my.auth.token = new Buffer(JSON.stringify(token)).toString('base64');
      cb(token);
    });
  }

  get_period = function(date) {
    date = date instanceof Date ? date : new Date();
    return (date.getFullYear() * 12 + date.getMonth() + 1) - (2014 * 12 + 5) + 400;
  }

  fwk.method(that, 'get_period', get_period, _super);
  fwk.method(that, 'report', report, _super);
  fwk.method(that, 'all_members', all_members, _super);
  fwk.method(that, 'use', use, _super);

  return that;
}

exports.youngliving = youngliving;
