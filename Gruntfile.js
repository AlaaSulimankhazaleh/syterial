module.exports = function (grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    less: {
      production: {
        files: {
          'css/syterial.css': 'less/syterial.less'
        }
      }
    },
		uglify: {
      development: {
        options: {
          beautify: true
        },
        files: {
          'dist/js/syterial.js': ['js/syterial.js', 'js/**/*.js']
        }
      },
      production: {
        options: {
          banner: '/*! <%= pkg.name %> <%= pkg.version %> */\n'
        },
        files: {
          'dist/js/syterial.min.js': ['js/syterial.js', 'js/**/*.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/css/syterial.min.css': 'css/syterial.css'
        }
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'css/', src: '*', dest: 'dist/css/', flatten: true, filter: 'isFile'},
          {expand: true, cwd: 'dist/css/', src: '*', dest: '../gh-pages/app/css/'},
          {expand: true, cwd: 'dist/fonts/', src: '*', dest: '../gh-pages/app/fonts/'},
          {expand: true, cwd: 'dist/js/', src: '*', dest: '../gh-pages/app/js/'}
        ]
      }
    }
	});


  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['less', 'uglify', 'cssmin', 'copy']);
};