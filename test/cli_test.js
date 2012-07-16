'use strict';

var cli = require('../lib/cli.js');
var commands = require('../lib/commands.js');

exports.cli = {
  'routes registered': function (test) {
    // List commands
    test.equal(cli.router.routes.list['(.+)'].on, commands.list);
    test.equal(cli.router.routes.l['(.+)'].on, commands.list);

    // Add commands
    test.equal(cli.router.routes.add['([._a-zA-Z0-9-]+)']['(.+)'].on, commands.add);
    test.equal(cli.router.routes.a['([._a-zA-Z0-9-]+)']['(.+)'].on, commands.add);

    // Set commands
    test.equal(cli.router.routes.set['([._a-zA-Z0-9-]+)']['(.+)'].on, commands.set);
    test.equal(cli.router.routes.s['([._a-zA-Z0-9-]+)']['(.+)'].on, commands.set);

    // Remove commands
    test.equal(cli.router.routes.remove['(.+)'].on, commands.remove);
    test.equal(cli.router.routes.rm['(.+)'].on, commands.remove);
    test.equal(cli.router.routes.r['(.+)'].on, commands.remove);

    test.done();
  }
};
