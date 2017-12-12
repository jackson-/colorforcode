var {resolve} = require('path');
var Ansible = require('node-ansible');

var Runit = new Ansible.Playbook().playbook(resolve('c4c-ansible-deploy/c4c-deploy'));

Runit.inventory(resolve('c4c-ansible-deploy/hosts'));

Runit.on('stdout', function(data) { console.log(data.toString()); });
Runit.on('stderr', function(data) { console.log(data.toString()); });
Runit.exec();