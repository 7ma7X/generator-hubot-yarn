'use strict'

const Generator = require('yeoman-generator')
const chalk = require('chalk')
const npmName = require('npm-name')
const slugify = require('slugify')
const fs = require('fs')

function hubotStartSay () {
  return '                     _____________________________  ' + '\n' +
          '                    /                             \\ ' + '\n' +
          ' ' + chalk.cyan('  //\\') + '              |      Extracting input for    |' + '\n' +
          ' ' + chalk.cyan(' ////\\  ') + '  ' + chalk.yellow('_____') + '    |   self-replication process   |' + '\n' +
          ' ' + chalk.cyan('//////\\  ') + chalk.yellow('/') + chalk.cyan('_____') + chalk.yellow('\\') + '   \\                             / ' + '\n' +
          ' ' + chalk.cyan('=======') + chalk.yellow(' |') + chalk.cyan('[^_/\\_]') + chalk.yellow('|') + '   /----------------------------  ' + '\n' +
          '  ' + chalk.yellow('|   | _|___') + '@@' + chalk.yellow('__|__') + '                                ' + '\n' +
          '  ' + chalk.yellow('+===+/  ///     ') + chalk.cyan('\\_\\') + '                               ' + '\n' +
          '   ' + chalk.cyan('| |_') + chalk.yellow('\\ /// HUBOT/') + chalk.cyan('\\\\') + '                             ' + '\n' +
          '   ' + chalk.cyan('|___/') + chalk.yellow('\\//      /') + chalk.cyan('  \\\\') + '                            ' + '\n' +
          '         ' + chalk.yellow('\\      /   +---+') + '                            ' + '\n' +
          '          ' + chalk.yellow('\\____/    |   |') + '                            ' + '\n' +
          '           ' + chalk.cyan('| //|') + '    ' + chalk.yellow('+===+') + '                            ' + '\n' +
          '            ' + chalk.cyan('\\//') + '      |xx|                            ' +
          '\n'
}

function hubotEndSay () {
  return '                     _____________________________  ' + '\n' +
          ' _____              /                             \\ ' + '\n' +
          ' \\    \\             |   Self-replication process   |' + '\n' +
          ' |    |    ' + chalk.yellow('_____') + '    |          complete...         |' + '\n' +
          ' |__' + chalk.cyan('\\\\') + '|   ' + chalk.yellow('/') + chalk.cyan('_____') + chalk.yellow('\\') + '   \\     Good luck with that.    / ' + '\n' +
          '   ' + chalk.cyan('|//') + chalk.yellow('+  |') + chalk.cyan('[^_/\\_]') + chalk.yellow('|') + '   /----------------------------  ' + '\n' +
          '  ' + chalk.yellow('|   | _|___') + '@@' + chalk.yellow('__|__') + '                                ' + '\n' +
          '  ' + chalk.yellow('+===+/  ///     ') + chalk.cyan('\\_\\') + '                               ' + '\n' +
          '   ' + chalk.cyan('| |_') + chalk.yellow('\\ /// HUBOT/') + chalk.cyan('\\\\') + '                             ' + '\n' +
          '   ' + chalk.cyan('|___/') + chalk.yellow('\\//      /') + chalk.cyan('  \\\\') + '                            ' + '\n' +
          '         ' + chalk.yellow('\\      /   +---+') + '                            ' + '\n' +
          '          ' + chalk.yellow('\\____/    |   |') + '                            ' + '\n' +
          '           ' + chalk.cyan('| //|') + '    ' + chalk.yellow('+===+') + '                            ' + '\n' +
          '            ' + chalk.cyan('\\//') + '      |xx|                            ' +
          '\n'
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.defaultAdapter = 'campfire',
    this.defaultDescription = 'A simple helpful robot for your Company',

    // FIXME add documentation to these
    this.option('owner', {
      desc: 'Name and email of the owner of new bot (ie Example <user@example.com>)',
      type: String
    })

    this.option('name', {
      desc: 'Name of new bot',
      type: String
    })

    this.option('description', {
      desc: 'Description of the new bot',
      type: String
    })

    this.option('adapter', {
      desc: 'Hubot adapter to use for new bot',
      type: String
    })

    this.option('defaults', {
      desc: "Accept defaults and don't prompt for user input",
      type: Boolean
    })

    if (this.options.defaults) {
      this.options.owner = this.options.owner || this.determineDefaultOwner()
      this.options.name = this.options.name || this.determineDefaultName()
      this.options.adapter = this.options.adapter || this.defaultAdapter
      this.options.description = this.options.description || this.defaultDescription
    }

    if (this.options.owner === true) {
      this.env.error('Missing owner. Make sure to specify it like --owner="<owner>"')
    }

    if (this.options.name === true) {
      this.env.error('Missing name. Make sure to specify it like --name="<name>"')
    }

    if (this.options.description === true) {
      this.env.error('Missing description. Make sure to specify it like --description="<description>"')
    }

    if (this.options.adapter === true) {
      this.env.error('Missing adapter name. Make sure to specify it like --adapter=<adapter>')
    }
  }

  determineDefaultOwner() {
    let userName
    let userEmail

    if (typeof (this.user.git.name) === 'function') {
      userName = this.user.git.name()
    } else {
      userName = this.user.git.name
    }

    if (typeof (this.user.git.email) === 'function') {
      userEmail = this.user.git.email()
    } else {
      userEmail = this.user.git.email
    }

    if (userName && userEmail) {
      return userName + ' <' + userEmail + '>'
    } else {
      return 'User <user@example.com>'
    }
  }

  determineDefaultName() {
    return slugify(this.appname)
  }

  initializing() {
    this.pkg = require('../../package.json')

    this.externalScripts = [
      'hubot-diagnostics',
      'hubot-help',
      'hubot-redis-brain',
      'hubot-rules'
    ]
  }

  async prompting() {
    this.log(hubotStartSay())

    const done = this.async();

    const prompts = [];

    if (!this.options.owner) {
      prompts.push({
        name: 'botOwner',
        message: 'Owner',
        default: this.determineDefaultOwner()
      })
    }

    if (!this.options.name) {
      prompts.push({
        name: 'botName',
        message: 'Bot name',
        default: this.determineDefaultName()
      })
    }

    if (!this.options.description) {
      prompts.push({
        name: 'botDescription',
        message: 'Description',
        default: this.defaultDescription
      })
    }

    if (!this.options.adapter) {
      prompts.push({
        name: 'botAdapter',
        message: 'Bot adapter',
        default: this.defaultAdapter,
        validate: function (botAdapter) {
          const done = this.async()

          if (botAdapter === 'campfire') {
            done(null, true)
            return
          }

          const name = 'hubot-' + botAdapter
          npmName(name, function (error, unavailable) {
            if (error) throw error
            if (unavailable) {
              done("Can't find that adapter on NPM, try again?")
              return
            }

            done(null, true)
          })
        }
      })
    }

    await this.prompt(prompts).then((props) => {
      this.props = props;
      done();
    });
  }

  writing() {
    this.props.botOwner = this.options.owner || this.props.botOwner
    this.props.botName = this.options.name || this.props.botName
    this.props.botDescription = this.options.description || this.props.botDescription
    this.props.botAdapter = this.options.adapter || this.props.botAdapter

    try {
      fs.statSync('bin')
    } catch (e) {
      fs.mkdirSync('bin')
    }

    try {
      fs.statSync('scripts')
    } catch (e) {
      fs.mkdirSync('scripts')
    }

    this.template = function(template, destionation) {
      return this.fs.copyTpl(
        this.templatePath(template),
        this.destinationPath(destionation),
        this.props
      );
    }

    this.copy = function(template, destination) {
      return this.fs.copy(
        this.templatePath(template),
        this.destinationPath(destination)
      );
    }

    this.template('bin/hubot', 'bin/hubot')
    this.template('bin/hubot.cmd', 'bin/hubot.cmd')
    this.template('Procfile', 'Procfile')
    this.template('README.md', 'README.md')

    fs.writeFileSync('external-scripts.json', JSON.stringify(this.externalScripts, undefined, 2))

    this.copy('gitignore', '.gitignore')
    this.template('_package.json', 'package.json')
    this.copy('scripts/example.coffee', 'scripts/example.coffee')
  }

  end() {
    fs.chmodSync(this.destinationPath('bin/hubot'), '755')
    
    const packages = ['hubot'].concat(this.externalScripts).map(name => `${name}@latest`)

    if (this.props.botAdapter !== 'campfire') {
      packages.push('hubot-' + this.props.botAdapter)
    }

    this.yarnInstall(packages, {'binLinks': false})

    this.log(hubotEndSay())
  }
}
