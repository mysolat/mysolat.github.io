function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";";
}

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
  var cookie = "SGR02"
  if(getCookie('zone') == ""){
    setCookie('zone', cookie)
  }
  else{
    cookie = getCookie('zone')
  }
  return cookie; 
}



Vue.config.devtools = true
var endpointUrl = 'https://api.solat.my/';
var Zon = Vue.resource(endpointUrl + 'zones.json');
var Calendar = Vue.resource(endpointUrl + 'zones{/zone}.json');

//var Calendar = Vue.resource(endpointUrl + 'year{/yy}/month{/mm}/locations{/zone}.json');

var data =  {
    zones: [],
    zone: detectLocation(),
    year: 2017,
    month: 05,
    days: [],
    today: [],
    location: ''
  }

var daily = new Vue({
  el: '#daily',
  data: data,
  methods: {
    fetchData: function(yy, mm, dd, zone) {
    self = this
    Calendar.get({zone: zone}).then(function (response) {
        self.today = response.data;
        self.location = self.today.locations[0]
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
  el: '#main',
  data: data,
  computed: {

  },
  mounted: function() {
    this.init();
  },

  methods: {
    init: function() {   
      this.setCookies();
      this.fetchZones();
      daily.fetchData('', '', '', this.zone);
      monthly.fetchData(this.year, this.month, this.zone);
    },

    fetchZones: function() {
      self = this
      Zon.get({}).then(function (response) {self.zones = response.data });
    },
    
    setZone: function(kod) {
      this.zone = kod;
      this.init()
    },

    setCookies: function() {
      setCookie('zone', this.zone);
    }
  }
})



