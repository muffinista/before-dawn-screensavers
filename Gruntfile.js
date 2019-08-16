module.exports = function(grunt) {
  require('dotenv').config();
  
  const fs = require('fs')
  const path = require('path')
  const srcpath = ".";

  var getFolders = function() {
    let folders = fs.readdirSync(srcpath).
                     filter(file => fs.statSync(path.join(srcpath, file)).isDirectory()).
                     filter(f => f !== ".git" && !f.match(/^__/)).
                     filter(f => fs.existsSync(path.join(srcpath, f, "saver.json")))

    return folders;
  };

  grunt.registerTask('rebuild', 'Update list of screensavers', function() {
    console.log(getFolders());
    fs.writeFileSync("savers.json", JSON.stringify(getFolders()));   
  });

  grunt.registerTask('preflight', 'Prepare screensavers for release', function() {
    let folders = getFolders();
    for (s of folders) {
      let src = path.join(srcpath, s, "saver.json");
      let data = JSON.parse(fs.readFileSync(src));

      // remove key that we don't need for released screensavers
      delete data.editable;

      // pretty-format the json output
      output = JSON.stringify(data, null, 2);
      
      console.log(src + " -> " + output);
      fs.writeFileSync(src, output);
    }
  });

  grunt.initConfig({
    watch: {
      scripts: {
        files: ['**/*.json'],
        tasks: ['rebuild']
      }
    },
    release: {
      options: {
        beforeRelease: ['rebuild', 'preflight'],
        commitMessage: "Release <%= version %>",
        tagName: 'v<%= version %>',
        npm: false,
        github: {
          repo: 'muffinista/before-dawn-screensavers',
          accessTokenVar: 'GITHUB_ACCESS_TOKEN'
        }
      }
    }
  });
  
  grunt.loadNpmTasks('load-grunt-tasks');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-release');
  grunt.registerTask('default', ['rebuild']);
};
