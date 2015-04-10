angular.module('starter.filters', [])
    .filter('reverse', function() {
        return function(items) {
            if(items){
            return items.slice().reverse();
            }else {
                return items
            }
        };
    });
 /**
 * Created by chao liu on 2014/11/23.
 */
