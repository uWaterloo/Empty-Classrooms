angular.module('PortalApp')

.controller('widgetCtrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {

    // SETUP

    // Widget Configuration
    $scope.portalHelpers.config = {
        "title": "Test Project",
        "icon": "icon-bell"
    };

    // Initialize input variable
    $scope.startTime = { value: "Start time => 00:00:00" };
  	$scope.endTime = { value: "End time => 00:00:00" };
  	$scope.building = { value: "e.g. MC" };
  	$scope.day = { value: "(M, T, W, TH, F)" };
  
    $scope.rooms = "Class Number,Building,Room,Start Date,End Date,Weekdays,Start Time,End Time,,,," + " 4068,AL,6,,,M,12:30:00,14:20:00,,,," + " 4068,AL,6,,,T,14:30:00,17:20:00,,,," + " 4068,AL,6,,,F,9:00:00,12:50:00,,,," + " 3496,AL,105,,,M,11:30:00,12:50:00,,,," + " 4044,AL,105,,,M,13:00:00,14:20:00,,,," + " 8100,AL,105,,,M,14:30:00,15:50:00,,,," + " 3742,AL,105,,,T,8:30:00,9:50:00,,,," + " 3928,AL,105,,,T,10:00:00,11:20:00,,,," + " 5401,AL,105,,,T,11:30:00,14:20:00,,,," + " 3212,AL,105,,,T,14:30:00,15:50:00,,,," + " 4247,AL,105,,,T,14:30:00,15:50:00,,,,";
  
    //console.log($scope.rooms);
    // Show loading message in the first column
    $scope.portalHelpers.showView('loading.html', 1);

    // Show loading animation
    $scope.portalHelpers.toggleLoading(true);
  
  	$scope.portalHelpers.showView("something", 1);

    // DATABASE EXAMPLE

    $scope.getDbData = function () {
        $scope.portalHelpers.invokeServerFunction('getData').then(function (result) {
            $scope.dbData = result;
        });
    }

    // Try to get test data from the database
    $scope.getDbData();

    // Create table
    $scope.createTable = function () {
        $scope.portalHelpers.invokeServerFunction('createTable').then(function (result) {
            $scope.getDbData();
        });
    }

    // Insert a value into the database
    $scope.insertData = function () {
        if ($scope.insertValue.value.length > 50)
            alert('value should be less than 50 characters');
        else {
            $scope.portalHelpers.invokeServerFunction('insert', { value: $scope.insertValue.value }).then(function (result) {
                $scope.dbData = result;
            });
        }
    };

    // DETAILS VIEW EXAMPLE
    $scope.showView2 = function () {
        $scope.portalHelpers.showView('view2.html', 2);
    }

    $scope.showView3 = function () {
        $scope.portalHelpers.showView('view3.html', 3);
    }
    
    $scope.showView4 = function () {
        $scope.portalHelpers.showView('view4.html', 4);
    }
    
    $scope.csvJSON = function(room){
 
      var lines=room.split(",,,,");

      var result = [];

      var headers=lines[0].split(",");

      for(var i=1;i<lines.length;i++){

          var obj = {};
          var currentline=lines[i].split(",");

          for(var j=0;j<headers.length;j++){
              obj[headers[j]] = currentline[j];
          }

          result.push(obj);

      }

      //return result; //JavaScript object
      return JSON.stringify(result); //JSON
    
    }
    
    
    
    $scope.roomsJSON = $scope.csvJSON($scope.rooms); 
    $scope.realJSONobject = JSON.parse($scope.roomsJSON);
  	//console.log($scope.actualRoomsJSON[5]['Class Number']);
	
  
  	$scope.getRooms = function(building, day, startTime, endTime) 
	{
      var rooms = new Array(25);
      var y = 0;
      for( x = 0; x < $scope.realJSONobject.length; x++)
      {	
        console.log('outside: ' + x);
        if ($scope.realJSONobject[x]['Building'] ==  building && 
              $scope.realJSONobject[x]['Weekdays'] == day)
          {
              	console.log('inside: ' + x);
            	console.log('bool start time: ' + ($scope.realJSONobject[x]['Start Time'] > endTime));
            	console.log('bool end time: ' + ($scope.realJSONobject[x]['End Time'] > startTime));
            
                if($scope.realJSONobject[x]['Start Time'] > endTime 
                 && startTime < $scope.realJSONobject[x]['End Time']) 
              	{
                  	rooms[y] = x;
                  	console.log(x);
                    y++;
              	}
          }
      }
      
      if(y == 0)
	  {
		console.log("Sorry no rooms are available during the stated time " +
				"period in this building");
	  } 
      
      else
      {
      	var numRooms = y;
        console.log("The following rooms are free at this time:");
        y = 0;

        while(y<numRooms)
        {
          console.log( "There are " + (y + 1) + " free rooms!" );
          y++;
        }
	   }
    }
    
    $scope.getRooms("AL", "M", "10:00:00", "11:00:00"); 
    // PORTAL DATA SOURCE EXAMPLE

    // Get data for the widget
    $http.get('/ImportantLinks/JSONSource').success(function (data) {
        // Make data available in the scope
        $scope.links = data;
        // Turn off loading animation
        $scope.portalHelpers.toggleLoading(false);
        // Show main view
        $scope.portalHelpers.showView('main.html', 1);
    });

    // OPEN API EXAMPLE
    $scope.portalHelpers.invokeServerFunction('getOpenData').then(function (result) {
        $scope.openDataExampleData = result;
    });


}])
// Custom directive example
.directive('DirectiveName', ['$http', function ($http) {
    return {
        link: function (scope, el, attrs) {

        }
    };
}])
// Custom filter example
.filter('FilterName', function () {
    return function (input, arg1, arg2) {
        var output = input;
        return output;
    }
});