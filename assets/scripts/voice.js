// Animal base class
var Voice = Fiber.extend(function() {
    return {
        init: function(options) {
        	if(!options) options={};

            // Private
            function private1(){}
            function private2(){}

            // Privileged
            this.privileged1 = function(){}
            this.privileged2 = function(){}
        },
        // Public
        method1: function(){}
    }
});

function voice_init_pre() {
  prop.voice = {};
  prop.voice.voices = {};
  prop.voice.current  = null;
}

function voice_init() {
	window.speechSynthesis.onvoiceschanged = function() {
	    var voices = window.speechSynthesis.getVoices();
      	// Loop through each of the voices.
    	voices.forEach(function(voice) {
    		voice = jQuery.extend(true, {}, voice);
    		voice.name = voice.name.replace(/\s+/g, '-').toLowerCase();
    		voice_add(voice);

    		if (voice.default) {
    			prop.voice.current = voice;
    		}
        });
	};

}

function voice_ready() {
  if(!('atc-last-voice' in localStorage)) voice_set('kdbg');
  else voice_set();
}

function voice_load(name) {
  name = name.toLowerCase();
  if(name in prop.voice.voices) {
    console.log(voice + ": already loaded");
    return;
  }
  var voice=new Voice({name:voice});
  voice_add(voice);
  return voice;
}

function voice_add(voice) {
  prop.voice.voices[voice.name] = voice;
}

function voice_set(name) {
  if(!name) {
    if(!('atc-last-voice' in localStorage)) return;
    else name = localStorage['atc-last-voice'];
  }
  name = name.toLowerCase();

  localStorage['atc-last-voice'] = name;
  if(!(name in prop.voice.voices)) {
    console.log(name + ": no such voice");
    return;
  }
  if(prop.voice.current) {
    prop.voice.current.unset();
    //aircraft_remove_all();
  }
  prop.voice.current = prop.voice.voices[name];
  prop.voice.current.set();

  $('#voice').text(prop.voice.current.name.toUpperCase());
  $('#voice').attr("title", prop.voice.current.name);

  prop.canvas.dirty = true;
}

function voice_get(name) {
  if(!name) return prop.voice.current;
  return prop.voice.voices[name.toLowerCase()];
}