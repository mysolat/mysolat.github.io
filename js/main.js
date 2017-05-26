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

      var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 6
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }


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
    location: '',
    time_now: ''
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
      this.time_now = moment().format('LT'); 
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
      $('#myModal').modal('show');
    }
  }
})


var modal = new Vue({
  el: '#modal',
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
      $('#myModal').modal('hide');
    },

    setCookies: function() {
      setCookie('zone', this.zone);
    },

    openSetting: function() {
      $('#myModal').modal('show');
    }
  }
})

