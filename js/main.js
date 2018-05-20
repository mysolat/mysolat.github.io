function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
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
  var cookie = "SGR01"

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
var Zon = Vue.resource(endpointUrl + 'zon.json');
var Calendar = Vue.resource(endpointUrl + 'zon{/zone}.json');
var date = new Date();

var data =  {
    zones: [],
    zone: detectLocation(),
    year: date.getFullYear(),
    month: date.getMonth()+1,
    days: [],
    today: [],
    location: '',
    time_now: '',
    search: ''
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
    },
    highlightCurrent: function(waktu, waktu2){
      var waktu_first = moment(waktu, 'HH:mm:ss A');
      var waktu_second = moment(waktu2, 'HH:mm:ss A');
      var time_now = moment(this.time_now, 'HH:mm:ss A');
      if (waktu_second == null) {
        result = time_now.isBefore(waktu_first)
      }
      else {
        result = time_now.isBetween(waktu_first, waktu_second)
      }
      
      return result
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
      this.updateCurrentTime;
      setInterval(() => { this.updateCurrentTime(); }, 1 * 1000);
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
    },

    openSetting: function() {
      $('#modal-option').modal('show');
    },

    updateCurrentTime: function() {
      this.time_now = moment().format('LTS');
    }
  }
})


var settings = new Vue({
  el: '#settings',
  data: data,
  computed: {
    filteredItems() {
      return this.zones.filter(zone => {
         return zone.locations[0].toLowerCase().includes(this.search.toLowerCase());
      })
    }

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
      this.search = "";
      this.init()
      $('#modal-option').modal('hide');
    },

    setCookies: function() {
      setCookie('zone', this.zone);
    },

    openSetting: function() {
      $('#modal-option').modal('show');
    }
    
  }
})

