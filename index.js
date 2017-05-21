var endpointUrl = 'http://api.solat.my/zones';

var Zon = Vue.resource(endpointUrl + '.json');
var Calendar = Vue.resource(endpointUrl + '{/zone}.json');
//var Calendar = Vue.resource(endpointUrl + 'year{/yy}/month{/mm}/locations{/zone}.json');

var vm = new Vue({
  el: '#app',
  data: {
    zones: [],
    current_zone: "JHR01",
    days: [],
    year: '',
    month: ''
  },
  computed: {

  },
  mounted: function() {
	  this.fetchZones();
    this.year = 2017;
    this.month = 5;
    this.fetchData(this.year, this.month, this.current_zone);
  },
  methods: {
    fetchZones: function() {
	  self = this
      Zon.get({}).then(function (response) {
        self.zones = response.data
      });
    },
    
    fetchData: function(yy,mm,zone) {
	  self = this
	  Calendar.get({zone: zone}).then(function (response) {
        self.days = response.data;
      });
    },
    
    getThisZone: function(kod) {
      this.fetchData(2017, this.month, kod);
      this.current_zone = kod;
    },

    getThisMonth: function(mm) {
      this.fetchData(2017, mm, 'jhr01');
    }
  }
})
