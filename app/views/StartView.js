// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Utils) {

        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.isRendered = false;
                this.listenTo(this, "render", this.postRender);
                $("body").hammer({
                  preventDefault: true
                });
                
                
            },
            events: {
                "swipeup":"onSwipeup",
                "dragup":"onSwipeup",
                "swipedown":"onSwipedown",
                "dragdown":"onSwipedown",
                "tap #download": "showDownloadTips",
                "tap #phone": "showDownloadTips",
                "tap #downloadrt": "showDownloadTips"
            },
            render: function () {
                this.template = _.template(template, {});
                this.$el.html(Mustache.render(this.template, {}));

                this.trigger("render");
                return this;
            },
            postRender: function() {
                var self = this;
                
                this.stages = [{
                    el:"#first",
                    elementsAnimation: new AnimationScheduler(this.$el.find("#logo,#logo-fox,#intro"),
                    {
                        "isSequential":true,
                        "sequentialDelay":1000
                    }),
                    stageAnimation: new AnimationScheduler(this.$el.find("#first"),{
                        "hideAtFirst":false
                    })
                },{
                    el:"#second",
                    elementsAnimation: new AnimationScheduler(this.$el.find(".about-block"),
                    {
                        "isSequential":true,
                        "sequentialDelay":1000
                    }),
                    stageAnimation: new AnimationScheduler(this.$el.find("#second"),{
                        "hideAtFirst":false
                    })
                },{
                    el:"#third",
                    elementsAnimation: new AnimationScheduler(this.$el.find("#phone,#download,#slideBack"),
                    {
                        "isSequential":true,
                        "sequentialDelay":1000
                    }),
                    stageAnimation: new AnimationScheduler(this.$el.find("#third"),{
                        "hideAtFirst":false
                    })
                }];
                
                this.currentStage = this.stages[0]; 
                this.currentStageIndex = 0;
                               
                this.currentStage.elementsAnimation.animateIn(function(){
                    self.onEnterStage();
                });
                
                this.isRendered = true;
            },
            onSwipeup: function(ev) {
                ev.gesture.stopPropagation();
                ev.gesture.preventDefault();
                ev.gesture.stopDetect();
                
                
                this.proceedToNextStage();
            },
            onSwipedown: function(ev) {
                ev.gesture.stopPropagation();
                ev.gesture.preventDefault();
                ev.gesture.stopDetect();
                this.proceedToPrevStage();
                //window.location.reload();
            },
            onExitStage: function() {
                this.$el.find("#slideUp").fadeOut().addClass("hidden");
            },
            onEnterStage: function() {
                if ( this.currentStageIndex + 1 < this.stages.length ) {
                    this.$el.find("#slideUp").removeClass("hidden").fadeIn();
                }
            },
            proceedToNextStage: function() {
                var self = this;
                
                if ( this.currentStageIndex + 1 < this.stages.length ) {
                
                    var previousStage = this.currentStage;
                    
                    this.currentStageIndex = this.currentStageIndex + 1;
                    this.currentStage = this.stages[this.currentStageIndex];
                    
                    if(this.currentStageIndex == this.stages.length - 1 ) {
                        //last stage
                        $("#downloadrt").fadeOut();
                    }
                    
                    this.onExitStage();
                    previousStage.stageAnimation.animateOut(function() {
                        self.currentStage.elementsAnimation.animateIn(function(){
                            self.onEnterStage();
                        });
                    });
                }
                
            },
            proceedToPrevStage: function() {
                var self = this;
                if ( this.currentStageIndex > 0 ) {
                    var previousStage = this.currentStage;
                    
                    this.currentStageIndex = this.currentStageIndex - 1;
                    this.currentStage = this.stages[this.currentStageIndex];
                    
                    self.currentStage.stageAnimation.hideAtFirst = true;
                    self.currentStage.stageAnimation.initObjects();
                    self.onExitStage();
                    self.currentStage.stageAnimation.animateIn( function() {
                            previousStage.elementsAnimation.initObjects();
                            self.onEnterStage();
                            if(self.currentStageIndex == self.stages.length - 2 ) {
                                //last stage
                                $("#downloadrt").fadeIn();
                            }

                    });
                }
            },
            showDownloadTips: function(ev) {
                if ( Utils.isWechat() ) {
                    ev.gesture.preventDefault();
                    ev.gesture.stopPropagation();
                    $("#main").addClass("blur");
                    
                    Backbone.history.navigate("download", { trigger: false, replace: true });
                    
                    $("#downloadOverlay").fadeIn();
                    $("#downloadOverlay").tap(function(){
                        $("#main").removeClass("blur");
                        $("#downloadOverlay").fadeOut();
                        Backbone.history.navigate("", { trigger: false, replace: true });
                    });
                    
                    
                } else {
                    window.location.href="https://itunes.apple.com/us/app/mi-misecret/id880007797?ls=1&mt=8";
                }
                
            }
        });
        return StartView;
    }

);