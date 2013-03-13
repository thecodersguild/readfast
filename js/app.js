window.events = _.clone(Backbone.Events);

var ReadFast = ReadFast || {}

var globalWordIndex = 0;
var globalTextLength = 0;
var timeToGo = 0;
var globalTimeSpan =500;


ReadFast.Visor = Backbone.View.extend({

  events: {
    'click #play': 'start',
    'click #pause': 'stop',
    'click #rewind': 'rewind',
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

  cycle: function () {
    if (this.countable) {
      $('output', this.$el).text(this.words[globalWordIndex]);
      $('#progress').css('width', (globalWordIndex / globalTextLength)*100 + '%' );
      $('#rest').text(Math.round((globalTextLength - globalWordIndex ) * globalTimeSpan / 1000) + "s");
      globalWordIndex ++;

      if (globalWordIndex < this.words.length) {
        setTimeout(
          "events.trigger('cycle'," + globalWordIndex + ")", 
          this.timeSpan
        );      
      } else {
        this.countable = false;
      }
    }
  },

  start: function () {
    if (!this.countable) {
      this.countable = true;
      this.countSoFar = globalWordIndex;
      $("#time").text(Math.round(this.countSoFar / 1000) + 's');
      this.text = $.trim($("textarea").val());
      this.words = this.text.split(/\s/);
      globalTextLength = this.words.length;
      setTimeout("events.trigger('count')", 10);
      $('#textarea1').addClass('hide');
      $('#play').addClass('hide');
      events.trigger('cycle');
    }
  },

  stop: function () {
    if (this.countable) {
      this.countable = false;
      $('#pause').text('Play');
    }else{
      this.countable = true;
      $('#pause').text('Pausa');
      $("#time").text(Math.round(this.countSoFar / 1000) + 's');
      setTimeout("events.trigger('count')", 10);
      events.trigger('cycle', globalWordIndex - 1);
    }
  },

  rewind: function () {
    if (globalWordIndex > 11){
      globalWordIndex = globalWordIndex - 10;
    }else{
      globalWordIndex = 0;
    }
    $('#progress').css('width', (globalWordIndex / globalTextLength)*100 + '%' );
  },

  updateTimeSpan: function (timeSpan) {
    this.timeSpan = timeSpan;
    globalTimeSpan = timeSpan;
    $('#rest').text(Math.round((globalTextLength - globalWordIndex ) * globalTimeSpan / 1000) + "s");
  },

  count: function () {
    this.countSoFar += 10;
    $("#time").text(Math.round(this.countSoFar / 1000) + 's');
    if (this.countable) {
      setTimeout("events.trigger('count')", 10);
    }
  }

});


$( function () {

  ReadFast.visor = new ReadFast.Visor();

});