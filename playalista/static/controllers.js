var ECHONEST_API_KEY = 'RRUBJ1MGC491TGXIL';
var ECHONEST_API_URL = 'http://developer.echonest.com/api/v4';

var YOUTUBE_API_KEY = 'AIzaSyCiERdaxIuw6WOxFFB1joOu1XBEuuCO2dg';
var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

var DEFAULT_SONGS = [
  "Epistrophy - Thelonious Monk",
  "Blitzkrieg Bop - The Ramones",
  "Hearts Grow (kasanaru kage)",
  "Danger - 11h30",
  "Erroll Garner - Autumn Leaves",
  "Bad Boy Good Man",
  "Virtual Boy - Mass",
  "Born Gold - Lawn Knives",
  "Phoenix - 1901",
  "Dance yourself clean",
  "Royksopp forever",
  "An Astrologists Guide To The Stars In The Sky - Biorheology",
  "Hall of the Mountain King",
  "Stan Getz Desafinado",
  "Handsome boy modeling school",
  "Miami showdown",
  "New Slang",
  "Beirut - Nantes",
  "Tycho - A walk",
  "Ghostwriter",
  "Andrew Shum",
  "Mr. Sandman chordettes",
  "Bassnectar lights",
  "life/universe detektivbyran",
  "Stayin Alive bee gees",
  "Institutionalized suicidal tendencies",
  "Sunset Song",
  "fragrance of Dark Coffee",
  "Eyes on fire, Zed's Dead",
  "First Snow - Emancipator",
  "m-taku, One",
  "mala, alicia",
  "Kiss with a fist",
  "Rose cornandbeans",
  "Russian opera",
  "Floppy disc unatco",
  "Doctor who tesla",
  "Unatco old",
  "Unatco new",
  "Comin home baby",
  "No one knows my plan",
  "2wicky",
  "Yukar",
  "Rearrange miles kane",
  "Booty swing",
  "Session linkin park",
  "Sail",
  "What you know",
  "Takenobu",
  "Korra music",
  "Danzon 2",
  "The Mating Game",
  "Dirty Laundry",
  "24 Hours open",
  "Tank cowboy bebop",
  "I will survive",
  "Shooting stars bag raider",
  "Fuck shit stack",
  "I'm Just Your Problem",
  "Daddy why did you eat my Fries",
  "Positive Black Ignorance",
  "George Washington song",
  "Appeal to Timbaland",
  "Crystalised Remix",
  "heyyeyaaeyaaaeyaeyaa",
  "Schlozer",
  "Moanin by Mingus",
  "Moanin by 7note",
  "Eldar moanin kennedy center",
  "Ray Brown master class",
  "Scrap IO neotokyo",
  "Tin Soldiers neotokyo",
  "Impetus neotokyo",
  "Annul neotokyo",
  "Footprint neotokyo",
  "Monk Quartet",
  "Sail remix",
  "Quantic Transatlantic",
  "I miss you ayur",
  "Flower dance",
  "Round midnight 7note",
  "Reflection eternal",
  "Kronos and ron carter",
  "Magnum Force theme",
  "Black orpheus",
  "stanley clarke",
  "Moanin art blakey",
  "Moanin eldar",
  "Polyushka Polye",
  "Monday remix",
  "Derezzed remix",
  "Where is my mind",
  "Campus vampire weekend",
  "M79 vampire weekend",
  "Clint Eastwood gorillaz",
  "Cheers Elephant",
  "Murderers frusciante",
  "Warrior concerto",
  "Somebody that I used to know dubstep",
  "Somebody told me",
  "miss Otis regrets",
  "Is this it the strokes",
  "God only knows bioshock",
  "Fortunate son",
  "Ex-boyfriend",
  "Busker adam ben ezra",
  "Tom Waits down in the hole",
  "Blind boys down in the hole",
  "Get Lucky George Barnett",
  "All caps madvillain",
  "Seven nation army",
  "Swisgaar's solo",
  "Feels like we only go backwards",
  "Tycho - A Walk",
  "Home Stay",
  "Smirnoff Tea Party",
  "Farewell Spaceman",
  "Zero 7",
  "Space Walk lemon jelly",
  "Everything is OK halou",
  "Baroque in Rhythm",
  "ante up",
  "i go i go i go wave machine",
  "spitfire porter robinson",
  "charlie brown theme",
  "charlie brown jazz",
  "i always kill the things i love",
  "unchain my heart hugh laurie",
  "yesterdays paul chambers",
  "circle be unbroken",
  "step vampire weekend",
  "death note l's theme",
  "torched song",
  "when i'm small",
  "I can see it in your face",
  "red army choir",
  "move bitch ludacris",
]

var time_out_id = 0;

var playalista = angular.module('playalista', ['autocomplete', 'youtube']);

playalista.controller('musicCtrl', function($scope, $http) {
  $scope.queryEchonest = function(requestType, requestFunction, parameters, callback) {
    if (!requestType in ['artist', 'song', 'playlist']) {
      throw exception;
    }
    parameters['api_key'] = ECHONEST_API_KEY;

    var requestUrl = [ECHONEST_API_URL, requestType, requestFunction].join('/');

    var paramKeys = Object.keys(parameters);
    var paramStrings = [];

    for (key in parameters) {
      if (parameters[key] instanceof Array) {
        for (var j = 0; j < parameters[key].length; j++) {
          paramStrings = paramStrings.concat(encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key][j]));
        }
      }
      else {
        paramStrings = paramStrings.concat(encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]));
      }
    }

    requestUrl = requestUrl.concat('?', paramStrings.join('&'));

    $http.get(requestUrl).success(callback).error(function() {
      console.log("echonest query failed in queryEchonest");
    });
  };

  $scope.getSong = function(searchTerm) {
    parameters = {
      'combined': searchTerm,
      'bucket': ['tracks', 'audio_summary', 'id:7digital-US'],
      'rank_type': 'relevance',
    };

    console.log("query: " + searchTerm);

    if (searchTerm) {
      if(time_out_id != 0) {
        clearTimeout(time_out_id);
      }
      time_out_id = setTimeout(function() {
        time_out_id = 0;
        $scope.queryEchonest('song', 'search', parameters, function(data, status, headers, config) {
          console.log("data: " + data);
          $scope.suggestions = [];
          for (var i = 0; i < data.response.songs.length; i++) {
            var song = data.response.songs[i];
            var entry = song.title + ' - ' + song.artist_name;
            if ($scope.suggestions.indexOf(entry) == -1) {
              $scope.suggestions.push(entry);
            }
          }
        });
      }, 150);

    }
  };

  $scope.getRelatedSong = function(songId) {
    parameters = {
      'song_id': songId,
      'format': 'json',
      'results': '20',
      'type': 'song-radio',
    };

    if (searchTerm) {
      // $scope.queryEchonest('playlist', 'static', parameters, function(data, status, headers, config) {
      //     debugger;
      // });
      console.log('getting related song');
    }
  };

  $scope.getVideo = function(searchTerm) {
    var requestUrl = YOUTUBE_API_URL + "?part=id&q=" + encodeURIComponent(searchTerm) + '&order=relevance&type=video&key=' + YOUTUBE_API_KEY;
    $http.get(requestUrl).success(function(data, status, headers, config) {
      for (var i = 0; i < data.items.length; i++) {
        if ($scope.history.indexOf(data.items[i].id.videoId) == -1) {
          $scope.code = data.items[i].id.videoId;
          break;
        }
        console.log("duplicate video found");
      }

      $scope.history.push($scope.code);
      $scope.getNextVideo();
    }).error(function() {
      console.log("echonest query failed in getVideo");
    });
  };

  $scope.getNextVideo = function() {
    var requestUrl = YOUTUBE_API_URL + "?part=id&relatedToVideoId=" + $scope.code + '&order=relevance&type=video&key=' + YOUTUBE_API_KEY;
    $http.get(requestUrl).success(function(data, status, headers, config) {
      if (data.items.length < 5) {
        $scope.next = data.items[Math.floor(Math.random() * data.items.length)].id.videoId;
      }
      else {
        $scope.next = data.items[Math.floor(Math.random() * 5)].id.videoId;
      }
    }).error(function() {
      console.log("echonest query failed in getVideo");
    });
  };

  $scope.onStateChange = function(state) {
    if (state.data == 0) {
      $scope.code = $scope.next;
      $scope.getNextVideo();
    }
  };

  $scope.selected = DEFAULT_SONGS[Math.floor(Math.random() * DEFAULT_SONGS.length)];

  console.log('current selected: ' + $scope.selected);

  $scope.code = $scope.getVideo($scope.selected);

  $scope.next = '';

  $scope.suggestions = [];

  $scope.history = []
});
