/**
 * =============================================================================
 * APPLICATION_NAME
 *
 * (c) Copyright 2015 Stefan Kolb <dev@stefankolb.de>
 * =============================================================================
 */

'use strict';

module.exports = function(grunt) {

  /**
   * ***************************************************************************
   * EXTERNAL MODULE IMPORT
   * ***************************************************************************
   */

  var _merge = require('lodash.merge');

  // Note: Install new modules by adding them to 'package.json' file located
  //       at the root level and do 'npm install' in the terminal afterwards.

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');


  /**
   * ***************************************************************************
   * INITIALIZATION
   * ***************************************************************************
   */

  var _appConfig;

  // Load application specific configuration from app.config.js file,
  // if it exists
  if (grunt.file.exists('./app.config.js')) {
    _appConfig = require('./app.config.js');
  } else {
    grunt.fail.warn('Could not load application specific configuration from ' +
      '"app.config.js". File does not exists!');
  }

  var _pathAssets = 'assets';
  var _pathAssetsScripts = 'assets/scripts';


  /**
   * ***************************************************************************
   * TASK CONFIGURATION
   * ***************************************************************************
   */

  var _taskConfig = {

    pkg: grunt.file.readJSON('package.json'),


    // -------------------------------------------------------------------------
    // CLEAN
    // -------------------------------------------------------------------------

    clean: {

      develop: [
        '<%= dir.develop %>'
      ],

      compile: [
        '<%= dir.compile %>'
      ]

    },


    // -------------------------------------------------------------------------
    // COMPASS / SASS / SCSS
    // -------------------------------------------------------------------------

    compass: {

      develop: {
        options: {
          environment: 'development',
          outputStyle: 'compact',
          sassDir: '<%= files_internal.sass.dir_base %>',
          specify: '<%= files_internal.sass.file_base %>',
          cssDir: '<%= dir.develop %>/' + _pathAssets +'/',
          raw: 'preferred_syntac = :scss\n'
        }
      },

      compile: {
        options: {
          environment: 'production',
          outputStyle: 'compact',
          sassDir: '<%= files_internal.sass.dir_base %>',
          specify: '<%= files_internal.sass.file_base %>',
          cssDir: '<%= dir.compile%>/' + _pathAssets +'/',
          raw: 'preferred_syntac = :scss\n'
        }
      }

    },


    // -------------------------------------------------------------------------
    // CONCATINATION
    // -------------------------------------------------------------------------

    concat: {

      compile: {
        src: [
          '<%= files_internal.scripts %>'
        ],
        dest: '<%= dir.compile %>/' + _pathAssetsScripts + '/<%= pkg.name %>.js'
      }

    },


    // -------------------------------------------------------------------------
    // COPY
    // -------------------------------------------------------------------------

    copy: {

      develop: {
        files: [
          {
            cwd: '.',
            src: [
              '<%= files_external.scripts %>',
              '<%= files_internal.scripts %>'
            ],
            dest: '<%= dir.develop %>/' + _pathAssetsScripts,
            expand: true,
            flatten: true
          }
        ]
      },

      compile: {
        files: [
          {
            cwd: '.',
            src: [
              '<%= files_external.scripts_min %>'
            ],
            dest: '<%= dir.compile %>/' + _pathAssetsScripts,
            expand: true,
            flatten: true
          }
        ]
      }

    },


    // -------------------------------------------------------------------------
    // WATCH / DELTA
    // -------------------------------------------------------------------------

    delta: {

      options: {
        livereload: true,
        spawn: false
      },

      config: {
        files: [
          'app.config.js'
        ],
        tasks: [
          'develop'
        ]
      },

      html: {
        files: [
          'src/index.html'
        ],
        tasks: [
          'index:develop'
        ]
      },

      js: {
        files: [
          'src/scripts/**/*.js'
        ],
        tasks: [
          'jshint:develop',
          'karma:unit',
          'copy:develop',
          'index:develop'
        ]
      },

      jsspec: {
        files: [
          'src/tests/**/*.spec.js'
        ],
        tasks: [
          'karma:unit'
        ]
      }

    },


    // -------------------------------------------------------------------------
    // JSHINT CODE QUALITY
    // -------------------------------------------------------------------------

    jshint: {

      options: {
        reporter: require('jshint-stylish'),
        jshintrc: '.jshintrc'
      },

      develop: [
        '<%= files_internal.scripts %>'
      ]

    },


    // -------------------------------------------------------------------------
    // INDEX
    // -------------------------------------------------------------------------

    index: {

      develop: {
        dest: '<%= dir.develop %>',
        src: {
          styles: [
            '<%= compass.develop.options.cssDir %>/**/*.css'
          ],
          scripts: [
            '<%= files_external.scripts %>',
            '<%= files_internal.scripts %>'
          ]
        }
      },

      compile: {
        dest: '<%= dir.compile %>',
        src: {
          styles: [
            '<%= compass.compile.options.cssDir %>/**/*.css'
          ],
          scripts: [
            '<%= files_external.scripts_min %>',
            '<%= dir.compile %>/' + _pathAssetsScripts + '/<%= pkg.name %>.min.js'
          ]
        }
      }

    },


    // -------------------------------------------------------------------------
    // KARMA TEST RUNNER
    // -------------------------------------------------------------------------

    karma: {

      unit: {
        options: {
          autoWatch: false,
          port: 9998,
          runnerPort: 9999,
          singleRun: true,
          files: [
            'src/tests/**/*.spec.js'
          ],
          frameworks: [
            'jasmine'
          ],
          browsers: [
            'Chrome'
          ],
          reporters: [
            'mocha'
          ]
        }
      }
    },


    // -------------------------------------------------------------------------
    // MINIFICATION
    // -------------------------------------------------------------------------

    uglify: {

      options: {
        compress: {
          booleans: true,
          cascade: true,
          comparisons: true,
          conditionals: true,
          dead_code: true,
          drop_debugger: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
          loops: true,
          properties: true,
          sequences: true,
          side_effects: true,
          unused: true,
          warnings: true
        }
      },

      compile: {
        files: {
          '<%= dir.compile %>/assets/scripts/<%= pkg.name %>.min.js': [
            '<%= files_internal.scripts %>'
          ]
        }
      }

    }

  };


  /**
   * ***************************************************************************
   * TASK REGISTRATION
   * ***************************************************************************
   */

  // Combine application configuration and task configuration and init Grunt
  _merge(_taskConfig, _appConfig);
  grunt.initConfig(_taskConfig);

  // ---------------------------------------------------------------------------
  // SIMPLE TASKS
  // ---------------------------------------------------------------------------

  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', [
    'develop',
    'karma:unit',
    'delta'
  ]);

  grunt.registerTask('develop', [
    'clean:develop',
    'compass:develop',
    'copy:develop',
    'index:develop'
  ]);

  grunt.registerTask('compile', [
    'clean:compile',
    'compass:compile',
    'copy:compile',
    'concat:compile',
    'uglify:compile',
    'index:compile'
  ]);

  grunt.registerTask('deploy', [ ]);

  grunt.registerTask('default', [ ]);

  // ---------------------------------------------------------------------------
  // MULTITASKS
  // ---------------------------------------------------------------------------

  grunt.registerMultiTask('index', 'Creates an index.html file',
    function() {
      var _mapper = function(path, file) {
        return path + '/' + file.substring(file.lastIndexOf('/') + 1, file.length);
      };

      var filesStyle = grunt.file.expand(this.data.src.styles);
      filesStyle = filesStyle.map(_mapper.bind(this, _pathAssets));
      var filesScript = grunt.file.expand(this.data.src.scripts);
      filesScript = filesScript.map(_mapper.bind(this, _pathAssetsScripts));

      grunt.file.copy('src/index.html',
        this.data.dest + '/index.html', {
          process: function(contents) {
            return grunt.template.process(contents, {
              data: {
                filesStyle: filesStyle,
                filesScript: filesScript
              }
            });
          }
        }
      );
    }
  );

};
