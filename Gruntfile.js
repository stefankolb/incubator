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
            dest: '<%= dir.develop %>/scripts',
            expand: true,
            flatten: true
          }
        ]
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

  grunt.registerTask('watch', [ ]);

  grunt.registerTask('develop', [
    'clean:develop',
    'compass:develop',
    'copy:develop'
  ]);

  grunt.registerTask('compile', [ ]);

  grunt.registerTask('deploy', [ ]);

  grunt.registerTask('default', [ ]);

};
