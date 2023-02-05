import Generator from 'yeoman-generator';

export const licenses = [
  { name: 'Apache 2.0', value: 'Apache-2.0' },
  { name: 'MIT', value: 'MIT' },
  { name: 'Mozilla Public License 2.0', value: 'MPL-2.0' },
  { name: 'BSD 2-Clause (FreeBSD) License', value: 'BSD-2-Clause-FreeBSD' },
  { name: 'BSD 3-Clause (NewBSD) License', value: 'BSD-3-Clause' },
  { name: 'Internet Systems Consortium (ISC) License', value: 'ISC' },
  { name: 'GNU AGPL 3.0', value: 'AGPL-3.0' },
  { name: 'GNU GPL 3.0', value: 'GPL-3.0' },
  { name: 'GNU LGPL 3.0', value: 'LGPL-3.0' },
  { name: 'Unlicense', value: 'Unlicense' },
  { name: 'No License (Copyrighted)', value: 'UNLICENSED' }
];

interface GitConfig {
  user: {
    name: string,
    email: string
  }
}

export default class GeneratorLicense extends Generator {
  gitc: GitConfig = {
    user: {
      name: 'nobody',
      email: 'nomail',
    }
  };


  name = '';
  email = '';
  website = '';
  license = '';

  constructor(args: any, opts: any) {
    super(args, opts);

    this.option('name', {
      type: String,
      description: 'Name of the license owner',
    });

    this.option('email', {
      type: String,
      description: 'Email of the license owner',
    });

    this.option('website', {
      type: String,
      description: 'Website of the license owner',
    });

    this.option('year', {
      type: String,
      description: 'Year(s) to include on the license',
      default: new Date().getFullYear()
    });

    this.option('licensePrompt', {
      type: String,
      description: 'License prompt text',
      default: 'Which license do you want to use?',
      hide: true,
    });

    this.option('defaultLicense', {
      type: String,
      description: 'Default license',
    });

    this.option('license', {
      type: String,
      description: 'Select a license, so no license prompt will happen, in case you want to handle it outside of this generator',
    });

    this.option('output', {
      type: String,
      description: 'Set the output file for the generated license',
      default: 'LICENSE'
    });

    this.option('publish', {
      type: Boolean,
      description: 'Publish the package',
    });
  }

  initializing() {
    this.gitc = {
      user: {
        name: this.user.git.name(),
        email: this.user.git.email()
      }
    };
  }

  async prompting() {
    const prompts = [
      {
        name: 'name',
        message: "What's your name:",
        default: this.options.name || this.gitc.user.name,
        when: this.options.name === undefined
      },
      {
        name: 'email',
        message: 'Your email (optional):',
        default: this.options.email || this.gitc.user.email,
        when: this.options.email === undefined
      },
      {
        name: 'website',
        message: 'Your website (optional):',
        default: this.options.website,
        when: this.options.website === undefined
      },
      {
        type: 'list',
        name: 'license',
        message: this.options.licensePrompt,
        default: this.options.defaultLicense,
        when:
          !this.options.license ||
          licenses.find((x) => x.value === this.options.license) === undefined,
        choices: licenses
      }
    ];

    return this.prompt(prompts).then((answers) => {
      this.name = answers.name;
      this.email = answers.email;
      this.website = answers.website;
      this.license = answers.license;
    });
  }

  writing() {
    // License file
    const filename = this.license + '.txt';
    let author = this.name.trim();
    if (this.email) {
      author += ' <' + this.email.trim() + '>';
    }

    if (this.website) {
      author += ' (' + this.website.trim() + ')';
    }

    this.fs.copyTpl(
      this.templatePath(filename),
      this.destinationPath(this.options.output),
      {
        year: this.options.year,
        author: author
      }
    );

    // Package
    if (!this.fs.exists(this.destinationPath('package.json'))) {
      return;
    }

    const pkg = this.fs.readJSON(this.destinationPath('package.json'), {}) as any;
    pkg.license = this.license;

    if (
      (this.options.publish === undefined && this.license === 'UNLICENSED') ||
      this.options.publish === false
    ) {
      pkg.private = true;
    }

    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
  }
};
