'use strict'

/* global describe, before, it */

var path = require('path')
var assert = require('yeoman-assert')
var helpers = require('yeoman-test')
var os = require('os')

describe('hubot:app', function (done) {
  it('generate a project', function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(os.tmpdir(), './temp-test'))
      .withPrompts({ botOwner: 'HelloRusk <k@hellorusk.net>'})
      .withPrompts({ botName: 'hubot-test'})
      .withPrompts({ botDescription: 'simple robbot'})
      .withPrompts({ botAdapter: 'slack' })
      .toPromise().then(function() {
        assert.file([
          'bin/hubot',
          'bin/hubot.cmd',
          'Procfile',
          'README.md',
          'external-scripts.json',
          '.gitignore',
          'package.json',
          'scripts/example.coffee'
        ])
      });
  })
})
