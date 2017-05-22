var endpointUrl = 'http://api.solat.my/zones';
Vue.config.devtools = true
var Zon = Vue.resource(endpointUrl + '.json');
var Calendar = Vue.resource(endpointUrl + '{/zone}.json');
//var Calendar = Vue.resource(endpointUrl + 'year{/yy}/month{/mm}/locations{/zone}.json');

var data =  {
    zones: [],
    zone: "JHR01",
    year: 2017,
    month: 05,
    days: [],
    today: [],
  }

var daily = new Vue({
  el: '#daily',
  data: data,
  methods: {
    fetchData: function(yy,mm,zone) {
    self = this
    Calendar.get({zone: zone}).then(function (response) {
        self.today = response.data;
      });
    }
  }
})

var monthly = new Vue({
  el: '#monthly',
  data: data,
  methods: {
    fetchData: function(yy, mm, zone) {
      self = this
      Calendar.get({year: yy, month: mm, zone: zone}).then(function (response) {    
        self.days = response.data;
      });
    },
    
    getThisMonth: function(mm) {
      this.month = mm
      self.fetchData(this.year, mm, this.zone);
    }
  }
})

var locations = new Vue({
  el: '#locations',
  data: data,
  computed: {

  },
  mounted: function() {
    this.fetchZones();
    daily.fetchData(this.year, this.month, this.zone);
    monthly.fetchData(this.year, this.month, this.zone);
  },

  methods: {
    fetchZones: function() {
      self = this
      Zon.get({}).then(function (response) {
        self.zones = response.data
      });
    },
    
    getThisZone: function(kod) {
      this.zone = kod;
      monthly.fetchData(this.year, this.month, this.zone);
    },
  }
})



