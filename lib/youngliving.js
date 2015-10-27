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
    callAPI('POST', '/vo.dlv.api/reportdata/v2/load', report_options, true, cb);
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

  callAPI = function(method, path, params, auth, callback) {
    var full_url = url.resolve(my.host, path);
    var make_request = true;

    var body = JSON.stringify(params);

    var headers = {};
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = body.length.toString();

    if(auth) {
      if(!my.auth.token) {
        login(function(){ callAPI(method, path, params, auth, callback); });
        make_request = false;
      } else {
          headers["AuthToken"] = my.auth.token;
      }
    }

    if(make_request) {
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
  }

  login = function(cb) {
    callAPI('POST', '/api/accounts/token', my.auth, false, function(err, token) {
      if(!err) my.auth.token = new Buffer(JSON.stringify(token)).toString('base64');
      cb(token);
    });
  }

  fwk.method(that, 'report', report, _super);
  fwk.method(that, 'use', use, _super);

  return that;
}

exports.youngliving = youngliving;
