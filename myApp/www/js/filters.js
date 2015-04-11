angular.module('starter.filters', [])
    .filter('possessed', function() {
        return function(items, possession) {
            var result = [];
            angular.forEach(items,function(itemValue) {
                angular.forEach(possession, function (value) {
                    if (itemValue._id == value) {
                        result.push(itemValue)
                    }
                })
            })
            return result
        }
    })
    .filter('reverse', function() {
        return function(items) {
            return items.slice().reverse();
        }
    })
 /**
 * Created by chao liu on 2014/11/23.
  $scope.find = function(item) {

            }
 */
