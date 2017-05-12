// public/core.js
var coffee = angular.module('coffee', []);

coffee.directive('potRepeatDirective', function() {
  return function(scope, element, attrs) {

  };
});

function mainController($scope, $http) {

    // get all pots, store in $scope.pots
    $scope.refresh_pots = function() {
        $http.get('/latest')
            .success(function(data) {
                for (i=0; i<data.length; i++) {
                    data[i].brew_time_parsed = Date.parse(data[i].brew_time);
                }
                $scope.pots = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    }
    
    // when submitting the add form, send the text to the node API
    $scope.made_coffee = function(id, $event) {
        console.log($event.currentTarget);
        if ($($event.currentTarget).hasClass('disable_button')) {
            return;
        } else {
            $http.post('/made_coffee', {pot_id: id})
                .success(function(data) {
                    console.log(data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
                
            $scope.refresh_pots();
        }
    };
    
    $scope.new_pot = function() { 
        var name = window.prompt("Name your coffee pot?");
        $http.post('/new_pot', {name: name})
            .success(function(data) { 
                console.log("New pot added: " + data);
            })
            .error(function(data) { 
                console.log('Error: ' + data);
            });
            
        $scope.refresh_pots();
    };
    
    //returns formatting name string if len>0, otherwise nothing
    $scope.show_name = function(name, fallback) { 
        try {
            return name.length > 0 ? name : fallback;
        } catch(err) {
            return fallback;
        }
    };
    
    $scope.remove_pot = function(id, $event) {
        name = $('#name_' + id).html().trim();
        if (confirm("Delete '" + name + "'?")) {
            $http.post('/remove_pot', {pot_id: id})
                .success(function(data) {
                    console.log("Pot removed: " + data);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
                
            $scope.refresh_pots();
        }
    };
    
    // on first load, refresh pots
    $scope.refresh_pots();
}