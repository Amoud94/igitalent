const fs = require('fs');

module.exports = function (io) {
    global.Utils = {};
    global.Models = {};
    global.Validation = {};
    global.Components = {};
    global.Core = require(`./core.js`);
    fs.readdirSync('src/components').forEach((component) => {

        try {
            global.Models[component] = require(`../components/${component}/model.js`);
        } catch (e) { console.log("forEach  components model : --------"); console.log(e); global.Models[component] = {}; }


        try {
            global.Validation[component] = require(`../components/${component}/validation.js`);
        } catch (e) { global.Validation[component] = {}; }

        if (component == 'cronJobs') {
            try {
                global.Components[component] = require(`../components/${component}/index.js`);
            } catch (e) { console.log(e); global.Components[component] = {}; }
        }
    });

    fs.readdirSync('src/utils').forEach((util) => {
        global.Utils[util.split('.')[0]] = require(`../utils/${util}`);
    });

}