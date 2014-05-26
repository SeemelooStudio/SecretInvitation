// StartView.js
// -------
define(["jquery", "backbone", "mustache", "text!templates/Start.html", "animationscheduler", "utils"],
    function ($, Backbone, Mustache, template, AnimationScheduler, Utils) {

        var StartView = Backbone.View.extend({

            el: "#main",
            
            initialize: function (options) {
                this.listenTo(this, "render", this.postRender);
                $("body").hammer({
                  preventDefault: true
                });
                
                
            },
            events: {
                "swipeup":"onSwipeup",
                "dragup":"onSwipeup",
                "swipedown":"onSwipedown",
                "dragdown":"onSwipedown"
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

                    });
                }
            }
        });
        return StartView;
    }

);