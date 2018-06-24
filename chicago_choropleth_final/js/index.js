// Set the Map Options to be applied when the map is set.
var map;
var mapOptions = {
    zoom: 10,
    //scrollwheel: false,
    center: {lat: 41.835832, lng: -87.621887},
}
// Set the map to the element ID and give it the map options to be applied
map = new google.maps.Map(document.getElementById('map-canvas'),    mapOptions);
// Set a blank infoWindow to be used for each to state on click
var infoWindow = new google.maps.InfoWindow({
    content: ""
});

// Create the state data layer and load the GeoJson Data
var stateLayer = new google.maps.Data();
  stateLayer.loadGeoJson('https://raw.githubusercontent.com/fangjjcs/chicago_data/master/Boundaries-Police-Beats-current.geojson');

// Set and apply styling to the stateLayer
stateLayer.setStyle(function(feature) {
    return { 
      fillColor: getColor(feature.getProperty('beat_num')), // call function to get color for state based on the COLI (Cost of Living Index)
      fillOpacity: 0.9,
      visible: true,
      strokeColor: '#fff',
      strokeWeight: 1,
      zIndex: 1
    };
});

  // Add mouseover and mouse out styling for the GeoJSON State data
stateLayer.addListener('mouseover', function(e) {
    stateLayer.overrideStyle(e.feature, {
      strokeColor: '#666',
      strokeWeight: 2,
      zIndex: 2
    });
  
});
stateLayer.addListener('mouseout', function(e) {
    stateLayer.revertStyle();
});

// Adds an info window on click with in a state that includes the state name and id
stateLayer.addListener('click', function(e) {
    console.log(e);
     
    infoWindow.setContent('<div style="line-height:1.00;overflow:hidden;white-space:nowrap;">' + 'beat_num: ' +
      e.feature.getProperty('beat_num') + '</div>');

    var anchor = new google.maps.MVCObject();
    anchor.set("position", e.latLng);
    infoWindow.open(map, anchor);
  });

// Final step here sets the stateLayer GeoJSON data onto the map
stateLayer.setMap(map);



/*
function initMap(){
	map = new google.maps.Map(document.getElementById('map-canvas'), {
	center: {lat: 41.835832, lng: -87.621887},
	zoom: 10
	});
}*/

// Prepare for data
var properties; //split長長字串
var features = {
  position: [],
  type: [],
  arrest: [],
  number: [],
  beat: [],
};
var obj = {
  lat: [],
  lng: [],
  type: [],
  arrest: [],
  num: [],
  beat: [],
};// obj 用來放 lat,lng,type,content 的list(都是字串)
// Read crime data web3
$.ajax({
	type: "GET",
	url: "https://raw.githubusercontent.com/fangjjcs/crime_web_final/master/crime_data_web4.txt",
	dataType: "text",
	success: function(data){
		properties = data.split(/,|\n/); //split長長字串
    var lat;
    var lng;
    var n;
		for(var i=0 ; i<properties.length;i++){
		  var r = i%7;
		  if(r==0) {
        lat = parseFloat(properties[i]);
			  obj.lat.push(lat);
		  }
		  else if(r==1) {
        lng = parseFloat(properties[i]);
			  obj.lng.push(lng);
		  }
		  else if(r==2) {
			  obj.type.push(properties[i]);
			  //console.log(properties[i]);
		  }
      else if(r==3) {
			  obj.arrest.push(properties[i]);
			  //console.log(obj.arrest);
		  }
      else if(r==4) {
        n=parseFloat(properties[i])
			  obj.num.push(n);
			  //console.log(properties[i]);
		  }
      else if(r==5) {
        n=parseFloat(properties[i])
			  obj.beat.push(n);
			  //console.log(properties[i]);
		  }
		}
    
		//console.log(obj.beat);
		for(var i = 0; i < obj.lat.length;i++){
      //console.log(i);
      var latlng = new google.maps.LatLng(parseFloat(obj.lat[i]),parseFloat(obj.lng[i]));
		  features.position.push(latlng);
      features.type.push(obj.type[i]);
      features.arrest.push(obj.arrest[i]);
      features.number.push(obj.num[i]);
      features.beat.push(obj.beat[i]);
      //console.log(features.beat);
		}
    
	}
});

// Beat, Significant crime type and unarrest crime type
var beat_obj = {
  beat: [],
  type: [],
  unarrest: [],
};
$.ajax({
	type: "GET",
	url: "https://raw.githubusercontent.com/fangjjcs/crime_web_final/master/crime_ob_fa.txt",
	success: function(data){
		properties = data.split(/,|\n/); //split長長字串
    var Beat;
    var crimetype;
    var unarrest;
		for(var i=0 ; i<properties.length;i++){
		  var r = i%4;
		  if(r==0) {
        Beat = parseFloat(properties[i]);
			  beat_obj.beat.push(Beat);
        //console.log(Beat);
		  }
		  else if(r==1) {
        crimetype = parseFloat(properties[i]);
			  beat_obj.type.push(crimetype);
        //console.log(crimetype);
		  }
		  else if(r==2) {
        unarrest = parseFloat(properties[i]);
			  beat_obj.unarrest.push(unarrest);
			  //console.log(unarrest);
		  }
		}
    
		//console.log(obj.beat);
		for(var i = 0; i < obj.lat.length;i++){
      //console.log(i);
      var latlng = new google.maps.LatLng(parseFloat(obj.lat[i]),parseFloat(obj.lng[i]));
		  features.position.push(latlng);
      features.type.push(obj.type[i]);
      features.arrest.push(obj.arrest[i]);
      features.number.push(obj.num[i]);
      features.beat.push(obj.beat[i]);
      //console.log(features.beat);
		}
    
	}
});


var icons = {
	  1: {
		icon: './images/icon01.png',
		type: 'BATTERY',
    color:"#79ceb8"
	  },
	  2: {
		icon: './images/icon02.png',
		type: 'OTHER OFFENSE'
	  },
	  3: {
		icon: './images/icon03.png',
		type: 'ROBBERY'
	  },
	  4: {
		icon: './images/icon04.png',
		type: 'NARCOTICS',
    color: "#e95f5c"
	  },
	  5: {
		icon: './images/icon05.png',
		type: 'CRIMINAL DAMAGE'
	  },
	  6: {
		icon: './images/icon06.png',
		type: 'WEAPONS VIOLATION',
    color: "#e8d4a2"
	  },
	  7: {
		icon: './images/icon07.png',
		type: 'THEFT',
    color: "#ffdb00"
	  },
	  8: {
		icon: './images/icon08.png',
		type: 'BURGLARY'
	  },
	  9: {
		icon: './images/icon09.png',
		type: "MOTOR VEHICLE THEFT'",
    color: "#0d9ddb"
	  },
    10: {
		icon: './images/icon10.png',
		type: "ASSAULT"
	  },
    11: {
		icon: './images/icon11.png',
		type: "CRIMINAL TRESPASS'",
    color: "#718087"
	  },
    12: {
		icon: './images/icon12.png',
		type: "CRIM SEXUAL ASSAULT"
	  },
    13: {
		icon: './images/icon13.png',
		type: "ARSON"
	  },
    14: {
		icon: './images/icon14.png',
		type: "DECEPTIVE PRACTICE"
	  },
    15: {
		icon: './images/icon15.png',
		type: "KIDNAPPING"
	  },
    16: {
		icon: './images/icon16.png',
		type: "SEX OFFENSE"
	  },
    17: {
		icon: './images/icon17.png',
		type: "OFFENSE INVOLVING CHILDREN"
	  },
    18: {
		icon: './images/icon18.png',
		type: "PROSTITUTION"
	  },
    19: {
		icon: './images/icon19.png',
		type: "GAMBLING"
	  },
    20: {
		icon: './images/icon20.png',
		type: "INTIMIDATION"
	  },
    21: {
		icon: './images/icon21.png',
		type: "STALKING"
	  },
    22: {
		icon: './images/icon22.png',
		type: "OBSCENITY"
	  },
    23: {
		icon: './images/icon23.png',
		type: "PUBLIC INDECENCY"
	  },
    24: {
		icon: './images/icon24.png',
		type: "HUMAN TRAFFICKING"
	  },
    25: {
		icon: './images/icon25.png',
		type: "OTHER NARCOTIC VIOLATION"
	  },
    26: {
		icon: './images/icon26.png',
		type: "HOMICIDE"
	  }
};


var global = [];
var count =0;
var markers=[];
/*
function show_particular(features) {
  console.log(features.type);
	features.forEach(function(feature) {
    count = count+1;
    
		global.push({
			position: feature.position,
			type: feature.type,
      place: feature.place,
      arrest: feature.arrest,
			//beatnum: feature.beatnum,
		})
	});
}*/
//console.log(global.type);

var markers ;
//clean map
function clear(){
	if(markers!=null){
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
		console.log("CLEAR");
	}
}
function remove(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}
// icon

//toggle to ignite draw map
var check = [];
var checkBox;
function unchecked(){
  document.getElementById("q1").checked = true;
	document.getElementById("q2").checked = false;
  document.getElementById("q3").checked = false;
  document.getElementById("q4").checked = false;
}
// Q1 data layer1 for crim type in each beat
$(document).ready(function(){
  $('#q1').click(function(event){
    if (event.target.checked == true){
      document.getElementById("s1").style.backgroundColor = "#f4cb58";
      document.getElementById("q2").checked = false;
      document.getElementById("s2").style.backgroundColor = "#ccc";
      document.getElementById("q3").checked = false;
      document.getElementById("s3").style.backgroundColor = "#ccc";
      remove(check,checkBox);
      clear();
      stateLayer.setStyle(function(feature) {
    return { 
      fillColor: getColor(feature.getProperty('beat_num')), // call function to get color for state based on the COLI (Cost of Living Index)
      fillOpacity: 0.9,
      visible: true,
      strokeColor: '#fff',
      strokeWeight: 1,
      zIndex: 1
    };
});
    }
    else{
      stateLayer.setStyle({visible: false});
      document.getElementById("s1").style.backgroundColor = "#ccc";
    }
  });
});

// Q2 data layer2 for most unarrest crim type in each beat
$(document).ready(function(){
  $('#q2').click(function(event){
    if (event.target.checked == true){
      document.getElementById("s2").style.backgroundColor = "#f4cb58";
      document.getElementById("q1").checked = false;
      document.getElementById("s1").style.backgroundColor = "#ccc";
      document.getElementById("q3").checked = false;
      document.getElementById("s3").style.backgroundColor = "#ccc";
      remove(check,checkBox);
      clear();
      stateLayer.setStyle(function(feature) {
    return { 
      fillColor: getColor2(feature.getProperty('beat_num')), // call function to get color for state based on the COLI (Cost of Living Index)
      fillOpacity: 0.9,
      visible: true,
      strokeColor: '#fff',
      strokeWeight: 1,
      zIndex: 1
    };
});
    }
    else{
      stateLayer.setStyle({visible: false});
      document.getElementById("s2").style.backgroundColor = "#ccc";
    }
  });
});

// Q3 data layer3 conclusion
$(document).ready(function(){
  $('#q3').click(function(event){
    if (event.target.checked == true){
      document.getElementById("s3").style.backgroundColor = "#f4cb58";
      document.getElementById("q1").checked = false;
      document.getElementById("s1").style.backgroundColor = "#ccc";
      document.getElementById("q2").checked = false;
      document.getElementById("s2").style.backgroundColor = "#ccc";
      document.getElementById("q4").checked = false;
      document.getElementById("s4").style.backgroundColor = "#ccc";
      remove(check,checkBox);
      clear();
      stateLayer.setStyle(function(feature) {
    return { 
      fillColor: getColor3(feature.getProperty('beat_num')), // call function to get color for state based on the COLI (Cost of Living Index)
      fillOpacity: 0.9,
      visible: true,
      strokeColor: '#fff',
      strokeWeight: 1,
      zIndex: 1
    };
});
    }
    else{
      stateLayer.setStyle({visible: false});
      document.getElementById("s3").style.backgroundColor = "#ccc";
    }
  });
});


// Q3 scatter spot
$(document).ready(function(){
	$('#q4').click(function(event){
		//clear();
    checkBox = $(event.target).val();
    //console.log(event.target.checked);
		if (event.target.checked == true){
			check.push(checkBox);
      document.getElementById("s4").style.backgroundColor = "#f4cb58";
      document.getElementById("s1").style.backgroundColor = "#ccc";
      document.getElementById("s2").style.backgroundColor = "#ccc";
 document.getElementById("q1").checked = false;
      document.getElementById("q2").checked = false;
      document.getElementById("s3").style.backgroundColor = "#ccc";
 document.getElementById("q3").checked = false;
      stateLayer.setStyle({visible: false});
		}
		else {
			//console.log("false");
			remove(check,checkBox);
      clear();
      document.getElementById("s4").style.backgroundColor = "#ccc";
      //stateLayer.revertStyle();
			//console.log(check)
		}
		//console.log(check.length);
		//console.log("here");
		for(var l = 0 ; l<check.length ; l++){
      //console.log(features.num[1]);
        //console.log("1");
      for(var j=0 ; j<features.type.length;j++ ){
        var myLatLng = {lat: features.position[j].lat() , lng: features.position[j].lng()};
        var markerr = new google.maps.Marker({
					position: myLatLng,
					title: "TYPE: "+features.type[j]+'\n'+"ARREST: "+features.arrest[j],
					icon: icons[features.number[j]].icon,
					map: map
				});
       console.log(j);
				markers.push(markerr);
      }
		 }
		 
		//draw(obj.lat,obj.lng,obj.type,features);
	});
});

// returns a color based on the value given when the function is called
function getColor(coli) {
  
  //console.log(coli);
  var colors = [
      'green',
      '#c2c083',
      '#ffcccc',
      '#ff9999',
      'red'
    ];
  for(var i=0; i<beat_obj.beat.length;i++){
    var beat = beat_obj.beat[i];
    if(coli == beat){
      //console.log(coli,beat);
      
      return icons[beat_obj.type[i]].color ;
      
      
    }
    //
  }
    /*
    return coli >= 25 ? colors[4] :
      coli > 20 ? colors[3] :
      coli > 15 ? colors[2] :
      coli > 10 ? colors[1] :
      colors[0];
      */
}
// for Q2
// returns a color based on the value given when the function is called
function getColor2(coli) {
  
  //console.log(coli);
  for(var i=0; i<beat_obj.beat.length;i++){
    var beat = beat_obj.beat[i];
    if(coli == beat){
      //console.log(coli,beat);
      
      return icons[beat_obj.unarrest[i]].color ;
      
      
    }
    //
  }
    /*
    return coli >= 25 ? colors[4] :
      coli > 20 ? colors[3] :
      coli > 15 ? colors[2] :
      coli > 10 ? colors[1] :
      colors[0];
      */
}

// for Q3
// returns a color based on the value given when the function is called
var sign =[1112, 1115, 1122, 1121, 1132, 1134];
function getColor3(coli) {
  
  //console.log(coli);
  for(var i=0; i<beat_obj.beat.length;i++){
    for(var l=0;l<sign.length;l++){
      var s = sign[l];
      if(coli == s){
      //console.log(coli,beat);
      return "red" ;
      
      
    }
    }
    
    //
  }
    /*
    return coli >= 25 ? colors[4] :
      coli > 20 ? colors[3] :
      coli > 15 ? colors[2] :
      coli > 10 ? colors[1] :
      colors[0];
      */
}



//<script type="text/javascript" //src="http://maps.google.com/maps/api/js?sensor=false">//</script>