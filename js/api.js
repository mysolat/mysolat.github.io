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
var date = new Date();


new Vue({
  el: '#main',
  data: function () {
    return {
      endpoint: 'https://api.solat.my',
      year: date.getFullYear(),
      month: date.getMonth()+1,
      zones: [],
      zone: "SGR03", // detectLocation()
      days: [],
      today: [],
      location: '',
      time_now: '',
      search: ''
    }
  }, 
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
      var url = this.endpoint + '/negeri.json'
      this.$http.get(url).then(function (response) { this.zones = response.data })
    },


    fetchDaily: function(yy, mm, dd, zone) {
        var url = this.endpoint + `/zon/${zone}.json`
        this.$http.get(url).then(function (response) {
        this.today = response.data;
        this.location = this.today.locations.join(', ')
      });
    },

    fetchMonthly: function(yy, mm, zone) {
      var url = this.endpoint + `/year/${this.year}/month/${this.month}/zon/${this.zone}.json`
       this.$http.get(url).then(function (response) {    
        this.days = response.data;
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
      this.fetchMonthly(this.year, mm, this.zone);
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