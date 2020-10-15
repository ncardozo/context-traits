/* This file is part of Context Traits.
   Copyright © 2012—2015 UCLouvain.
 */

module.exports = function (grunt) {
    'use strict';

	var _ = grunt.util._;
	var parts = [
        'src/prologue.js',
        'src/prototypes.js',
		'src/activation.js',
        'src/adaptation.js',
		'src/composition.js',
		'src/namespaces.js',
		'src/contexts.js',
		'src/epilogue.js'
        ];

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		concat: {
			options: {
                stripBanners: true,
				separator: '\n',
				banner: '/* ' +
	                '\n * <%= pkg.title %> v<%= pkg.version %>' +
	                '\n * <%= pkg.homepage %>' +
                    '\n * Copyright © 2012—<%= grunt.template.today("yyyy, hh:MM") %> <%= pkg.copyright %>' +
                    '\n * 2016-<%= grunt.template.today("yyyy") %> Universidad de los Andes' +
	                '\n * Licensed under <%= _.toSentence(_(pkg.licenses).map("type")) %>'
	            + '\n */ \n\n'
			},
	    	dist: {
	        	src: parts,
				dest: 'build/<%= pkg.name %>.js'
            }
        },

        uglify: {
			options: {
		    	banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
		  	},
			lib: {
	            files: {
					'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
				}
	        }
	    },
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-docco');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-qunit');
   	
	grunt.registerTask('compile', ['concat:dist']);
}