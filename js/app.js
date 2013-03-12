window.events = _.clone(Backbone.Events);

var ReadFast = ReadFast || {}

ReadFast.Visor = Backbone.View.extend({

  events: {
    'click button': 'start'
  },
  
  initialize: function () {
    this.$el = $('body');
    this.timeSpan = 1000;
    $('#slider').slider()
      .on('slide', function (event) {
        events.trigger('timeSpan:update', event.value);
      });
    events.on('cycle', this.cycle, this);
    events.on('timeSpan:update', this.updateTimeSpan, this);
    events.on('count', this.count, this);
  },

  cycle: function (wordIndex) {
    $('output', this.$el).text(this.words[wordIndex]);
    wordIndex ++;

    if (wordIndex < this.words.length) {
      setTimeout(
        "events.trigger('cycle'," + wordIndex + ")", 
        this.timeSpan
      );      
    } else {
      this.countable = false;
    }
  },

  start: function () {
    this.countable = true;
    this.countSoFar = 0;
    $("kbd").text(this.countSoFar / 1000);
    this.text = $.trim($("textarea").val());
    this.words = this.text.split(" ");
    setTimeout("events.trigger('count')", 10);
    events.trigger('cycle', 0);
  },

  updateTimeSpan: function (timeSpan) {
    this.timeSpan = timeSpan;
  },

  count: function () {
    this.countSoFar += 10;
    $("kbd").text(this.countSoFar / 1000);
    if (this.countable) {
      setTimeout("events.trigger('count')", 10);
    }
  }

});


$( function () {

  ReadFast.visor = new ReadFast.Visor();

});