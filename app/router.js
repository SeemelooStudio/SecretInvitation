define(function(require, exports, module) {
  "use strict";

  // External dependencies.
  var Backbone = require("backbone");
  require("hammerjs");
  require("jqueryhammer");
  
  //views
  var MainView = require("views/MainView");
  var mainView;
  
  var PrepareView = require("views/PrepareView");
  var prepareView;
  
  var StartView = require("views/StartView");
  var startView;

  // Defining the application router.
  module.exports = Backbone.Router.extend({
    initialize: function() {
        mainView = new MainView();        
        prepareView = new PrepareView();
        startView = new StartView();
    },
    routes: {
      "": "index",
      "download":"download",
      "*action":"index"
    },

    index: function() {
      require(["image!app/img/fox.png",
               "image!app/img/logofox.png",
               "image!app/img/window.png",
               "image!app/img/windowtop.png",
               "image!app/img/about-1.png",
               "image!app/img/about-2.png",
               "image!app/img/about-3.png",
               "image!app/img/about-4.png",
               "image!app/img/phone.png",
               "image!app/img/download.png",
               "image!app/img/arrowup.png",
               "image!app/img/bg.png",
               "image!app/img/intro.png"],function(fox,logofox,window,windowtop,about1,about2,about3,about4,phone,download,arrow,bg,intro){
          startView.render();
      });
      
    },
    download: function() {
        if ( startView.isRendered ) {
            
        } else {
            
        }
    }
  });
});
