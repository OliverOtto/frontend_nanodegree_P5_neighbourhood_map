
function viewModel() {

    // Mannheim 49.4837106,8.4622333
    // Heidelberg 49.4260887, 8.6840708
    var neighborhood = new google.maps.LatLng(49.4837106,8.4622333); // initial location
    var self = this;
    var map;
    var infoWindow;
    var service;
    var CLIENT_ID = 'BXD1PDOS212PL0VFGXF5M0TFQHSU4TWTZ1YYGTGNO1V4EOLL';
    var CLIENT_SECRET = 'EI0OC4F4BLPHROLZARFQFCK1S5REKIOPSZNYTUMF4GKQ0QNC';
    var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/search' +
    '?client_id=CLIENT_ID' +
    '&client_secret=CLIENT_SECRET' +
    '&v=20130815' +
    '&ll=LATLON' +
    '&query=LOCNAME' +
    //'&intent=match' +
    //'&m=foursquare';
    '&radius=1500' +
    //'&ll=49.4837106,8.4622333' +
    '&limit=1';
    //'&categoryId=4d4b7105d754a06374d81259' +
    //'&callback=?';


    // Location class that store a place and the corresponding marker in the locations array
    var Location = function (place, marker) {
        this.place = place,
        this.marker = marker,
        this.active = ko.observable(false),
        this.visibleItem = ko.observable(true)
    }

    // Observable knockout array where we store locations
    locations = ko.observableArray();

    /** Invoke click trigger when user clicks over a location list item.
      * Also close the list if the screen is in "mobile" mode.
      *
      * @param {Location} location: The location object that we want to show info.
      * @returns nothing.
      */
    self.showdata = function (location) {
        google.maps.event.trigger(location.marker, 'click');
        if ($(".navbar").css('display') === 'block') {
            $("#menu-button").trigger('click');
        }
    }

    /** Reset active locations on the list to inactive state.
      *
      * @returns nothing.
      */
    function resetActiveLocations() {
        var locationsLength = locations().length;
        for (var i=0; i < locationsLength; i++) {
            locations()[i].active(false);
        }
    }

// setup google maps apu - suppress all user interaction on map zooming, panning etc
    function mapInit() {
        var mapOptions = {
            disableDoubleClickZoom: true,
            zoom: 15,
            center: neighborhood,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            scrollwheel: false,
            draggable: false,
            zoomControl: false,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_BOTTOM
            },
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            overviewMapControl: false
        };
        map = new google.maps.Map($('#mapCanvas')[0], mapOptions);

        // set map to full size and places list to full height
        $('#mapCanvas').css('height', $(window).height());
        $('.scrollable-menu').css('max-height', $(window).height()-70);
        $('.scrollable-menu').css('max-width', $(window).width());

        // ensure the map is full size and places list to full height after a window resize event
        $(window).resize(function() {
            $('#mapCanvas').css('height', $(window).height());
            $('.scrollable-menu').css('max-height', $(window).height()-70);
            $('.scrollable-menu').css('max-width', $(window).width());
        });

        // Google API infoWindow
        var infoWindowElement = $('#infoWindow')[0];
        var infoOptions = {
            content: infoWindowElement
        };
        infoWindow = new google.maps.InfoWindow (infoOptions);
        // get places in the vicinity
        getPlacesNearby();
    }

    function getPlacesNearby(){
        // call places api
        var request = {
            location: neighborhood,
            radius: 1600
        };
        if (locations().length === 0){
            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, placesCallback);
        }
    }

    // function getFoursquare{
    //     $.getJSON(API_ENDPOINT
    //      .replace('CLIENT_ID', CLIENT_ID)
    //      .replace('CLIENT_SECRET', CLIENT_SECRET)
    //      , function(result, status) {

    //     if (status !== 'success') return alert('Request to Foursquare failed');

    //     // Transform each venue result into a marker on the map.
    //     for (var i = 0; i < result.response.venues.length; i++) {
    //         var venue = result.response.venues[i];
    //         var placeLoc = venue.location;
    //         var image = {
    //                 url: place.icon,
    //                 size: new google.maps.Size(71, 71),
    //                 origin: new google.maps.Point(0, 0),
    //                 anchor: new google.maps.Point(17, 34),
    //                 scaledSize: new google.maps.Size(25, 25)
    //             };
    //         var marker = new google.maps.Marker({
    //             map: map,
    //             icon: image,
    //             title: venue.name,
    //             position: venue.location
    //         });
    //         var location = new Location(place, marker);
    //         locations.push(location);

    //         google.maps.event.addListener(marker, 'click', function() {
    //             // var request = {
    //             //     placeId: place.place_id
    //             // };
    //             // service.getDetails(request, callBack_createInfoWindow);
    //             // infoWindow.open(map, this);
    //             // resetActiveLocations();
    //             // location.active(true);
    //             // map.panTo(marker.position);
    //         });
    //     //   var venue = result.response.venues[i];
    //     //   var latlng = L.latLng(venue.location.lat, venue.location.lng);
    //     //   var marker = L.marker(latlng, {
    //     //       icon: L.mapbox.marker.icon({
    //     //         'marker-color': '#BE9A6B',
    //     //         'marker-symbol': 'cafe',
    //     //         'marker-size': 'large'
    //     //       })
    //     //     })
    //     //   .bindPopup('<strong><a href="https://foursquare.com/v/' + venue.id + '">' +
    //     //     venue.name + '</a></strong>')
    //     //     .addTo(foursquarePlaces);
    //     // }

    //     });
    // }


    // Create markers with places returned by places service
    function placesCallback(places, status) {
        // check status and create markers
        //var placesLength = places.length;
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            //for (var i = 0; i < placesLength; i++) {
            places.forEach(function(place){
                var placeLatLng = place.geometry.location.lat() + ',' + place.geometry.location.lng();
                place.foursquareAddress = 'No Data from Foursquare for this location available';
                $.getJSON(API_ENDPOINT
                    .replace('CLIENT_ID', CLIENT_ID)
                    .replace('CLIENT_SECRET', CLIENT_SECRET)
                    .replace('LOCNAME', place.name)
                    .replace('LATLON', placeLatLng)
                    , function(object, status) {
                    if (status !== 'success') return alert('Request to Foursquare failed');
                        $.each(object.response.venues, function(i, venues) {
                            //place.foursquareAddress = venues.location.address;
                            place.foursquareAddress = '<strong><a href="https://foursquare.com/v/' + venues.id + '">' +
                            venues.name + '</a></strong>'
                            //place.info.setContent('<h3>' + place.name + '</h3>' + '<p>' +
                            //place.foursquareAddress + '</p>');
                        });

                })
                //attach success and error handlers
                .error(function() {
                    console.log('Foursquare update error');
                })
                .success(function() {
                    createMarker (place);
                    console.log('FourSquare update success');
                });

                });


        }
    }


    // create single marker
    function createMarker(place) {
        // place location and picture
        var placeLoc = place.geometry.location;
        var image = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        marker.foursquareAddress = place.foursquareAddress;
        var location = new Location(place, marker);
        locations.push(location);

        google.maps.event.addListener(marker, 'click', function() {
            var request = {
                placeId: place.place_id
            };
            service.getDetails(request, function (placeDetails, status){
                callBack_createInfoWindow(placeDetails, status, place);
            });
            //callBack_createInfoWindow);
            infoWindow.open(map, this);
            resetActiveLocations();
            location.active(true);
            map.panTo(marker.position);
        });
    }

    // get infoview
    function callBack_createInfoWindow(place, status, placeOrg) {
        // check status and generate html view
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            var streetviewURL = 'https://maps.googleapis.com/maps/api/streetview?size=128x128&location=' + place.geometry.location;
            var contentString = '<div class="media"><div class="pull-left" href="#"><img class="media-object img-thumbnail" src="'
                                    + streetviewURL + '" alt="streetview image"></div><div class="media-body"><h4 class="media-heading">'
                                    + place.name + '</h4>' + place.vicinity + '<br>';

            if (place.formatted_phone_number) contentString += place.formatted_phone_number +'<br>';
            if (place.url) contentString += '<a href="' + place.url + '">Google+</a>';
            contentString += '<br>';
            contentString += 'Foursquare: ' + placeOrg.foursquareAddress;
            contentString += '</div></div>';
            infoWindow.setContent(contentString);
        }
    };

    mapInit ();

    // self.searchtext = ko.observable("");
    // self.searchtext.extend({ rateLimit: {
    //                             timeout: 400,
    //                             method: "notifyWhenChangesStop" } });
    // self.clearSearchText = function() {
    //   this.searchtext('');
    // };
    //    /* List of leagues to filter */
    // self.filters = ko.observableArray([]);
    // /* Tracks whether to show message that search results returned no data. */
    // self.emptysearch = ko.observable(false);

    //USING GOOGLE MAPS SEARCH FUNCTION
    var input = $('#input')[0];
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    $('#input').on('keyup',function(e){
        var tagElems = locations;
        // hide all tags
        //$(tagElems).hide();
        //resetActiveLocations();
        var input = $('#input')[0];
        if (input.value === ""){
            var locationsLength = locations().length;
            for (var i=0; i < locationsLength; i++) {
                locations()[i].active(true);
                locations()[i].visibleItem(true);
                locations()[i].marker.setVisible(true);
            }
        } else {
            var locationsLength = locations().length;
            for (var i=0; i < locationsLength; i++) {
                if (locations()[i].place.name.toLowerCase().indexOf(input.value.toLowerCase()) === -1){
                    locations()[i].active(false);
                    locations()[i].visibleItem(false);
                    locations()[i].marker.setVisible(false);
                }
               else{
                    locations()[i].active(true);
                    locations()[i].visibleItem(true);
                    locations()[i].marker.setVisible(true);
                }
            }
        }
        // mapInit();
        // var input = $('#input')[0];
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        // //places.forEach(function(place){

        // locations().forEach( function (location){
        //     if (location.active === true) {
        //         createMarker(location.place);
        //     }
        // });

        //place markers manually
        // { // loop through all tagElements
        //     var tag = $(tagElems).eq(i);

        //     if(($(tag).text().toLowerCase()).indexOf($(this).val().toLowerCase()) === 0){
        //     // if element's text value starts with the hint show that tag element
        //             $(tag).show();
        //         }
        //     }
    });


    // self.searchtext = ko.observable("");
    // self.searchtext.extend({ rateLimit: {
    //                             timeout: 400,
    //                             method: "notifyWhenChangesStop" } });
    // self.clearSearchText = function() {
    //   this.searchtext('');
    // };
    // /* List of leagues to filter */
    // self.filters = ko.observableArray([]);
    // /* Tracks whether to show message that search results returned no data. */
    // self.emptysearch = ko.observable(false);
    // // marker.setVisible(true);
    // var searchBox = new google.maps.places.SearchBox(input);

    // //event listener
    // google.maps.event.addListener(searchBox, 'places_changed', searchBoxCallback);
    // map.addListener('bounds_changed', function() {
    //     searchBox.setBounds(map.getBounds());
    // });
    // //searchBox.setBounds(map.getBounds());

    // // callback for searchbox
    // function searchBoxCallback() {
    //         // TODO NEED RESET
    //         var places = searchBox.getPlaces();
    //         // error check
    //         if (places.length == 0) {
    //             return;

    //         // remove markers from map
    //         for (var i = 0; i < locations().length; i++) {
    //             locations()[i].marker.setMap(null);
    //         }

    //         // locations cleared
    //         locations([]);

    //         // map bounds and markers created
    //         var bounds = new google.maps.LatLngBounds();
    //         for (var i = 0; i < places.length; i++) {
    //             createMarker (places[i]);
    //             bounds.extend(places[i].geometry.location);
    //         }
    //         map.fitBounds(bounds);
    //     }

    //     // focus search results on displayed area
    //     google.maps.event.addListener(map, 'bounds_changed', function() {
    //         searchBox.setBounds(map.getBounds());
    //     });
    // }


};

ko.applyBindings (new viewModel ());