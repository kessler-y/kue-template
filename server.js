var kue = require('kue');
var redis = require('redis');
var config = require('./config');

kue.redis.createClient = function() {
  var client = redis.createClient(config.redis.port, config.redis.server);    
  return client;
};

var jobs = kue.createQueue();
var clusterize = require('clusterize');

clusterize(worker, master);

function master() {

  kue.app.listen(3000);

  jobs.create('email', {
    title: 'welcome email for tj'
  , to: 'tj@learnboost.com'
  , template: 'welcome-email'
  }).save();
}

function worker() {
  jobs.process('email', function(job, done){
    var pending = 5
      , total = pending;

    setInterval(function(){
      job.log('sending!');
      job.progress(total - pending, total);
      --pending || done();
    }, 1000);
  });
}

