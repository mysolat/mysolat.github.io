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
  var cookie = "SGR03"

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
var Locations = Vue.resource(endpointUrl + 'negeri.json');
var date = new Date();

var data =  {
    year: date.getFullYear(),
    month: date.getMonth()+1,
    zones: [],
    zone: detectLocation(),
    days: [],
    today: [],
    location: '',
    time_now: '',
    search: ''
  }

new Vue({
  el: '#main',
  data: data,
  computed: {
   //filteredZones() {
   //   return this.zones
   // }
  },

  mounted: function() {
    this.setCookies();
    this.init();
    this.timeNow();
  },

  methods: {
    init: function() {
     
      this.fetchDaily('', '', '', this.zone);
      this.fetchMonthly(this.year, this.month, this.zone);
  
    },

    fetchLocations: function() {
      self = this
      Locations.get({}).then(function (response) { self.zones = response.data })
    },


    fetchDaily: function(yy, mm, dd, zone) {
      self = this
      Calendar.get({zone: zone}).then(function (response) {
        self.today = response.data;
        self.location = self.today.locations.join(', ')
      });
    },

    fetchMonthly: function(yy, mm, zone) {
      self = this
      Calendar.get({year: yy, month: mm, zone: zone}).then(function (response) {    
        self.days = response.data;
      });
    },
    
 
    setZone: function(kod) {
      this.zone = kod;
      this.init()
      this.search = "";
      $('#modal-option').modal('hide');
    },

    setCookies: function() {
      setCookie('zone', this.zone);
    },
 
    openSetting: function() {
      this.fetchLocations();
      $('#modal-option').modal('show');
    },

    timeNow: function() {
      setInterval(() => {this.time_now = moment().format('LTS');}, 1 * 1000);
    },   

    getThisMonth: function(mm) {
      this.month = mm
      self.fetchMonthly(this.year, mm, this.zone);
    },

    highlightCurrent: function(waktu, waktu2){
      var start = moment(waktu, 'HH:mm:ss A');
      var end = moment(waktu2, 'HH:mm:ss A');
      var time_now = moment(this.time_now, 'HH:mm:ss A');
      if (end == null) {
        result = time_now.isBefore(start)
      }
      else {
        result = time_now.isBetween(start, end)
      }
      return result
    }
  }
})