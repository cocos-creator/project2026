'use strict';

var Path = require('path');

module.exports = {
    messages: {
        open () {
            Editor.Panel.open('excel-to-json.panel');
        },
        //
        parse () {
            var xlsxj;
            try {
                xlsxj = require('xlsx-to-json');
            } catch (e) {
                Editor.log('Please install npm dependencies first.');
                return;
            }
            let srcPath = Path.join(Editor.projectPath, 'data.xlsx');
            Editor.log('processing excel parse...');
            Editor.log('src: ' + srcPath);
            let outPath = Path.join(Editor.projectPath, 'assets/resources/data');
            function Refresh(outName) {
                Editor.assetdb.refresh ( 'db://assets/resources/data/' + outName, (err, results) => {
                        if ( err ) {
                            Editor.assetdb.error('Failed to reimport asset %s, %s', outName, err.stack);
                            return;
                        }
                        Editor.assetdb._handleRefreshResults(results);
                });
            }
            xlsxj({
                input: srcPath,  // input xls
                output: Path.join(outPath, 'cards.json'), // output json
                sheet: 'cards'
            }, function(err, result) {
                if(err) {
                    console.error(err);
                    return;
                }
                Editor.success("Convert heroes to json complete");
                Refresh('cards.json');
            });
        },
        install (event, opts) {
            let fork = require('child_process').fork;
            let cmdStr = Editor.url('app://node_modules/npm/bin/npm-cli.js');
            let child = fork(cmdStr, ['install'], {
                cwd: Editor.url('packages://excel-to-json/'),
                stdio: 'inherit'
            });
            child.on('exit', function(code) {
                Editor.success('Install npm dependencies complete!');
            });
        }
    }
};
