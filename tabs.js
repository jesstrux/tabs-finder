#! /usr/bin/env node
const fs = require('fs');
const scrapeIt = require("scrape-it");
const minimist = require('minimist');
const BASE_URL = "https://tabs.ultimate-guitar.com/";

if(process.argv.length < 4){
    console.log("Some parameters are missing.\n\n");
    console.log("Use format -a [artist] -s [song] -v [tabs version]");
    return;
}

var arg = minimist(process.argv.slice(2));

var artist = arg['a'] || arg['artist'];
artist = artist.replace(/\s/g, "_");

var song = arg['s'] || arg['song'];
song = song.replace(/\s/g, "_");

var version = arg['v'] || arg['ver'] || arg['version'];
version = !version || version === 1 ? "" : "_ver"+version;

var song_path = artist[0]+"/"+artist+"/";
song_path += song+version+"_crd.htm";

var tabs_url = BASE_URL + song_path;

console.log("Fetching tabs for: " + song + " by " + artist+ "\n\n...");

scrapeIt(tabs_url, {
    version: ".t_version",
    other_versions : {
    	listItem : ".versions_column li:not(.curversion)",
    	data : {
    		v : {
    			selector: "a",
    			convert: x => x.replace("ver ", "")
    		}
    	}
    },
    ratingCount: ".raiting .v_c",
    ratingType: ".vote-success"
    ,tabs: ".js-tab-content"
}).then(page => {
    var tabs = page.tabs;
    console.log(tabs);
    return;

    /*uncomment the lines below in case you want to
    write the tabs to an html page and still keep
    a pertinent look*/

    // tabs = tabs.replace(/[^\S\n]/g, "&nbsp;");
    // tabs = tabs.replace(/\n/g, "<br />");
    // console.log("Found lyrics, saving to file");

    // var output = `
    // <!DOCTYPE html>
    // <html lang="en">
    //     <head>
    //         <meta charset="UTF-8">
    //         <title>Document</title>
    //     </head>
    //     <body>
    //         ${tabs}
    //     </body>
    // </html>`;

    // fs.writeFileSync("./some.html", output);
})
.catch(error => {
    console.log("An error occured: " + error);
});