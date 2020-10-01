/* This file is part of Context Traits.
   Copyright © 2012—2015 UCLouvain.
 */

module.exports = function (grunt) {
    'use strict';

	var _ = grunt.util._;
	var parts = [
        'prologue',
        'prototypes',
		'activation',
        'adaptation',
		'composition',
		'namespaces',
		'contexts',
		'epilogue'
        ];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			options: {
				separator: ';',
				banner: '/* ' + [
	                '\n * <%= pkg.title %> v<%= pkg.version %>',
	                '\n * <%= pkg.homepage %>',
	                '\n * Copyright © 2012—<%= grunt.template.today("yyyy, hh:MM") %> <%= pkg.copyright %>',
	                '\n * Licensed under <%= _.toSentence(_(pkg.licenses).pluck("type")) %>'
	            ]+ '\n */ \n\n'
			},
	    	lib: {
	        //	src: _.map(parts, function(p) {return 'src/' + p + '.coffee'; }),
//	            dest: 'build/<%= pkg.name %>.coffee'
				src: 'build/<%= pkg.name %>.js',
				dest: 'dist/<%= pkg.name %>.js'
	        },
	        test: {
	           src: [ '<banner>', 'build/<%= pkg.name %>-tests.js' ],
	           dest: 'test/<%= pkg.name %>-tests.js'
	        },
	        nodeTest: {
	            src: [ '<banner>', 'build/test.js' ],
	            dest: 'test/test.js'
	        }
	    },

	    uglify: {
			options: {
		    	banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		  	},
			lib: {
	            files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.lib.dest %>']
				}
	        }
	    },

		coffee: {
			options: {
				join: true
			},
			compile: {
				files: {
//					'build/<%= pkg.name %>.js': 'build/<%= pkg.name %>.coffee'
					'build/<%= pkg.name %>.js': [_.map(parts, function(p) {return 'src/' + p + '.coffee'; })]
				}
			},
			contexts: {
				src: 'src/contexts/',
				dest: 'dist/contexts/'
			},
			test: {
				files: {
					'build/<%= pkg.name %>-tests.js': _.map(parts, function (p) { return 'test/src/' + p + '.coffee'; }),
				}
			}
		},	
			
		qunit: {
			files: ['test/index.html']
		},
		
		watch: {
			files: ['<config:coffee.compile>',
            	'<config:coffee.test>',
            	'<config:qunit.files>'
        		],
        	tasks: ['targets']
		},
		 		
		jshint: {
			files: ['Gruntfile.js', 'test/**/*.js'],
	        options: {
	            boss: true,
	            browser: true,
	            curly: true,
	            eqeqeq: true,
	            eqnull: true,
	            immed: true,
	            latedef: true,
	            newcap: true,
	            noarg: true,
	            sub: true,
	            undef: true
	        },
	        globals: {
	            exports: true,
	            module: false
	        }
	    },
	
		docco: {
            src: [ 'src/*.coffee' ]
        },

        clean: {
            build: [ "build/" ]
        }
	});
	
	grunt.loadTasks('.tasks/');
	
	grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-qunit');
   	grunt.loadNpmTasks('grunt-contrib-coffee');

	grunt.registerTask('libs', ['coffee:compile', 'concat:lib', 'uglify:lib']);
	grunt.registerTask('docs', 'docco');
	grunt.registerTask('tests', ['coffee:test', 'concat:test']);
    grunt.registerTask('targets', ['libs', 'tests', 'docs']);
	
	grunt.registerTask('nodeunit', ['libs', 'tests', 'qunit']);
    grunt.registerTask('default', ['targets', 'jshint', 'qunit']);

};
