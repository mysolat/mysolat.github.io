var endpointUrl = 'http://api.labs.my/takwim/';
        
new Vue({
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
    this.fetchData(this.year,this.month,'jhr01');
  },
  methods: {
    fetchZones: function() {
      _this = this;
      _this.zones = [];
      $.getJSON(endpointUrl + '/locations.json', function(response) {
        _this.zones = response;
      });
    },
    
    fetchData: function(yy,mm,zone) {
      _this = this;
      _this.days = [];
      $.getJSON(endpointUrl + 'year/'+yy+'/month/'+mm+'/locations/'+zone+'.json', function(response) {
        _this.days = response;
      });
    },
    
    getThisZone: function(kod) {
      this.fetchData(2016,this.month,kod);
      this.current_zone = kod
    },

    getThisMonth: function(mm) {
      this.fetchData(2016,mm,'jhr01');
    }
  }
})
