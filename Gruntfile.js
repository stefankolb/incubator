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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
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


  /**
   * ***************************************************************************
   * TASK CONFIGURATION
   * ***************************************************************************
   */

  var _taskConfig = {

    // -------------------------------------------------------------------------
    // CLEAN
    // -------------------------------------------------------------------------

    clean: {

      develop: [
        '<%= dir.develop %>'
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
          cssDir: '<%= dir.develop %>/assets/',
          raw: 'preferred_syntac = :scss\n'
        }
      },

      compile: {
        options: {
          environment: 'production',
          outputStyle: 'compact',
          sassDir: '<%= files_internal.sass.dir_base %>',
          specify: '<%= files_internal.sass.file_base %>',
          cssDir: '<%= dir.compile%>/assets/',
          raw: 'preferred_syntac = :scss\n'
        }
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
            dest: '<%= dir.develop %>/assets/scripts',
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

        globals: {

        },

        curly: true,
        eqeqeq: true,
        forin: true,
        futurehostile: true,
        globalstrict: true,
        latedef: true,
        undef: true,
        unused: true,

        browser: true
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

  grunt.registerTask('compile', [ ]);

  grunt.registerTask('deploy', [ ]);

  grunt.registerTask('default', [ ]);

  // ---------------------------------------------------------------------------
  // MULTITASKS
  // ---------------------------------------------------------------------------

  grunt.registerMultiTask('index', 'Creates an index.html file',
    function() {
      var filesStyle = grunt.file.expand(this.data.src.styles);
      var filesScript = grunt.file.expand(this.data.src.scripts);

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
