var endpointUrl = 'http://api.labs.my/takwim/';

var Zon = Vue.resource(endpointUrl + '/locations.json');
var Calendar = Vue.resource(endpointUrl + 'year{/yy}/month{/mm}/locations{/zone}.json');

var vm = new Vue({
  el: '#app',
  data: {
    zones: [],
    current_zone:[],
    days: [],
    year: '',
    month: ''
  },
  computed: {

  },
  ready: function() {
	this.fetchZones();
    this.year = 2016;
    this.month = 6;
    this.fetchData(this.year, this.month, 'jhr01');
  },
  methods: {
    fetchZones: function() {
	  self = this
      Zon.get({}).then(function (response) {
        self.$set('zones', response.data);
      });
    },
    
    fetchData: function(yy,mm,zone) {
	  self = this
	  Calendar.get({yy: yy, mm: mm, zone: zone}).then(function (response) {
        self.$set('days', response.data);
      });
    },
    
    getThisZone: function(kod) {
      this.fetchData(2016, this.month, kod);
      this.current_zone = kod;
    },

    getThisMonth: function(mm) {
      this.fetchData(2016, mm, 'jhr01');
    }
  }
})
