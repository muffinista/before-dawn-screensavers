module.exports = function(grunt) {
  grunt.registerTask('rebuild', 'Update list of screensavers', function() {
    const fs = require('fs')
    const path = require('path')
    const _ = require('lodash');
    
    const srcpath = ".";
    
    let folders = fs.readdirSync(srcpath).filter(file => fs.statSync(path.join(srcpath, file)).isDirectory());
    folders = _.reject(folders, f => f === ".git" || f.match(/^__/))
    folders = _.reject(folders, f => !fs.existsSync(path.join(srcpath, f, "saver.json")))

    fs.writeFileSync("savers.json", JSON.stringify(folders));
    
  });

  grunt.initConfig({
    watch: {
      scripts: {
        files: ['**/*.json'],
        tasks: ['rebuild']
      }
    }
  });
  
  grunt.loadNpmTasks('load-grunt-tasks');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default', ['rebuild']);
};
