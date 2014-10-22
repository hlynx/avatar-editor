module.exports = function (grunt) {
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('bower.json'),
        meta: {
            srcDir: 'src',
            destDir: 'dist',
            banner: '/*!\n' +
                ' * AvatarEditor v<%= pkg.version %>\n' +
                ' * <%= pkg.repository.url %>\n' +
                ' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.authors[0] %>\n' +
                ' */\n'
        },
        cssmin: {
            minify: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                expand: true,
                cwd: '<%= meta.srcDir %>',
                src: ['*.css', '!*.min.css'],
                dest: '<%= meta.destDir %>',
                ext: '.min.css'
            }
        },
        ngmin: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
                src: ['<%= meta.srcDir %>/<%= pkg.name %>.js'],
                dest: '<%= meta.destDir %>/<%= pkg.name %>.js'
            }
        },
        concat: {
            options: {
                banner: '<%= meta.banner %>',
                stripBanners: true
            },
            dist: {
                src: ['<%= meta.srcDir %>/<%= pkg.name %>.js'],
                dest: '<%= meta.destDir %>/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= meta.banner %>'
            },
            dist: {
//                src: '<%= concat.dist.dest %>',
                src: '<%= meta.srcDir %>/<%= pkg.name %>.js',
                dest: '<%= meta.destDir %>/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.registerTask('default', [
        'cssmin:minify',
//        'ngmin:dist',
        'uglify:dist'
    ]);

};
