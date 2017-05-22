var endpointUrl = 'http://api.solat.my/zones';
Vue.config.devtools = true
var Zon = Vue.resource(endpointUrl + '.json');
var Calendar = Vue.resource(endpointUrl + '{/zone}.json');
// Require dependencies 
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
    this.setCookie();
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
      this.setCookie();
    },
    setCookie: function() {
      document.cookie = "zone=" + this.zone;
    }
  }
})

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function detectLocation(){
  var detected_location = "SGR02"
  if(getCookie('zone') == ""){
    document.cookie = "zone=" + detected_location;
  }

}

